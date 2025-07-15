import { GameState } from '../types';
import { drawPlayer } from '../render/player';
import { drawSpeechBubble } from '../render/speech-bubble';
import {
    drawLoadingOverlay,
    drawErrorOverlay,
    drawPauseOverlay,
    drawDebugInfo,
} from '../render/overlays';
import { createRenderContext, clearCanvas, drawBackground } from '../render/canvas-helpers';
import { pipe, when } from '../utils';

export const render = (ctx: CanvasRenderingContext2D, state: GameState): void => {
    const renderCtx = createRenderContext(ctx, state);

    // Show error overlay
    if (state.system.error) {
        pipe(renderCtx, clearCanvas, drawErrorOverlay);
        return;
    }

    // Show loading overlay
    if (state.gameMode === 'loading') {
        pipe(renderCtx, clearCanvas, drawBackground, drawLoadingOverlay);
        return;
    }

    // Main game rendering pipeline
    pipe(
        renderCtx,
        clearCanvas,
        drawBackground,
        drawPlayer,
        drawSpeechBubble,
        drawDebugInfo,
        when(state.gameMode === 'paused', drawPauseOverlay)
    );
};
