export function createCanvas(id: string, width: number, height: number): CanvasRenderingContext2D {
    const canvas = document.getElementById(id) as HTMLCanvasElement;
    const ctx = canvas.getContext('2d')!;

    canvas.width = width;
    canvas.height = height;

    return ctx;
}
