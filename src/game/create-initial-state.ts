import { GameState, SpriteMap } from '../types';

import janitorPlayerSprites from '../assets/sprite/janitor/config.json';
import receptionPlayerSprites from '../assets/sprite/reception/config.json';

// Factory for initial global state
export function createInitialState(): GameState {
    return {
        gameTime: 0,
        canvas: {
            width: 0,
            height: 0,
        },
        loading: {
            progress: 0,
            isComplete: false,
        },
        assets: {
            audio: {},
            images: {},
            sprites: {
                ...(janitorPlayerSprites as SpriteMap),
                ...(receptionPlayerSprites as SpriteMap),
            },
            isAudioLoaded: false,
            isImagesLoaded: false,
        },
        input: {
            keysHeld: [],
            keysPressed: [],
        },
        currentScene: 'loading',
        availableStages: 2,
        completedStages: 0,
        currentStage: 0,
    };
}
