import { GameState, GameAction } from '../types';

export function applySceneAction(
    state: GameState,
    action: GameAction,
    fixedTimeStep: number
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

            // If skipping out animation, immediately finish the transition out
            if (action.skipOutAnimation) {
                return applySceneAction(
                    {
                        ...state,
                        scenes: {
                            ...state.scenes,
                            currentScene: action.scene,
                            nextScene: undefined,
                            isTransitioningOut: false,
                        },
                    },
                    action.skipInAnimation
                        ? { type: 'FINISH_SCENE_TRANSITION_IN' }
                        : { type: 'START_SCENE_TRANSITION_IN' },
                    fixedTimeStep
                );
            }

            // Start the transition out normally
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
        case 'START_SCENE_TRANSITION_IN': {
            return {
                ...state,
                scenes: {
                    ...state.scenes,
                    isTransitioningIn: true,
                    transitionStartTime: state.system.gameTime,
                },
            };
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
