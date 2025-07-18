import { GameState, GameAction } from '../types';

export function actionsFromState(_state: GameState): GameAction[] {
    const actions: GameAction[] = [];

    actions.push({ type: 'INCREMENT_GAME_TIME' }); // always increment game time

    // Check for actions that might be derived from state in case we need to ..

    return actions;
}
