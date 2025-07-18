import { StageNames } from './stages';

export type PlayerSkinNames = StageNames;
export type PlayerAnimationNames = `${PlayerMovementTypes}-${PlayerDirections}`;

export type PlayerDirections = 'up' | 'down' | 'left' | 'right';
export type PlayerMovementTypes = 'idle' | 'walk';

export interface BasePlayerState {
    readonly width: number;
    readonly height: number;
    readonly speed: number;
    readonly movementType: PlayerMovementTypes;
    readonly lastMovementTime: number;
    readonly facingDirection: PlayerDirections;
    readonly animationStartTime: number;
    readonly currentAnimation: PlayerAnimationNames;
    readonly currentFrame: number;
}

export interface StagePlayerState {
    readonly x: number;
    readonly y: number;
    readonly skin: PlayerSkinNames;
}
