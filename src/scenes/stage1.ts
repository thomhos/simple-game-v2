import { GameStore } from '../types';

import { DefaultScene } from './default';

interface Stage1SceneState {}

export class Stage1Scene extends DefaultScene<Stage1SceneState> {
    name = 'stage1';

    update(store: GameStore) {
        super.update(store);
        const state = store.getState();

        if (state.input.keysPressed.includes('Escape') && this.transitionType === 'none') {
            this.changeScene('menu');
        }
    }
}
