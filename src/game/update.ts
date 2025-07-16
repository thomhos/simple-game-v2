import { GameAction, GameState, InputState } from '../types';
import {
    actionsFromInput,
    actionsFromState,
    applySystemAction,
    applySceneAction,
} from '../actions';
import { pipe } from '../utils';

export const update = (state: GameState, input: InputState, fixedTimeStep: number): GameState => {
    // Set up all actions
    const actions: GameAction[] = [
        { type: 'INCREMENT_GAME_TIME' }, // always increment game time
        ...actionsFromInput(state, input), // map any incoming input into actions
        ...actionsFromState(state), // see if the current state is generating any actions
    ];

    // Process all actions
    return pipe(
        state,
        (s) => actions.reduce((acc, action) => applySystemAction(acc, action, fixedTimeStep), s),
        (s) => actions.reduce((acc, action) => applySceneAction(acc, action, fixedTimeStep), s)
        // (s) => actions.reduce((acc, action) => applyPlayerAction(acc, action, fixedTimeStep), s)
    );
};
