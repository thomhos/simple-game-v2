import { GameState, GameAction } from '../types';

export function applyGameActions(state: GameState, action: GameAction, _deltaTime: number): GameState {
    switch (action.type) {
        case 'PAUSE_GAME': {
            return {
                ...state,
                gameMode: 'paused',
            };
        }
        case 'RESUME_GAME': {
            return {
                ...state,
                gameMode: 'playing',
            };
        }
        default:
            return state;
    }
}
