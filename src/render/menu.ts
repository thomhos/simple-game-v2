import { RenderContext } from './canvas-helpers';

export function drawMenu(renderCtx: RenderContext): RenderContext {
    const { ctx, state } = renderCtx;
    
    // Only render menu if we're in menu scene
    if (state.scenes.currentScene !== 'menu') {
        return renderCtx;
    }

    const menuState = state.scenes.localState.menu;
    const { menuItems, highlightedMenuItem, isFlashing, flashStartTime } = menuState;
    const { scenes } = state;

    // Calculate transition progress for slide animations
    let slideProgress = 1; // Default to fully visible
    let slideDirection = 1; // 1 = slide from right, -1 = slide to left
    
    if (scenes.isTransitioningIn) {
        const elapsed = state.system.gameTime - scenes.transitionStartTime;
        slideProgress = Math.min(elapsed / scenes.transitionDuration, 1);
        // Ease-out animation for slide-in
        slideProgress = 1 - Math.pow(1 - slideProgress, 3);
        slideDirection = -1; // Slide in from right
    } else if (scenes.isTransitioningOut) {
        const elapsed = state.system.gameTime - scenes.transitionStartTime;
        const outProgress = Math.min(elapsed / scenes.transitionDuration, 1);
        // Ease-in animation for slide-out (faster acceleration)
        slideProgress = 1 - Math.pow(outProgress, 2);
        slideDirection = 1; // Slide out to left
    }

    // Menu styling
    const menuX = ctx.canvas.width / 2;
    const menuY = ctx.canvas.height / 2;
    const buttonWidth = 200;
    const buttonHeight = 50;
    const buttonSpacing = 20;
    
    // Calculate slide offset
    const slideOffset = (1 - slideProgress) * (300 * slideDirection);

    // Draw title with slide animation and opacity
    ctx.fillStyle = `rgba(255, 255, 255, ${slideProgress})`;
    ctx.font = 'bold 48px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('Game Menu', menuX + slideOffset * 0.5, menuY - 100);

    // Calculate flash effect
    let flashIntensity = 0;
    if (isFlashing) {
        const flashElapsed = state.system.gameTime - flashStartTime;
        const flashDuration = 300; // 300ms flash
        if (flashElapsed < flashDuration) {
            // Create a pulsing effect: flash bright -> normal -> bright
            const progress = flashElapsed / flashDuration;
            flashIntensity = Math.sin(progress * Math.PI * 4) * 0.5 + 0.5; // 4 pulses over 300ms
        }
    }

    // Draw menu buttons with staggered slide animation
    menuItems.forEach((item, index) => {
        const buttonY = menuY + index * (buttonHeight + buttonSpacing);
        const isHighlighted = index === highlightedMenuItem && !scenes.isTransitioningIn && !scenes.isTransitioningOut;
        const isFlashingItem = isFlashing && index === highlightedMenuItem;
        
        // Stagger the animation for each button
        const staggerDelay = index * 0.1;
        let buttonSlideProgress = slideProgress;
        
        if (scenes.isTransitioningIn) {
            // Staggered slide-in
            buttonSlideProgress = Math.max(0, Math.min(1, (slideProgress - staggerDelay) / (1 - staggerDelay)));
        } else if (scenes.isTransitioningOut) {
            // Reverse stagger for slide-out (last button slides out first)
            const reverseStaggerDelay = (menuItems.length - 1 - index) * 0.1;
            buttonSlideProgress = Math.max(0, Math.min(1, (slideProgress - reverseStaggerDelay) / (1 - reverseStaggerDelay)));
        }
        
        const buttonSlideOffset = (1 - buttonSlideProgress) * (300 * slideDirection);

        // Calculate flash colors
        let bgColor = isHighlighted ? [76, 175, 80] : [51, 51, 51]; // RGB values
        let borderColor = isHighlighted ? [102, 187, 106] : [102, 102, 102]; // RGB values
        let textColor = [255, 255, 255]; // RGB values
        
        if (isFlashingItem) {
            // Flash between normal and bright white
            const flashR = Math.floor(bgColor[0] + (255 - bgColor[0]) * flashIntensity);
            const flashG = Math.floor(bgColor[1] + (255 - bgColor[1]) * flashIntensity);
            const flashB = Math.floor(bgColor[2] + (255 - bgColor[2]) * flashIntensity);
            bgColor = [flashR, flashG, flashB];
            
            const borderFlashR = Math.floor(borderColor[0] + (255 - borderColor[0]) * flashIntensity);
            const borderFlashG = Math.floor(borderColor[1] + (255 - borderColor[1]) * flashIntensity);
            const borderFlashB = Math.floor(borderColor[2] + (255 - borderColor[2]) * flashIntensity);
            borderColor = [borderFlashR, borderFlashG, borderFlashB];
        }

        // Draw button background with opacity and flash
        ctx.fillStyle = `rgba(${bgColor[0]}, ${bgColor[1]}, ${bgColor[2]}, ${buttonSlideProgress})`;
        ctx.fillRect(
            menuX - buttonWidth / 2 + buttonSlideOffset,
            buttonY - buttonHeight / 2,
            buttonWidth,
            buttonHeight
        );

        // Draw button border with opacity and flash
        ctx.strokeStyle = `rgba(${borderColor[0]}, ${borderColor[1]}, ${borderColor[2]}, ${buttonSlideProgress})`;
        ctx.lineWidth = 2;
        ctx.strokeRect(
            menuX - buttonWidth / 2 + buttonSlideOffset,
            buttonY - buttonHeight / 2,
            buttonWidth,
            buttonHeight
        );

        // Draw button text with opacity
        ctx.fillStyle = `rgba(${textColor[0]}, ${textColor[1]}, ${textColor[2]}, ${buttonSlideProgress})`;
        ctx.font = '24px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(
            item.toUpperCase(),
            menuX + buttonSlideOffset,
            buttonY + 8 // Center text vertically
        );
    });

    // Draw instructions with fade-in
    ctx.fillStyle = `rgba(204, 204, 204, ${slideProgress})`;
    ctx.font = '16px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('Use Arrow Keys/WASD to navigate, Enter/Space to select', menuX + slideOffset * 0.3, ctx.canvas.height - 50);
    
    ctx.textAlign = 'left'; // Reset alignment
    return renderCtx;
}