import { RenderContext, StageNames } from '../types';
import { DefaultScene } from './default';

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
        const stageWidth = 300;
        const stageHeight = 80;
        const stageSpacing = 20;

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

        // Draw title
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 48px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('Select Stage', centerX, centerY - 150);

        // Draw stage cards
        this.localState!.stages.forEach((stage, index) => {
            const stageY = centerY - 50 + index * (stageHeight + stageSpacing);
            const isHighlighted = index === this.localState!.highlightedStage;
            const isFlashingStage =
                this.localState!.isFlashing && index === this.localState!.highlightedStage;

            // Calculate colors based on state
            let bgColor = [51, 51, 51]; // Default gray
            let borderColor = [102, 102, 102];
            let textColor = '#cccccc';

            if (stage.isUnlocked) {
                if (isHighlighted) {
                    bgColor = [76, 175, 80]; // Green for highlighted
                    borderColor = [102, 187, 106];
                    textColor = '#ffffff';
                } else {
                    bgColor = [68, 68, 68]; // Lighter gray for unlocked
                    borderColor = [136, 136, 136];
                    textColor = '#ffffff';
                }
            } else {
                bgColor = [34, 34, 34]; // Darker for locked
                borderColor = [68, 68, 68];
                textColor = '#666666';
            }

            // Apply flash effect
            if (isFlashingStage && stage.isUnlocked) {
                const flashR = Math.floor(bgColor[0] + (255 - bgColor[0]) * flashIntensity);
                const flashG = Math.floor(bgColor[1] + (255 - bgColor[1]) * flashIntensity);
                const flashB = Math.floor(bgColor[2] + (255 - bgColor[2]) * flashIntensity);
                bgColor = [flashR, flashG, flashB];

                const borderFlashR = Math.floor(
                    borderColor[0] + (255 - borderColor[0]) * flashIntensity
                );
                const borderFlashG = Math.floor(
                    borderColor[1] + (255 - borderColor[1]) * flashIntensity
                );
                const borderFlashB = Math.floor(
                    borderColor[2] + (255 - borderColor[2]) * flashIntensity
                );
                borderColor = [borderFlashR, borderFlashG, borderFlashB];
            }

            // Draw stage card background
            ctx.fillStyle = `rgb(${bgColor[0]}, ${bgColor[1]}, ${bgColor[2]})`;
            ctx.fillRect(
                centerX - stageWidth / 2,
                stageY - stageHeight / 2,
                stageWidth,
                stageHeight
            );

            // Draw stage card border
            ctx.strokeStyle = `rgb(${borderColor[0]}, ${borderColor[1]}, ${borderColor[2]})`;
            ctx.lineWidth = 2;
            ctx.strokeRect(
                centerX - stageWidth / 2,
                stageY - stageHeight / 2,
                stageWidth,
                stageHeight
            );

            // Draw stage title
            ctx.fillStyle = textColor;
            ctx.font = 'bold 24px Arial';
            ctx.textAlign = 'center';
            ctx.fillText(stage.title, centerX, stageY - 10);

            // Draw stage description
            ctx.fillStyle = stage.isUnlocked ? '#cccccc' : '#555555';
            ctx.font = '14px Arial';
            ctx.textAlign = 'center';
            ctx.fillText(stage.description, centerX, stageY + 15);

            // Draw lock indicator for locked stages
            if (!stage.isUnlocked) {
                ctx.fillStyle = '#ff6b6b';
                ctx.font = 'bold 16px Arial';
                ctx.textAlign = 'right';
                ctx.fillText('🔒', centerX + stageWidth / 2 - 15, stageY);
            }

            // Draw selection indicator
            if (isHighlighted && stage.isUnlocked) {
                ctx.fillStyle = '#4ecdc4';
                ctx.font = 'bold 16px Arial';
                ctx.textAlign = 'left';
                ctx.fillText('▶', centerX - stageWidth / 2 - 25, stageY);
            }
        });

        // Draw progress/stats
        const completedStages = this.localState!.stages.filter((stage) => stage.isUnlocked).length;
        const totalStages = this.localState!.stages.length;

        ctx.fillStyle = '#888888';
        ctx.font = '18px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(`Stages Available: ${completedStages}/${totalStages}`, centerX, centerY + 120);

        // Draw instructions
        ctx.fillStyle = '#cccccc';
        ctx.font = '16px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(
            'Use Arrow Keys/WASD to navigate, Enter/Space to select',
            centerX,
            canvas.height - 50
        );
        ctx.fillText('Press Escape to return to menu', centerX, canvas.height - 25);

        ctx.textAlign = 'left'; // Reset alignment

        // Restore canvas state after fade effect
        ctx.restore();
    }
}
