import { GameState, RenderContext } from '../types';

export function createCanvas(id: string, width: number, height: number): CanvasRenderingContext2D {
    const canvas = document.getElementById(id) as HTMLCanvasElement;
    if (!canvas) {
        throw new Error(`Canvas element with id "${id}" not found`);
    }

    const ctx = canvas.getContext('2d');
    if (!ctx) {
        throw new Error('Failed to get 2D rendering context from canvas');
    }

    if (width <= 0 || height <= 0) {
        throw new Error('Canvas width and height must be positive numbers');
    }

    canvas.width = width;
    canvas.height = height;

    return ctx;
}

export const createRenderContext = (
    ctx: CanvasRenderingContext2D,
    state: GameState
): RenderContext => ({
    ctx,
    state,
});

// Base rendering functions
export const clearCanvas = (renderCtx: RenderContext): RenderContext => {
    renderCtx.ctx.clearRect(0, 0, renderCtx.ctx.canvas.width, renderCtx.ctx.canvas.height);
    return renderCtx;
};

// CRT effects function
export const renderCRTEffects = (renderContext: RenderContext): RenderContext => {
    const { ctx } = renderContext;
    const { canvas } = ctx;

    // Scanlines
    ctx.fillStyle = 'rgba(0, 0, 0, 0.15)';
    for (let y = 0; y < canvas.height; y += 4) {
        ctx.fillRect(0, y, canvas.width, 2);
    }

    // CRT vignette effect
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const maxRadius = Math.max(canvas.width, canvas.height) / 2;

    const gradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, maxRadius);

    gradient.addColorStop(0, 'rgba(0, 0, 0, 0)');
    gradient.addColorStop(0.7, 'rgba(0, 0, 0, 0.1)');
    gradient.addColorStop(1, 'rgba(0, 0, 0, 0.3)');

    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    return renderContext;
};
