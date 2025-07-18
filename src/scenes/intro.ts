import { GameState } from '../types';

import { DefaultScene } from './default';

interface IntroSceneState {}

export class IntroScene extends DefaultScene<IntroSceneState> {
    name = 'intro';

    update(state: GameState, fts: number) {
        super.update(state, fts);

        if (state.input.keysPressed.includes('1') && this.transitionType === 'none') {
            this.changeScene('menu');
        }
    }
}
