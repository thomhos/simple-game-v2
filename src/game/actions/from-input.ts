import { GameState, InputState, GameAction } from '../../types';

export function actionsFromInput(_state: GameState, input: InputState): GameAction[] {
    const actions: GameAction[] = [];

    // Map input to actions in case we need to do this outside scenes..
    actions.push({
        type: 'UPDATE_INPUT',
        input,
    });

    return actions;
}
