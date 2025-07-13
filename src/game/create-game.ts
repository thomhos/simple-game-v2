import { GameState, InputSystem, UpdateFn, RenderFn } from '../types';

import { createEventEmitter } from './create-event-emitter';
import { createInitialState } from './create-initial-state';

export function createGame(input: InputSystem, ctx: CanvasRenderingContext2D, update: UpdateFn, render: RenderFn) {
    let state: GameState;
    let lastTime = 0;
    let accumulator = 0; //
    let animationId: number | null = null; // Used to clean up the game on stop
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

        console.log('running');

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

        start: (initialState?: GameState) => {
            state = initialState || createInitialState();
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
