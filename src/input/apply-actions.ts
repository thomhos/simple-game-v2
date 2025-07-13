import { GameState, InputAction } from '../types';

const PLAYER_SPEED = 200; // pixels per second

export function applyInputAction(state: GameState, inputAction: InputAction, deltaTime: number = 16.67): GameState {
    switch (inputAction.type) {
        case 'MOVE_PLAYER': {
            const moveDistance = (PLAYER_SPEED * deltaTime) / 1000;
            let newX = state.player.x;
            let newY = state.player.y;

            switch (inputAction.direction) {
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
        case 'STOP_PLAYER':
        case 'NO_ACTION':
        default:
            return state;
    }
}
