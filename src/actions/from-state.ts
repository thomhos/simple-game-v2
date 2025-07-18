import { GameState, GameAction } from '../types';

export function actionsFromState(state: GameState): GameAction[] {
    const actions: GameAction[] = [];

    // // Check if scene transitions are finished
    // const timeSinceTransitionStart = state.gameTime - state.scenes.transitionStartTime;
    // if (
    //     state.scenes.isTransitioningOut &&
    //     timeSinceTransitionStart >= state.scenes.transitionDuration
    // ) {
    //     actions.push({ type: 'FINISH_SCENE_TRANSITION_OUT' });
    // }

    // if (
    //     state.scenes.isTransitioningIn &&
    //     timeSinceTransitionStart >= state.scenes.transitionDuration
    // ) {
    //     actions.push({ type: 'FINISH_SCENE_TRANSITION_IN' });
    // }

    // // Check if menu flash animation is finished
    // if (state.scenes.currentScene === 'menu') {
    //     const menuState = state.scenes.localState.menu;
    //     if (menuState.isFlashing) {
    //         const flashElapsed = state.system.gameTime - menuState.flashStartTime;
    //         const flashDuration = 300; // Must match the duration in render code
    //         if (flashElapsed >= flashDuration) {
    //             actions.push({ type: 'MENU_FLASH_END' });
    //         }
    //     }
    // }

    return actions;
}
