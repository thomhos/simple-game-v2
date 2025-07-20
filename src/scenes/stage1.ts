import { DefaultScene } from './default';

interface Stage1SceneState {}

export class Stage1Scene extends DefaultScene<Stage1SceneState> {
    name = 'stage1';

    update() {
        super.update();
        const state = this.store.getState();

        if (state.input.keysPressed.includes('Escape')) {
            this.changeScene('menu');
        }
    }
}
