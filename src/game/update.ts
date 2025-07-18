import { GameAction, GameState, InputState } from '../types';
import { actionsFromInput, actionsFromState, applySystemAction } from '../actions';
import { pipe } from '../utils';

// import { LoadingScene } from '../scenes/loading-scene';

export const update = (
    state: GameState,
    queuedActions: GameAction[],
    input: InputState,
    fixedTimeStep: number
): GameState => {
    // Get all actions
    const actions: GameAction[] = [
        { type: 'INCREMENT_GAME_TIME' }, // always increment game time
        ...actionsFromInput(state, input), // map any incoming input into actions
        ...actionsFromState(state), // see if the current state is generating any actions
        ...queuedActions,
    ];

    // Process all actions
    const newState = pipe(
        state,
        (s) => ({ ...s, input }),
        (s) => actions.reduce((acc, action) => applySystemAction(acc, action, fixedTimeStep), s)
        // (s) => actions.reduce((acc, action) => applySceneAction(acc, action, fixedTimeStep), s)
        // (s) => actions.reduce((acc, action) => applyPlayerAction(acc, action, fixedTimeStep), s)
    );

    // // Provide new state to scenes
    // LoadingScene.update(newState, input, fixedTimeStep);

    return newState;
};
