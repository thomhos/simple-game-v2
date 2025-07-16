/*
 *  Game                - Is the full state
 *      System          - Holds all the state related to the Game Application, so it can run well
 *      Assets          - Hold all the assets and whether they are loaded
 *      Scenes          - Are all the specific screens
 *          Local       - Local screen state holds state that is only specific to that screen
 *      Stages          - State for each stage, is separate because Intro, StageSelect, Playing and Complete scenes need to access it
 *          Shared      - There is some shared state across stages, such as which one is active and completed.
 *          Each stage  - Each stage then has it's own local state for stage specific state
 *              Player  - Player state for this stage, inherits from a base player interface, but is managed per stage
 *              Map     - Map for this stage, inherits from a base map interface, but is managed per stage
 */

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
    isMuted: boolean;
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
    audio: AudioMap;
    isAudioLoaded: boolean;

    images: ImagesMap;
    isImagesLoaded: boolean;

    sprites: SpriteMap;
    isSpritesLoaded: boolean;
}

// ASSETS -> AUDIO
export type AudioMap = { [key: string]: Audio };
export interface Audio {
    readonly path: string;
    readonly audioFile: HTMLAudioElement;
    readonly duration: number;
}

// ASSETS -> IMAGES
export type ImagesMap = { [key: string]: Image };
export interface Image {
    readonly path: string;
    readonly image: HTMLImageElement;
    readonly width: number;
    readonly height: number;
}

// ASSETS -> SPRITES
export type SpriteNames = `${PlayerSkinNames}-${PlayerMovementTypes}-${PlayerDirections}`;
export type SpriteMap = { [Property in SpriteNames]: Sprite };

export interface SpriteFrame {
    readonly x: number;
    readonly y: number;
    readonly width: number;
    readonly height: number;
}

export interface Sprite {
    readonly path: string;
    readonly image: HTMLImageElement;
    readonly width: number;
    readonly height: number;
    readonly frames: SpriteFrame[];
    readonly frameDuration: number;
    readonly loop: boolean;
}

// SCENES
export type SceneNames = 'loading' | 'menu' | 'intro' | 'stage-select' | 'playing' | 'complete';

export interface SceneState {
    currentScene: SceneNames;
    nextScene: SceneNames;
    localState: LocalSceneState;

    isTransitioningIn: boolean;
    isTransitioningOut: boolean;
    transitionStartTime: number;
    transitionProgress: number;
}

export type LocalSceneState =
    | LoadingSceneState
    | MenuSceneState
    | IntroSceneState
    | StageSelectSceneState
    | PlayingSceneState
    | CompleteSceneState;

export interface LoadingSceneState {
    loadingStartTime: number;
    loadingProgress: number;
}

export interface MenuSceneState {
    menuItems: ['start', 'continue'];
    highlightedMenuItem: number;
}

export interface IntroSceneState {
    animationStartTime: number;
    animationProgress: number;
}

export interface StageSelectSceneState {
    highlightedStage: StageNames;
}

export interface PlayingSceneState {}

export interface CompleteSceneState {}

// STAGES
export interface StageState {
    stageSelected: StageNames | null;
    stagesCompleted: StageNames[];
    stages: Stage[]; // array because order matters
}

export type StageNames = 'janitor' | 'reception';

// maybe a similar pattern as with scenes? maybe one stage state and then some local state?
export interface Stage<TPlayer extends StagePlayerState = StagePlayerState> {
    name: StageNames;
    isRunning: boolean;
    isCompleted: boolean;
    map: StageMap;
    player: BasePlayerState & TPlayer;
}

// MAP
export interface StageMap {}

// STAGE 1
export interface JanitorStagePlayerState extends StagePlayerState {
    itemsToPickUp: [];
    itemsPickedUp: [];
}

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
