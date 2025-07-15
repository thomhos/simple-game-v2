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
