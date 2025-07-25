import { PlayerEntity, RenderContext, SpriteFrame } from '../types';

export function getCurrentFrame(
    gameTime: number,
    animationStartTime: number,
    frameDuration: number,
    frames: SpriteFrame[],
    loop: boolean
): number {
    const elapsed = gameTime - animationStartTime;
    const frameIndex = Math.floor(elapsed / frameDuration);

    if (loop) {
        return frameIndex % frames.length;
    } else {
        return Math.min(frameIndex, frames.length - 1);
    }
}

export function drawPlayer({ ctx, state }: RenderContext, player: PlayerEntity) {
    const images = state.assets.images;
    const sprites = state.assets.sprites;
    const playerAnimation = player.currentAnimation;

    const sprite = sprites[playerAnimation];
    const image = images[sprite.path];
    const frame = sprite.frames[player.currentFrame];

    ctx.drawImage(
        image.image,
        frame.x,
        frame.y,
        frame.width,
        frame.height, // Source rectangle
        player.position.x + 8,
        player.position.y,
        player.size.width,
        player.size.height // Destination rectangle
    );
}
