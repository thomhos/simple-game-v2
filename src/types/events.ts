export type GameEvent = 'start' | 'stop' | 'pause' | 'resume' | 'stateChanged';
export type GameEventHandler<T = any> = (data?: T) => void;
export interface GameEventEmitter {
    on: <T>(event: GameEvent, handler: GameEventHandler<T>) => () => void;
    emit: <T>(event: GameEvent, data?: T) => void;
    off: (event: GameEvent, handler: GameEventHandler) => void;
}
