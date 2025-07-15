import { GameState } from '../types';
import { drawPlayer } from '../render/player';
import { drawSpeechBubble } from '../render/speech-bubble';
import { drawLoadingOverlay, drawErrorOverlay, drawPauseOverlay, drawDebugInfo } from '../render/overlays';

export const render = (ctx: CanvasRenderingContext2D, state: GameState): void => {
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

    // Draw background
    ctx.fillStyle = '#2d4a2b';
    ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);

    // Show loading overlay
    if (state.gameMode === 'loading' && !state.system.error) {
        drawLoadingOverlay(ctx);
        return;
    }

    // Show error overlay
    if (state.system.error) {
        drawErrorOverlay(ctx, state.system.error);
        return;
    }

    // Draw player with sprite or fallback
    drawPlayer(ctx, state, state.sprites.loadedSprites);

    // Draw speech bubble with exclamation mark
    drawSpeechBubble(ctx, state);

    // Draw debug info
    drawDebugInfo(ctx, state);

    // Show pause overlay
    if (state.gameMode === 'paused') {
        drawPauseOverlay(ctx);
    }
};
