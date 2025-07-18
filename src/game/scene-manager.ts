import { SceneManager, ActionDispatcher, Scene, SceneNames } from '../types';

import { LoadingScene, MenuScene, IntroScene } from '../scenes';

type SceneMap = { [key in SceneNames]: Scene };

export function createSceneManager(dispatch: ActionDispatcher): SceneManager {
    let currentScene: SceneNames | null = null;
    let sceneInHandled = true;

    const scenes: SceneMap = {
        loading: new LoadingScene(dispatch),
        menu: new MenuScene(dispatch),
        intro: new IntroScene(dispatch),
    };

    return {
        update(state, fts) {
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
                scenes[currentScene]?.update(state, fts);
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
