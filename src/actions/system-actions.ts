import { GameState, GameAction } from '../types';

export function applySystemAction(
    state: GameState,
    action: GameAction,
    fixedTimeStep: number
): GameState {
    switch (action.type) {
        case 'INCREMENT_GAME_TIME': {
            return {
                ...state,
                system: {
                    ...state.system,
                    gameTime: state.system.gameTime + fixedTimeStep,
                },
            };
        }
        case 'UPDATE_LOADING_PROGRESS': {
            return {
                ...state,
                scenes: {
                    ...state.scenes,
                    localState: {
                        ...state.scenes.localState,
                        loading: {
                            ...state.scenes.localState.loading,
                            loadingProgress: action.progress,
                        },
                    },
                },
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
                system: {
                    ...state.system,
                    error: {
                        message: action.message,
                    },
                },
            };
        }
        case 'RESOLVE_ERROR': {
            return {
                ...state,
                system: {
                    ...state.system,
                    error: undefined,
                },
            };
        }
        case 'SET_CANVAS_SIZE': {
            return {
                ...state,
                system: {
                    ...state.system,
                    canvas: {
                        width: action.width,
                        height: action.height,
                    },
                },
            };
        }
        default:
            return state;
    }
}
