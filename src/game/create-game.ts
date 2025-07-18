import { GameState, InputSystem } from '../types';

import { createEventEmitter } from './event-emitter';
import { createActionDispatcher } from './action-dispatcher';
import { createInitialState } from './create-initial-state';
import { update } from './update';
import { render } from './render';
import { loadAllAssets } from './asset-loader';
import { createSceneManager } from '../scenes/scene-manager';
// import { LoadingScene } from '../scenes/loading-scene';

export function createGame(input: InputSystem, ctx: CanvasRenderingContext2D) {
    const events = createEventEmitter();
    const dispatcher = createActionDispatcher();
    const sceneManager = createSceneManager(dispatcher);

    let state: GameState;
    let lastTime = 0;
    let accumulatedTime = 0; //
    let animationId: number | null = null; // Used to clean up the game on stop

    const FIXED_TIMESTEP = 1000 / 60; // 16.67ms for 60fps

    // Provide dispatch to scenes
    // LoadingScene.provideDispatcher(dispatcher);

    // Define game loop
    const loop = (currentTime: number) => {
        const deltaTime = currentTime - lastTime;
        lastTime = currentTime;
        accumulatedTime += deltaTime;

        // If frame processing was slow, catch up first before moving on
        while (accumulatedTime >= FIXED_TIMESTEP) {
            state = update(state, dispatcher.getQueuedActions(), input.getState(), FIXED_TIMESTEP);
            sceneManager.update(state, input.getState(), FIXED_TIMESTEP);

            // Clear pressed keys after processing input
            input.clearPressed();

            accumulatedTime -= FIXED_TIMESTEP;
        }

        render(ctx, state);
        sceneManager.render({ ctx, state });
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
            dispatcher.dispatch({
                type: 'SET_CANVAS_SIZE',
                width: ctx.canvas.width,
                height: ctx.canvas.height,
            });

            // Start listening to input
            input.start();

            events.emit('start', { state });
            loop(0);
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
