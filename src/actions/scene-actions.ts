import { GameState, GameAction } from '../types';

export function applySceneAction(
    state: GameState,
    action: GameAction,
    _fixedTimeStep: number
): GameState {
    switch (action.type) {
        case 'CHANGE_SCENE': {
            // If already transitioning, ignore the action
            if (
                state.scenes.isTransitioningOut ||
                state.scenes.isTransitioningIn ||
                state.scenes.currentScene === action.scene
            ) {
                return state;
            }

            // Start the transition out immediately
            return {
                ...state,
                scenes: {
                    ...state.scenes,
                    nextScene: action.scene,
                    isTransitioningOut: true,
                    transitionStartTime: state.system.gameTime,
                },
            };
        }
        case 'FINISH_SCENE_TRANSITION_OUT': {
            if (state.scenes.nextScene) {
                return {
                    ...state,
                    scenes: {
                        ...state.scenes,
                        currentScene: state.scenes.nextScene,
                        nextScene: undefined,
                        isTransitioningOut: false,
                        isTransitioningIn: true,
                        transitionStartTime: state.system.gameTime,
                    },
                };
            } else {
                return state;
            }
        }
        case 'FINISH_SCENE_TRANSITION_IN': {
            return {
                ...state,
                scenes: {
                    ...state.scenes,
                    isTransitioningIn: false,
                    transitionStartTime: 0,
                },
            };
        }
        default:
            return state;
    }
}
