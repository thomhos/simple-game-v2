import { GameState } from '../types';

import { DefaultScene } from './default';

interface Stage2SceneState {}

export class Stage2Scene extends DefaultScene<Stage2SceneState> {
    name = 'stage2';

    update(state: GameState, fts: number) {
        super.update(state, fts);

        if (state.input.keysPressed.includes('Escape') && this.transitionType === 'none') {
            this.changeScene('menu');
        }
    }
}
