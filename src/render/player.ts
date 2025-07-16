import { RenderContext } from './canvas-helpers';

export function drawPlayer(renderCtx: RenderContext): RenderContext {
    const { ctx, state } = renderCtx;
    
    // TODO: Update player rendering for new stage-based structure
    // For now, just draw the first stage's player if it exists
    if (state.stages.stages.length === 0) {
        return renderCtx;
    }

    const player = state.stages.stages[0].player;
    
    // For now, just draw a simple rectangle placeholder
    // TODO: Implement sprite rendering with new asset structure
    ctx.fillStyle = 'blue';
    ctx.fillRect(player.x, player.y, player.width, player.height);

    return renderCtx;
}
