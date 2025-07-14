import { GameState, InputState } from './types';
import { applyGameAction, mapInputToActions } from './actions';
import { pipe } from './utils';

export const update = (state: GameState, input: InputState, deltaTime: number): GameState => {
    // Map input to actions based on current game state
    const actions = mapInputToActions(input, state);

    return pipe(
        state,
        // Apply all actions
        (s): GameState => actions.reduce((acc, action) => applyGameAction(acc, action, deltaTime), s)
        // (s) => updateCutscene(s, deltaTime),
        // (s) => updateAnimations(s, deltaTime)
    );
};
