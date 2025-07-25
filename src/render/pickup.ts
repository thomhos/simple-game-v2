import { PickupEntity, RenderContext } from '../types';

export function drawPickup({ ctx, state }: RenderContext, pickup: PickupEntity) {
    if (pickup.collected) return;

    // Create pulsing effect
    const pulseScale = 0.9 + 0.1 * Math.sin(state.gameTime * 0.005);
    const scaledSize = {
        x: pickup.size.width * pulseScale,
        y: pickup.size.height * pulseScale,
    };
    const offset = {
        x: (pickup.size.width - scaledSize.x) / 2,
        y: (pickup.size.height - scaledSize.y) / 2,
    };

    // Draw pickup with pulse effect
    ctx.fillStyle = pickup.color;
    ctx.fillRect(
        pickup.position.x + offset.x,
        pickup.position.y + offset.y,
        scaledSize.x,
        scaledSize.y
    );

    // Add sparkle effect
    ctx.fillStyle = '#ffffff';
    const sparkleOffset = Math.sin(state.gameTime * 0.01) * 2;
    ctx.fillRect(
        pickup.position.x + pickup.size.width / 2 - 1 + sparkleOffset,
        pickup.position.y + pickup.size.height / 2 - 1,
        2,
        2
    );
}
