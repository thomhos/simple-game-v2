export type GameAction =
    | {
          type: 'MOVE_PLAYER';
          direction: 'up' | 'down' | 'left' | 'right';
      }
    | { type: 'STOP_PLAYER' }
    | { type: 'PAUSE_TOGGLE' };
