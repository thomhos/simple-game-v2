import { RenderContext } from './canvas-helpers';

export function drawSpeechBubble(renderCtx: RenderContext): RenderContext {
    const { ctx, state } = renderCtx;
    const player = state.player;
    const bubbleWidth = 30;
    const bubbleHeight = 25;
    const bubbleX = player.x + player.width / 2 - bubbleWidth / 2;
    const bubbleY = player.y - bubbleHeight;

    // Draw speech bubble background
    ctx.fillStyle = '#ffffff';
    ctx.strokeStyle = '#333333';
    ctx.lineWidth = 2;

    // Main bubble
    ctx.beginPath();
    ctx.roundRect(bubbleX, bubbleY, bubbleWidth, bubbleHeight, 8);
    ctx.fill();
    ctx.stroke();

    // Speech bubble tail
    ctx.beginPath();
    ctx.moveTo(bubbleX + bubbleWidth / 2 - 5, bubbleY + bubbleHeight);
    ctx.lineTo(bubbleX + bubbleWidth / 2, bubbleY + bubbleHeight + 8);
    ctx.lineTo(bubbleX + bubbleWidth / 2 + 5, bubbleY + bubbleHeight);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Draw red exclamation mark
    ctx.fillStyle = '#ff0000';
    ctx.font = 'bold 18px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('!', bubbleX + bubbleWidth / 2, bubbleY + bubbleHeight - 5);
    ctx.textAlign = 'left'; // Reset alignment

    return renderCtx;
}
