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
};
