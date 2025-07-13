import { GameAction } from '../types/actions';
import { InputState } from '../types/input';
import { GameState } from '../types/game';

export function mapInputToActions(input: InputState, state: GameState): GameAction[] {
    const actions: GameAction[] = [];

    // Check for pause toggle (works in any state) - only on key press, not hold
    if (input.keysPressed.has('Escape')) {
        actions.push({ type: 'PAUSE_TOGGLE' });
        return actions; // Pause toggle takes priority
    }

    // Only process other input if game is not paused
    if (state.gameMode === 'paused') {
        actions.push({ type: 'NO_ACTION' });
        return actions;
    }
    
    // Only process movement actions if game is playing
    if (state.gameMode === 'playing') {
        // Find the most recently pressed movement key that's still held
        const movementKeys = ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'w', 'a', 's', 'd'];
        const heldMovementKeys = input.keyOrder.filter(key => 
            movementKeys.includes(key) && input.keysHeld.has(key)
        );
        
        if (heldMovementKeys.length > 0) {
            // Use the most recently pressed key (last in order)
            const mostRecentKey = heldMovementKeys[heldMovementKeys.length - 1];
            
            if (mostRecentKey === 'ArrowUp' || mostRecentKey === 'w') {
                actions.push({ type: 'MOVE_PLAYER', direction: 'up' });
            } else if (mostRecentKey === 'ArrowDown' || mostRecentKey === 's') {
                actions.push({ type: 'MOVE_PLAYER', direction: 'down' });
            } else if (mostRecentKey === 'ArrowLeft' || mostRecentKey === 'a') {
                actions.push({ type: 'MOVE_PLAYER', direction: 'left' });
            } else if (mostRecentKey === 'ArrowRight' || mostRecentKey === 'd') {
                actions.push({ type: 'MOVE_PLAYER', direction: 'right' });
            }
        } else {
            // No movement keys held
            actions.push({ type: 'STOP_PLAYER' });
        }
    }

    // If no actions were added, add NO_ACTION
    if (actions.length === 0) {
        actions.push({ type: 'NO_ACTION' });
    }

    return actions;
}
