// import { LoadedSprites, SpriteConfig, SpriteFrame } from '../types';

// export function getCurrentFrame(gameTime: number, animationStartTime: number, frameDuration: number, frames: SpriteFrame[], loop: boolean): number {
//     const elapsed = gameTime - animationStartTime;
//     const frameIndex = Math.floor(elapsed / frameDuration);

//     if (loop) {
//         return frameIndex % frames.length;
//     } else {
//         return Math.min(frameIndex, frames.length - 1);
//     }
// }

// export function drawSprite(
//     ctx: CanvasRenderingContext2D,
//     spriteConfig: SpriteConfig,
//     loadedSprites: LoadedSprites,
//     currentFrame: number,
//     destX: number,
//     destY: number,
//     destWidth: number,
//     destHeight: number
// ): void {
//     const spriteAsset = loadedSprites[spriteConfig.path];

//     if (!spriteAsset || !spriteAsset.image) {
//         // Fallback to colored rectangle if sprite not available
//         ctx.fillStyle = '#4a90e2';
//         ctx.fillRect(destX, destY, destWidth, destHeight);
//         ctx.strokeStyle = '#ffffff';
//         ctx.lineWidth = 2;
//         ctx.strokeRect(destX, destY, destWidth, destHeight);
//         return;
//     }

//     const frame = spriteConfig.frames[currentFrame];

//     ctx.drawImage(
//         spriteAsset.image,
//         frame.x,
//         frame.y,
//         frame.width,
//         frame.height, // Source rectangle
//         destX,
//         destY,
//         destWidth,
//         destHeight // Destination rectangle
//     );
// }
