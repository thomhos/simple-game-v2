import { InputState, InputSystem } from './types';

export function createInputSystem(): InputSystem {
    let inputState: InputState = { keysHeld: new Set(), keysPressed: new Set(), keyOrder: [] };

    const handleKeyDown = (e: KeyboardEvent) => {
        // Ignore keys pressed with modifiers (CMD, CTRL, ALT, Shift) to prevent sticky keys
        if (e.metaKey || e.ctrlKey || e.altKey || e.shiftKey) {
            return;
        }

        // Prevent default behavior for game keys to avoid browser shortcuts
        if (isGameKey(e.key)) {
            e.preventDefault();
        }

        // Only add to keysPressed if it wasn't already held
        const wasHeld = inputState.keysHeld.has(e.key);
        const newKeysHeld = new Set([...inputState.keysHeld, e.key]);
        const newKeysPressed = wasHeld ? inputState.keysPressed : new Set([...inputState.keysPressed, e.key]);
        
        // Update key order - remove if exists, then add to end (most recent)
        const newKeyOrder = inputState.keyOrder.filter(key => key !== e.key);
        if (!wasHeld) {
            newKeyOrder.push(e.key);
        }
        
        inputState = { keysHeld: newKeysHeld, keysPressed: newKeysPressed, keyOrder: newKeyOrder };
    };

    const handleKeyUp = (e: KeyboardEvent) => {
        // Always remove the key regardless of modifiers to prevent sticky keys
        const newKeysHeld = new Set(inputState.keysHeld);
        newKeysHeld.delete(e.key);
        
        // Remove from key order
        const newKeyOrder = inputState.keyOrder.filter(key => key !== e.key);
        
        inputState = { keysHeld: newKeysHeld, keysPressed: inputState.keysPressed, keyOrder: newKeyOrder };

        // Prevent default behavior for game keys
        if (isGameKey(e.key)) {
            e.preventDefault();
        }
    };

    // Clear all keys when window loses focus to prevent sticky keys
    const handleBlur = () => {
        inputState = { keysHeld: new Set(), keysPressed: new Set(), keyOrder: [] };
    };

    // Helper function to identify game keys
    const isGameKey = (key: string): boolean => {
        const gameKeys = ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'w', 'a', 's', 'd', 'Escape'];
        return gameKeys.includes(key);
    };

    return {
        start: () => {
            window.addEventListener('keydown', handleKeyDown);
            window.addEventListener('keyup', handleKeyUp);
            window.addEventListener('blur', handleBlur);
        },
        stop: () => {
            window.removeEventListener('keydown', handleKeyDown);
            window.removeEventListener('keyup', handleKeyUp);
            window.removeEventListener('blur', handleBlur);
        },
        getState: () => inputState,
        clearPressed: () => {
            inputState = { keysHeld: inputState.keysHeld, keysPressed: new Set(), keyOrder: inputState.keyOrder };
        },
    };
}
