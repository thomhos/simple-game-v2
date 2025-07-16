import { GameAction } from '../types/actions';
import { GameState } from '../types';

export function actionsFromState(state: GameState): GameAction[] {
    const actions: GameAction[] = [];

    // Check if scene transitions are finished
    const timeSinceTransitionStart = state.system.gameTime - state.scenes.transitionStartTime;
    if (
        state.scenes.isTransitioningOut &&
        timeSinceTransitionStart >= state.scenes.transitionDuration
    ) {
        actions.push({ type: 'FINISH_SCENE_TRANSITION_OUT' });
    }

    if (
        state.scenes.isTransitioningIn &&
        timeSinceTransitionStart >= state.scenes.transitionDuration
    ) {
        actions.push({ type: 'FINISH_SCENE_TRANSITION_IN' });
    }

    return actions;
}
