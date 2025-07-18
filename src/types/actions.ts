import { SceneNames, StageNames, AudioMap, ImagesMap } from './game-state';

type SystemAction =
    | {
          type: 'INCREMENT_GAME_TIME';
      }
    | {
          type: 'UPDATE_LOADING_PROGRESS';
          progress: number;
      }
    | {
          type: 'ASSETS_LOADED';
          audio: AudioMap;
          images: ImagesMap;
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
          skipOutAnimation?: boolean;
          skipInAnimation?: boolean;
      }
    | {
          type: 'START_SCENE_TRANSITION_OUT';
      }
    | {
          type: 'FINISH_SCENE_TRANSITION_OUT';
      }
    | {
          type: 'START_SCENE_TRANSITION_IN';
      }
    | {
          type: 'FINISH_SCENE_TRANSITION_IN';
      }
    | {
          type: 'MENU_NAVIGATE_UP';
      }
    | {
          type: 'MENU_NAVIGATE_DOWN';
      }
    | {
          type: 'MENU_SELECT';
      }
    | {
          type: 'MENU_FLASH_START';
      }
    | {
          type: 'MENU_FLASH_END';
      };
// type PlayerAction =
//     | {
//           type: 'MOVE_PLAYER';
//           direction: PlayerDirections;
//       }
//     | { type: 'STOP_PLAYER' };

export type GameAction = SystemAction | SceneAction;
