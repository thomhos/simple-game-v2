// import { AnimationType, SpriteState, AnimationConfig, SpriteAsset, LoadedSprites } from '../types';

// export function createSpriteState(initialAnimation: AnimationType = 'idle'): SpriteState {
//     return {
//         currentAnimation: initialAnimation,
//         animationStartTime: Date.now(),
//     };
// }

// export function updateAnimation(
//     spriteState: SpriteState,
//     newAnimation: AnimationType
// ): SpriteState {
//     if (spriteState.currentAnimation === newAnimation) {
//         return spriteState;
//     }

//     return {
//         currentAnimation: newAnimation,
//         animationStartTime: Date.now(),
//     };
// }

// export function getAnimationDirection(dx: number, dy: number): AnimationType {
//     if (dx === 0 && dy === 0) {
//         return 'idle';
//     }

//     // Prioritize horizontal movement over vertical
//     if (Math.abs(dx) >= Math.abs(dy)) {
//         return dx > 0 ? 'walk-right' : 'walk-left';
//     } else {
//         return dy > 0 ? 'walk-down' : 'walk-up';
//     }
// }

// export function getCurrentSprite(
//     spriteState: SpriteState,
//     animationConfig: AnimationConfig,
//     loadedSprites: LoadedSprites
// ): SpriteAsset | null {
//     const spriteConfig = animationConfig[spriteState.currentAnimation];
//     return loadedSprites[spriteConfig.path] ?? null;
// }

// export function createDefaultPlayerAnimationConfig(): AnimationConfig {
//     return {
//         'idle': {
//             path: '/assets/sprites/player-idle.png',
//             width: 32,
//             height: 32,
//         },
//         'walk-left': {
//             path: '/assets/sprites/player-walk-left.png',
//             width: 32,
//             height: 32,
//         },
//         'walk-right': {
//             path: '/assets/sprites/player-walk-right.png',
//             width: 32,
//             height: 32,
//         },
//         'walk-up': {
//             path: '/assets/sprites/player-walk-up.png',
//             width: 32,
//             height: 32,
//         },
//         'walk-down': {
//             path: '/assets/sprites/player-walk-down.png',
//             width: 32,
//             height: 32,
//         },
//     };
// }

// export function getAllSpritePaths(animationConfig: AnimationConfig): string[] {
//     return Object.values(animationConfig).map(config => config.path);
// }
