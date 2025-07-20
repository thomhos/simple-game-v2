import { SceneNames } from './scenes';
import { InputState } from './input';
import { AssetState } from './assets';
import { GameAction } from './actions';

// Simplified global state - only system concerns
export interface GameState {
    gameTime: number;
    fixedTimeStep: number;
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

    availableStages: number;
    completedStages: number;
    currentStage: number;
}

export type GameStore = Store<GameState, GameAction>;
export type GameReducer = Reducer<GameState, GameAction>;
export type GameDispatcher = StoreDispatcher<GameAction>;
export type StoreDispatcher<A> = (action: A) => void;

export type Reducer<T, A extends GameAction> = (state: T, action: A) => T;
export type Store<T, A extends GameAction> = {
    getState(): T;
    dispatch: StoreDispatcher<A>;
};
