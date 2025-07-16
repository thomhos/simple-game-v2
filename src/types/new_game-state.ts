// GAME
export interface GameState {
    system: SystemState;
    assets: AssetState;
    scenes: SceneState;
    stages: StageState;
}

// SYSTEM
export interface SystemState {
    gameTime: number;
    hasSaveFile: boolean;
    canvas: {
        width: number;
        height: number;
    };
    error?: {
        message: string;
    };
}

// ASSETS
export interface AssetState {
    loadedAudio: loadedAudio;
    isAudioLoaded: boolean;
    audioMap: AudioMap;

    loadedImages: loadedImages;
    isImagesLoaded: boolean;
    imagesMap: ImagesMap;

    loadedSprites: LoadedSprites;
    isSpritesLoaded: boolean;
    spriteMap: SpriteMap;
}

// ASSETS -> AUDIO
export interface loadedAudio {}
export interface AudioMap {}

// ASSETS -> IMAGES
export interface loadedImages {}
export interface ImagesMap {}

// ASSETS -> SPRITES
export type SpriteNames = `${PlayerSkinNames}-${PlayerMovementTypes}-${PlayerDirections}`;
export type SpriteMap = { [Property in SpriteNames]: SpriteConfig };

export interface SpriteConfig {
    readonly path: string;
    readonly frames: SpriteFrame[];
    readonly frameDuration: number;
    readonly loop: boolean;
}

export interface SpriteFrame {
    readonly x: number;
    readonly y: number;
    readonly width: number;
    readonly height: number;
}

export interface SpriteAsset {
    readonly image: HTMLImageElement;
    readonly width: number;
    readonly height: number;
}

export interface LoadedSprites {
    readonly [path: string]: SpriteAsset;
}

export type PlayerSpriteMap = { [Property in PlayerAnimationNames]: SpriteNames };

// SCENES
export type SceneNames = 'loading' | 'menu' | 'intro' | 'stage-select' | 'playing' | 'complete';

export interface SceneState {
    current: SceneNames;
}

// STAGES
export interface StageState {
    availableStages: Stage[];
    stagesCompleted: Stage[];
    stage: Record<StageNames, Stage>;
}

export type StageNames = 'janitor' | 'reception';

export interface Stage {
    isRunning: boolean;
    isCompleted: boolean;
    map: {};
    player: {};
}

// MAP

// PLAYER
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

export interface JanitorStagePlayerState extends StagePlayerState {
    itemsPickedUp: [];
}
