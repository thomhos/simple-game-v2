import { PickupEntity, PlayerAnimationNames, PlayerEntity, RenderContext, Vector2 } from '../types';
import { createMapManager, createEntityManager } from '../game/';
import { drawMap, drawPlayer, drawPickup } from '../render';
import { DefaultScene } from './default';

interface JanitorSceneState {
    playerId?: string;
    timeRemaining: number;
    pickupsCollected: number;
    totalPickups: number;
    gameStarted: boolean;
    gameCompleted: boolean;
    lastUpdateTime: number;
}

export class JanitorScene extends DefaultScene<JanitorSceneState> {
    name = 'janitor';

    map = createMapManager('janitor');
    entities = createEntityManager();

    localState: JanitorSceneState = {
        playerId: undefined,
        timeRemaining: 60000, // 60 seconds
        totalPickups: 12,
        pickupsCollected: 0,
        gameStarted: false,
        gameCompleted: false,
        lastUpdateTime: 0,
    };

    onEnter() {
        super.onEnter();
        this.initializeLevel();
    }

    private initializeLevel() {
        if (!this.localState) return;

        this.resetGame();

        // Spawn player
        const spawnPosition = this.map.tileToWorld(this.map.getMapConfig().playerSpawn);
        this.localState.playerId = this.entities.createPlayer(spawnPosition);

        // Generate random pickups
        this.generateRandomPickups(this.localState.totalPickups);
    }

    private generateRandomPickups(count: number) {
        const mapConfig = this.map.getMapConfig();
        const playerSpawn = mapConfig.playerSpawn;
        const maxAttempts = count * 10; // Prevent infinite loops

        let createdCount = 0;
        let attempts = 0;

        while (createdCount < count && attempts < maxAttempts) {
            attempts++;

            // Generate random tile position (avoid edges which are walls)
            const randomTilePos: Vector2 = {
                x: Math.floor(Math.random() * (mapConfig.width - 2)) + 1,
                y: Math.floor(Math.random() * (mapConfig.height - 2)) + 1,
            };

            if (this.isValidPickupPosition(randomTilePos, playerSpawn)) {
                const worldPos = this.map.tileToWorld(randomTilePos);
                this.entities.createPickup(worldPos);
                createdCount++;
            }
        }
    }

    private isValidPickupPosition(tilePos: Vector2, playerSpawn: Vector2): boolean {
        // Don't place pickup on player spawn
        if (tilePos.x === playerSpawn.x && tilePos.y === playerSpawn.y) {
            return false;
        }

        // Don't place pickup too close to player spawn (1 tile buffer)
        const distanceFromSpawn =
            Math.abs(tilePos.x - playerSpawn.x) + Math.abs(tilePos.y - playerSpawn.y);
        if (distanceFromSpawn < 2) {
            return false;
        }

        // Check if position is solid (wall)
        const worldPos = this.map.tileToWorld(tilePos);
        if (this.map.isPositionSolid(worldPos)) {
            return false;
        }

        // Check if there's already a pickup at this position
        const existingPickups = this.entities.getEntitiesByType('pickup');
        const hasExistingPickup = existingPickups.some((pickup) => {
            const pickupTilePos = this.map.worldToTile(pickup.position);
            return pickupTilePos.x === tilePos.x && pickupTilePos.y === tilePos.y;
        });

        return !hasExistingPickup;
    }

    update() {
        super.update();
        const state = this.store.getState();

        if (this.transitionType !== 'none' || !this.localState?.gameStarted) return;

        this.updateTimer();

        if (this.localState.playerId) {
            this.updatePlayerMovement(this.localState.playerId);
            this.updatePlayerAnimation(this.localState.playerId);
            this.updatePlayerCollisions(this.localState.playerId);
        }

        // Check win condition
        if (
            this.localState.pickupsCollected >= this.localState.totalPickups &&
            !this.localState.gameCompleted
        ) {
            this.localState.gameCompleted = true;
            // Send action to global state about stage complete
        }

        if (state.input.keysPressed.includes('Escape')) {
            this.changeScene('stage-select');
        }

        // Handle restart
        if (state.input.keysPressed.includes('r') && this.localState.gameCompleted) {
            this.initializeLevel();
        }
    }

    resetGame() {
        this.entities.removeAll();

        // Reset game state
        this.localState.playerId = undefined;
        this.localState.pickupsCollected = 0;
        this.localState.timeRemaining = 60000;
        this.localState.gameStarted = true;
        this.localState.gameCompleted = false;
        this.localState.lastUpdateTime = this.store.getState().gameTime;
    }

    updateTimer() {
        const state = this.store.getState();
        const deltaTime = state.gameTime - this.localState.lastUpdateTime;

        // Update timer
        if (!this.localState.gameCompleted) {
            this.localState.timeRemaining -= deltaTime;

            if (this.localState.timeRemaining <= 0) {
                this.localState.timeRemaining = 0;
                this.localState.gameCompleted = true;
            }
        }

        this.localState.lastUpdateTime = state.gameTime;
    }

    updatePlayerAnimation(playerId: string) {
        const state = this.store.getState();
        const currentTime = state.gameTime;
        const player = this.entities.getEntityById(playerId) as PlayerEntity;

        if (player) {
            // Set current animation
            const currentAnimation: PlayerAnimationNames = `janitor-${player.movementType}-${player.facingDirection}`;

            // Get sprite config from game state
            const spriteConfig = state.assets.sprites[currentAnimation];
            if (spriteConfig) {
                const timeSinceLastFrame = currentTime - player.lastFrameTime;

                // Check if we need to advance to next frame
                if (timeSinceLastFrame >= spriteConfig.frameDuration) {
                    const maxFrames = spriteConfig.frames.length;
                    const nextFrame = (player.currentFrame + 1) % maxFrames;

                    this.entities.updateEntity(player.id, {
                        currentAnimation,
                        currentFrame: nextFrame,
                        lastFrameTime: currentTime,
                    });
                }
            }
        }
    }

    updatePlayerMovement(playerId: string) {
        const { input, fixedTimeStep } = this.store.getState();
        const player = this.entities.getEntityById(playerId) as PlayerEntity;
        const moveSpeed = player.speed * (fixedTimeStep / 1000); // Convert to pixels per second

        let direction: Vector2 = { x: 0, y: 0 };
        let newFacingDirection = player.facingDirection;

        // Find the most recent movement key pressed (prevents diagonal movement)
        const movementKeys = [
            'ArrowLeft',
            'a',
            'ArrowRight',
            'd',
            'ArrowUp',
            'w',
            'ArrowDown',
            's',
        ];
        const heldMovementKeys = input.keysHeld.filter((key) => movementKeys.includes(key));

        if (heldMovementKeys.length > 0) {
            const lastKey = heldMovementKeys[heldMovementKeys.length - 1];

            if (lastKey === 'ArrowLeft' || lastKey === 'a') {
                direction.x = -1;
                newFacingDirection = 'left';
            } else if (lastKey === 'ArrowRight' || lastKey === 'd') {
                direction.x = 1;
                newFacingDirection = 'right';
            } else if (lastKey === 'ArrowUp' || lastKey === 'w') {
                direction.y = -1;
                newFacingDirection = 'up';
            } else if (lastKey === 'ArrowDown' || lastKey === 's') {
                direction.y = 1;
                newFacingDirection = 'down';
            }
        }

        // Calculate new position
        const newPosition: Vector2 = {
            x: player.position.x + direction.x * moveSpeed,
            y: player.position.y + direction.y * moveSpeed,
        };

        // update movement type
        const isMoving = direction.x !== 0 || direction.y !== 0;
        const movementType = isMoving ? 'walk' : 'idle';

        // Check for collisions with solid tiles
        const collisionPoints = [
            { x: newPosition.x, y: newPosition.y },
            { x: newPosition.x + player.collisionBox.width, y: newPosition.y },
            { x: newPosition.x, y: newPosition.y + player.collisionBox.height },
            {
                x: newPosition.x + player.collisionBox.width,
                y: newPosition.y + player.collisionBox.height,
            },
        ];

        for (const point of collisionPoints) {
            if (this.map.isPositionSolid(point)) {
                this.entities.updateEntity(player.id, {
                    facingDirection: newFacingDirection,
                    movementType,
                });
                return;
            }
        }

        // Update player position
        this.entities.updateEntity(player.id, {
            position: newPosition,
            velocity: { x: direction.x * moveSpeed, y: direction.y * moveSpeed },
            facingDirection: newFacingDirection,
            movementType,
        });
    }

    updatePlayerCollisions(playerId: string) {
        const player = this.entities.getEntityById(playerId) as PlayerEntity;
        const collisionsWithPlayer = this.entities.getCollisions(player);

        if (collisionsWithPlayer.length > 0) {
            for (const collision of collisionsWithPlayer) {
                if (collision.type === 'pickup') {
                    // Only collect if not already collected
                    if (!collision.collected) {
                        this.entities.updateEntity(collision.id, { collected: true });
                        this.localState.pickupsCollected++;
                    }
                }
            }
        }
    }

    render(renderContext: RenderContext) {
        super.render(renderContext);
        const { ctx } = renderContext;

        // Calculate fade effect based on transition state
        let opacity = 1;
        if (this.transitionType === 'in') {
            opacity = this.transitionProgress;
        } else if (this.transitionType === 'out') {
            opacity = 1 - this.transitionProgress;
        }

        // Apply fade effect to entire scene
        ctx.save();
        ctx.globalAlpha = opacity;

        drawMap(renderContext, this.map.getMapConfig());

        if (this.localState.totalPickups > 0) {
            const allPickups: PickupEntity[] = this.entities.getEntitiesByType('pickup');

            for (const pickup of allPickups) {
                if (!pickup.collected) {
                    drawPickup(renderContext, pickup as PickupEntity);
                }
            }
        }

        if (this.localState.playerId) {
            const player = this.entities.getEntityById(this.localState.playerId) as PlayerEntity;
            drawPlayer(renderContext, player);
        }

        // Render UI
        this.renderUI(renderContext);

        // Restore canvas state
        ctx.restore();
    }

    private renderUI(renderContext: RenderContext) {
        if (!this.localState) return;

        const { ctx } = renderContext;
        const { canvas } = ctx;

        // Draw timer
        ctx.fillStyle = '#ffffff';
        ctx.font = '14px "Press Start 2P"';
        ctx.textAlign = 'left';

        const timeSeconds = Math.ceil(this.localState.timeRemaining / 1000);
        const timeColor = timeSeconds <= 10 ? '#ff4444' : '#ffffff';
        ctx.fillStyle = timeColor;
        ctx.fillText(`Time: ${timeSeconds}s`, 32, 24);

        ctx.textAlign = 'right';
        ctx.fillText(
            `Trash Collected: ${this.localState.pickupsCollected}/${this.localState.totalPickups}`,
            canvas.width - 32,
            24
        );

        // Draw instructions
        ctx.textAlign = 'center';
        ctx.fillStyle = '#cccccc';
        ctx.font = '10px "Press Start 2P"';
        ctx.fillText('WASD/Arrow Keys to move', canvas.width / 2, canvas.height - 60);
        ctx.fillText(
            'Collect all trash before time runs out!',
            canvas.width / 2,
            canvas.height - 40
        );
        ctx.fillText('Press ESC to return to stage select', canvas.width / 2, canvas.height - 20);

        // Draw game over / win screen
        if (this.localState.gameCompleted) {
            // Semi-transparent overlay
            ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            // Game over text
            ctx.fillStyle = '#ffffff';
            ctx.font = 'bold 32px "Press Start 2P"';
            ctx.textAlign = 'center';

            if (this.localState.pickupsCollected >= this.localState.totalPickups) {
                ctx.fillStyle = '#4CAF50';
                ctx.fillText('LEVEL COMPLETE!', canvas.width / 2, canvas.height / 2 - 50);
                ctx.fillStyle = '#ffffff';
                ctx.font = '16px "Press Start 2P"';
                ctx.fillText('Great job cleaning up!', canvas.width / 2, canvas.height / 2);
            } else {
                ctx.fillStyle = '#f44336';
                ctx.fillText('TIME UP!', canvas.width / 2, canvas.height / 2 - 50);
                ctx.fillStyle = '#ffffff';
                ctx.font = '16px "Press Start 2P"';
                ctx.fillText('You ran out of time!', canvas.width / 2, canvas.height / 2);
            }

            ctx.font = '12px "Press Start 2P"';
            ctx.fillText(
                'Press R to restart, ESC for stage select',
                canvas.width / 2,
                canvas.height / 2 + 50
            );
        }

        ctx.textAlign = 'left'; // Reset alignment
    }
}
