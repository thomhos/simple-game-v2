import { InputState, InputSystem } from '../types';

export function createInputSystem(): InputSystem {
    let inputState: InputState = { keys: new Set() };

    const handleKeyDown = (e: KeyboardEvent) => {
        inputState = { keys: new Set([...inputState.keys, e.key]) };
    };

    const handleKeyUp = (e: KeyboardEvent) => {
        const newKeys = new Set(inputState.keys);
        newKeys.delete(e.key);
        inputState = { keys: newKeys };
    };

    return {
        start: () => {
            window.addEventListener('keydown', handleKeyDown);
            window.addEventListener('keyup', handleKeyUp);
        },
        stop: () => {
            window.removeEventListener('keydown', handleKeyDown);
            window.removeEventListener('keyup', handleKeyUp);
        },
        getState: () => inputState,
    };
}
