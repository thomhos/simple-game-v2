import { MapConfig, RenderContext } from '../types';

export function drawMap({ ctx }: RenderContext, mapConfig: MapConfig) {
    // Background
    for (let y = 0; y < mapConfig.height; y++) {
        for (let x = 0; x < mapConfig.width; x++) {
            const tile = mapConfig.layers.background[y][x];

            // Just drawing colored boxes for now
            // ctx.strokeStyle = '#ffffff';
            // ctx.lineWidth = 1;
            // ctx.strokeRect(
            //     x * mapConfig.tileWidth,
            //     y * mapConfig.tileHeight,
            //     mapConfig.tileWidth,
            //     mapConfig.tileHeight
            // );
            ctx.fillStyle = tile.color;
            ctx.fillRect(
                x * mapConfig.tileWidth,
                y * mapConfig.tileHeight,
                mapConfig.tileWidth,
                mapConfig.tileHeight
            );
        }
    }
}
