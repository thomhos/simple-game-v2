import { Stage, JanitorStageState } from '../types/scenes';
import { InputState } from '../types/input';

class JanitorStage implements Stage<JanitorStageState> {
    readonly name = 'janitor';
    
    state: JanitorStageState = {
        player: {
            x: 100,
            y: 100,
            facing: 'down',
            isMoving: false,
        },
        itemsToPickUp: [
            { id: 'trash1', x: 200, y: 150 },
            { id: 'trash2', x: 300, y: 200 },
            { id: 'trash3', x: 150, y: 250 },
        ],
        itemsPickedUp: [],
        timeRemaining: 60000, // 60 seconds in milliseconds
    };

    update(state: JanitorStageState, input: InputState, deltaTime: number): JanitorStageState {
        let newState = { ...state };

        // Update timer
        newState.timeRemaining = Math.max(0, newState.timeRemaining - deltaTime);

        // Handle player movement
        const speed = 2.6; // pixels per frame at 60fps
        let deltaX = 0;
        let deltaY = 0;
        let isMoving = false;

        if (input.keysHeld.includes('ArrowUp') || input.keysHeld.includes('w')) {
            deltaY = -speed;
            newState.player.facing = 'up';
            isMoving = true;
        }
        if (input.keysHeld.includes('ArrowDown') || input.keysHeld.includes('s')) {
            deltaY = speed;
            newState.player.facing = 'down';
            isMoving = true;
        }
        if (input.keysHeld.includes('ArrowLeft') || input.keysHeld.includes('a')) {
            deltaX = -speed;
            newState.player.facing = 'left';
            isMoving = true;
        }
        if (input.keysHeld.includes('ArrowRight') || input.keysHeld.includes('d')) {
            deltaX = speed;
            newState.player.facing = 'right';
            isMoving = true;
        }

        // Update player position with boundary checking
        const newX = newState.player.x + deltaX;
        const newY = newState.player.y + deltaY;
        
        // Simple boundary checking (assuming canvas is 800x600)
        if (newX >= 20 && newX <= 780) {
            newState.player.x = newX;
        }
        if (newY >= 20 && newY <= 580) {
            newState.player.y = newY;
        }

        newState.player.isMoving = isMoving;

        // Check for item pickup
        if (input.keysPressed.includes(' ') || input.keysPressed.includes('Enter')) {
            const pickupRadius = 30;
            newState.itemsToPickUp = newState.itemsToPickUp.filter(item => {
                const distance = Math.sqrt(
                    Math.pow(item.x - newState.player.x, 2) + 
                    Math.pow(item.y - newState.player.y, 2)
                );
                
                if (distance <= pickupRadius) {
                    newState.itemsPickedUp.push(item.id);
                    return false; // Remove from itemsToPickUp
                }
                return true; // Keep in itemsToPickUp
            });
        }

        // Check win/lose conditions
        if (newState.itemsToPickUp.length === 0) {
            this.onComplete?.();
        } else if (newState.timeRemaining <= 0) {
            this.onFail?.();
        }

        return newState;
    }

    render(ctx: CanvasRenderingContext2D, state: JanitorStageState): void {
        // Clear background
        ctx.fillStyle = '#f0f0f0';
        ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);

        // Draw items to pick up
        ctx.fillStyle = '#8B4513'; // Brown for trash
        state.itemsToPickUp.forEach(item => {
            ctx.fillRect(item.x - 10, item.y - 10, 20, 20);
        });

        // Draw player
        ctx.fillStyle = '#4CAF50'; // Green player
        ctx.fillRect(state.player.x - 15, state.player.y - 15, 30, 30);
        
        // Draw player facing direction
        ctx.fillStyle = '#2E7D32'; // Darker green for facing indicator
        switch (state.player.facing) {
            case 'up':
                ctx.fillRect(state.player.x - 5, state.player.y - 15, 10, 5);
                break;
            case 'down':
                ctx.fillRect(state.player.x - 5, state.player.y + 10, 10, 5);
                break;
            case 'left':
                ctx.fillRect(state.player.x - 15, state.player.y - 5, 5, 10);
                break;
            case 'right':
                ctx.fillRect(state.player.x + 10, state.player.y - 5, 5, 10);
                break;
        }

        // Draw UI
        ctx.fillStyle = '#000000';
        ctx.font = '20px Arial';
        ctx.textAlign = 'left';
        ctx.fillText(`Items Left: ${state.itemsToPickUp.length}`, 20, 30);
        ctx.fillText(`Items Collected: ${state.itemsPickedUp.length}`, 20, 60);
        ctx.fillText(`Time: ${Math.ceil(state.timeRemaining / 1000)}s`, 20, 90);
        
        // Instructions
        ctx.font = '16px Arial';
        ctx.fillText('WASD/Arrows: Move, Space/Enter: Pick up items', 20, ctx.canvas.height - 20);
    }

    onStart(): void {
        console.log('Janitor stage started!');
    }

    onComplete(): void {
        console.log('Janitor stage completed!');
        // Could trigger stage completion in global state
    }

    onFail(): void {
        console.log('Janitor stage failed - time up!');
        // Could trigger stage failure in global state
    }
}

export const janitorStage = new JanitorStage();