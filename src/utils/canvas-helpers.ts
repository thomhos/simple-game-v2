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

export const drawBackground = (
    color: string = '#ffffff'
): ((renderCtx: RenderContext) => RenderContext) => {
    return (renderCtx) => {
        renderCtx.ctx.fillStyle = toNESColor(color);
        renderCtx.ctx.fillRect(0, 0, renderCtx.ctx.canvas.width, renderCtx.ctx.canvas.height);
        return renderCtx;
    };
};

// CRT effects function
export const renderCRTEffects = (renderContext: RenderContext): RenderContext => {
    const { ctx } = renderContext;
    const { canvas } = ctx;

    const lineGlitchChance = 0.0001;
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
    gradient.addColorStop(1, 'rgba(0, 0, 0, 0.25)');

    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    return renderContext;
};

// Color quantization helper
export const quantizeColor = (color: string, palette: string[]): string => {
    // Parse color string (hex or rgba/rgb)
    const parseColor = (colorStr: string): { r: number; g: number; b: number; a: number } => {
        // Handle hex colors (#ffffff or #fff)
        if (colorStr.startsWith('#')) {
            const hex = colorStr.replace('#', '');
            if (hex.length === 3) {
                return {
                    r: parseInt(hex[0] + hex[0], 16),
                    g: parseInt(hex[1] + hex[1], 16),
                    b: parseInt(hex[2] + hex[2], 16),
                    a: 1,
                };
            } else if (hex.length === 6) {
                return {
                    r: parseInt(hex.substr(0, 2), 16),
                    g: parseInt(hex.substr(2, 2), 16),
                    b: parseInt(hex.substr(4, 2), 16),
                    a: 1,
                };
            }
        }

        // Handle rgb() and rgba() colors
        const rgbaMatch = colorStr.match(/rgba?\(([^)]+)\)/);
        if (rgbaMatch) {
            const values = rgbaMatch[1].split(',').map((v) => parseFloat(v.trim()));
            return {
                r: Math.round(values[0] || 0),
                g: Math.round(values[1] || 0),
                b: Math.round(values[2] || 0),
                a: values[3] !== undefined ? values[3] : 1,
            };
        }

        // Default fallback
        return { r: 0, g: 0, b: 0, a: 1 };
    };

    // Convert hex color to RGB
    const hexToRgb = (hex: string): { r: number; g: number; b: number } => {
        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result
            ? {
                  r: parseInt(result[1], 16),
                  g: parseInt(result[2], 16),
                  b: parseInt(result[3], 16),
              }
            : { r: 0, g: 0, b: 0 };
    };

    // Calculate color distance (Euclidean distance in RGB space)
    const colorDistance = (
        color1: { r: number; g: number; b: number },
        color2: { r: number; g: number; b: number }
    ): number => {
        const dr = color1.r - color2.r;
        const dg = color1.g - color2.g;
        const db = color1.b - color2.b;
        return Math.sqrt(dr * dr + dg * dg + db * db);
    };

    const inputColor = parseColor(color);
    let closestColor = palette[0];
    let closestDistance = Infinity;

    for (const paletteColor of palette) {
        const paletteRgb = hexToRgb(paletteColor);
        const distance = colorDistance(inputColor, paletteRgb);

        if (distance < closestDistance) {
            closestDistance = distance;
            closestColor = paletteColor;
        }
    }

    // Preserve alpha if original had transparency
    if (inputColor.a < 1) {
        const paletteRgb = hexToRgb(closestColor);
        return `rgba(${paletteRgb.r}, ${paletteRgb.g}, ${paletteRgb.b}, ${inputColor.a})`;
    }

    return closestColor;
};

// Predefined color palettes
export const COLOR_PALETTES = {
    gameboy: ['#0f380f', '#306230', '#8bac0f', '#9bbc0f'],
    gbc: [
        '#000000',
        '#003300',
        '#006600',
        '#009900',
        '#00cc00',
        '#00ff00',
        '#330000',
        '#333300',
        '#336600',
        '#339900',
        '#33cc00',
        '#33ff00',
        '#660000',
        '#663300',
        '#666600',
        '#669900',
        '#66cc00',
        '#66ff00',
        '#990000',
        '#993300',
        '#996600',
        '#999900',
        '#99cc00',
        '#99ff00',
        '#cc0000',
        '#cc3300',
        '#cc6600',
        '#cc9900',
        '#cccc00',
        '#ccff00',
        '#ff0000',
        '#ff3300',
        '#ff6600',
        '#ff9900',
        '#ffcc00',
        '#ffff00',
        '#000033',
        '#003333',
        '#006633',
        '#009933',
        '#00cc33',
        '#00ff33',
        '#330033',
        '#333333',
        '#336633',
        '#339933',
        '#33cc33',
        '#33ff33',
        '#660033',
        '#663333',
        '#666633',
        '#669933',
        '#66cc33',
        '#66ff33',
        '#990033',
        '#993333',
        '#996633',
        '#999933',
        '#99cc33',
        '#99ff33',
        '#cc0033',
        '#cc3333',
        '#cc6633',
        '#cc9933',
        '#cccc33',
        '#ccff33',
        '#ff0033',
        '#ff3333',
        '#ff6633',
        '#ff9933',
        '#ffcc33',
        '#ffff33',
        '#000066',
        '#003366',
        '#006666',
        '#009966',
        '#00cc66',
        '#00ff66',
        '#330066',
        '#333366',
        '#336666',
        '#339966',
        '#33cc66',
        '#33ff66',
        '#660066',
        '#663366',
        '#666666',
        '#669966',
        '#66cc66',
        '#66ff66',
        '#990066',
        '#993366',
        '#996666',
        '#999966',
        '#99cc66',
        '#99ff66',
        '#cc0066',
        '#cc3366',
        '#cc6666',
        '#cc9966',
        '#cccc66',
        '#ccff66',
        '#ff0066',
        '#ff3366',
        '#ff6666',
        '#ff9966',
        '#ffcc66',
        '#ffff66',
        '#000099',
        '#003399',
        '#006699',
        '#009999',
        '#00cc99',
        '#00ff99',
        '#330099',
        '#333399',
        '#336699',
        '#339999',
        '#33cc99',
        '#33ff99',
        '#660099',
        '#663399',
        '#666699',
        '#669999',
        '#66cc99',
        '#66ff99',
        '#990099',
        '#993399',
        '#996699',
        '#999999',
        '#99cc99',
        '#99ff99',
        '#cc0099',
        '#cc3399',
        '#cc6699',
        '#cc9999',
        '#cccc99',
        '#ccff99',
        '#ff0099',
        '#ff3399',
        '#ff6699',
        '#ff9999',
        '#ffcc99',
        '#ffff99',
        '#0000cc',
        '#0033cc',
        '#0066cc',
        '#0099cc',
        '#00cccc',
        '#00ffcc',
        '#3300cc',
        '#3333cc',
        '#3366cc',
        '#3399cc',
        '#33cccc',
        '#33ffcc',
        '#6600cc',
        '#6633cc',
        '#6666cc',
        '#6699cc',
        '#66cccc',
        '#66ffcc',
        '#9900cc',
        '#9933cc',
        '#9966cc',
        '#9999cc',
        '#99cccc',
        '#99ffcc',
        '#cc00cc',
        '#cc33cc',
        '#cc66cc',
        '#cc99cc',
        '#cccccc',
        '#ccffcc',
        '#ff00cc',
        '#ff33cc',
        '#ff66cc',
        '#ff99cc',
        '#ffcccc',
        '#ffffcc',
        '#0000ff',
        '#0033ff',
        '#0066ff',
        '#0099ff',
        '#00ccff',
        '#00ffff',
        '#3300ff',
        '#3333ff',
        '#3366ff',
        '#3399ff',
        '#33ccff',
        '#33ffff',
        '#6600ff',
        '#6633ff',
        '#6666ff',
        '#6699ff',
        '#66ccff',
        '#66ffff',
        '#9900ff',
        '#9933ff',
        '#9966ff',
        '#9999ff',
        '#99ccff',
        '#99ffff',
        '#cc00ff',
        '#cc33ff',
        '#cc66ff',
        '#cc99ff',
        '#ccccff',
        '#ccffff',
        '#ff00ff',
        '#ff33ff',
        '#ff66ff',
        '#ff99ff',
        '#ffccff',
        '#ffffff',
    ],
    nes: [
        '#7C7C7C',
        '#0000FC',
        '#0000BC',
        '#4428BC',
        '#940084',
        '#A80020',
        '#A81000',
        '#881400',
        '#503000',
        '#007800',
        '#006800',
        '#005800',
        '#004058',
        '#000000',
        '#000000',
        '#000000',
        '#BCBCBC',
        '#0078F8',
        '#0058F8',
        '#6844FC',
        '#D800CC',
        '#E40058',
        '#F83800',
        '#E45C10',
        '#AC7C00',
        '#00B800',
        '#00A800',
        '#00A844',
        '#008888',
        '#000000',
        '#000000',
        '#000000',
        '#F8F8F8',
        '#3CBCFC',
        '#6888FC',
        '#9878F8',
        '#F878F8',
        '#F85898',
        '#F87858',
        '#FCA044',
        '#F8B800',
        '#B8F818',
        '#58D854',
        '#58F898',
        '#00E8D8',
        '#787878',
        '#000000',
        '#000000',
        '#FCFCFC',
        '#A4E4FC',
        '#B8B8F8',
        '#D8B8F8',
        '#F8B8F8',
        '#F8A4C0',
        '#F0D0B0',
        '#FCE0A8',
        '#F8D878',
        '#D8F878',
        '#B8F8B8',
        '#B8F8D8',
        '#00FCFC',
        '#F8D8F8',
        '#000000',
        '#000000',
    ],
    cga: [
        '#000000',
        '#0000aa',
        '#00aa00',
        '#00aaaa',
        '#aa0000',
        '#aa00aa',
        '#aa5500',
        '#aaaaaa',
        '#555555',
        '#5555ff',
        '#55ff55',
        '#55ffff',
        '#ff5555',
        '#ff55ff',
        '#ffff55',
        '#ffffff',
    ],
    mono: ['#000000', '#333333', '#666666', '#999999', '#cccccc', '#ffffff'],
};

// Convenience function with default palette
export const toGameBoyColor = (color: string): string => {
    return quantizeColor(color, COLOR_PALETTES.gameboy);
};

export const toNESColor = (color: string): string => {
    return quantizeColor(color, COLOR_PALETTES.nes);
};

export const toCGAColor = (color: string): string => {
    return quantizeColor(color, COLOR_PALETTES.cga);
};

export const toMonoColor = (color: string): string => {
    return quantizeColor(color, COLOR_PALETTES.mono);
};

export const toGBCColor = (color: string): string => {
    return quantizeColor(color, COLOR_PALETTES.gbc);
};
