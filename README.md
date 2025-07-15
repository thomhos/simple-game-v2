Todos
* Inject inputSystem because it's a side-effect (later we have audio and network as well)
* Create a loadingSystem for sprites, audio, possible network stuff, while preloading the game
* Create an action queue in the state, so I can just put any action in there and handle them in update
    state = dispatch(state, action) => ({ ...state, pendingActions: [...state.pendingActions, { type: 'ACTION' } ]})
    in update
    for(const action of state.pendingActions) { state = applyAction(action) }
* move spriteConfig and animations to a separate file for ease of use
* refactor sprite rendering
* add NPC
* add dialog
* add flags
* add tilemap
* add camera system
* add collision triggers on map
