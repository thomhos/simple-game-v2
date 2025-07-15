import { GameState, GameAction } from '../types';
// import { updateAnimation, getAnimationDirection } from '../sprites';

const PLAYER_SPEED = 100; // pixels per second

export function applyPlayerAction(state: GameState, action: GameAction, deltaTime: number): GameState {
    switch (action.type) {
        case 'MOVE_PLAYER': {
            const moveDistance = (PLAYER_SPEED * deltaTime) / 1000;
            let newX = state.player.x;
            let newY = state.player.y;
            let dx = 0;
            let dy = 0;

            switch (action.direction) {
                case 'up':
                    newY -= moveDistance;
                    dy = -1;
                    break;
                case 'down':
                    newY += moveDistance;
                    dy = 1;
                    break;
                case 'left':
                    newX -= moveDistance;
                    dx = -1;
                    break;
                case 'right':
                    newX += moveDistance;
                    dx = 1;
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
                    // spriteState: updatedSpriteState,
                },
            };
        }
        case 'STOP_PLAYER':
            // set idle animation
            return state;
        default:
            return state;
    }
}
