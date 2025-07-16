import { SceneNames, StageNames } from './game-state';

type SystemAction =
    | {
          type: 'INCREMENT_GAME_TIME';
      }
    | {
          type: 'ASSETS_LOADED';
          audio: HTMLAudioElement[];
          images: HTMLImageElement[];
          sprites: HTMLImageElement[];
      }
    | {
          type: 'SELECT_STAGE';
          stage: StageNames;
      }
    | {
          type: 'THROW_ERROR';
          message: string;
      }
    | { type: 'RESOLVE_ERROR' }
    | {
          type: 'SET_CANVAS_SIZE';
          width: number;
          height: number;
      };

type SceneAction =
    | {
          type: 'CHANGE_SCENE';
          scene: SceneNames;
      }
    | {
          type: 'START_SCENE_TRANSITION_OUT';
          targetScene: SceneNames;
      }
    | {
          type: 'FINISH_SCENE_TRANSITION_OUT';
      }
    | {
          type: 'START_SCENE_TRANSITION_IN';
      }
    | {
          type: 'FINISH_SCENE_TRANSITION_IN';
      };
// type PlayerAction =
//     | {
//           type: 'MOVE_PLAYER';
//           direction: PlayerDirections;
//       }
//     | { type: 'STOP_PLAYER' };

export type GameAction = SystemAction | SceneAction;
