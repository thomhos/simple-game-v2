export interface Vector2 {
    x: number;
    y: number;
}

export enum TileCodes {
    empty = '.',
    wall = '#',
}
export type TileType = 'empty' | 'wall';

export interface Tile {
    type: TileType;
    solid: boolean;
    color: string; // Simple color for block rendering
}

export type TileDefinition = {
    [key in TileCodes]: Tile;
};

export type RawTileLayer = string[];
export type TileLayer = Tile[][];

export interface MapConfigJson {
    name: string;
    width: number;
    height: number;
    tileWidth: number;
    tileHeight: number;
    tileDefinitions: TileDefinition;
    playerSpawn: Vector2;
    layers: {
        background: RawTileLayer;
        foreground: RawTileLayer;
    };
}

export interface MapConfig extends Omit<MapConfigJson, 'layers'> {
    layers: {
        background: TileLayer;
        foreground: TileLayer;
    };
}

export interface MapTypes {
    [key: string]: MapConfigJson;
}
