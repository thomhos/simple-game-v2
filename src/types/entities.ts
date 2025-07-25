import { Vector2 } from './map';

export type EntityType = 'player' | 'pickup';

export interface BaseEntity {
    id: string;
    type: EntityType;
    size: {
        width: number;
        height: number;
    };
    position: Vector2;
}

export interface CollisionBox {
    x: number;
    y: number;
    width: number;
    height: number;
    offsetX?: number;
    offsetY?: number;
}

export interface EntityWithCollision extends BaseEntity {
    collisionBox: CollisionBox;
    canCollideWith: EntityType[];
}

// Entity states for different behaviors
export interface MovingEntity extends EntityWithCollision {
    speed: number;
    direction: Vector2;
    velocity: Vector2;
    moveDestination?: Vector2;
}

export interface AnimatedEntity extends BaseEntity {
    lastFrameTime: number;
    currentFrame: number;
    animationSpeed: number;
    spriteSheet: string;
}

// Specific entity types
export type PlayerSkinNames = 'janitor' | 'reception';
export type PlayerMovementTypes = 'idle' | 'walk';
export type PlayerDirections = 'up' | 'down' | 'left' | 'right';
export type PlayerAnimationNames = `${PlayerSkinNames}-${PlayerMovementTypes}-${PlayerDirections}`;

export interface PlayerEntity extends MovingEntity, AnimatedEntity {
    type: 'player';
    movementType: PlayerMovementTypes;
    facingDirection: PlayerDirections;
    currentAnimation: PlayerAnimationNames;
}

export interface PickupEntity extends EntityWithCollision {
    type: 'pickup';
    pickupType: string;
    collected: boolean;
    color: string; // later should be animated or image
}

export type Entity = PlayerEntity | PickupEntity;
