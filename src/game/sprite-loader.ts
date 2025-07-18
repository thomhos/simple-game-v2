// import { SpriteAsset, LoadedSprites, SpriteMap } from '../types';

// export async function loadSpriteAsset(path: string): Promise<SpriteAsset> {
//     return new Promise((resolve, reject) => {
//         const image = new Image();

//         image.onload = () => {
//             resolve({
//                 image,
//                 width: image.naturalWidth,
//                 height: image.naturalHeight,
//             });
//         };

//         image.onerror = () => {
//             reject(new Error(`Failed to load sprite: ${path}`));
//         };

//         image.src = path;
//     });
// }

// export async function loadSpritesFromMap(spriteMap: SpriteMap): Promise<LoadedSprites> {
//     // Extract unique paths from the sprite map
//     const uniquePaths = Array.from(new Set(Object.values(spriteMap).map((config) => config.path)));

//     // Load all unique sprites
//     const loadPromises = uniquePaths.map(async (path) => {
//         const spriteAsset = await loadSpriteAsset(path);
//         return { path, spriteAsset };
//     });

//     const loadedSprites = await Promise.all(loadPromises);

//     // Build the loaded sprites map
//     return loadedSprites.reduce((acc, { path, spriteAsset }) => {
//         return {
//             ...acc,
//             [path]: spriteAsset,
//         };
//     }, {} as LoadedSprites);
// }
