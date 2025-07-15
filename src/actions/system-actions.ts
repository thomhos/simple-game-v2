import { GameState, GameAction } from '../types';

export function applySystemAction(state: GameState, action: GameAction, _fixedTimeStep: number): GameState {
    switch (action.type) {
        case 'PAUSE_GAME': {
            return {
                ...state,
                gameMode: 'paused',
            };
        }
        case 'START_GAME': {
            return {
                ...state,
                gameMode: 'playing',
            };
        }
        case 'START_LOADING': {
            return {
                ...state,
                gameMode: 'loading',
                sprites: {
                    ...state.sprites,
                    isLoaded: false,
                },
            };
        }
        case 'SPRITES_LOADED': {
            return {
                ...state,
                gameMode: 'playing',
                sprites: {
                    ...state.sprites,
                    isLoaded: true,
                    loadedSprites: action.loadedSprites,
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
                        details: action.details,
                    },
                },
            };
        }
        case 'RESOLVE_ERROR': {
            return {
                ...state,
                system: {
                    ...state.system,
                    error: null,
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
