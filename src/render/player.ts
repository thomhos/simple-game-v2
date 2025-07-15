import { getCurrentFrame, drawSprite } from './sprite';
import { RenderContext } from './canvas-helpers';

export function drawPlayer(renderCtx: RenderContext): RenderContext {
    const { ctx, state } = renderCtx;
    const loadedSprites = state.sprites.loadedSprites;

    const playerAnimation = state.player.spriteAnimationState.currentAnimation;
    const spriteName = state.player.sprites[playerAnimation];
    const spriteConfig = state.sprites.spriteMap[spriteName];

    const currentFrame = getCurrentFrame(
        state.gameTime,
        state.player.spriteAnimationState.animationStartTime,
        spriteConfig.frameDuration,
        spriteConfig.frames,
        spriteConfig.loop
    );

    drawSprite(ctx, spriteConfig, loadedSprites, currentFrame, state.player.x, state.player.y, state.player.width, state.player.height);

    return renderCtx;
}
