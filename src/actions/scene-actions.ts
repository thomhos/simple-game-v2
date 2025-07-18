// import { GameState, GameAction } from '../types';

// export function applySceneAction(
//     state: GameState,
//     action: GameAction,
//     fixedTimeStep: number
// ): GameState {
//     switch (action.type) {
//         case 'CHANGE_SCENE': {
//             // If already transitioning, ignore the action
//             if (
//                 state.scenes.isTransitioningOut ||
//                 state.scenes.isTransitioningIn ||
//                 state.scenes.currentScene === action.scene
//             ) {
//                 return state;
//             }

//             // If skipping out animation, immediately finish the transition out
//             if (action.skipOutAnimation) {
//                 return applySceneAction(
//                     {
//                         ...state,
//                         scenes: {
//                             ...state.scenes,
//                             currentScene: action.scene,
//                             nextScene: undefined,
//                             isTransitioningOut: false,
//                         },
//                     },
//                     action.skipInAnimation
//                         ? { type: 'FINISH_SCENE_TRANSITION_IN' }
//                         : { type: 'START_SCENE_TRANSITION_IN' },
//                     fixedTimeStep
//                 );
//             }

//             // Start the transition out normally
//             return {
//                 ...state,
//                 scenes: {
//                     ...state.scenes,
//                     nextScene: action.scene,
//                     isTransitioningOut: true,
//                     transitionStartTime: state.system.gameTime,
//                 },
//             };
//         }
//         case 'FINISH_SCENE_TRANSITION_OUT': {
//             if (state.scenes.nextScene) {
//                 return {
//                     ...state,
//                     scenes: {
//                         ...state.scenes,
//                         currentScene: state.scenes.nextScene,
//                         nextScene: undefined,
//                         isTransitioningOut: false,
//                         isTransitioningIn: true,
//                         transitionStartTime: state.system.gameTime,
//                     },
//                 };
//             } else {
//                 return state;
//             }
//         }
//         case 'START_SCENE_TRANSITION_IN': {
//             return {
//                 ...state,
//                 scenes: {
//                     ...state.scenes,
//                     isTransitioningIn: true,
//                     transitionStartTime: state.system.gameTime,
//                 },
//             };
//         }
//         case 'FINISH_SCENE_TRANSITION_IN': {
//             return {
//                 ...state,
//                 scenes: {
//                     ...state.scenes,
//                     isTransitioningIn: false,
//                     transitionStartTime: 0,
//                 },
//             };
//         }
//         case 'MENU_NAVIGATE_UP': {
//             if (state.scenes.currentScene !== 'menu') return state;

//             const menuState = state.scenes.localState.menu;
//             const newHighlightedMenuItem = menuState.highlightedMenuItem > 0
//                 ? menuState.highlightedMenuItem - 1
//                 : menuState.menuItems.length - 1; // Wrap to bottom

//             return {
//                 ...state,
//                 scenes: {
//                     ...state.scenes,
//                     localState: {
//                         ...state.scenes.localState,
//                         menu: {
//                             ...menuState,
//                             highlightedMenuItem: newHighlightedMenuItem,
//                         },
//                     },
//                 },
//             };
//         }
//         case 'MENU_NAVIGATE_DOWN': {
//             if (state.scenes.currentScene !== 'menu') return state;

//             const menuState = state.scenes.localState.menu;
//             const newHighlightedMenuItem = menuState.highlightedMenuItem < menuState.menuItems.length - 1
//                 ? menuState.highlightedMenuItem + 1
//                 : 0; // Wrap to top

//             return {
//                 ...state,
//                 scenes: {
//                     ...state.scenes,
//                     localState: {
//                         ...state.scenes.localState,
//                         menu: {
//                             ...menuState,
//                             highlightedMenuItem: newHighlightedMenuItem,
//                         },
//                     },
//                 },
//             };
//         }
//         case 'MENU_SELECT': {
//             if (state.scenes.currentScene !== 'menu') return state;

//             // Start flash animation first
//             const flashState = applySceneAction(state, { type: 'MENU_FLASH_START' }, fixedTimeStep);

//             const menuState = flashState.scenes.localState.menu;
//             const selectedItem = menuState.menuItems[menuState.highlightedMenuItem];

//             // Handle menu selection after a delay (flash effect will trigger scene change)
//             if (selectedItem === 'start') {
//                 // Flash will trigger scene change after animation
//                 return flashState;
//             } else if (selectedItem === 'continue') {
//                 // TODO: Implement continue functionality
//                 return flashState;
//             }

//             return flashState;
//         }
//         case 'MENU_FLASH_START': {
//             if (state.scenes.currentScene !== 'menu') return state;

//             return {
//                 ...state,
//                 scenes: {
//                     ...state.scenes,
//                     localState: {
//                         ...state.scenes.localState,
//                         menu: {
//                             ...state.scenes.localState.menu,
//                             isFlashing: true,
//                             flashStartTime: state.system.gameTime,
//                         },
//                     },
//                 },
//             };
//         }
//         case 'MENU_FLASH_END': {
//             if (state.scenes.currentScene !== 'menu') return state;

//             const menuState = state.scenes.localState.menu;
//             const selectedItem = menuState.menuItems[menuState.highlightedMenuItem];

//             // End flash and trigger scene change
//             let newState = {
//                 ...state,
//                 scenes: {
//                     ...state.scenes,
//                     localState: {
//                         ...state.scenes.localState,
//                         menu: {
//                             ...menuState,
//                             isFlashing: false,
//                             flashStartTime: 0,
//                         },
//                     },
//                 },
//             };

//             // Now trigger the actual scene change
//             if (selectedItem === 'start' || selectedItem === 'continue') {
//                 return applySceneAction(newState, { type: 'CHANGE_SCENE', scene: 'playing' }, fixedTimeStep);
//             }

//             return newState;
//         }
//         default:
//             return state;
//     }
// }
