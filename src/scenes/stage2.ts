import { GameStore } from '../types';

import { DefaultScene } from './default';

interface Stage2SceneState {}

export class Stage2Scene extends DefaultScene<Stage2SceneState> {
    name = 'stage2';

    update(store: GameStore) {
        super.update(store);
        const state = store.getState();

        if (state.input.keysPressed.includes('Escape') && this.transitionType === 'none') {
            this.changeScene('menu');
        }
    }
}
