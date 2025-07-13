import { GameState, InputState } from './types';
import { applyInputAction, getInputAction } from './input';
import { pipe } from './utils';

export const update = (state: GameState, input: InputState, deltaTime: number): GameState => {
    return pipe(
        state,
        (s) => applyInputAction(s, getInputAction(s, input), deltaTime)
        // (s) => updateCutscene(s, deltaTime),
        // (s) => updateAnimations(s, deltaTime)
    );
};
