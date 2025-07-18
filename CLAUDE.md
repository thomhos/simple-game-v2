# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

- **Development server**: `npm run dev` (starts Vite dev server on port 3000)
- **Build for production**: `npm run build` (outputs to `dist/` directory)  
- **Preview production build**: `npm run preview`
- **Format code**: `npm run format` (formats code with Prettier)
- **Check formatting**: `npm run format:check` (checks if code is properly formatted)

## Architecture Overview

This is a TypeScript 2D game built with a **scene-based architecture** featuring simplified global state management, modular scene components, and action dispatcher pattern for clean separation of concerns.

### Scene-Based Architecture

The game uses a **scene-based architecture** where global state only handles system concerns:

- **Global State**: Simplified to handle only loading, input, canvas, assets, error states, and scene transitions
- **Scene Management**: Each scene manages its own local state and renders independently
- **Action Dispatcher**: Centralized system for scenes to communicate with global state
- **Lifecycle Management**: Proper scene onEnter/onExit handling with transition support

### Core Components

- **Entry point** (`src/main.ts`): Initializes the game system, creates canvas, input system, and starts the game loop
- **HTML template** (`src/index.html`): Base HTML structure for the game canvas
- **Game engine** (`src/game/create-game.ts`): Manages the core game loop with scene manager integration
- **Scene manager** (`src/game/scene-manager.ts`): Handles scene lifecycle, transitions, and routing
- **Action dispatcher** (`src/game/action-dispatcher.ts`): Provides scenes with ability to dispatch global actions

### Global State Management

The global state is **simplified and immutable**, focusing only on system concerns:

```typescript
interface GameState {
    gameTime: number;
    canvas: { width: number; height: number };
    error?: { message: string };
    loading: { progress: number; isComplete: boolean };
    assets: AssetState;
    input: InputState;
    currentScene: SceneNames;
    transition: { isTransitioning: boolean; fromScene?: SceneNames; toScene?: SceneNames; startTime: number; duration: number };
    availableStages: number;
    completedStages: number;
    currentStage: number;
}
```

### Scene System Architecture

#### Scene Interface and Base Classes
- **Scene Interface** (`src/types/scenes.ts`): Defines core scene lifecycle methods (update, render, onEnter, onExit)
- **DefaultScene** (`src/scenes/default.ts`): Base class providing transition management and action dispatcher integration
- **Scene Manager** (`src/game/scene-manager.ts`): Manages scene instances, lifecycle, and routing

#### Scene Types
- **Loading Scene** (`src/scenes/loading.ts`): Handles asset loading and progress display
- **Menu Scene** (`src/scenes/menu.ts`): Main menu with navigation and selection
- **Intro Scene** (`src/scenes/intro.ts`): Game introduction and story
- **Stage Scenes**: Individual mini-games/stages with their own gameplay logic

#### Scene State Management
Each scene manages its own local state independently:
```typescript
// Example scene-specific states
interface MenuSceneState {
    highlightedMenuItem: number;
    menuItems: ['start', 'continue'];
    isFlashing: boolean;
    flashStartTime: number;
}

interface JanitorStageState {
    player: { x: number; y: number; facing: string; isMoving: boolean };
    itemsToPickUp: Array<{ id: string; x: number; y: number }>;
    itemsPickedUp: string[];
    timeRemaining: number;
}
```

### Action Dispatcher Pattern

The action dispatcher provides clean communication between scenes and global state:

```typescript
interface ActionDispatcher {
    dispatch(action: GameAction): void;
    dispatch(action: GameAction, delay?: number): void;
    getQueuedActions(): GameAction[];
}
```

**Global Actions**:
- `INCREMENT_GAME_TIME`: Update global game timer
- `UPDATE_INPUT`: Update input state
- `SET_CANVAS_SIZE`: Handle canvas resizing
- `ASSETS_LOADED`: Notify when assets are loaded
- `CHANGE_SCENE`: Request scene transition
- `THROW_ERROR`/`RESOLVE_ERROR`: Error state management

### Key System Components

- **Canvas system** (`src/canvas.ts`): Canvas creation and context management with dynamic resizing support
- **Input system** (`src/input.ts`): Consolidated keyboard input handling with immutable state
- **Actions system** (`src/actions/`): Simplified action processing
  - `from-input.ts`: Maps input state to global actions
  - `from-state.ts`: Derives actions from current state (e.g., increment game time)
  - `system-actions.ts`: System-level action handlers
- **Game system** (`src/game/`): Core engine components
  - `create-game.ts`: Game loop with scene manager integration
  - `create-initial-state.ts`: Factory for initial global state
  - `scene-manager.ts`: Scene lifecycle and routing management
  - `action-dispatcher.ts`: Central action dispatch system
  - `asset-loader.ts`: Asset loading and management
  - `event-emitter.ts`: Event system for game lifecycle events
- **Rendering system** (`src/render/`): Modular functional rendering
  - `canvas-helpers.ts`: RenderContext pattern and base rendering functions
  - `overlays.ts`: System overlays (loading, error, debug)
  - Additional render modules as needed by scenes
- **Utilities** (`src/utils/functions.ts`): Comprehensive functional programming toolkit

### Scene Transition System

Scenes support smooth transitions with animation capabilities:
- **Transition Types**: 'in', 'out', 'none'
- **Transition Duration**: Configurable per scene (default 1500ms)
- **Lifecycle Hooks**: onEnter, onEnterComplete, onExit, onExitComplete
- **Animation Integration**: Scenes can implement custom transition animations

### Current Game Features

- **Scene-Based Navigation**: Loading, menu, intro, and stage scenes
- **Simplified State Management**: Global state focuses only on system concerns
- **Scene Autonomy**: Each scene manages its own local state and rendering
- **Clean Communication**: Action dispatcher pattern for scene-to-global communication
- **Transition Support**: Built-in scene transition system with animation capabilities
- **Asset Management**: Centralized loading with progress tracking
- **Error Handling**: Robust error recovery with user-friendly error screens
- **Input System**: Consolidated keyboard input handling
- **Canvas Management**: Dynamic resizing and context management
- **Debug Support**: Debug overlays and development tools

### Functional Programming Integration

While the architecture has moved to scene-based components, functional programming patterns are still used:

#### Core Functional Utilities (`src/utils/functions.ts`)
- **`pipe`**: Function composition for chaining transformations
- **`when`/`unless`**: Conditional function application
- **`branch`**: Conditional branching with true/false paths
- **`filter`**: Predicate-based function application
- **`tap`**: Side effects without changing values (debugging)
- **`attempt`**: Try-catch wrapper with fallback
- **`memoize`**: Result caching for performance

#### Rendering Pattern (`RenderContext`)
```typescript
interface RenderContext {
    readonly ctx: CanvasRenderingContext2D;
    readonly state: GameState;
}
```

### Project Structure

```
src/
├── index.html           # HTML template for the game
├── main.ts              # Entry point with game initialization
├── canvas.ts            # Canvas utilities and context management
├── input.ts             # Consolidated input system with immutable state
├── actions/
│   ├── from-input.ts    # Maps input to global actions
│   ├── from-state.ts    # Derives actions from state
│   ├── system-actions.ts # System-level action handlers
│   └── index.ts         # Actions exports
├── game/
│   ├── action-dispatcher.ts # Action dispatcher implementation
│   ├── asset-loader.ts      # Asset loading and management
│   ├── create-game.ts       # Game engine with scene manager integration
│   ├── create-initial-state.ts # Initial state factory
│   ├── event-emitter.ts     # Event system implementation
│   ├── scene-manager.ts     # Scene lifecycle and routing
│   └── index.ts             # Game exports
├── scenes/
│   ├── default.ts       # Base scene class with transitions
│   ├── loading.ts       # Loading scene
│   ├── menu.ts          # Menu scene
│   ├── intro.ts         # Intro scene
│   └── index.ts         # Scene exports
├── render/
│   ├── canvas-helpers.ts # RenderContext pattern and base functions
│   ├── overlays.ts       # System overlays (loading, error, debug)
│   └── index.ts          # Render exports
├── types/
│   ├── actions.ts       # Action types and dispatcher interface
│   ├── game.ts          # Global game state types
│   ├── scenes.ts        # Scene interface and state types
│   ├── input.ts         # Input system types
│   ├── assets.ts        # Asset management types
│   └── index.ts         # Type exports
├── utils/
│   ├── functions.ts     # Functional programming utilities
│   └── index.ts         # Utility exports
├── assets/
│   └── sprite/          # Character sprite sheets and configurations
└── css/
    ├── normalize.css    # CSS reset
    └── styles.css       # Game styles
```

### Technical Notes

- **Vite configuration**: Serves from `src/` directory, builds to `dist/`
- **TypeScript**: Strict typing with comprehensive type definitions in `src/types/`
- **Scene-based architecture**: Each scene is self-contained with its own state management
- **Action dispatcher**: Centralized system for scene-to-global communication
- **Canvas Size**: Dynamically configurable through global state, automatically resizes with window
- **Transition System**: Built-in scene transition support with lifecycle hooks
- **Error Recovery**: Comprehensive error handling with graceful fallbacks
- **Asset Loading**: Centralized asset management with progress tracking

### Development Patterns

The codebase follows these key patterns:
- **Scene Autonomy**: Each scene manages its own state and rendering logic
- **Simplified Global State**: Global state only handles system concerns (loading, input, canvas, transitions)
- **Action Dispatcher**: Clean communication channel between scenes and global state
- **Immutable Global State**: Global state changes return new objects
- **Scene Lifecycle**: Proper onEnter/onExit handling with transition support
- **Modular Design**: Game systems are composed using scene-based architecture
- **Functional Utilities**: Core functional programming utilities available for complex operations

The architecture is designed to be easily extensible, with clear separation of concerns between global system management and scene-specific game logic.

## Development Patterns

The codebase is designed for extensibility with these architectural principles:
- **Scene-Based Architecture**: Support for multiple game states (menu, gameplay, etc.)
- **Modular Systems**: Core systems (movement, rendering, input) designed for reuse
- **Progressive Enhancement**: Building on the existing functional foundation