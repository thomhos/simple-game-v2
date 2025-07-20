import { GameAction, Reducer, Store } from '../types';

export function createStore<T, A extends GameAction>(
    initialState: T,
    reducer: Reducer<T, A>
): Store<T, A> {
    let state = initialState;

    return {
        getState(): T {
            return state;
        },
        dispatch(a: A) {
            state = reducer(state, a);
        },
    };
}
