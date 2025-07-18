import { GameState } from '../types';

import { DefaultScene } from './default';

interface MenuSceneState {}

export class MenuScene extends DefaultScene<MenuSceneState> {
    name = 'menu';

    update(state: GameState, fts: number) {
        super.update(state, fts);

        if (state.input.keysPressed.includes('2') && this.transitionType === 'none') {
            this.changeScene('intro');
        }
    }
}

// import { Scene, MenuSceneState } from '../types/scenes';
// import { InputState } from '../types/input';

// class MenuScene implements Scene<MenuSceneState> {
//     readonly name = 'menu';

//     state: MenuSceneState = {
//         highlightedMenuItem: 0,
//         menuItems: ['start', 'continue'],
//         isFlashing: false,
//         flashStartTime: 0,
//     };

//     update(state: MenuSceneState, input: InputState, deltaTime: number): MenuSceneState {
//         let newState = { ...state };

//         // Handle navigation input
//         if (input.keysPressed.includes('ArrowUp') || input.keysPressed.includes('w')) {
//             newState.highlightedMenuItem = newState.highlightedMenuItem > 0
//                 ? newState.highlightedMenuItem - 1
//                 : newState.menuItems.length - 1; // Wrap to bottom
//         }

//         if (input.keysPressed.includes('ArrowDown') || input.keysPressed.includes('s')) {
//             newState.highlightedMenuItem = newState.highlightedMenuItem < newState.menuItems.length - 1
//                 ? newState.highlightedMenuItem + 1
//                 : 0; // Wrap to top
//         }

//         // Handle selection
//         if (input.keysPressed.includes('Enter') || input.keysPressed.includes(' ')) {
//             if (!newState.isFlashing) {
//                 newState.isFlashing = true;
//                 newState.flashStartTime = performance.now();
//             }
//         }

//         // Handle flash animation
//         if (newState.isFlashing) {
//             const flashElapsed = performance.now() - newState.flashStartTime;
//             const flashDuration = 300;

//             if (flashElapsed >= flashDuration) {
//                 newState.isFlashing = false;
//                 newState.flashStartTime = 0;

//                 // Emit scene change event (we'll handle this in the global update)
//                 const selectedItem = newState.menuItems[newState.highlightedMenuItem];
//                 if (selectedItem === 'start' || selectedItem === 'continue') {
//                     this.onMenuItemSelected?.(selectedItem);
//                 }
//             }
//         }

//         return newState;
//     }

//     render(ctx: CanvasRenderingContext2D, state: MenuSceneState): void {
//         // Menu styling
//         const menuX = ctx.canvas.width / 2;
//         const menuY = ctx.canvas.height / 2;
//         const buttonWidth = 200;
//         const buttonHeight = 50;
//         const buttonSpacing = 20;

//         // Calculate flash effect
//         let flashIntensity = 0;
//         if (state.isFlashing) {
//             const flashElapsed = performance.now() - state.flashStartTime;
//             const flashDuration = 300;
//             if (flashElapsed < flashDuration) {
//                 const progress = flashElapsed / flashDuration;
//                 flashIntensity = Math.sin(progress * Math.PI * 4) * 0.5 + 0.5;
//             }
//         }

//         // Draw title
//         ctx.fillStyle = '#ffffff';
//         ctx.font = 'bold 48px Arial';
//         ctx.textAlign = 'center';
//         ctx.fillText('Game Menu', menuX, menuY - 100);

//         // Draw menu buttons
//         state.menuItems.forEach((item, index) => {
//             const buttonY = menuY + index * (buttonHeight + buttonSpacing);
//             const isHighlighted = index === state.highlightedMenuItem;
//             const isFlashingItem = state.isFlashing && index === state.highlightedMenuItem;

//             // Calculate colors with flash effect
//             let bgColor = isHighlighted ? [76, 175, 80] : [51, 51, 51];
//             let borderColor = isHighlighted ? [102, 187, 106] : [102, 102, 102];

//             if (isFlashingItem) {
//                 const flashR = Math.floor(bgColor[0] + (255 - bgColor[0]) * flashIntensity);
//                 const flashG = Math.floor(bgColor[1] + (255 - bgColor[1]) * flashIntensity);
//                 const flashB = Math.floor(bgColor[2] + (255 - bgColor[2]) * flashIntensity);
//                 bgColor = [flashR, flashG, flashB];

//                 const borderFlashR = Math.floor(borderColor[0] + (255 - borderColor[0]) * flashIntensity);
//                 const borderFlashG = Math.floor(borderColor[1] + (255 - borderColor[1]) * flashIntensity);
//                 const borderFlashB = Math.floor(borderColor[2] + (255 - borderColor[2]) * flashIntensity);
//                 borderColor = [borderFlashR, borderFlashG, borderFlashB];
//             }

//             // Draw button background
//             ctx.fillStyle = `rgb(${bgColor[0]}, ${bgColor[1]}, ${bgColor[2]})`;
//             ctx.fillRect(
//                 menuX - buttonWidth / 2,
//                 buttonY - buttonHeight / 2,
//                 buttonWidth,
//                 buttonHeight
//             );

//             // Draw button border
//             ctx.strokeStyle = `rgb(${borderColor[0]}, ${borderColor[1]}, ${borderColor[2]})`;
//             ctx.lineWidth = 2;
//             ctx.strokeRect(
//                 menuX - buttonWidth / 2,
//                 buttonY - buttonHeight / 2,
//                 buttonWidth,
//                 buttonHeight
//             );

//             // Draw button text
//             ctx.fillStyle = '#ffffff';
//             ctx.font = '24px Arial';
//             ctx.textAlign = 'center';
//             ctx.fillText(
//                 item.toUpperCase(),
//                 menuX,
//                 buttonY + 8
//             );
//         });

//         // Draw instructions
//         ctx.fillStyle = '#cccccc';
//         ctx.font = '16px Arial';
//         ctx.textAlign = 'center';
//         ctx.fillText('Use Arrow Keys/WASD to navigate, Enter/Space to select', menuX, ctx.canvas.height - 50);

//         ctx.textAlign = 'left'; // Reset alignment
//     }

//     // Transition methods
//     async transitionIn(): Promise<void> {
//         // Could implement slide-in animation here
//         return new Promise(resolve => {
//             setTimeout(resolve, 300); // Simple delay for now
//         });
//     }

//     async transitionOut(): Promise<void> {
//         // Could implement slide-out animation here
//         return new Promise(resolve => {
//             setTimeout(resolve, 300); // Simple delay for now
//         });
//     }

//     onEnter(): void {
//         // Reset state when entering menu
//         this.state.highlightedMenuItem = 0;
//         this.state.isFlashing = false;
//         this.state.flashStartTime = 0;
//     }

//     // Callback for when menu item is selected (set by global update)
//     onMenuItemSelected?: (item: string) => void;
// }

// // Export singleton instance
// export const menuScene = new MenuScene();
