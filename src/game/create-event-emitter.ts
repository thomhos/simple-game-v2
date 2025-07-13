import { GameEvent, GameEventEmitter, GameEventHandler } from '../types';

export function createEventEmitter(): GameEventEmitter {
    const listeners: Record<GameEvent, GameEventHandler[]> = {
        start: [],
        stop: [],
        pause: [],
        resume: [],
        stateChanged: [],
    };

    return {
        on: <T>(event: GameEvent, handler: GameEventHandler<T>) => {
            listeners[event].push(handler);

            // Return unsubscribe function
            return () => {
                const index = listeners[event].indexOf(handler);
                if (index > -1) {
                    listeners[event].splice(index, 1);
                }
            };
        },

        emit: <T>(event: GameEvent, data?: T) => {
            listeners[event].forEach((handler) => handler(data));
        },

        off: (event: GameEvent, handler: GameEventHandler) => {
            const index = listeners[event].indexOf(handler);
            if (index > -1) {
                listeners[event].splice(index, 1);
            }
        },
    };
}
