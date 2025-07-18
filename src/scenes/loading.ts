import { GameState, RenderContext } from '../types';
import { DefaultScene } from './default';
import { loadAllAssets } from '../game/asset-loader';

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

    async loadAssets(state: GameState) {
        this.localState.assetsRequested = true;
        // Start loading assets
        try {
            const assets = await loadAllAssets(state, (progress) => {
                this.localState.progress = progress;
            });

            // Assets loaded successfully
            this.dispatcher.dispatch({
                type: 'ASSETS_LOADED',
                audio: assets.audio,
                images: assets.images,
            });
            this.changeScene('menu', true);
        } catch (error) {
            console.error('Failed to load assets:', error);
            this.dispatcher.dispatch({
                type: 'THROW_ERROR',
                message: 'Failed to load game assets',
            });
        }
    }

    update(state: GameState, fts: number) {
        super.update(state, fts);

        if (!this.localState?.assetsRequested) {
            this.loadAssets(state);
        }


        if (state.input.keysPressed.includes('1') && this.transitionType === 'none') {
            this.changeScene('menu');
        }
    }

    render(renderContext: RenderContext): RenderContext {
        super.render(renderContext);
        const { ctx } = renderContext;

        ctx.fillStyle = '#ffffff';
        ctx.font = '32px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('Loading sprites...', ctx.canvas.width / 2, ctx.canvas.height / 2);

        // Draw progress bar if we have progress
        if (this.localState.progress > 0) {
            const barWidth = 300;
            const barHeight = 20;
            const barX = (ctx.canvas.width - barWidth) / 2;
            const barY = ctx.canvas.height / 2 + 50;

            // Background
            ctx.fillStyle = '#333333';
            ctx.fillRect(barX, barY, barWidth, barHeight);

            // Progress
            ctx.fillStyle = '#4CAF50';
            ctx.fillRect(barX, barY, barWidth * this.localState.progress, barHeight);

            // Text
            ctx.fillStyle = '#ffffff';
            ctx.font = '16px Arial';
            ctx.fillText(
                `${Math.round(this.localState.progress * 100)}%`,
                ctx.canvas.width / 2,
                barY + barHeight + 25
            );

            ctx.textAlign = 'left'; // Reset alignment
        }

        return renderContext;
    }
}
