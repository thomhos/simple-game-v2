import { LoadedSprites } from './sprites';
import { PlayerDirections } from './game';

export type GameAction =
    | {
          type: 'MOVE_PLAYER';
          direction: PlayerDirections;
      }
    | { type: 'STOP_PLAYER' }
    | { type: 'PAUSE_GAME' }
    | { type: 'START_LOADING' }
    | { type: 'START_GAME' }
    | {
          type: 'SPRITES_LOADED';
          loadedSprites: LoadedSprites;
      }
    | {
          type: 'THROW_ERROR';
          message: string;
          details?: string;
      }
    | { type: 'RESOLVE_ERROR' }
    | {
          type: 'SET_CANVAS_SIZE';
          width: number;
          height: number;
      };
