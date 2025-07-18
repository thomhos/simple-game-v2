// import { GlobalGameState, GlobalAction } from '../types/global-state';
// import { InputState } from '../types/input';
// import { pipe, when } from '../utils';
// import { menuScene } from '../scenes/menu-scene';

// // Global actions handler - only handles system concerns
// export function applyGlobalAction(
//     state: GlobalGameState,
//     action: GlobalAction,
//     deltaTime: number
// ): GlobalGameState {
//     switch (action.type) {
//         case 'INCREMENT_GAME_TIME':
//             return {
//                 ...state,
//                 system: {
//                     ...state.system,
//                     gameTime: state.system.gameTime + deltaTime,
//                 },
//             };

//         case 'SET_CANVAS_SIZE':
//             return {
//                 ...state,
//                 system: {
//                     ...state.system,
//                     canvas: {
//                         width: action.width,
//                         height: action.height,
//                     },
//                 },
//             };

//         case 'UPDATE_LOADING_PROGRESS':
//             return {
//                 ...state,
//                 loading: {
//                     ...state.loading,
//                     progress: action.progress,
//                 },
//             };

//         case 'LOADING_COMPLETE':
//             return {
//                 ...state,
//                 loading: {
//                     ...state.loading,
//                     isComplete: true,
//                 },
//                 currentScene: 'menu', // Auto-transition to menu when loading complete
//             };

//         case 'CHANGE_SCENE':
//             return {
//                 ...state,
//                 currentScene: action.scene,
//                 // Reset stage when changing scenes
//                 currentStage: action.scene === 'playing' ? state.currentStage : null,
//             };

//         case 'CHANGE_STAGE':
//             return {
//                 ...state,
//                 currentStage: action.stage,
//                 currentScene: 'playing', // Ensure we're in playing scene
//             };

//         case 'START_TRANSITION':
//             return {
//                 ...state,
//                 transition: {
//                     isTransitioning: true,
//                     fromScene: action.fromScene,
//                     toScene: action.toScene,
//                     startTime: state.system.gameTime,
//                     duration: action.duration || 500,
//                 },
//             };

//         case 'FINISH_TRANSITION':
//             return {
//                 ...state,
//                 transition: {
//                     ...state.transition,
//                     isTransitioning: false,
//                     fromScene: undefined,
//                     toScene: undefined,
//                 },
//             };

//         case 'THROW_ERROR':
//             return {
//                 ...state,
//                 system: {
//                     ...state.system,
//                     error: { message: action.message },
//                 },
//             };

//         case 'RESOLVE_ERROR':
//             return {
//                 ...state,
//                 system: {
//                     ...state.system,
//                     error: undefined,
//                 },
//             };

//         default:
//             return state;
//     }
// }

// // Generate global actions from input
// function actionsFromInput(state: GlobalGameState, input: InputState): GlobalAction[] {
//     const actions: GlobalAction[] = [];

//     // Global scene switching (for debugging)
//     if (input.keysPressed.includes('1')) {
//         actions.push({ type: 'CHANGE_SCENE', scene: 'menu' });
//     }
//     if (input.keysPressed.includes('2')) {
//         actions.push({ type: 'CHANGE_SCENE', scene: 'playing' });
//     }

//     return actions;
// }

// // Generate global actions from current state
// function actionsFromState(state: GlobalGameState): GlobalAction[] {
//     const actions: GlobalAction[] = [];

//     // Check if transitions should finish
//     if (state.transition.isTransitioning) {
//         const elapsed = state.system.gameTime - state.transition.startTime;
//         if (elapsed >= state.transition.duration) {
//             actions.push({ type: 'FINISH_TRANSITION' });

//             // Change to target scene when transition finishes
//             if (state.transition.toScene) {
//                 actions.push({ type: 'CHANGE_SCENE', scene: state.transition.toScene });
//             }
//         }
//     }

//     return actions;
// }

// // Main global update function
// export function updateGlobal(
//     state: GlobalGameState,
//     input: InputState,
//     deltaTime: number
// ): GlobalGameState {
//     // Set up global actions
//     const globalActions: GlobalAction[] = [
//         { type: 'INCREMENT_GAME_TIME' },
//         ...actionsFromInput(state, input),
//         ...actionsFromState(state),
//     ];

//     // Update global state
//     let newState = pipe(
//         state,
//         (s) => ({ ...s, input }), // Update input state
//         (s) => globalActions.reduce((acc, action) => applyGlobalAction(acc, action, deltaTime), s)
//     );

//     // Set up scene callbacks
//     setupSceneCallbacks(newState);

//     // Update active scene
//     newState = pipe(
//         newState,
//         when(newState.currentScene === 'menu', (s) => {
//             menuScene.state = menuScene.update(menuScene.state, s.input, deltaTime);
//             return s;
//         })
//         // Add other scenes here as we create them
//         // when(s => s.currentScene === 'playing' && s.currentStage === 'janitor', s => {
//         //     janitorStage.state = janitorStage.update(janitorStage.state, s.input, deltaTime);
//         //     return s;
//         // })
//     );

//     return newState;
// }

// // Set up callbacks so scenes can trigger global actions
// function setupSceneCallbacks(state: GlobalGameState): void {
//     // Menu scene can trigger scene changes
//     menuScene.onMenuItemSelected = (item: string) => {
//         if (item === 'start' || item === 'continue') {
//             // This is a bit of a hack - we need a better way to trigger global actions from scenes
//             // For now, we'll handle this in the next update cycle
//             setTimeout(() => {
//                 // In a real implementation, we'd want an event system or action queue
//                 console.log(`Menu selected: ${item} - should change to playing scene`);
//             }, 0);
//         }
//     };
// }
