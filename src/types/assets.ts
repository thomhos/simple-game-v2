import { PlayerSkinNames, PlayerMovementTypes, PlayerDirections } from './entities';

export interface AssetState {
    audio: AudioMap;
    images: ImagesMap;
    sprites: SpriteMap;
    isAudioLoaded: boolean;
    isImagesLoaded: boolean;
}

// ASSETS -> AUDIO
export type AudioMap = { [key: string]: Audio };
export interface Audio {
    readonly path: string; // used to look up in the map
    readonly audioFile: HTMLAudioElement;
    readonly duration: number;
}

// ASSETS -> IMAGES
export type ImagesMap = { [key: string]: Image };
export interface Image {
    readonly path: string; // used to look up in the map
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
    readonly path: string; // used to look up in the image map
    // readonly width: number;
    // readonly height: number;
    readonly frames: SpriteFrame[];
    readonly frameDuration: number;
    readonly loop: boolean;
}
