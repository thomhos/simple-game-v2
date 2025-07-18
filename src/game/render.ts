import { GameState } from '../types';
// import { drawPlayer } from '../render/player';
// import { drawSpeechBubble } from '../render/speech-bubble';
import { drawErrorOverlay, drawDebugInfo } from '../render/overlays';
import { createRenderContext, clearCanvas, drawBackground } from '../render/canvas-helpers';
// import { drawMenu } from '../render/menu';
import { pipe, when } from '../utils';

// import { LoadingScene } from '../scenes/loading-scene';

export const render = (ctx: CanvasRenderingContext2D, state: GameState): void => {
    // const { error, currentScene } = state;

    pipe(
        createRenderContext(ctx, state),
        clearCanvas,
        drawBackground,
        drawDebugInfo
        // when(currentScene === 'loading', LoadingScene.render),
        // when(error !== undefined, drawErrorOverlay)
    );
};
