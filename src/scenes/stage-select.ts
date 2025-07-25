import { RenderContext, StageNames } from '../types';
import { DefaultScene } from './default';
import { toColorPalette } from '../utils';

interface StageSelectSceneState {
    highlightedStage: number;
    stages: Array<{
        name: StageNames;
        title: string;
        description: string;
        isUnlocked: boolean;
    }>;
    isFlashing: boolean;
    flashStartTime: number;
}

export class StageSelectScene extends DefaultScene<StageSelectSceneState> {
    name = 'stage-select';

    localState: StageSelectSceneState = {
        highlightedStage: 0,
        stages: [
            {
                name: 'janitor',
                title: 'Janitor Duty',
                description: 'Clean up the office mess before time runs out!',
                isUnlocked: true,
            },
            {
                name: 'reception',
                title: 'Reception Desk',
                description: 'Handle customer requests and keep everyone happy.',
                isUnlocked: true,
            },
        ],
        isFlashing: false,
        flashStartTime: 0,
    };

    onEnter() {
        super.onEnter();
        // Reset stage select state when entering
        if (this.localState) {
            this.localState.highlightedStage = 0;
            this.localState.isFlashing = false;
            this.localState.flashStartTime = 0;
        }
    }

    update() {
        super.update();
        const state = this.store.getState();

        if (this.transitionType !== 'none') return;

        // Handle navigation input
        if (state.input.keysPressed.includes('ArrowUp') || state.input.keysPressed.includes('w')) {
            this.localState!.highlightedStage =
                this.localState!.highlightedStage > 0
                    ? this.localState!.highlightedStage - 1
                    : this.localState!.stages.length - 1; // Wrap to bottom
        }

        if (
            state.input.keysPressed.includes('ArrowDown') ||
            state.input.keysPressed.includes('s')
        ) {
            this.localState!.highlightedStage =
                this.localState!.highlightedStage < this.localState!.stages.length - 1
                    ? this.localState!.highlightedStage + 1
                    : 0; // Wrap to top
        }

        // Handle selection
        if (state.input.keysPressed.includes('Enter') || state.input.keysPressed.includes(' ')) {
            const selectedStage = this.localState!.stages[this.localState!.highlightedStage];
            if (selectedStage.isUnlocked && !this.localState!.isFlashing) {
                this.localState!.isFlashing = true;
                this.localState!.flashStartTime = state.gameTime;
            }
        }

        // Handle flash animation
        if (this.localState!.isFlashing) {
            const flashElapsed = state.gameTime - this.localState!.flashStartTime;
            const flashDuration = 300;

            if (flashElapsed >= flashDuration) {
                this.localState!.isFlashing = false;
                this.localState!.flashStartTime = 0;

                // Navigate to selected stage
                const selectedStage = this.localState!.stages[this.localState!.highlightedStage];
                this.changeScene(selectedStage.name);
            }
        }

        // Handle back to menu
        if (state.input.keysPressed.includes('Escape')) {
            this.changeScene('menu');
        }
    }

    render(renderContext: RenderContext) {
        super.render(renderContext);

        const { ctx, state } = renderContext;
        const { canvas } = ctx;
        const centerX = canvas.width / 2;
        const centerY = canvas.height / 2;

        // Calculate fade effect based on transition state
        let opacity = 1;
        if (this.transitionType === 'in') {
            opacity = this.transitionProgress;
        } else if (this.transitionType === 'out') {
            opacity = 1 - this.transitionProgress;
        }

        // Apply fade effect to entire scene
        ctx.save();
        ctx.globalAlpha = opacity;

        // Calculate flash effect
        let flashIntensity = 0;
        if (this.localState!.isFlashing) {
            const flashElapsed = state.gameTime - this.localState!.flashStartTime;
            const flashDuration = 300;
            if (flashElapsed < flashDuration) {
                const progress = flashElapsed / flashDuration;
                flashIntensity = Math.sin(progress * Math.PI * 4) * 0.5 + 0.5;
            }
        }

        // Draw title with retro styling
        ctx.fillStyle = toColorPalette('#ffffff');
        ctx.font = 'bold 40px "Press Start 2P"';
        ctx.textAlign = 'center';
        ctx.fillText('SELECT STAGE', centerX, centerY - 120);

        // Draw stages as simple menu items (classic NES style)
        const menuStartY = centerY - 40;
        const lineHeight = 50;

        this.localState!.stages.forEach((stage, index) => {
            const itemY = menuStartY + index * lineHeight;
            const isHighlighted = index === this.localState!.highlightedStage;
            const isFlashingStage =
                this.localState!.isFlashing && index === this.localState!.highlightedStage;

            // Draw selection indicator (classic NES style)
            if (isHighlighted && stage.isUnlocked) {
                ctx.fillStyle = toColorPalette('#ffffff');
                ctx.font = '16px "Press Start 2P"';
                ctx.textAlign = 'right';

                // Combine flash and transition opacity
                const indicatorOpacity = isFlashingStage ? flashIntensity * opacity : opacity;
                ctx.save();
                ctx.globalAlpha = indicatorOpacity;
                ctx.fillText('►', centerX - 120, itemY + 3);
                ctx.restore();
            }

            // Draw stage title
            let textColor = toColorPalette('#ffffff');
            if (!stage.isUnlocked) {
                textColor = toColorPalette('#666666');
            }

            ctx.fillStyle = textColor;
            ctx.font = '20px "Press Start 2P"';
            ctx.textAlign = 'left';

            // Flash the text if selected
            if (isFlashingStage && stage.isUnlocked) {
                ctx.save();
                ctx.globalAlpha = flashIntensity;
            }

            ctx.fillText(stage.title.toUpperCase(), centerX - 100, itemY + 8);

            if (isFlashingStage && stage.isUnlocked) {
                ctx.restore();
            }

            // Draw lock indicator for locked stages
            if (!stage.isUnlocked) {
                ctx.fillStyle = toColorPalette('#ff6b6b');
                ctx.font = '16px "Press Start 2P"';
                ctx.textAlign = 'right';
                ctx.fillText('LOCKED', centerX + 120, itemY + 6);
            }
        });

        // Draw instructions in retro style
        ctx.fillStyle = toColorPalette('#ffffff');
        ctx.font = '12px "Press Start 2P"';
        ctx.textAlign = 'center';
        ctx.fillText('USE ARROW KEYS TO SELECT', centerX, canvas.height - 80);
        ctx.fillText('PRESS ENTER TO START STAGE', centerX, canvas.height - 60);
        ctx.fillText('PRESS ESC TO RETURN TO MENU', centerX, canvas.height - 40);

        ctx.textAlign = 'left'; // Reset alignment

        // Restore canvas state after fade effect
        ctx.restore();
    }
}
