import { RenderContext } from '../types';
import { DefaultScene } from './default';
import { loadAllAssets } from '../utils/asset-loader';
import { toColorPalette } from '../utils';

export interface LoadingSceneState {
    assetsRequested: boolean;
    progress: number;
}

export class LoadingScene extends DefaultScene<LoadingSceneState> {
    name = 'loading';

    localState: LoadingSceneState = {
        assetsRequested: false,
        progress: 0,
    };

    async loadAssets() {
        this.localState.assetsRequested = true;
        const state = this.store.getState();
        // Start loading assets
        try {
            const assets = await loadAllAssets(state, (progress) => {
                this.localState.progress = progress;
            });

            // Assets loaded successfully
            this.dispatch({
                type: 'ASSETS_LOADED',
                audio: assets.audio,
                images: assets.images,
            });

            await new Promise((resolve) => {
                setTimeout(resolve, 3000);
            });

            // Move to menu when done
            this.changeScene('menu');
        } catch (error) {
            console.error('Failed to load assets:', error);
            this.dispatch({
                type: 'THROW_ERROR',
                message: 'Failed to load game assets',
            });
        }
    }

    update() {
        super.update();
        const state = this.store.getState();

        if (!this.localState?.assetsRequested) {
            this.loadAssets();
        }

        // Skip if in transition
        if (this.transitionType !== 'none') return;

        if (state.input.keysPressed.includes('1')) {
            this.changeScene('menu');
        }
    }

    render(renderContext: RenderContext) {
        super.render(renderContext);

        const { ctx } = renderContext;

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

        ctx.fillStyle = toColorPalette('#ffffff');
        ctx.font = '16px "Press Start 2P"';
        ctx.textAlign = 'center';
        ctx.fillText('loading ...', ctx.canvas.width / 2, ctx.canvas.height / 2 - 20);

        // Draw progress bar if we have progress
        if (this.localState.progress > 0) {
            const barWidth = 250;
            const barHeight = 10;
            const barX = (ctx.canvas.width - barWidth) / 2;
            const barY = ctx.canvas.height / 2;

            // Progress bar outline
            ctx.strokeStyle = toColorPalette('#ffffff');
            ctx.lineWidth = 1;
            ctx.strokeRect(barX - 4, barY - 4, barWidth + 8, barHeight + 8);

            // Progress
            // ctx.fillStyle = '#4CAF50';
            ctx.fillStyle = toColorPalette('#ffffff');
            ctx.fillRect(barX, barY, barWidth * this.localState.progress, barHeight);

            // Text
            ctx.fillStyle = toColorPalette('#ffffff');
            ctx.font = '10px "Press Start 2P"';
            ctx.fillText(
                `${Math.round(this.localState.progress * 100)}%`,
                ctx.canvas.width / 2,
                barY + barHeight + 30
            );

            ctx.textAlign = 'left'; // Reset alignment
        }

        // Restore canvas state after fade effect
        renderContext.ctx.restore();
    }
}
