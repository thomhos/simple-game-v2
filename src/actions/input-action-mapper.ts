import { GameAction } from '../types/actions';
import { InputState } from '../types/input';
import { GameState } from '../types/game';

export function mapInputToActions(input: InputState, state: GameState): GameAction[] {
    const actions: GameAction[] = [];

    // GAME ACTIONS //
    if (input.keysPressed.includes('Escape')) {
        if (state.gameMode === 'playing') {
            actions.push({ type: 'PAUSE_GAME' });
            return actions; // Pausing the game prevents any further movement input
        }

        if (state.gameMode === 'paused') {
            actions.push({ type: 'RESUME_GAME' });
            return actions; // Resuming the game prevents any further movement input
        }
    }

    // Only process movement actions if game is playing
    if (state.gameMode === 'playing') {
        // Use the most recently pressed key (last in array)
        const mostRecentKey = input.keysHeld[input.keysHeld.length - 1];

        if (mostRecentKey === 'ArrowUp' || mostRecentKey === 'w') {
            actions.push({ type: 'MOVE_PLAYER', direction: 'up' });
        } else if (mostRecentKey === 'ArrowDown' || mostRecentKey === 's') {
            actions.push({ type: 'MOVE_PLAYER', direction: 'down' });
        } else if (mostRecentKey === 'ArrowLeft' || mostRecentKey === 'a') {
            actions.push({ type: 'MOVE_PLAYER', direction: 'left' });
        } else if (mostRecentKey === 'ArrowRight' || mostRecentKey === 'd') {
            actions.push({ type: 'MOVE_PLAYER', direction: 'right' });
        }
    }

    return actions;
}
