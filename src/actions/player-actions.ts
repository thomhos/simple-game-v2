import { GameState, GameAction, PlayerAnimationNames } from '../types';

export function applyPlayerAction(state: GameState, action: GameAction, _fixedTimeStep: number): GameState {
    switch (action.type) {
        case 'MOVE_PLAYER': {
            const { system, player } = state;
            const moveDistance = player.speed;
            const movementState = 'walk';

            let newX = player.x;
            let newY = player.y;
            let facingDirection = player.facingDirection;

            switch (action.direction) {
                case 'up':
                    facingDirection = 'up';
                    newY = newY - moveDistance >= 0 ? newY - moveDistance : 0;
                    break;
                case 'down':
                    facingDirection = 'down';
                    newY = newY + moveDistance <= system.canvas.height - player.height ? newY + moveDistance : system.canvas.height - player.height;
                    break;
                case 'left':
                    facingDirection = 'left';
                    newX = newX - moveDistance >= 0 ? newX - moveDistance : 0;
                    break;
                case 'right':
                    facingDirection = 'right';
                    newX = newX + moveDistance <= system.canvas.width - player.width ? newX + moveDistance : system.canvas.width - player.width;
                    break;
            }

            // Check if player actually moved
            const actuallyMoved = newX !== player.x || newY !== player.y;
            const finalMovementState = actuallyMoved ? movementState : 'idle';
            const currentAnimation = `${finalMovementState}-${facingDirection}` as PlayerAnimationNames;

            return {
                ...state,
                player: {
                    ...player,
                    x: newX,
                    y: newY,
                    facingDirection,
                    movementState: finalMovementState,
                    lastMovementTime: state.gameTime,
                    spriteAnimationState: {
                        ...player.spriteAnimationState,
                        currentAnimation,
                    },
                },
            };
        }
        case 'STOP_PLAYER':
            // set idle animation based on current facing direction
            const movementState = 'idle';
            const timeSinceLastMovement = state.gameTime - state.player.lastMovementTime;

            // If idle for more than 5 seconds, default to idle-down
            const shouldDefaultToDown = timeSinceLastMovement > 5000;
            const facingDirection = shouldDefaultToDown ? 'down' : state.player.facingDirection;
            const currentAnimation = `${movementState}-${facingDirection}` as PlayerAnimationNames;

            return {
                ...state,
                player: {
                    ...state.player,
                    facingDirection,
                    movementState,
                    spriteAnimationState: {
                        ...state.player.spriteAnimationState,
                        currentAnimation,
                        animationStartTime: 0,
                    },
                },
            };
        default:
            return state;
    }
}
