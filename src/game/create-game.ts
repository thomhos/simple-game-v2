import { GameState, InputSystem, GameAction } from '../types';
import { pipe, createRenderContext, clearCanvas } from '../utils';
import {
    createActionDispatcher,
    actionsFromInput,
    actionsFromState,
    applySystemAction,
} from './actions';

import { createEventEmitter } from './event-emitter';
import { createSceneManager } from './scene-manager';
import { createInitialState } from './create-initial-state';

export function createGame(input: InputSystem, ctx: CanvasRenderingContext2D) {
    const events = createEventEmitter();
    const dispatcher = createActionDispatcher();
    const sceneManager = createSceneManager(dispatcher);

    let state: GameState;
    let lastTime = 0;
    let accumulatedTime = 0; //
    let animationId: number | null = null; // Used to clean up the game on stop

    const FIXED_TIMESTEP = 1000 / 60; // 16.67ms for 60fps

    // Define game loop
    const loop = (currentTime: number) => {
        const deltaTime = currentTime - lastTime;
        lastTime = currentTime;
        accumulatedTime += deltaTime;

        // If frame processing was slow, catch up first before moving on
        while (accumulatedTime >= FIXED_TIMESTEP) {
            const actions: GameAction[] = [
                ...actionsFromInput(state, input.getState()), // map any incoming input into actions
                ...actionsFromState(state), // see if the current state is generating any actions
                ...dispatcher.getQueuedActions(), // see if the scenes generated any acitons
            ];

            // Update state by processing all system actions
            state = actions.reduce(
                (acc, action) => applySystemAction(acc, action, FIXED_TIMESTEP),
                state
            );

            // Update all scenes (they cannot update the state, only through dispatcher)
            sceneManager.update(state, FIXED_TIMESTEP);

            // Clear pressed keys after processing input
            input.clearPressed();

            accumulatedTime -= FIXED_TIMESTEP;
        }

        // Render the scenes
        pipe(createRenderContext(ctx, state), clearCanvas, sceneManager.render);

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
