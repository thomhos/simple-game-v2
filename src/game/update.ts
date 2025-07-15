import { GameState, InputState } from '../types';
import { applySystemAction, applyPlayerAction, mapInputToActions } from '../actions';
import { pipe, when } from '../utils';

export const update = (state: GameState, input: InputState, fixedTimeStep: number): GameState => {
    const actions = mapInputToActions(input, state);

    return pipe(
        state,
        when(state.gameMode !== 'paused', (s) => ({ ...s, gameTime: s.gameTime + fixedTimeStep })),
        (s) => actions.reduce((acc, action) => applySystemAction(acc, action, fixedTimeStep), s),
        (s) => actions.reduce((acc, action) => applyPlayerAction(acc, action, fixedTimeStep), s)
    );
};
