import { GameState, InputSystem, UpdateFn, RenderFn } from '../types';

import { createEventEmitter } from './create-event-emitter';
import { createInitialState } from './create-initial-state';

export function createGame(input: InputSystem, ctx: CanvasRenderingContext2D, update: UpdateFn, render: RenderFn) {
    let state: GameState;
    let lastTime = 0;
    let accumulator = 0; //
    let animationId: number | null = null; // Used to clean up the game on stop

    const FIXED_TIMESTEP = 1000 / 60; // 16.67ms for 60fps
    const events = createEventEmitter();

    const loop = (currentTime: number): void => {
        const deltaTime = currentTime - lastTime;
        lastTime = currentTime;

        // Always process input (including pause toggle)
        const previousState = state;
        state = update(state, input.getState(), FIXED_TIMESTEP);

        // Clear pressed keys after processing input
        input.clearPressed();

        // Emit state change event if state actually changed
        if (state !== previousState) {
            events.emit('stateChanged', {
                previousState,
                currentState: state,
            });
        }

        // Only accumulate time and run game logic if not paused
        if (state.gameMode !== 'paused') {
            accumulator += deltaTime;

            // Fixed timestep updates for game logic (but not input processing)
            while (accumulator >= FIXED_TIMESTEP) {
                // Game logic updates would go here in the future
                // For now, input processing happens above regardless of pause state
                accumulator -= FIXED_TIMESTEP;
            }
        }

        render(ctx, state);
        animationId = requestAnimationFrame(loop);
    };

    return {
        on: events.on,
        off: events.off,
        emit: events.emit,

        getState: (): GameState => state,
        isPaused: (): boolean => state.gameMode === 'paused',

        start: (initialState?: GameState): void => {
            state = initialState || createInitialState();
            lastTime = 0;
            accumulator = 0;

            input.start();
            events.emit('start', { state });
            loop(0);
        },
        pause: (): void => {
            if (state.gameMode !== 'paused') {
                state = { ...state, gameMode: 'paused' };
                events.emit('pause', { state });
            }
        },
        resume: (): void => {
            if (state.gameMode === 'paused') {
                state = { ...state, gameMode: 'playing' };
                lastTime = performance.now();
                events.emit('resume', { state });
            }
        },
        stop: (cleanup?: () => void): void => {
            if (animationId) {
                cancelAnimationFrame(animationId);
                animationId = null;
            }

            events.emit('stop', { state });

            if (cleanup) {
                cleanup();
            }
        },
    };
}
