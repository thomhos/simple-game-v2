import { GameStore, GameDispatcher, SceneNames, Scene, RenderContext } from '../types';

type TransitionType = 'none' | 'in' | 'out';

export class DefaultScene<T> implements Scene {
    name: string | undefined;

    dispatch: GameDispatcher;
    localState: T | undefined = undefined;

    nextScene: SceneNames | null = null;

    transitionDuration: number = 500;
    transitionType: TransitionType = 'none';
    transitionStartTime: number = 0;
    transitionProgress: number = 0;
    hasExited: boolean = false;

    constructor(store: GameStore) {
        this.dispatch = store.dispatch;
    }

    resetTransition() {
        this.transitionType = 'none';
        this.transitionProgress = 0;
        this.transitionStartTime = 0;
        this.hasExited = false;
    }

    startTransition(type: TransitionType) {
        this.resetTransition();
        this.transitionType = type;
    }

    updateTransition(gameTime: number) {
        const elapsed = gameTime - this.transitionStartTime;
        const progress = Math.min(elapsed / this.transitionDuration, 1);
        this.transitionProgress = progress;

        if (this.transitionProgress >= 1) {
            if (this.transitionType === 'in') {
                this.onEnterComplete();
                this.resetTransition(); // Only reset after enter completes
            }
            if (this.transitionType === 'out') {
                this.hasExited = true;
                this.onExitComplete();
                // Don't reset transition - let the new scene reset it in onEnter()
            }
        }
    }

    onEnter() {
        this.resetTransition();
        if (this.transitionType === 'none') {
            this.startTransition('in');
        }
    }

    onEnterComplete() {}

    onExit() {
        if (this.transitionType === 'none') {
            this.startTransition('out');
        }
    }

    onExitComplete() {
        if (this.nextScene) {
            const scene = this.nextScene;
            this.nextScene = null;
            this.dispatch({
                type: 'CHANGE_SCENE',
                scene,
            });
        }
    }

    changeScene(scene: SceneNames, skipAnimation?: boolean) {
        if (skipAnimation) {
            this.dispatch({
                type: 'CHANGE_SCENE',
                scene,
            });
        } else {
            this.nextScene = scene;
            this.startTransition('out');
        }
    }

    update(store: GameStore) {
        const state = store.getState();
        // Initialize transition start time with current gameTime if not set
        if (this.transitionType === 'in' || this.transitionType === 'out') {
            if (this.transitionStartTime === 0) {
                this.transitionStartTime = state.gameTime;
            }
            this.updateTransition(state.gameTime);
        }
    }

    render(_ctx: RenderContext) {
        // Don't render anything if scene has exited
        if (this.hasExited) {
            return;
        }
    }
}
