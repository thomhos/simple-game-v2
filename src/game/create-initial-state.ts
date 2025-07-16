import {
    GameState,
    Stage,
    JanitorStagePlayerState,
    StagePlayerState,
    SpriteMap,
    StageNames,
} from '../types';

import janitorPlayerSprites from '../assets/sprite/janitor/config.json';
import receptionPlayerSprites from '../assets/sprite/reception/config.json';

const createStageState = (stage: StageNames): Stage<StagePlayerState> => {
    return {
        name: stage,
        isRunning: false,
        isCompleted: false,
        map: {},
        player: {
            x: 400,
            y: 300,
            width: 32,
            height: 64,
            speed: 2.6,
            movementType: 'idle',
            lastMovementTime: 0,
            facingDirection: 'down',
            animationStartTime: 0,
            currentAnimation: 'idle-down',
            currentFrame: 0,
            skin: stage,
        },
    };
};

export function createInitialState(): GameState {
    const janitorBaseState = createStageState('janitor');
    const janitorStage: Stage<JanitorStagePlayerState> = {
        ...janitorBaseState,
        player: {
            ...janitorBaseState.player,
            itemsToPickUp: [],
            itemsPickedUp: [],
        },
    };

    const receptionBaseState = createStageState('reception');
    const receptionStage: Stage<StagePlayerState> = {
        ...receptionBaseState,
    };

    return {
        system: {
            gameTime: 0,
            hasSaveFile: false,
            isMuted: false,
            canvas: {
                width: 0,
                height: 0,
            },
        },
        assets: {
            audio: {},
            isAudioLoaded: false,
            images: {},
            isImagesLoaded: false,
            spriteImages: {} as any, // Will be populated by sprite loader
            sprites: {
                ...(janitorPlayerSprites as SpriteMap),
                ...(receptionPlayerSprites as SpriteMap),
            },
            isSpritesLoaded: false,
        },
        scenes: {
            currentScene: 'loading',
            nextScene: undefined,
            localState: {
                loading: {
                    loadingStartTime: 0,
                    loadingProgress: 0,
                },
                menu: {
                    menuItems: ['start', 'continue'],
                    highlightedMenuItem: 0,
                },
                intro: {
                    animationStartTime: 0,
                },
                'stage-select': {
                    highlightedStage: 0,
                },
                playing: {},
                complete: {},
            },
            isTransitioningIn: false,
            isTransitioningOut: false,
            transitionStartTime: 0,
            transitionDuration: 1500, //ms
        },
        stages: {
            stageSelected: undefined,
            stagesCompleted: [],
            stages: [janitorStage, receptionStage],
        },
    };
}
