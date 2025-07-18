import { SceneNames } from './scenes';
import { InputState } from './input';
import { AssetState } from './assets';

// Simplified global state - only system concerns
export interface GameState {
    gameTime: number;
    canvas: {
        width: number;
        height: number;
    };
    error?: {
        message: string;
    };

    loading: {
        progress: number;
        isComplete: boolean;
    };

    assets: AssetState;

    input: InputState;

    currentScene: SceneNames;

    transition: {
        isTransitioning: boolean;
        fromScene?: SceneNames;
        toScene?: SceneNames;
        startTime: number;
        duration: number;
    };

    availableStages: number;
    completedStages: number;
    currentStage: number;
}
