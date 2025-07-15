import { InputState } from './input';
import { SpriteState, SpriteNames } from './sprites';

// GAME
export type GameModes = 'loading' | 'playing' | 'paused' | 'error';

export interface GameState {
    readonly gameMode: GameModes;
    readonly sprites: SpriteState;
    readonly map: {
        readonly availableMaps: string[];
        readonly activeMap: string;
    };
    readonly player: PlayerState;
    readonly error: GameError | null;
}

export interface GameError {
    readonly message: string;
    readonly details?: string;
}

export type UpdateFn = (state: GameState, input: InputState, deltaTime: number) => GameState;
export type RenderFn = (ctx: CanvasRenderingContext2D, state: GameState) => void;

export type GameEvent = 'start' | 'stop' | 'pause' | 'resume' | 'stateChanged';
export type GameEventHandler<T = any> = (data?: T) => void;
export interface GameEventEmitter {
    on: <T>(event: GameEvent, handler: GameEventHandler<T>) => () => void;
    emit: <T>(event: GameEvent, data?: T) => void;
    off: (event: GameEvent, handler: GameEventHandler) => void;
}

// MAP
export interface TileConfig {
    name: string;
    solid: boolean;
    trigger?: boolean;
}

export interface TileSet {
    [key: string]: TileConfig;
}

export type TileLayerData = string[]; // ["####_____####"]

export interface TileLayerConfig {
    background: TileLayerData;
    foreground: TileLayerData;
}

export interface MapConfig {
    name: string;
    width: number;
    height: number;
    tileWidth: number;
    tileHeight: number;
    tileSet: TileConfig;
    layers: TileLayerConfig;
}

export interface MapState {
    availableMaps: string[];
    activeMap: string;
}

// PLAYER
export type PlayerAnimationNames = 'idle' | 'walk-up' | 'walk-down' | 'walk-left' | 'walk-right';

export type PlayerSpriteMap = { [Property in PlayerAnimationNames]: SpriteNames };

export interface PlayerState {
    readonly x: number;
    readonly y: number;
    readonly width: number;
    readonly height: number;
    readonly sprites: PlayerSpriteMap;
    readonly spriteAnimationState: {
        readonly currentAnimation: PlayerAnimationNames;
        readonly animationStartTime: number;
        readonly currentFrame: number;
        readonly frameTimer: number; // maybe same as animationStartTime
    };
}
