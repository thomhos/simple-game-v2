import { GameState, GameAction } from '../types';

const PLAYER_SPEED = 200; // pixels per second

export function applyPlayerActions(state: GameState, action: GameAction, deltaTime: number): GameState {
    switch (action.type) {
        case 'MOVE_PLAYER': {
            const moveDistance = (PLAYER_SPEED * deltaTime) / 1000;
            let newX = state.player.x;
            let newY = state.player.y;

            switch (action.direction) {
                case 'up':
                    newY -= moveDistance;
                    break;
                case 'down':
                    newY += moveDistance;
                    break;
                case 'left':
                    newX -= moveDistance;
                    break;
                case 'right':
                    newX += moveDistance;
                    break;
            }

            // Keep player within canvas bounds (assuming 800x600 canvas)
            newX = Math.max(0, Math.min(800 - state.player.width, newX));
            newY = Math.max(0, Math.min(600 - state.player.height, newY));

            return {
                ...state,
                player: {
                    ...state.player,
                    x: newX,
                    y: newY,
                },
            };
        }
        default:
            return state;
    }
}
