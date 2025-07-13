export interface InputSystem {
    start: () => void;
    stop: () => void;
    getState: () => InputState;
    clearPressed: () => void;
}

export interface InputState {
    readonly keysHeld: ReadonlySet<string>; // Keys currently being held down
    readonly keysPressed: ReadonlySet<string>; // Keys that were just pressed this frame
    readonly keyOrder: readonly string[]; // Order in which keys were pressed (most recent last)
}
