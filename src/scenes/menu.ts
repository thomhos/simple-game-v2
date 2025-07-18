import { GameState } from '../types';

import { DefaultScene } from './default';

interface MenuSceneState {}

export class MenuScene extends DefaultScene<MenuSceneState> {
    name = 'menu';

    update(state: GameState, fts: number) {
        super.update(state, fts);

        if (state.input.keysPressed.includes('2') && this.transitionType === 'none') {
            this.changeScene('intro');
        }
    }
}

