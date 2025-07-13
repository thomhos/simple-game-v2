import { InputState } from './input';

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

export interface PlayerState {
    readonly x: number;
    readonly y: number;
    readonly width: number;
    readonly height: number;
}

export interface GameState {
    readonly gameMode: 'playing' | 'paused' | 'inventory' | 'dialogue';
    readonly map: {
        readonly availableMaps: string[];
        readonly activeMap: string;
    };
    readonly player: PlayerState;
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
