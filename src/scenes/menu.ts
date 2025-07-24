import { RenderContext, MenuSceneState } from '../types';
import { DefaultScene } from './default';
import { toColorPalette } from '../utils';

export class MenuScene extends DefaultScene<MenuSceneState> {
    name = 'menu';

    localState: MenuSceneState = {
        highlightedMenuItem: 0,
        // menuItems: ['start', 'continue'],
        menuItems: ['start'],
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

        // Draw main logo/title
        ctx.fillStyle = toColorPalette('#ffffff');
        ctx.fillRect(33, 105, 740, 180);

        ctx.fillStyle = toColorPalette('#000000');
        ctx.fillRect(43, 115, 720, 160);
        ctx.fillStyle = toColorPalette('#000000');
        ctx.fillRect(55, 95, 657, 30);

        ctx.font = 'bold 80px "Press Start 2P"';

        ctx.textAlign = 'left';
        ctx.fillStyle = toColorPalette('#f5e109');
        ctx.fillText('BUSINESS', 72, 157);
        ctx.fillStyle = toColorPalette('#f57b09');
        ctx.fillText('BUSINESS', 65, 150);

        ctx.textAlign = 'right';
        ctx.fillStyle = toColorPalette('#f5e109');
        ctx.fillText('BOB', canvas.width - 53, 257);
        ctx.fillStyle = toColorPalette('#f57b09');
        ctx.fillText('BOB', canvas.width - 60, 250);

        // Draw subtitle
        ctx.fillStyle = toColorPalette('#f57b09');
        ctx.font = '16px "Press Start 2P"';
        ctx.textAlign = 'left';
        ctx.fillText('From Mop To Top', 70, 185);
        ctx.fillStyle = toColorPalette('#ffffff');
        ctx.fillText('An adventure to the top', 70, 215);
        ctx.fillText('of the corporate ladder!', 70, 245);

        // Draw menu items (classic NES style - simple text list)
        ctx.textAlign = 'center';
        const menuStartY = centerY + 100;
        const lineHeight = 40;

        this.localState!.menuItems.forEach((item, index) => {
            const itemY = menuStartY + index * lineHeight;
            const isHighlighted = index === this.localState!.highlightedMenuItem;
            const isFlashingItem =
                this.localState!.isFlashing && index === this.localState!.highlightedMenuItem;

            // Draw selection indicator (classic NES style)
            if (isHighlighted) {
                ctx.fillStyle = toColorPalette('#ffffff');
                ctx.font = '16px';
                ctx.textAlign = 'right';

                // Combine flash and transition opacity
                const indicatorOpacity = isFlashingItem ? flashIntensity * opacity : opacity;
                ctx.save();
                ctx.globalAlpha = indicatorOpacity;
                ctx.fillText('►', centerX - 60, itemY + 6);
                ctx.restore();
            }

            // Draw menu text
            ctx.fillStyle = toColorPalette('#ffffff');
            ctx.font = '20px "Press Start 2P"';
            ctx.textAlign = 'left';

            // Flash the text if selected
            if (isFlashingItem) {
                ctx.save();
                ctx.globalAlpha = flashIntensity;
            }

            ctx.fillText(item, centerX - 40, itemY + 8);

            if (isFlashingItem) {
                ctx.restore();
            }
        });

        // Draw copyright text (classic NES style)
        ctx.fillStyle = toColorPalette('#ffffff');
        ctx.font = '12px "Press Start 2P"';
        ctx.textAlign = 'center';
        ctx.fillText('© 2025 BUSINESS BOB PRODUCTIONS', centerX, canvas.height - 60);
        ctx.fillText('SELECT START TO BEGIN', centerX, canvas.height - 35);

        // Reset alignment
        ctx.textAlign = 'left';

        // Restore canvas state after fade effect
        ctx.restore();
    }
}
