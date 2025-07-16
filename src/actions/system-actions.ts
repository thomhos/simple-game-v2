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
