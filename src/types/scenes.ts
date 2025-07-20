import { RenderContext } from './render';
import { GameStore } from './game';

export interface SceneManager {
    update(): void;
    render(ctx: RenderContext): RenderContext;
}

// Base scene interface that all scenes implement
export interface Scene {
    // Core lifecycle methods
    update(store: GameStore): void;
    render(ctx: RenderContext): void;

    // Scene lifecycle hooks
    onEnter(): void;
    onExit(): void;
}

// Simplified scene names for routing
export type SceneNames = 'loading' | 'menu' | 'intro' | 'stage-select' | StageNames;
export type StageNames = 'janitor' | 'reception';

// Menu scene specific state
export interface MenuSceneState {
    highlightedMenuItem: number;
    menuItems: ['start', 'continue'];
    isFlashing: boolean;
    flashStartTime: number;
}

// Loading scene specific state
export interface LoadingSceneState {
    progress: number;
    startTime: number;
}

// Playing scene state (manages which stage is active)
export interface PlayingSceneState {
    currentStage: StageNames | null;
    stagesCompleted: StageNames[];
}

// Example stage states
export interface JanitorStageState {
    player: {
        x: number;
        y: number;
        facing: 'up' | 'down' | 'left' | 'right';
        isMoving: boolean;
    };
    itemsToPickUp: Array<{ id: string; x: number; y: number }>;
    itemsPickedUp: string[];
    timeRemaining: number;
}

export interface ReceptionStageState {
    player: {
        x: number;
        y: number;
    };
    customers: Array<{ id: string; patience: number; request: string }>;
    completedTasks: number;
}
