export interface InputSystem {
    start: () => void;
    stop: () => void;
    getState: () => InputState;
    // on: () => {}
}

export interface InputState {
    readonly keys: ReadonlySet<string>;
}

export type InputAction = { type: 'MOVE_PLAYER'; direction: 'up' | 'down' | 'left' | 'right' } | { type: 'STOP_PLAYER' } | { type: 'NO_ACTION' };
