import { DefaultScene } from './default';

interface Stage2SceneState {}

export class Stage2Scene extends DefaultScene<Stage2SceneState> {
    name = 'stage2';

    update() {
        super.update();
        const state = this.store.getState();

        if (state.input.keysPressed.includes('Escape')) {
            this.changeScene('menu');
        }
    }
}
