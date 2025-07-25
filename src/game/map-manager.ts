import { MapConfigJson, MapConfig, MapTypes, Vector2, Tile, TileCodes } from '../types';

import JanitorMap from '../assets/map.json';

// List all the maps we have
const mapTypes: MapTypes = {
    janitor: JanitorMap as MapConfigJson,
};

// Process the layer strings into Tiles
const processMapJson = (mapJson: MapConfigJson): MapConfig => {
    const getTile = (r: string): Tile[] => {
        const tileCodes = r.split('');
        return tileCodes.map((c) => mapJson.tileDefinitions[c as TileCodes]);
    };
    const background = mapJson.layers.background.map(getTile);
    const foreground = mapJson.layers.foreground.map(getTile);
    return {
        ...mapJson,
        layers: {
            background,
            foreground,
        },
    };
};

export function createMapManager(mapType: keyof typeof mapTypes = 'janitor') {
    const mapConfig = processMapJson(mapTypes[mapType]);

    return {
        getMapConfig(): MapConfig {
            return mapConfig;
        },
        worldToTile(vector: Vector2): Vector2 {
            return {
                x: Math.floor(vector.x / mapConfig.tileWidth),
                y: Math.floor(vector.y / mapConfig.tileHeight),
            };
        },
        tileToWorld(vector: Vector2): Vector2 {
            return {
                x: vector.x * mapConfig.tileWidth,
                y: vector.y * mapConfig.tileHeight,
            };
        },
        getTile(vector: Vector2): Tile | null {
            if (
                vector.x < 0 ||
                vector.x >= mapConfig.width ||
                vector.y < 0 ||
                vector.y >= mapConfig.height
            ) {
                return null;
            }
            return mapConfig.layers.background[vector.y][vector.x];
        },
        isPositionSolid(worldPos: Vector2): boolean {
            const tilePos = this.worldToTile(worldPos);
            const tile = this.getTile(tilePos);
            return tile ? tile.solid : true; // if there is no tile, treat it as solid
        },
    };
}

// export class GameMapSystem implements MapSystem, MapHelpers {
//     mapData: MapData;
//     tileDefinitions: TileDefinition;

//     constructor(mapData: MapData, customTiles?: Partial<TileDefinition>) {
//         this.mapData = mapData;
//         this.tileDefinitions = { ...DEFAULT_TILES, ...customTiles };
//     }

//     // Map helper methods
//     getTileAt(x: number, y: number): TileType {
//         if (x < 0 || x >= this.mapData.width || y < 0 || y >= this.mapData.height) {
//             return 'wall'; // Treat out-of-bounds as walls
//         }
//         return this.mapData.tiles[y][x];
//     }

//     getTileDefinition(tileType: TileType): Tile {
//         const tileDef = this.tileDefinitions[tileType as keyof TileDefinition];
//         return tileDef || this.tileDefinitions.empty;
//     }

//     worldToTile(worldPos: Vector2): Vector2 {
//         return {
//             x: Math.floor(worldPos.x / this.mapData.tileSize),
//             y: Math.floor(worldPos.y / this.mapData.tileSize),
//         };
//     }

//     tileToWorld(tilePos: Vector2): Vector2 {
//         return {
//             x: tilePos.x * this.mapData.tileSize,
//             y: tilePos.y * this.mapData.tileSize,
//         };
//     }

//     isPositionSolid(worldPos: Vector2): boolean {
//         const tilePos = this.worldToTile(worldPos);
//         const tileType = this.getTileAt(tilePos.x, tilePos.y);
//         const tileDef = this.getTileDefinition(tileType);
//         return tileDef.solid;
//     }

//     getRectangleCollisions(rect: Rectangle): Vector2[] {
//         const collisions: Vector2[] = [];

//         // Check all corners and edges of the rectangle
//         const checkPoints = [
//             { x: rect.x, y: rect.y }, // Top-left
//             { x: rect.x + rect.width - 1, y: rect.y }, // Top-right
//             { x: rect.x, y: rect.y + rect.height - 1 }, // Bottom-left
//             { x: rect.x + rect.width - 1, y: rect.y + rect.height - 1 }, // Bottom-right
//             { x: rect.x + rect.width / 2, y: rect.y }, // Top-center
//             { x: rect.x + rect.width / 2, y: rect.y + rect.height - 1 }, // Bottom-center
//             { x: rect.x, y: rect.y + rect.height / 2 }, // Left-center
//             { x: rect.x + rect.width - 1, y: rect.y + rect.height / 2 }, // Right-center
//         ];

//         for (const point of checkPoints) {
//             if (this.isPositionSolid(point)) {
//                 const tilePos = this.worldToTile(point);
//                 // Only add unique tile positions
//                 if (!collisions.some((c) => c.x === tilePos.x && c.y === tilePos.y)) {
//                     collisions.push(tilePos);
//                 }
//             }
//         }

//         return collisions;
//     }

//     // Additional utility methods
//     isRectangleBlocked(rect: Rectangle): boolean {
//         return this.getRectangleCollisions(rect).length > 0;
//     }

//     getValidMovePosition(currentPos: Vector2, targetPos: Vector2, entitySize: Vector2): Vector2 {
//         const rect: Rectangle = {
//             x: targetPos.x,
//             y: targetPos.y,
//             width: entitySize.x,
//             height: entitySize.y,
//         };

//         if (!this.isRectangleBlocked(rect)) {
//             return targetPos;
//         }

//         // Try horizontal movement only
//         const horizontalRect: Rectangle = {
//             x: targetPos.x,
//             y: currentPos.y,
//             width: entitySize.x,
//             height: entitySize.y,
//         };

//         if (!this.isRectangleBlocked(horizontalRect)) {
//             return { x: targetPos.x, y: currentPos.y };
//         }

//         // Try vertical movement only
//         const verticalRect: Rectangle = {
//             x: currentPos.x,
//             y: targetPos.y,
//             width: entitySize.x,
//             height: entitySize.y,
//         };

//         if (!this.isRectangleBlocked(verticalRect)) {
//             return { x: currentPos.x, y: targetPos.y };
//         }

//         // No valid movement
//         return currentPos;
//     }

//     // Map creation helpers
//     static createEmptyMap(width: number, height: number, tileSize: number = 32): MapData {
//         const tiles: TileType[][] = [];
//         for (let y = 0; y < height; y++) {
//             tiles[y] = [];
//             for (let x = 0; x < width; x++) {
//                 if (x === 0 || x === width - 1 || y === 0 || y === height - 1) {
//                     tiles[y][x] = 'wall';
//                 } else {
//                     tiles[y][x] = 'floor';
//                 }
//             }
//         }

//         return {
//             width,
//             height,
//             tileSize,
//             tiles,
//             playerSpawn: { x: tileSize * 2, y: tileSize * 2 },
//         };
//     }

//     static createTestMap(): MapData {
//         const width = 25;
//         const height = 20;
//         const tileSize = 32;

//         const tiles: TileType[][] = [];

//         // Create basic room with walls around the edges
//         for (let y = 0; y < height; y++) {
//             tiles[y] = [];
//             for (let x = 0; x < width; x++) {
//                 if (x === 0 || x === width - 1 || y === 0 || y === height - 1) {
//                     tiles[y][x] = 'wall';
//                 } else if (x === 10 && y > 5 && y < 10) {
//                     tiles[y][x] = 'wall'; // Central wall
//                 } else if ((x === 5 || x === 15) && y === 7) {
//                     tiles[y][x] = 'pickup'; // Some pickups
//                 } else {
//                     tiles[y][x] = 'floor';
//                 }
//             }
//         }

//         // Add goal at the end
//         tiles[height - 2][width - 2] = 'goal';

//         return {
//             width,
//             height,
//             tileSize,
//             tiles,
//             playerSpawn: { x: tileSize * 2, y: tileSize * 2 },
//         };
//     }
// }
