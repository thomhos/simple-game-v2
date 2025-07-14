export type PlayerDirections = 'up' | 'down' | 'left' | 'right';

export type GameAction =
    | {
          type: 'MOVE_PLAYER';
          direction: PlayerDirections;
      }
    | { type: 'PAUSE_GAME' }
    | { type: 'RESUME_GAME' };
