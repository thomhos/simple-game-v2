import { GameState, GameAction } from '../types';
// import { updateAnimation, getAnimationDirection } from '../sprites';

export function applyPlayerAction(state: GameState, action: GameAction, _fixedTimeStep: number): GameState {
    const PLAYER_MOVEMENT_PER_FRAME = 1.6; // pixels per frame

    switch (action.type) {
        case 'MOVE_PLAYER': {
            const moveDistance = PLAYER_MOVEMENT_PER_FRAME;
            let newX = state.player.x;
            let newY = state.player.y;
            let facingDirection = state.player.facingDirection;
            // let dx = 0;
            // let dy = 0;

            switch (action.direction) {
                case 'up':
                    facingDirection = 'up';
                    newY -= moveDistance;
                    // dy = -1;
                    break;
                case 'down':
                    facingDirection = 'down';
                    newY += moveDistance;
                    // dy = 1;
                    break;
                case 'left':
                    facingDirection = 'left';
                    newX -= moveDistance;
                    // dx = -1;
                    break;
                case 'right':
                    facingDirection = 'right';
                    newX += moveDistance;
                    // dx = 1;
                    break;
            }

            console.log(facingDirection);

            // Keep player within canvas bounds (assuming 800x600 canvas)
            newX = Math.max(0, Math.min(800 - state.player.width, newX));
            newY = Math.max(0, Math.min(600 - state.player.height, newY));

            return {
                ...state,
                player: {
                    ...state.player,
                    x: newX,
                    y: newY,
                    facingDirection,
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
