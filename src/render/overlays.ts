import { RenderContext } from './canvas-helpers';

export function drawLoadingOverlay(renderCtx: RenderContext): RenderContext {
    const { ctx } = renderCtx;
    ctx.fillStyle = '#ffffff';
    ctx.font = '32px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('Loading sprites...', ctx.canvas.width / 2, ctx.canvas.height / 2);
    ctx.textAlign = 'left'; // Reset alignment
    return renderCtx;
}

export function drawErrorOverlay(renderCtx: RenderContext): RenderContext {
    const { ctx, state } = renderCtx;
    const error = state.error;

    if (!error) return renderCtx;

    ctx.fillStyle = 'rgba(139, 0, 0, 0.8)'; // Dark red background
    ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);

    ctx.fillStyle = '#ffffff';
    ctx.font = '32px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('Something went wrong!', ctx.canvas.width / 2, ctx.canvas.height / 2 - 60);

    ctx.font = '20px Arial';
    ctx.fillText(
        error.message || 'An unknown error occurred',
        ctx.canvas.width / 2,
        ctx.canvas.height / 2 - 10
    );

    ctx.font = '18px Arial';
    ctx.fillStyle = '#ffffff';
    ctx.fillText(
        'Please refresh the page to try again',
        ctx.canvas.width / 2,
        ctx.canvas.height / 2 + 70
    );

    ctx.textAlign = 'left'; // Reset alignment
    return renderCtx;
}

export function drawPauseOverlay(renderCtx: RenderContext): RenderContext {
    const { ctx } = renderCtx;
    ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
    ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);

    ctx.fillStyle = '#ffffff';
    ctx.font = '32px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('PAUSED', ctx.canvas.width / 2, ctx.canvas.height / 2);
    ctx.fillText('Press Escape to resume', ctx.canvas.width / 2, ctx.canvas.height / 2 + 40);
    ctx.textAlign = 'left'; // Reset alignment
    return renderCtx;
}

export function drawDebugInfo(renderCtx: RenderContext): RenderContext {
    const { ctx, state } = renderCtx;
    ctx.textAlign = 'left'; // Reset alignment
    ctx.fillStyle = '#ffffff';
    ctx.font = '16px Arial';
    const xOffset = 10;
    let yOffset = 22;

    // Show game time
    ctx.fillText(`GameTime: ${(state.gameTime / 1000).toFixed(2)}`, xOffset, yOffset);
    yOffset += 20;

    // Show current scene
    ctx.fillText(`Scene: ${state.currentScene}`, xOffset, yOffset);
    yOffset += 20;

    // // Show transition state
    // const { scenes } = state;
    // if (scenes.isTransitioningOut) {
    //     const progress = Math.min(
    //         1,
    //         (state.system.gameTime - scenes.transitionStartTime) / scenes.transitionDuration
    //     );
    //     ctx.fillText(
    //         `Transitioning OUT to ${scenes.nextScene}: ${(progress * 100).toFixed(1)}%`,
    //         xOffset,
    //         yOffset
    //     );
    //     yOffset += 20;
    // }

    // if (scenes.isTransitioningIn) {
    //     const progress = Math.min(
    //         1,
    //         (state.system.gameTime - scenes.transitionStartTime) / scenes.transitionDuration
    //     );
    //     ctx.fillText(`Transitioning IN: ${(progress * 100).toFixed(1)}%`, xOffset, yOffset);
    //     yOffset += 20;
    // }

    // // Show next scene if set
    // if (scenes.nextScene) {
    //     ctx.fillText(`Next Scene: ${scenes.nextScene}`, xOffset, yOffset);
    //     yOffset += 20;
    // }

    ctx.fillText('Press 1 to go to menu, 2 to go to playing', xOffset, yOffset);

    return renderCtx;
}
