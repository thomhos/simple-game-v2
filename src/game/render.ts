import { GameState } from '../types';
// import { drawPlayer } from '../render/player';
// import { drawSpeechBubble } from '../render/speech-bubble';
import { drawLoadingOverlay, drawErrorOverlay, drawDebugInfo } from '../render/overlays';
import { createRenderContext, clearCanvas, drawBackground } from '../render/canvas-helpers';
import { pipe, when } from '../utils';

export const render = (ctx: CanvasRenderingContext2D, state: GameState): void => {
    const {
        system: { error },
        scenes: { currentScene },
    } = state;

    pipe(
        createRenderContext(ctx, state),
        clearCanvas,
        drawBackground,
        drawDebugInfo,
        when(currentScene === 'loading', drawLoadingOverlay),
        when(error !== undefined, drawErrorOverlay)
    );
};
