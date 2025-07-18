import { StagePlayerState, BasePlayerState } from './player';

// STAGES
export interface StageState {
    stageSelected: StageNames | undefined;
    stagesCompleted: StageNames[];
    stages: Stage[]; // array because order matters
}

export type StageNames = 'janitor' | 'reception';

// maybe a similar pattern as with scenes? maybe one stage state and then some local state?
export interface Stage<TPlayer extends StagePlayerState = StagePlayerState> {
    name: StageNames;
    isRunning: boolean;
    isCompleted: boolean;
    // map: StageMap;
    player: BasePlayerState & TPlayer;
}
