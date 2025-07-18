import { GameState, InputState, GameAction } from '../types';

export function actionsFromInput(state: GameState, input: InputState): GameAction[] {
    const actions: GameAction[] = [];

    // // Test scene transitions
    // if (input.keysPressed.includes('1')) {
    //     actions.push({ type: 'CHANGE_SCENE', scene: 'menu' });
    // }
    // if (input.keysPressed.includes('2')) {
    //     actions.push({ type: 'CHANGE_SCENE', scene: 'playing' });
    // }

    // // Menu navigation
    // if (state.scenes.currentScene === 'menu') {
    //     if (input.keysPressed.includes('ArrowUp') || input.keysPressed.includes('w')) {
    //         actions.push({ type: 'MENU_NAVIGATE_UP' });
    //     }
    //     if (input.keysPressed.includes('ArrowDown') || input.keysPressed.includes('s')) {
    //         actions.push({ type: 'MENU_NAVIGATE_DOWN' });
    //     }
    //     if (input.keysPressed.includes('Enter') || input.keysPressed.includes(' ')) {
    //         actions.push({ type: 'MENU_SELECT' });
    //     }
    // }

    // // TODO: Implement pause/resume for scene-based structure
    // // For now, only handle movement when in playing scene
    // if (state.scenes.currentScene === 'playing') {
    //     // Use the most recently pressed key (last in array)
    //     const mostRecentKey = input.keysHeld[input.keysHeld.length - 1];

    //     if (mostRecentKey === 'ArrowUp' || mostRecentKey === 'w') {
    //         actions.push({ type: 'MOVE_PLAYER', direction: 'up' });
    //     } else if (mostRecentKey === 'ArrowDown' || mostRecentKey === 's') {
    //         actions.push({ type: 'MOVE_PLAYER', direction: 'down' });
    //     } else if (mostRecentKey === 'ArrowLeft' || mostRecentKey === 'a') {
    //         actions.push({ type: 'MOVE_PLAYER', direction: 'left' });
    //     } else if (mostRecentKey === 'ArrowRight' || mostRecentKey === 'd') {
    //         actions.push({ type: 'MOVE_PLAYER', direction: 'right' });
    //     } else {
    //         actions.push({ type: 'STOP_PLAYER' });
    //     }
    // }

    return actions;
}
