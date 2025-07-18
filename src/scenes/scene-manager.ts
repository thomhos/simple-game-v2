import { ActionDispatcher } from '../game/action-dispatcher';
import { RenderContext } from '../render/canvas-helpers';
import { GameState, InputState, Scene, SceneNames } from '../types';

// import { DefaultScene } from './default-scene';
import { LoadingScene } from './loading-scene';
import { MenuScene } from './menu-scene';
import { IntroScene } from './intro-scene';

type SceneMap = { [key in SceneNames]: Scene };

export function createSceneManager(dispatch: ActionDispatcher) {
    let currentScene: SceneNames | null = null;
    let sceneInHandled = true;

    const scenes: SceneMap = {
        loading: new LoadingScene(dispatch),
        menu: new MenuScene(dispatch),
        intro: new IntroScene(dispatch),
    };

    return {
        update(state: GameState, input: InputState, fixedTimeStep: number) {
            if (currentScene !== state.currentScene) {
                if (currentScene) {
                    scenes[currentScene]?.onExit?.();
                }
                currentScene = state.currentScene;
                sceneInHandled = false;
            }

            if (currentScene && !sceneInHandled) {
                scenes[currentScene]?.onEnter?.();
                sceneInHandled = true;
            }

            if (currentScene) {
                scenes[currentScene]?.update(state, input, fixedTimeStep);
            }
        },
        render(ctx: RenderContext): RenderContext {
            if (currentScene) {
                scenes[currentScene]?.render(ctx);
            }
            return ctx;
        },
    };
}

// import { Scene, SceneNames } from '../types/scenes';
// import { loadingScene } from './loading-scene';
// import { menuScene } from './menu-scene';

// // Scene registry
// const scenes = new Map<SceneNames, Scene>([
//     ['loading', loadingScene],
//     ['menu', menuScene],
//     // ['playing', playingScene], // Will add when we create it
// ]);

// export class SceneManager {
//     private currentScene: Scene | null = null;

//     // Get scene by name
//     getScene(name: SceneNames): Scene | undefined {
//         return scenes.get(name);
//     }

//     // Switch to a new scene
//     async switchTo(sceneName: SceneNames): Promise<void> {
//         const newScene = this.getScene(sceneName);
//         if (!newScene) {
//             console.warn(`Scene '${sceneName}' not found`);
//             return;
//         }

//         // Exit current scene
//         if (this.currentScene) {
//             await this.currentScene.transitionOut?.();
//             this.currentScene.onExit?.();
//         }

//         // Enter new scene
//         this.currentScene = newScene;
//         this.currentScene.onEnter?.();
//         await this.currentScene.transitionIn?.();
//     }

//     // Get current scene
//     getCurrentScene(): Scene | null {
//         return this.currentScene;
//     }

//     // Render current scene
//     render(ctx: CanvasRenderingContext2D): void {
//         if (this.currentScene) {
//             this.currentScene.render(ctx, this.currentScene.state);
//         }
//     }
// }

// // Global scene manager instance
// export const sceneManager = new SceneManager();
