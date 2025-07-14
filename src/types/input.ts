export interface InputSystem {
    start: () => void;
    stop: () => void;
    getState: () => InputState;
    clearPressed: () => void;
}

export interface InputState {
    readonly keysHeld: readonly string[]; // Keys currently being held down (ordered by press time, most recent last)
    readonly keysPressed: readonly string[]; // Keys that were just pressed this frame
}
