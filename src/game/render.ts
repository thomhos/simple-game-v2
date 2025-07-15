import { GameState } from '../types';
import { drawPlayer } from '../sprites';

export const render = (ctx: CanvasRenderingContext2D, state: GameState): void => {
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

    // Draw background
    ctx.fillStyle = '#2d4a2b';
    ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);

    // Show loading overlay
    if (state.gameMode === 'loading' && !state.error) {
        ctx.fillStyle = '#ffffff';
        ctx.font = '32px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('Loading sprites...', ctx.canvas.width / 2, ctx.canvas.height / 2);
        ctx.textAlign = 'left'; // Reset alignment
        return;
    }

    // Show error overlay
    if (state.error) {
        ctx.fillStyle = 'rgba(139, 0, 0, 0.8)'; // Dark red background
        ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);

        ctx.fillStyle = '#ffffff';
        ctx.font = '32px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('Something went wrong!', ctx.canvas.width / 2, ctx.canvas.height / 2 - 60);

        ctx.font = '20px Arial';
        ctx.fillText(state.error?.message || 'An unknown error occurred', ctx.canvas.width / 2, ctx.canvas.height / 2 - 10);

        if (state.error?.details) {
            ctx.font = '16px Arial';
            ctx.fillStyle = '#cccccc';
            ctx.fillText(state.error.details, ctx.canvas.width / 2, ctx.canvas.height / 2 + 30);
        }

        ctx.font = '18px Arial';
        ctx.fillStyle = '#ffffff';
        ctx.fillText('Please refresh the page to try again', ctx.canvas.width / 2, ctx.canvas.height / 2 + 70);

        ctx.textAlign = 'left'; // Reset alignment
        return;
    }

    // Draw player with sprite or fallback
    drawPlayer(ctx, state, state.sprites.loadedSprites);

    // Draw debug info
    ctx.fillStyle = '#ffffff';
    ctx.font = '16px Arial';
    ctx.fillText(`Player: (${Math.round(state.player.x)}, ${Math.round(state.player.y)})`, 10, 30);
    ctx.fillText(`Animation: ${state.player.spriteAnimationState.currentAnimation}`, 10, 50);
    ctx.fillText(`Sprites loaded: ${state.sprites.isLoaded}`, 10, 70);
    ctx.fillText('Use arrow keys or WASD to move', 10, 90);
    ctx.fillText('Press Escape to pause/resume', 10, 110);

    // Show pause overlay
    if (state.gameMode === 'paused') {
        ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
        ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);

        ctx.fillStyle = '#ffffff';
        ctx.font = '32px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('PAUSED', ctx.canvas.width / 2, ctx.canvas.height / 2);
        ctx.fillText('Press Escape to resume', ctx.canvas.width / 2, ctx.canvas.height / 2 + 40);
        ctx.textAlign = 'left'; // Reset alignment
    }
};
