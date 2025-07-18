import { GameState } from '../types';

import { DefaultScene } from './default';

interface Stage1SceneState {}

export class Stage1Scene extends DefaultScene<Stage1SceneState> {
    name = 'stage1';

    update(state: GameState, fts: number) {
        super.update(state, fts);

        if (state.input.keysPressed.includes('Escape') && this.transitionType === 'none') {
            this.changeScene('menu');
        }
    }
}
