import { GameState } from '../types';

export function createInitialState(): GameState {
    return {
        map: {
            availableMaps: [],
            activeMap: '',
        },
        player: {
            x: 400,
            y: 300,
            width: 32,
            height: 32,
        },
    };
}
