import { GameState, LoadedSprites } from '../types';
import { getCurrentFrame, drawSprite } from './sprite';

export function drawPlayer(ctx: CanvasRenderingContext2D, state: GameState, loadedSprites: LoadedSprites): void {
    const playerAnimation = state.player.spriteAnimationState.currentAnimation;
    const spriteName = state.player.sprites[playerAnimation];
    const spriteConfig = state.sprites.spriteMap[spriteName];

    const currentFrame = getCurrentFrame(state.gameTime, state.player.spriteAnimationState.animationStartTime, spriteConfig.frameDuration, spriteConfig.frames, spriteConfig.loop);

    drawSprite(ctx, spriteConfig, loadedSprites, currentFrame, state.player.x, state.player.y, state.player.width, state.player.height);
}