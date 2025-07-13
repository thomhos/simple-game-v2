import { GameState } from './types';

export const render = (ctx: CanvasRenderingContext2D, state: GameState): void => {
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

    // Draw background
    ctx.fillStyle = '#2d4a2b';
    ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);

    // Draw player
    ctx.fillStyle = '#4a90e2';
    ctx.fillRect(state.player.x, state.player.y, state.player.width, state.player.height);

    // Draw border around player
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 2;
    ctx.strokeRect(state.player.x, state.player.y, state.player.width, state.player.height);

    // Draw debug info
    ctx.fillStyle = '#ffffff';
    ctx.font = '16px Arial';
    ctx.fillText(`Player: (${Math.round(state.player.x)}, ${Math.round(state.player.y)})`, 10, 30);
    ctx.fillText('Use arrow keys or WASD to move', 10, 50);
    ctx.fillText('Press Escape to pause/resume', 10, 70);
    
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
