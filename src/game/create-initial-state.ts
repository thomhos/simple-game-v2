import { GameState, SpriteMap } from '../types';
import playerSprite from '../assets/sprite/bob/config.json';
// import playerSprite from '../assets/sprite/amelia/config.json';

export function createInitialState(): GameState {
    return {
        gameMode: 'loading',
        gameTime: 0,
        system: {
            canvas: {
                width: 0,
                height: 0,
            },
            error: null,
        },
        sprites: {
            isLoaded: false,
            loadedSprites: {},
            spriteMap: playerSprite as SpriteMap,
        },
        map: {
            availableMaps: [],
            activeMap: '',
        },
        player: {
            x: 400,
            y: 300,
            width: 32,
            height: 64,
            speed: 2.6,
            facingDirection: 'down',
            movementState: 'idle',
            lastMovementTime: 0,
            sprites: {
                'idle-up': 'player-idle-up',
                'idle-down': 'player-idle-down',
                'idle-left': 'player-idle-left',
                'idle-right': 'player-idle-right',
                'walk-up': 'player-walk-up',
                'walk-down': 'player-walk-down',
                'walk-left': 'player-walk-left',
                'walk-right': 'player-walk-right',
            },
            spriteAnimationState: {
                currentAnimation: 'idle-down',
                animationStartTime: 0,
                currentFrame: 0,
            },
        },
    };
}
