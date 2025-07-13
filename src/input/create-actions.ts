import { GameState, InputState, InputAction } from '../types';

export function getInputAction(_state: GameState, input: InputState): InputAction {
    // Check for movement inputs (prioritize first key pressed)
    if (input.keys.has('ArrowUp') || input.keys.has('w')) {
        return { type: 'MOVE_PLAYER', direction: 'up' };
    }
    if (input.keys.has('ArrowDown') || input.keys.has('s')) {
        return { type: 'MOVE_PLAYER', direction: 'down' };
    }
    if (input.keys.has('ArrowLeft') || input.keys.has('a')) {
        return { type: 'MOVE_PLAYER', direction: 'left' };
    }
    if (input.keys.has('ArrowRight') || input.keys.has('d')) {
        return { type: 'MOVE_PLAYER', direction: 'right' };
    }

    return { type: 'NO_ACTION' };
}
