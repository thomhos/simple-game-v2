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

// Global actions - only for system concerns and scene routing
export type GlobalAction =
    | { type: 'INCREMENT_GAME_TIME' }
    | { type: 'SET_CANVAS_SIZE'; width: number; height: number }
    | { type: 'UPDATE_LOADING_PROGRESS'; progress: number }
    | { type: 'LOADING_COMPLETE' }
    | { type: 'CHANGE_SCENE'; scene: SceneNames }
    | { type: 'START_TRANSITION'; fromScene: SceneNames; toScene: SceneNames; duration?: number }
    | { type: 'FINISH_TRANSITION' }
    | { type: 'THROW_ERROR'; message: string }
    | { type: 'RESOLVE_ERROR' };
