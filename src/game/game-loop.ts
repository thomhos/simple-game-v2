import { GameState, InputSystem, GameStore } from '../types';
import { pipe, createRenderContext, clearCanvas, renderCRTEffects, drawBackground } from '../utils';

import { createEventEmitter } from './event-emitter';
import { createSceneManager } from './scene-manager';
import { createInitialState } from './initial-state';
import { createStore } from './store';
import { gameReducer } from './store-reducer';

export function createGame(input: InputSystem, ctx: CanvasRenderingContext2D) {
    const FIXED_TIMESTEP = 1000 / 60; // 16.67ms for 60fps
    const initialState: GameState = {
        ...createInitialState(),
        fixedTimeStep: FIXED_TIMESTEP,
        canvas: {
            width: ctx.canvas.width,
            height: ctx.canvas.height,
        },
    };
    const store: GameStore = createStore(initialState, gameReducer);
    const events = createEventEmitter();
    const sceneManager = createSceneManager(store);

    // let state: GameState;
    let lastTime = 0;
    let accumulatedTime = 0; //
    let animationId: number | null = null; // Used to clean up the game on stop

    // Define game loop
    const loop = (currentTime: number) => {
        const deltaTime = currentTime - lastTime;
        lastTime = currentTime;
        accumulatedTime += deltaTime;

        // If frame processing was slow, catch up first before moving on
        while (accumulatedTime >= FIXED_TIMESTEP) {
            store.dispatch({ type: 'INCREMENT_GAME_TIME' });
            store.dispatch({ type: 'UPDATE_INPUT', input: input.getState() });

            // Update all scenes (this have access to the store through the scenemanager)
            sceneManager.update();

            // Clear pressed keys after processing input
            input.clearPressed();

            accumulatedTime -= FIXED_TIMESTEP;
        }

        // Render the scenes
        pipe(
            createRenderContext(ctx, store.getState()),
            clearCanvas,
            drawBackground('#000000'),
            sceneManager.render,
            renderCRTEffects
        );

        animationId = requestAnimationFrame(loop);
    };

    return {
        on: events.on,
        off: events.off,
        emit: events.emit,

        getState: (): GameState => store.getState(),

        start: async (): Promise<void> => {
            input.start();
            events.emit('start', { state: store.getState() });
            loop(0);
        },
        stop: () => {
            if (animationId) {
                cancelAnimationFrame(animationId);
                animationId = null;
            }

            events.emit('stop', { state: store.getState() });
        },
    };
}
