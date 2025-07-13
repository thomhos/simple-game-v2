import { GameState, InputSystem, UpdateFn, RenderFn, GameEvent, GameEventEmitter, GameEventHandler } from '../types';

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

export function createInitialState(): GameState {
    return {
        map: {
            availableMaps: [],
            activeMap: '',
        },
        player: {
            x: 400,
            y: 300,
            width: 32,
            height: 32,
        },
    };
}

export function createGame(input: InputSystem, ctx: CanvasRenderingContext2D, update: UpdateFn, render: RenderFn) {
    let state: GameState;
    let lastTime = 0;
    let accumulator = 0;
    let animationId: number | null = null;
    let isPaused = false;

    const FIXED_TIMESTEP = 1000 / 60; // 16.67ms for 60fps
    const events = createEventEmitter();

    const loop = (currentTime: number) => {
        if (isPaused) {
            animationId = requestAnimationFrame(loop);
            return;
        }

        const deltaTime = currentTime - lastTime;
        lastTime = currentTime;
        accumulator += deltaTime;

        // Fixed timestep updates
        while (accumulator >= FIXED_TIMESTEP) {
            const previousState = state;
            state = update(state, input.getState(), FIXED_TIMESTEP);

            // Emit state change event if state actually changed
            if (state !== previousState) {
                events.emit('stateChanged', {
                    previousState,
                    currentState: state,
                });
            }

            accumulator -= FIXED_TIMESTEP;
        }

        render(ctx, state);
        animationId = requestAnimationFrame(loop);
    };

    return {
        on: events.on,
        off: events.off,
        emit: events.emit,

        getState: () => state,
        isPaused: () => isPaused,

        start: (initialState: GameState) => {
            state = initialState;
            lastTime = 0;
            accumulator = 0;
            isPaused = false;

            input.start();
            events.emit('start', { state });
            loop(0);
        },
        pause: () => {
            if (!isPaused) {
                isPaused = true;
                events.emit('pause', { state });
            }
        },
        resume: () => {
            if (isPaused) {
                isPaused = false;
                lastTime = performance.now();
                events.emit('resume', { state });
            }
        },
        stop: (cleanup?: () => void) => {
            if (animationId) {
                cancelAnimationFrame(animationId);
                animationId = null;
            }

            isPaused = false;
            events.emit('stop', { state });

            if (cleanup) {
                cleanup();
            }
        },
    };
}
