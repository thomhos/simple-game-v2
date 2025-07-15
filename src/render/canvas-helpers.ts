import { GameState } from '../types';

export interface RenderContext {
    readonly ctx: CanvasRenderingContext2D;
    readonly state: GameState;
}

export const createRenderContext = (ctx: CanvasRenderingContext2D, state: GameState): RenderContext => ({
    ctx,
    state,
});

// Base rendering functions
export const clearCanvas = (renderCtx: RenderContext): RenderContext => {
    renderCtx.ctx.clearRect(0, 0, renderCtx.ctx.canvas.width, renderCtx.ctx.canvas.height);
    return renderCtx;
};

export const drawBackground = (renderCtx: RenderContext): RenderContext => {
    renderCtx.ctx.fillStyle = '#2d4a2b';
    renderCtx.ctx.fillRect(0, 0, renderCtx.ctx.canvas.width, renderCtx.ctx.canvas.height);
    return renderCtx;
};

