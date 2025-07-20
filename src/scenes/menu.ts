import { RenderContext, MenuSceneState } from '../types';
import { DefaultScene } from './default';

export class MenuScene extends DefaultScene<MenuSceneState> {
    name = 'menu';

    localState: MenuSceneState = {
        highlightedMenuItem: 0,
        menuItems: ['start', 'continue'],
        isFlashing: false,
        flashStartTime: 0,
    };

    onEnter() {
        super.onEnter();
        // Reset menu state when entering
        if (this.localState) {
            this.localState.highlightedMenuItem = 0;
            this.localState.isFlashing = false;
            this.localState.flashStartTime = 0;
        }
    }

    update() {
        super.update();
        const state = this.store.getState();

        // prevent input during transition
        if (this.transitionType !== 'none') return;

        // Handle navigation input
        if (state.input.keysPressed.includes('ArrowUp') || state.input.keysPressed.includes('w')) {
            this.localState!.highlightedMenuItem =
                this.localState!.highlightedMenuItem > 0
                    ? this.localState!.highlightedMenuItem - 1
                    : this.localState!.menuItems.length - 1; // Wrap to bottom
        }

        if (
            state.input.keysPressed.includes('ArrowDown') ||
            state.input.keysPressed.includes('s')
        ) {
            this.localState!.highlightedMenuItem =
                this.localState!.highlightedMenuItem < this.localState!.menuItems.length - 1
                    ? this.localState!.highlightedMenuItem + 1
                    : 0; // Wrap to top
        }

        // Handle selection
        if (state.input.keysPressed.includes('Enter') || state.input.keysPressed.includes(' ')) {
            if (!this.localState!.isFlashing) {
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

                // Navigate based on selection
                const selectedItem =
                    this.localState!.menuItems[this.localState!.highlightedMenuItem];
                if (selectedItem === 'start') {
                    this.changeScene('intro');
                } else if (selectedItem === 'continue') {
                    this.changeScene('stage-select');
                }
            }
        }
    }

    render(renderContext: RenderContext) {
        super.render(renderContext);

        const { ctx, state } = renderContext;
        const { canvas } = ctx;
        const menuX = canvas.width / 2;
        const menuY = canvas.height / 2;
        const buttonWidth = 200;
        const buttonHeight = 50;
        const buttonSpacing = 20;

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
        ctx.fillText('Game Menu', menuX, menuY - 100);

        // Draw menu buttons
        this.localState!.menuItems.forEach((item, index) => {
            const buttonY = menuY + index * (buttonHeight + buttonSpacing);
            const isHighlighted = index === this.localState!.highlightedMenuItem;
            const isFlashingItem =
                this.localState!.isFlashing && index === this.localState!.highlightedMenuItem;

            // Calculate colors with flash effect
            let bgColor = isHighlighted ? [76, 175, 80] : [51, 51, 51];
            let borderColor = isHighlighted ? [102, 187, 106] : [102, 102, 102];

            if (isFlashingItem) {
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

            // Draw button background
            ctx.fillStyle = `rgb(${bgColor[0]}, ${bgColor[1]}, ${bgColor[2]})`;
            ctx.fillRect(
                menuX - buttonWidth / 2,
                buttonY - buttonHeight / 2,
                buttonWidth,
                buttonHeight
            );

            // Draw button border
            ctx.strokeStyle = `rgb(${borderColor[0]}, ${borderColor[1]}, ${borderColor[2]})`;
            ctx.lineWidth = 2;
            ctx.strokeRect(
                menuX - buttonWidth / 2,
                buttonY - buttonHeight / 2,
                buttonWidth,
                buttonHeight
            );

            // Draw button text
            ctx.fillStyle = '#ffffff';
            ctx.font = '24px Arial';
            ctx.textAlign = 'center';
            ctx.fillText(item.toUpperCase(), menuX, buttonY + 8);
        });

        // Draw instructions
        ctx.fillStyle = '#cccccc';
        ctx.font = '16px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(
            'Use Arrow Keys/WASD to navigate, Enter/Space to select',
            menuX,
            canvas.height - 50
        );

        ctx.textAlign = 'left'; // Reset alignment

        // Restore canvas state after fade effect
        ctx.restore();
    }
}
