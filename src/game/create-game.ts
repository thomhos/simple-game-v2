import { GameState, InputSystem } from '../types';
import { applySceneAction, applySystemAction } from '../actions';

import { createEventEmitter } from './event-emitter';
import { createInitialState } from './create-initial-state';
import { update } from './update';
import { render } from './render';
import { loadAllAssets } from './asset-loader';

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

            // Set canvas size, so don't have to hardcode elsewhere
            state = applySystemAction(
                state,
                { type: 'SET_CANVAS_SIZE', width: ctx.canvas.width, height: ctx.canvas.height },
                FIXED_TIMESTEP
            );

            // Start listening to input
            input.start();

            events.emit('start', { state });
            loop(0);

            // Start loading assets
            try {
                const assets = await loadAllAssets(state, (progress) => {
                    console.log(`Loading progress: ${(progress * 100).toFixed(1)}%`);
                    state = applySystemAction(
                        state,
                        {
                            type: 'UPDATE_LOADING_PROGRESS',
                            progress: progress * 100,
                        },
                        FIXED_TIMESTEP
                    );
                });

                // Assets loaded successfully
                state = applySystemAction(
                    state,
                    {
                        type: 'ASSETS_LOADED',
                        audio: assets.audio,
                        images: assets.images,
                    },
                    FIXED_TIMESTEP
                );

                // Transition to menu scene
                state = applySceneAction(
                    state,
                    {
                        type: 'CHANGE_SCENE',
                        scene: 'menu',
                        skipOutAnimation: true,
                    },
                    FIXED_TIMESTEP
                );
            } catch (error) {
                console.error('Failed to load assets:', error);
                state = applySystemAction(
                    state,
                    {
                        type: 'THROW_ERROR',
                        message: 'Failed to load game assets',
                    },
                    FIXED_TIMESTEP
                );
            }
        },
        stop: (cb?: () => void) => {
            if (animationId) {
                cancelAnimationFrame(animationId);
                animationId = null;
            }

            events.emit('stop', { state });

            if (cb) cb();
        },
    };
}
