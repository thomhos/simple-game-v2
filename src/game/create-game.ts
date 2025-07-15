import { GameState, InputSystem } from '../types';
import { applySystemAction } from '../actions';

import { createEventEmitter } from './event-emitter';
import { loadSpritesFromMap } from './sprite-loader';
import { createInitialState } from './create-initial-state';
import { update } from './update';
import { render } from './render';

export function createGame(input: InputSystem, ctx: CanvasRenderingContext2D) {
    const events = createEventEmitter();

    let state: GameState;
    let lastTime = 0;
    let accumulatedTime = 0; //
    let animationId: number | null = null; // Used to clean up the game on stop

    const FIXED_TIMESTEP = 1000 / 60; // 16.67ms for 60fps

    const loop = (currentTime: number) => {
        const deltaTime = currentTime - lastTime;
        lastTime = currentTime;
        accumulatedTime += deltaTime;

        // If frame processing was slow, catch up first before moving on
        while (accumulatedTime >= FIXED_TIMESTEP) {
            state = update(state, input.getState(), FIXED_TIMESTEP);

            // Clear pressed keys after processing input
            input.clearPressed();

            accumulatedTime -= FIXED_TIMESTEP;
        }

        render(ctx, state);
        animationId = requestAnimationFrame(loop);
    };

    return {
        on: events.on,
        off: events.off,
        emit: events.emit,

        getState: (): GameState => state,

        start: async (initialState?: Partial<GameState>): Promise<void> => {
            state = { ...createInitialState(), ...initialState };
            lastTime = 0;
            accumulatedTime = 0;

            // Always start loading sprites, regardless of initial state
            state = applySystemAction(state, { type: 'START_LOADING' }, FIXED_TIMESTEP);
            state = applySystemAction(state, { type: 'SET_CANVAS_SIZE', width: ctx.canvas.width, height: ctx.canvas.height }, FIXED_TIMESTEP);

            // Start listening to input
            input.start();

            events.emit('start', { state });
            loop(0);

            try {
                const loadedSprites = await loadSpritesFromMap(state.sprites.spriteMap);
                // Dispatch SPRITES_LOADED action to transition to playing mode
                state = applySystemAction(state, { type: 'SPRITES_LOADED', loadedSprites }, FIXED_TIMESTEP);
            } catch (error) {
                console.error('Failed to load sprites:', error);
                // Dispatch error action to show error page
                state = applySystemAction(
                    state,
                    {
                        type: 'THROW_ERROR',
                        message: 'Failed to load game sprites',
                        details: error instanceof Error ? error.message : 'Unknown error',
                    },
                    0
                );
            }
        },
        pause: () => {
            if (state.gameMode !== 'paused') {
                state = { ...state, gameMode: 'paused' };
                events.emit('pause', { state });
            }
        },
        resume: () => {
            if (state.gameMode === 'paused') {
                state = { ...state, gameMode: 'playing' };
                lastTime = performance.now();
                events.emit('resume', { state });
            }
        },
        stop: (cb?: () => void) => {
            if (animationId) {
                cancelAnimationFrame(animationId);
                animationId = null;
            }

            events.emit('stop', { state });

            if (cb) {
                cb();
            }
        },
    };
}
