import { GameState } from '../types';

export function createInitialState(): GameState {
    return {
        gameMode: 'loading',
        gameTime: 0,
        error: null,
        sprites: {
            isLoaded: false,
            loadedSprites: {},
            spriteMap: {
                'player-idle': {
                    path: 'assets/sprite/player_16x16.png',
                    frames: [
                        { x: 0, y: 0, width: 16, height: 32 },
                        { x: 16, y: 0, width: 16, height: 32 },
                        { x: 32, y: 0, width: 16, height: 32 },
                        { x: 48, y: 0, width: 16, height: 32 },
                    ],
                    frameDuration: 200,
                    loop: true,
                },
                'player-walk-up': {
                    path: 'assets/sprite/player_16x16.png',
                    frames: [
                        { x: 0, y: 0, width: 32, height: 32 },
                        { x: 16, y: 0, width: 32, height: 32 },
                        { x: 32, y: 0, width: 32, height: 32 },
                        { x: 46, y: 0, width: 32, height: 32 },
                    ],
                    frameDuration: 200,
                    loop: true,
                },
                'player-walk-down': {
                    path: 'assets/sprite/player_16x16.png',
                    frames: [
                        { x: 0, y: 0, width: 32, height: 32 },
                        { x: 32, y: 0, width: 32, height: 32 },
                        { x: 64, y: 0, width: 32, height: 32 },
                        { x: 32, y: 0, width: 32, height: 32 },
                    ],
                    frameDuration: 200,
                    loop: true,
                },
                'player-walk-left': {
                    path: 'assets/sprite/player_16x16.png',
                    frames: [
                        { x: 0, y: 0, width: 32, height: 32 },
                        { x: 32, y: 0, width: 32, height: 32 },
                        { x: 64, y: 0, width: 32, height: 32 },
                        { x: 32, y: 0, width: 32, height: 32 },
                    ],
                    frameDuration: 200,
                    loop: true,
                },
                'player-walk-right': {
                    path: 'assets/sprite/player_16x16.png',
                    frames: [
                        { x: 0, y: 0, width: 32, height: 32 },
                        { x: 32, y: 0, width: 32, height: 32 },
                        { x: 64, y: 0, width: 32, height: 32 },
                        { x: 32, y: 0, width: 32, height: 32 },
                    ],
                    frameDuration: 200,
                    loop: true,
                },
            },
        },
        map: {
            availableMaps: [],
            activeMap: '',
        },
        player: {
            x: 400,
            y: 300,
            width: 16,
            height: 32,
            facingDirection: 'down',
            movementState: 'idle',
            sprites: {
                idle: 'player-idle',
                'walk-up': 'player-walk-up',
                'walk-down': 'player-walk-down',
                'walk-left': 'player-walk-left',
                'walk-right': 'player-walk-right',
            },
            spriteAnimationState: {
                currentAnimation: 'idle',
                animationStartTime: 0,
                currentFrame: 0,
                frameTimer: 0,
            },
        },
    };
}
