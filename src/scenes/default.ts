import { ActionDispatcher, GameState, SceneNames, Scene, RenderContext } from '../types';

type TransitionType = 'none' | 'in' | 'out';

export class DefaultScene<T> implements Scene {
    name: string | undefined;

    localState: T | undefined = undefined;
    dispatcher: ActionDispatcher;

    nextScene: SceneNames | null = null;

    transitionDuration: number = 1500;
    transitionType: TransitionType = 'none';
    transitionStartTime: number = 0;
    transitionProgress: number = 0;

    constructor(dispatcher: ActionDispatcher) {
        this.dispatcher = dispatcher;
    }

    resetTransition() {
        this.transitionType = 'none';
        this.transitionProgress = 0;
        this.transitionStartTime = 0;
    }

    startTransition(type: TransitionType) {
        this.resetTransition();
        this.transitionType = type;
        this.transitionStartTime = performance.now();
    }

    updateTransition(gameTime: number) {
        const endTime = this.transitionStartTime + this.transitionDuration;
        const progress = gameTime / endTime;
        this.transitionProgress = progress;

        if (this.transitionProgress >= 1) {
            if (this.transitionType === 'in') {
                this.onEnterComplete();
            }
            if (this.transitionType === 'out') {
                this.onExitComplete();
            }
            this.resetTransition();
        }
    }

    onEnter() {
        this.resetTransition();
        if (this.transitionType === 'none') {
            this.startTransition('in');
        }
    }

    onEnterComplete() {
        console.log('welcome to: ', this.name);
    }

    onExit() {
        if (this.transitionType === 'none') {
            this.startTransition('out');
        }
    }

    onExitComplete() {
        console.log('5');
        if (this.nextScene) {
            const scene = this.nextScene;
            this.nextScene = null;
            this.dispatcher.dispatch({
                type: 'CHANGE_SCENE',
                scene,
            });
            // this.nextScene = null;
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
        if (this.transitionType === 'in' || this.transitionType === 'out') {
            this.updateTransition(state.gameTime);
        }
    }

    render(_ctx: RenderContext) {}
}
