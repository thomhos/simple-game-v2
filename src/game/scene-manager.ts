import { SceneManager, Scene, SceneNames, GameStore } from '../types';

import { LoadingScene, MenuScene, JanitorScene, StageSelectScene, Stage2Scene } from '../scenes';

type SceneMap = { [key in SceneNames]: Scene };

export function createSceneManager(store: GameStore): SceneManager {
    let currentScene: SceneNames | null = null;
    let sceneInHandled = true;

    const scenes: SceneMap = {
        loading: new LoadingScene(store),
        menu: new MenuScene(store),
        'stage-select': new StageSelectScene(store),
        janitor: new JanitorScene(store),
        reception: new Stage2Scene(store),
    };

    return {
        update() {
            const state = store.getState();
            if (currentScene !== state.currentScene) {
                if (currentScene) {
                    scenes[currentScene]?.onExit();
                }
                currentScene = state.currentScene;
                sceneInHandled = false;
            }

            if (currentScene && !sceneInHandled) {
                scenes[currentScene]?.onEnter();
                sceneInHandled = true;
            }

            if (currentScene) {
                scenes[currentScene]?.update(store);
            }
        },
        render(ctx) {
            if (currentScene) {
                scenes[currentScene]?.render(ctx);
            }
            return ctx;
        },
    };
}
