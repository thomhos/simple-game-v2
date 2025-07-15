import { GameState } from '../types';

export function drawLoadingOverlay(ctx: CanvasRenderingContext2D): void {
    ctx.fillStyle = '#ffffff';
    ctx.font = '32px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('Loading sprites...', ctx.canvas.width / 2, ctx.canvas.height / 2);
    ctx.textAlign = 'left'; // Reset alignment
}

export function drawErrorOverlay(ctx: CanvasRenderingContext2D, error: { message: string; details?: string }): void {
    ctx.fillStyle = 'rgba(139, 0, 0, 0.8)'; // Dark red background
    ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);

    ctx.fillStyle = '#ffffff';
    ctx.font = '32px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('Something went wrong!', ctx.canvas.width / 2, ctx.canvas.height / 2 - 60);

    ctx.font = '20px Arial';
    ctx.fillText(error.message || 'An unknown error occurred', ctx.canvas.width / 2, ctx.canvas.height / 2 - 10);

    if (error.details) {
        ctx.font = '16px Arial';
        ctx.fillStyle = '#cccccc';
        ctx.fillText(error.details, ctx.canvas.width / 2, ctx.canvas.height / 2 + 30);
    }

    ctx.font = '18px Arial';
    ctx.fillStyle = '#ffffff';
    ctx.fillText('Please refresh the page to try again', ctx.canvas.width / 2, ctx.canvas.height / 2 + 70);

    ctx.textAlign = 'left'; // Reset alignment
}

export function drawPauseOverlay(ctx: CanvasRenderingContext2D): void {
    ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
    ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);

    ctx.fillStyle = '#ffffff';
    ctx.font = '32px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('PAUSED', ctx.canvas.width / 2, ctx.canvas.height / 2);
    ctx.fillText('Press Escape to resume', ctx.canvas.width / 2, ctx.canvas.height / 2 + 40);
    ctx.textAlign = 'left'; // Reset alignment
}

export function drawDebugInfo(ctx: CanvasRenderingContext2D, state: GameState): void {
    ctx.fillStyle = '#ffffff';
    ctx.font = '16px Arial';
    ctx.fillText(`Player: (${Math.round(state.player.x)}, ${Math.round(state.player.y)})`, 10, 30);
    ctx.fillText(`Animation: ${state.player.spriteAnimationState.currentAnimation}`, 10, 50);
    ctx.fillText(`Sprites loaded: ${state.sprites.isLoaded}`, 10, 70);
    ctx.fillText('Use arrow keys or WASD to move', 10, 90);
    ctx.fillText('Press Escape to pause/resume', 10, 110);
}