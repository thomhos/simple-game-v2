import { InputState, InputSystem } from '../types';

// Helper function to identify game keys
export const isGameKey = (key: string): boolean => {
    const gameKeys = ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'w', 'a', 's', 'd', 'Escape'];
    return gameKeys.includes(key);
};

// Helper function to identify game keys
export const isMovementKey = (key: string): boolean => {
    const gameKeys = ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'w', 'a', 's', 'd'];
    return gameKeys.includes(key);
};

export function createInputSystem(): InputSystem {
    let inputState: InputState = {
        keysHeld: [],
        keysPressed: [],
    };

    const handleKeyDown = (e: KeyboardEvent): void => {
        // Ignore keys pressed with modifiers (CMD, CTRL, ALT, Shift) to prevent sticky keys
        if (e.metaKey || e.ctrlKey || e.altKey || e.shiftKey) {
            return;
        }

        // Prevent default behavior for game keys to avoid browser shortcuts
        if (isGameKey(e.key)) {
            e.preventDefault();
        }

        // Remove the key if it was already in held, then add again to the end
        const newKeysHeld = inputState.keysHeld.filter((key) => key !== e.key).concat(e.key);

        // Only add to keysPressed if it wasn't already held
        const newKeysPressed = inputState.keysHeld.includes(e.key) ? inputState.keysPressed : [...inputState.keysPressed, e.key];

        inputState = {
            keysHeld: newKeysHeld,
            keysPressed: newKeysPressed,
        };
    };

    const handleKeyUp = (e: KeyboardEvent): void => {
        const newKeysHeld = inputState.keysHeld.filter((key) => key !== e.key);

        inputState = {
            keysHeld: newKeysHeld,
            keysPressed: inputState.keysPressed,
        };

        // Prevent default behavior for game keys
        if (isGameKey(e.key)) {
            e.preventDefault();
        }
    };

    // Clear all keys when window loses focus to prevent sticky keys
    const handleBlur = (): void => {
        inputState = { keysHeld: [], keysPressed: [] };
    };

    return {
        start: (): void => {
            window.addEventListener('keydown', handleKeyDown);
            window.addEventListener('keyup', handleKeyUp);
            window.addEventListener('blur', handleBlur);
        },
        stop: (): void => {
            window.removeEventListener('keydown', handleKeyDown);
            window.removeEventListener('keyup', handleKeyUp);
            window.removeEventListener('blur', handleBlur);
        },
        getState: (): InputState => inputState,
        clearPressed: (): void => {
            inputState = { keysHeld: inputState.keysHeld, keysPressed: [] };
        },
    };
}
