import { GameState, RenderContext } from '../types';

export function createCanvas(id: string, width: number, height: number): CanvasRenderingContext2D {
    const canvas = document.getElementById(id) as HTMLCanvasElement;

    if (!canvas) {
        throw new Error(`Canvas element with id "${id}" not found`);
    }

    const ctx = canvas.getContext('2d', { willReadFrequently: true });
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

    const lineGlitchChance = 0.00015;
    const screenGlitchChance = 0.001;
    const flickerChance = 0.005;

    // Scanlines with occasional glitch
    for (let y = 0; y < canvas.height; y += 4) {
        // Random glitch chance (very small)
        const isGlitchLine = Math.random() < lineGlitchChance;
        const glitchIntensity = Math.random() * 0.3 + 0.05;

        if (isGlitchLine) {
            // Glitch effect - brighter, thicker scanline
            ctx.fillStyle = `rgba(255, 255, 255, ${glitchIntensity})`;
            ctx.fillRect(0, y, canvas.width, 3);

            // Random horizontal displacement for this line
            const displacement = (Math.random() - 0.5) * 10;
            const imageData = ctx.getImageData(0, y, canvas.width, 3);
            ctx.clearRect(0, y, canvas.width, 3);
            ctx.putImageData(imageData, displacement, y);
        } else {
            // Normal scanline
            const normalIntensity = 0.15 + (Math.random() - 0.5) * 0.05; // slight variation
            ctx.fillStyle = `rgba(0, 0, 0, ${normalIntensity})`;
            ctx.fillRect(0, y, canvas.width, 2);
        }
    }

    // Occasional screen-wide glitch
    if (Math.random() < screenGlitchChance) {
        const glitchHeight = Math.random() * 20 + 5;
        const glitchY = Math.random() * (canvas.height - glitchHeight);

        // Horizontal distortion
        const imageData = ctx.getImageData(0, glitchY, canvas.width, glitchHeight);
        const displacement = (Math.random() - 0.5) * 60;
        ctx.putImageData(imageData, displacement, glitchY);

        // Add some static
        ctx.fillStyle = `rgba(255, 255, 255, ${Math.random() * 0.2})`;
        ctx.fillRect(0, glitchY, canvas.width, glitchHeight);
    }

    // Subtle flicker (very occasional)
    if (Math.random() < flickerChance) {
        ctx.fillStyle = `rgba(255, 255, 255, ${Math.random() * 0.1})`;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
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
