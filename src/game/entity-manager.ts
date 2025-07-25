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
                collisionBox: {
                    x: position.x,
                    y: position.y,
                    width: 16,
                    height: 32,
                },
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
                position: { x: position.x + 8, y: position.y + 8 },
                size: { width: 16, height: 16 },

                // collision component
                collisionBox: {
                    x: position.x,
                    y: position.y,
                    width: 16,
                    height: 16,
                    offsetX: 8,
                    offsetY: 8,
                },
                canCollideWith: ['player'],

                // pickup specific
                pickupType: 'trash',
                collected: false,
                color: '#be0a0a',
            };
            entities.set(id, pickup);
            return id;
        },
        getCollisions(entity: Entity): Entity[] {
            if (!('collisionBox' in entity)) return [];

            const collisions: Entity[] = [];
            const entityBox = entity.collisionBox;

            for (const other of entities.values()) {
                if (other.id === entity.id) continue; // skip if itself
                if (!('collisionBox' in other)) continue; // skip if entity has no collisions
                if (!entity.canCollideWith.includes(other.type)) continue; // skip is cannot collide with current entity

                // check collisionbox sides
                const collisionBoxRight =
                    other.collisionBox.x +
                    (other.collisionBox.offsetX || 0) +
                    other.collisionBox.width;
                const collisionBoxLeft = other.collisionBox.x + (other.collisionBox.offsetX || 0);
                const collisionBoxBottom =
                    other.collisionBox.y +
                    (other.collisionBox.offsetY || 0) +
                    other.collisionBox.height;
                const collisionBoxTop = other.collisionBox.y + (other.collisionBox.offsetY || 0);

                const hasCollision =
                    entityBox.x < collisionBoxRight &&
                    entityBox.x + entityBox.width > collisionBoxLeft &&
                    entityBox.y < collisionBoxBottom &&
                    entityBox.y + entityBox.height > collisionBoxTop;

                if (hasCollision) {
                    collisions.push(other);
                }
            }

            return collisions;
        },
    };
}
