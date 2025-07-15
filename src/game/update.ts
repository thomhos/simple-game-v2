import { GameState, InputState } from '../types';
import { applySystemAction, applyPlayerAction, mapInputToActions } from '../actions';
import { pipe } from '../utils';

export const update = (state: GameState, input: InputState, deltaTime: number): GameState => {
    const actions = mapInputToActions(input, state);

    return pipe(
        state,
        (s) => ({ ...s, gameTime: s.gameMode !== 'paused' ? s.gameTime + deltaTime : s.gameTime }),
        (s) => actions.reduce((acc, action) => applySystemAction(acc, action, deltaTime), s),
        (s) => actions.reduce((acc, action) => applyPlayerAction(acc, action, deltaTime), s)
    );
};
