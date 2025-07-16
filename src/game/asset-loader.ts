import { GameState, AudioMap, ImagesMap } from '../types';

export interface AssetLoadingResult {
    audio: AudioMap;
    images: ImagesMap;
}

export interface AssetPaths {
    audio: string[];
    images: string[];
}

// Extract all asset paths from the current state
export function extractAssetPaths(state: GameState): AssetPaths {
    const audioPaths: string[] = [];
    const imagePaths: string[] = [];

    // Extract sprite paths and put them in images
    Object.entries(state.assets.sprites).forEach(([_key, sprite]) => {
        if (sprite.path && !imagePaths.includes(sprite.path)) {
            imagePaths.push(sprite.path);
        }
    });

    // TODO: Add audio paths when we have audio assets defined
    // TODO: Add other image paths when we have non-sprite image assets defined

    return {
        audio: audioPaths,
        images: imagePaths,
    };
}

// Load a single audio file
async function loadAudio(path: string): Promise<HTMLAudioElement> {
    return new Promise((resolve, reject) => {
        const audio = new Audio(path);
        audio.addEventListener('canplaythrough', () => resolve(audio));
        audio.addEventListener('error', reject);
        audio.load();
    });
}

// Load a single image file
async function loadImage(path: string): Promise<HTMLImageElement> {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => resolve(img);
        img.onerror = reject;
        img.src = path;
    });
}

// Generic asset loading function
async function loadAssets<T>(
    paths: string[],
    type: 'audio' | 'image',
    onProgress?: () => void
): Promise<T> {
    const assetMap = {} as T;

    const loadPromises = paths.map(async (path) => {
        let asset;

        if (type === 'audio') {
            const audioFile = await loadAudio(path);
            asset = {
                path,
                audioFile,
                duration: audioFile.duration,
            };
        } else {
            const image = await loadImage(path);
            asset = {
                path,
                image,
                width: image.width,
                height: image.height,
            };
        }

        (assetMap as Record<string, typeof asset>)[path] = asset;
        if (onProgress) {
            onProgress();
        }
    });

    await Promise.all(loadPromises);
    return assetMap;
}

// Main asset loading function
export async function loadAllAssets(
    state: GameState,
    onProgress?: (progress: number) => void
): Promise<AssetLoadingResult> {
    const paths = extractAssetPaths(state);
    const totalAssets = paths.audio.length + paths.images.length;
    let totalLoaded = 0;

    const updateProgress = () => {
        totalLoaded++;
        if (onProgress) {
            onProgress(Math.min(totalLoaded / totalAssets, 1)); // Cap at 1.0
        }
    };

    const [audio, images] = await Promise.all([
        loadAssets<AudioMap>(paths.audio, 'audio', updateProgress),
        loadAssets<ImagesMap>(paths.images, 'image', updateProgress),
    ]);

    return {
        audio,
        images,
    };
}
