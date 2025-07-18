import { GameState, GameAction } from '../../types';

export function applySystemAction(
    state: GameState,
    action: GameAction,
    fixedTimeStep: number
): GameState {
    switch (action.type) {
        case 'INCREMENT_GAME_TIME': {
            return {
                ...state,
                gameTime: state.gameTime + fixedTimeStep,
            };
        }
        case 'UPDATE_INPUT': {
            return {
                ...state,
                input: action.input,
            };
        }
        case 'ASSETS_LOADED': {
            return {
                ...state,
                assets: {
                    ...state.assets,
                    audio: action.audio,
                    isAudioLoaded: true,
                    images: action.images,
                    isImagesLoaded: true,
                },
            };
        }
        case 'THROW_ERROR': {
            return {
                ...state,
                error: {
                    message: action.message,
                },
            };
        }
        case 'RESOLVE_ERROR': {
            return {
                ...state,
                error: undefined,
            };
        }
        case 'SET_CANVAS_SIZE': {
            return {
                ...state,
                canvas: {
                    width: action.width,
                    height: action.height,
                },
            };
        }
        case 'CHANGE_SCENE': {
            // If already on this scene, ignore the action
            if (state.currentScene === action.scene) {
                return state;
            }
            return {
                ...state,
                currentScene: action.scene,
            };
        }
        default:
            return state;
    }
}
