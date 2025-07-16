// import { GameState, GameAction, PlayerAnimationNames } from '../types';

// export function applyPlayerAction(
//     state: GameState,
//     action: GameAction,
//     _fixedTimeStep: number
// ): GameState {
//     switch (action.type) {
//         case 'MOVE_PLAYER': {
//             // TODO: Implement player movement for new stage-based structure
//             // For now, just update the first stage's player (if it exists)
//             if (state.stages.stages.length === 0) return state;

//             const currentStage = state.stages.stages[0];
//             const { system } = state;
//             const player = currentStage.player;
//             const moveDistance = player.speed;
//             const movementType = 'walk';

//             let newX = player.x;
//             let newY = player.y;
//             let facingDirection = player.facingDirection;

//             switch (action.direction) {
//                 case 'up':
//                     facingDirection = 'up';
//                     newY = newY - moveDistance >= 0 ? newY - moveDistance : 0;
//                     break;
//                 case 'down':
//                     facingDirection = 'down';
//                     newY =
//                         newY + moveDistance <= system.canvas.height - player.height
//                             ? newY + moveDistance
//                             : system.canvas.height - player.height;
//                     break;
//                 case 'left':
//                     facingDirection = 'left';
//                     newX = newX - moveDistance >= 0 ? newX - moveDistance : 0;
//                     break;
//                 case 'right':
//                     facingDirection = 'right';
//                     newX =
//                         newX + moveDistance <= system.canvas.width - player.width
//                             ? newX + moveDistance
//                             : system.canvas.width - player.width;
//                     break;
//             }

//             // Check if player actually moved
//             const actuallyMoved = newX !== player.x || newY !== player.y;
//             const finalMovementType = actuallyMoved ? movementType : 'idle';
//             const currentAnimation =
//                 `${finalMovementType}-${facingDirection}` as PlayerAnimationNames;

//             return {
//                 ...state,
//                 stages: {
//                     ...state.stages,
//                     stages: state.stages.stages.map((stage, index) =>
//                         index === 0
//                             ? {
//                                   ...stage,
//                                   player: {
//                                       ...player,
//                                       x: newX,
//                                       y: newY,
//                                       facingDirection,
//                                       movementType: finalMovementType,
//                                       lastMovementTime: state.system.gameTime,
//                                       currentAnimation,
//                                   },
//                               }
//                             : stage
//                     ),
//                 },
//             };
//         }
//         case 'STOP_PLAYER':
//             // TODO: Implement player stop for new stage-based structure
//             if (state.stages.stages.length === 0) return state;

//             const currentStage = state.stages.stages[0];
//             const player = currentStage.player;
//             const movementType = 'idle';
//             const timeSinceLastMovement = state.system.gameTime - player.lastMovementTime;

//             // If idle for more than 5 seconds, default to idle-down
//             const shouldDefaultToDown = timeSinceLastMovement > 5000;
//             const facingDirection = shouldDefaultToDown ? 'down' : player.facingDirection;
//             const currentAnimation = `${movementType}-${facingDirection}` as PlayerAnimationNames;

//             return {
//                 ...state,
//                 stages: {
//                     ...state.stages,
//                     stages: state.stages.stages.map((stage, index) =>
//                         index === 0
//                             ? {
//                                   ...stage,
//                                   player: {
//                                       ...player,
//                                       facingDirection,
//                                       movementType,
//                                       currentAnimation,
//                                       animationStartTime: 0,
//                                   },
//                               }
//                             : stage
//                     ),
//                 },
//             };
//         default:
//             return state;
//     }
// }
