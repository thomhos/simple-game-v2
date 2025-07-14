import { GameState, InputState } from './types';
import { applyGameActions, applyPlayerActions, mapInputToActions } from './actions';
import { pipe } from './utils';

export const update = (state: GameState, input: InputState, deltaTime: number): GameState => {
    // Map input to actions based on current game state
    const actions = mapInputToActions(input, state);

    return pipe(
        state,
        // Apply all actions
        (s) => actions.reduce((acc, action) => applyGameActions(acc, action, deltaTime), s),
        (s) => actions.reduce((acc, action) => applyPlayerActions(acc, action, deltaTime), s)
        // (s) => updateCutscene(s, deltaTime),
        // (s) => updateAnimations(s, deltaTime)
    );
};
