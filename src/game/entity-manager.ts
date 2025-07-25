import { Entity, EntityType, PickupEntity, PlayerEntity, Vector2 } from '../types';

export function createEntityManager() {
    const entities: Map<string, Entity> = new Map();
    let nextId = 1;

    return {
        generateId() {
            return `entity_${nextId++}`;
        },
        getAllEntities() {
            return entities;
        },
        getEntityById(id: string) {
            return entities.get(id);
        },
        getEntitiesByType<T extends Entity>(type: EntityType): T[] {
            return [...entities.values()].filter((entity) => entity.type === type) as T[];
        },
        removeEntity(id: string): boolean {
            return entities.delete(id);
        },
        removeAll() {
            entities.clear();
            nextId = 1;
        },
        updateEntity(id: string, updates: Partial<Entity>): void {
            const entity = entities.get(id);
            if (entity) {
                // Create new entity with updates
                const updatedEntity: Entity = {
                    ...entity,
                    ...updates,
                } as Entity;

                // Update collision box if needed
                if ('collisionBox' in updatedEntity) {
                    updatedEntity.collisionBox = {
                        ...updatedEntity.collisionBox,
                        x: updatedEntity.position.x + (updatedEntity.collisionBox.offsetX || 0),
                        y: updatedEntity.position.y + (updatedEntity.collisionBox.offsetY || 0),
                    };
                }

                // Replace in map
                entities.set(id, updatedEntity);
            }
        },
        cleanup() {
            for (const entity of entities.values()) {
                if (entity.type === 'pickup') {
                    const pickup = entity;
                    if (pickup.collected) {
                        this.removeEntity(entity.id);
                    }
                }
            }
        },
        createPlayer(position: Vector2) {
            const id = this.generateId();
            const player: PlayerEntity = {
                // base
                id,
                type: 'player',
                position,
                size: { width: 16, height: 32 },

                // collision component
                collisionBox: { x: position.x, y: position.y, width: 32, height: 32 },
                canCollideWith: ['pickup'],

                // movement component
                speed: 200,
                direction: { x: 0, y: 0 },
                velocity: { x: 0, y: 0 },

                // animation component
                spriteSheet: 'janitor',
                currentFrame: 0,
                animationSpeed: 8,
                lastFrameTime: 0,

                // player specific
                facingDirection: 'down',
                movementType: 'idle',
                currentAnimation: 'janitor-idle-down',
            };
            entities.set(id, player);
            return id;
        },
        createPickup(position: Vector2) {
            const id = this.generateId();
            const pickup: PickupEntity = {
                // base
                id,
                type: 'pickup',
                position,
                size: { width: 32, height: 32 },

                // collision component
                collisionBox: { x: position.x, y: position.y, width: 32, height: 32 },
                canCollideWith: ['player'],

                // pickup specific
                pickupType: 'trash',
                collected: false,
                color: '#be0a0a',
            };
            entities.set(id, pickup);
            return id;
        },
    };
}

// import { Entity, EntityManager, EntityType, Vector2, Rectangle, PlayerEntity, NPCEntity, ProjectileEntity, PickupEntity, ObstacleEntity } from '../types';

// export class GameEntityManager implements EntityManager {
//     entities: Map<string, Entity> = new Map();
//     nextId: number = 1;

//     // Entity creation methods
//     createPlayer(position: Vector2, config?: Partial<PlayerEntity>): PlayerEntity {
//         const player: PlayerEntity = {
//             id: this.generateId(),
//             type: 'player',
//             position: { ...position },
//             size: { x: 32, y: 32 },
//             velocity: { x: 0, y: 0 },
//             isActive: true,
//             color: '#4CAF50',
//             collisionBox: { x: position.x, y: position.y, width: 32, height: 32 },
//             canCollideWith: ['obstacle', 'npc', 'pickup'],
//             speed: 200,
//             direction: { x: 0, y: 0 },
//             facingDirection: 'down',
//             isMoving: false,
//             health: 100,
//             maxHealth: 100,
//             currentFrame: 0,
//             animationSpeed: 8,
//             lastFrameTime: 0,
//             ...config
//         };

//         this.entities.set(player.id, player);
//         return player;
//     }

//     createNPC(position: Vector2, config?: Partial<NPCEntity>): NPCEntity {
//         const npc: NPCEntity = {
//             id: this.generateId(),
//             type: 'npc',
//             position: { ...position },
//             size: { x: 32, y: 32 },
//             velocity: { x: 0, y: 0 },
//             isActive: true,
//             color: '#FF9800',
//             collisionBox: { x: position.x, y: position.y, width: 32, height: 32 },
//             canCollideWith: ['obstacle', 'player'],
//             speed: 100,
//             direction: { x: 0, y: 0 },
//             aiState: 'idle',
//             interactionRadius: 50,
//             currentFrame: 0,
//             animationSpeed: 6,
//             lastFrameTime: 0,
//             ...config
//         };

//         this.entities.set(npc.id, npc);
//         return npc;
//     }

//     createProjectile(position: Vector2, direction: Vector2, ownerId: string, config?: Partial<ProjectileEntity>): ProjectileEntity {
//         const projectile: ProjectileEntity = {
//             id: this.generateId(),
//             type: 'projectile',
//             position: { ...position },
//             size: { x: 8, y: 8 },
//             velocity: { x: direction.x, y: direction.y },
//             isActive: true,
//             color: '#F44336',
//             collisionBox: { x: position.x, y: position.y, width: 8, height: 8 },
//             canCollideWith: ['obstacle', 'player', 'npc'],
//             speed: 400,
//             direction: { ...direction },
//             damage: 10,
//             lifespan: 3000, // 3 seconds
//             createdTime: Date.now(),
//             ownerId,
//             ...config
//         };

//         this.entities.set(projectile.id, projectile);
//         return projectile;
//     }

//     createPickup(position: Vector2, pickupType: string, value: number, config?: Partial<PickupEntity>): PickupEntity {
//         const pickup: PickupEntity = {
//             id: this.generateId(),
//             type: 'pickup',
//             position: { ...position },
//             size: { x: 16, y: 16 },
//             velocity: { x: 0, y: 0 },
//             isActive: true,
//             color: '#2196F3',
//             collisionBox: { x: position.x, y: position.y, width: 16, height: 16 },
//             canCollideWith: ['player'],
//             pickupType,
//             value,
//             collected: false,
//             ...config
//         };

//         this.entities.set(pickup.id, pickup);
//         return pickup;
//     }

//     createObstacle(position: Vector2, size: Vector2, config?: Partial<ObstacleEntity>): ObstacleEntity {
//         const obstacle: ObstacleEntity = {
//             id: this.generateId(),
//             type: 'obstacle',
//             position: { ...position },
//             size: { ...size },
//             velocity: { x: 0, y: 0 },
//             isActive: true,
//             color: '#795548',
//             collisionBox: { x: position.x, y: position.y, width: size.x, height: size.y },
//             canCollideWith: ['player', 'npc', 'projectile'],
//             blocking: true,
//             destructible: false,
//             ...config
//         };

//         this.entities.set(obstacle.id, obstacle);
//         return obstacle;
//     }

//     // Entity management methods
//     getEntity(id: string): Entity | undefined {
//         return this.entities.get(id);
//     }

//     getEntitiesByType<T extends Entity>(type: EntityType): T[] {
//         return Array.from(this.entities.values()).filter(entity => entity.type === type) as T[];
//     }

//     getAllEntities(): Entity[] {
//         return Array.from(this.entities.values());
//     }

//     removeEntity(id: string): boolean {
//         return this.entities.delete(id);
//     }

//     clearAll(): void {
//         this.entities.clear();
//         this.nextId = 1;
//     }

//     // Update methods
//     updateEntity(id: string, updates: Partial<Entity>): void {
//         const entity = this.entities.get(id);
//         if (entity) {
//             Object.assign(entity, updates);
//             // Update collision box position
//             if ('collisionBox' in entity) {
//                 entity.collisionBox.x = entity.position.x + (entity.collisionBox.offsetX || 0);
//                 entity.collisionBox.y = entity.position.y + (entity.collisionBox.offsetY || 0);
//             }
//         }
//     }

//     // Collision detection
//     checkCollision(rect1: Rectangle, rect2: Rectangle): boolean {
//         return rect1.x < rect2.x + rect2.width &&
//                rect1.x + rect1.width > rect2.x &&
//                rect1.y < rect2.y + rect2.height &&
//                rect1.y + rect1.height > rect2.y;
//     }

//     getCollisions(entity: Entity): Entity[] {
//         if (!('collisionBox' in entity)) return [];

//         const collisions: Entity[] = [];
//         const entityBox = entity.collisionBox;

//         for (const other of this.entities.values()) {
//             if (other.id === entity.id || !other.isActive) continue;
//             if (!('collisionBox' in other)) continue;
//             if (!entity.canCollideWith.includes(other.type)) continue;

//             if (this.checkCollision(entityBox, other.collisionBox)) {
//                 collisions.push(other);
//             }
//         }

//         return collisions;
//     }

//     // Utility methods
//     private generateId(): string {
//         return `entity_${this.nextId++}`;
//     }

//     // Cleanup expired entities (like projectiles)
//     cleanup(currentTime: number): void {
//         for (const entity of this.entities.values()) {
//             if (entity.type === 'projectile') {
//                 const projectile = entity as ProjectileEntity;
//                 if (currentTime - projectile.createdTime > projectile.lifespan) {
//                     this.removeEntity(entity.id);
//                 }
//             }

//             if (entity.type === 'pickup') {
//                 const pickup = entity as PickupEntity;
//                 if (pickup.collected) {
//                     this.removeEntity(entity.id);
//                 }
//             }
//         }
//     }
// }
