// SPRITES
export interface SpriteState {
    isLoaded: boolean;
    spriteMap: SpriteMap;
    loadedSprites: LoadedSprites;
}

export type SpriteMap = { [Property in SpriteNames]: SpriteConfig };
export type SpriteNames = 'player-idle' | 'player-walk-up' | 'player-walk-down' | 'player-walk-left' | 'player-walk-right';

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
