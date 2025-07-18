import { GameAction, ActionDispatcher } from '../../types';

export function createActionDispatcher(): ActionDispatcher {
    const actionQueue: GameAction[] = [];

    return {
        dispatch: (action: GameAction, delay: number = 0): void => {
            if (delay > 0) {
                setTimeout(() => actionQueue.push(action), delay);
            } else {
                actionQueue.push(action);
            }
        },
        getQueuedActions: (): GameAction[] => {
            const actions = [...actionQueue];
            actionQueue.length = 0;
            return actions;
        },
    };
}
