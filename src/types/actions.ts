import { SceneNames, InputState, AudioMap, ImagesMap } from '../types';

export type GameAction =
    | { type: 'INCREMENT_GAME_TIME' }
    | { type: 'UPDATE_INPUT'; input: InputState }
    | { type: 'SET_CANVAS_SIZE'; width: number; height: number }
    | { type: 'ASSETS_LOADED'; audio: AudioMap; images: ImagesMap }
    | { type: 'CHANGE_SCENE'; scene: SceneNames }
    | { type: 'THROW_ERROR'; message: string }
    | { type: 'RESOLVE_ERROR' };
