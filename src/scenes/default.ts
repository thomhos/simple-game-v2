import { ActionDispatcher, GameState, SceneNames, Scene, RenderContext } from '../types';

type TransitionType = 'none' | 'in' | 'out';

export class DefaultScene<T> implements Scene {
    name: string | undefined;

    localState: T | undefined = undefined;
    dispatcher: ActionDispatcher;

    nextScene: SceneNames | null = null;

    transitionDuration: number = 500;
    transitionType: TransitionType = 'none';
    transitionStartTime: number = 0;
    transitionProgress: number = 0;
    hasExited: boolean = false;

    constructor(dispatcher: ActionDispatcher) {
        this.dispatcher = dispatcher;
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
            this.dispatcher.dispatch({
                type: 'CHANGE_SCENE',
                scene,
            });
        }
    }

    changeScene(scene: SceneNames, skipAnimation?: boolean) {
        if (skipAnimation) {
            this.dispatcher.dispatch({
                type: 'CHANGE_SCENE',
                scene,
            });
        } else {
            this.nextScene = scene;
            this.startTransition('out');
        }
    }

    update(state: GameState, _fixedTimeStep: number) {
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
