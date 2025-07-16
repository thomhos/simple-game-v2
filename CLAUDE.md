# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

- **Development server**: `npm run dev` (starts Vite dev server on port 3000)
- **Build for production**: `npm run build` (outputs to `dist/` directory)  
- **Preview production build**: `npm run preview`
- **Format code**: `npm run format` (formats code with Prettier)
- **Check formatting**: `npm run format:check` (checks if code is properly formatted)

## Architecture Overview

This is a TypeScript 2D game built with functional programming principles, featuring a complete sprite animation system, error handling, and modular rendering architecture.

### Core Game Loop Architecture

The game uses a **functional game loop** with immutable state management:

- **Entry point** (`src/main.ts`): Initializes the game system, creates canvas, input system, and starts the game loop
- **HTML template** (`src/index.html`): Base HTML structure for the game canvas
- **Game engine** (`src/game/create-game.ts`): Manages the core game loop with `requestAnimationFrame`, handles start/stop/pause/resume lifecycle
- **State management**: Purely functional - `UpdateFn` takes current state and returns new state, never mutating existing state
- **Rendering**: Modular rendering system using functional composition with `RenderContext` pattern
- **Sprite loading** (`src/game/sprite-loader.ts`): Async sprite asset loading with error handling

### Key Components

- **Canvas system** (`src/canvas.ts`): Canvas creation and context management with dynamic resizing support
- **Input system** (`src/input.ts`): Consolidated keyboard input handling with immutable state
- **Actions system** (`src/actions/`): Modular action processing
  - `input-action-mapper.ts`: Maps input state to game actions (movement, etc.)
  - `system-actions.ts`: System-level actions (pause/resume, loading, sprites, errors, canvas resize)
  - `player-actions.ts`: Player-specific actions (movement with bounds checking, animation state)
- **Game system** (`src/game/`): Modular game engine components
  - `create-event-emitter.ts`: Event system for game lifecycle events
  - `create-game.ts`: Core game loop with fixed timestep, pause/resume, and action dispatch
  - `create-initial-state.ts`: Factory for initial game state with system configuration
  - `update.ts`: Core game logic using functional composition with conditional helpers
  - `render.ts`: Main rendering orchestration using functional pipeline
  - `sprite-loader.ts`: Async sprite asset loading with comprehensive error handling
- **Rendering system** (`src/render/`): Modular functional rendering
  - `canvas-helpers.ts`: RenderContext pattern and base rendering functions
  - `player.ts`: Player sprite rendering with animation frame calculation
  - `speech-bubble.ts`: Speech bubble rendering with red exclamation mark
  - `overlays.ts`: Loading, error, pause, and debug overlays
  - `sprite.ts`: Core sprite rendering utilities with fallback handling
- **Sprite system** (`src/sprites.ts`): Legacy sprite utilities (being phased out)
- **Utilities** (`src/utils/functions.ts`): Comprehensive functional programming toolkit

### Current Game Features

- **Animated Player Character**: Sprite-based player with directional animations (walk/idle in 4 directions)
- **Multiple Character Support**: Bob, Adam, Amelia, Alex sprite sets with JSON configuration
- **Smart Movement System**: WASD/arrow key controls with movement state tracking and idle timeout
- **Boundary Checking**: Player stays within dynamically resizable canvas bounds
- **Animation State Management**: Automatic animation switching based on movement and facing direction
- **Idle Timeout Behavior**: After 5 seconds of inactivity, player defaults to idle-down animation
- **Speech Bubble**: Visual indicator with red exclamation mark above player
- **Fixed Timestep**: 60fps game loop with accumulator for consistent physics
- **Loading States**: Comprehensive loading screen with sprite asset management
- **Error Handling**: Robust error recovery with user-friendly error screens
- **Debug Display**: Shows player coordinates, animation state, and controls
- **Event System**: Emits game lifecycle events with console logging
- **Pause/Resume Controls**: Manual pause/resume with Escape key and transparent pause overlay
- **Window Resize Support**: Canvas automatically resizes with window, maintaining game state
- **Focus Management**: Game pauses when window loses focus

### State Management Pattern

The game state is **immutable** and follows this pattern:
```typescript
type UpdateFn = (state: GameState, input: InputState, deltaTime: number) => GameState
type RenderFn = (ctx: CanvasRenderingContext2D, state: GameState) => void
```

All state changes must return new state objects rather than mutating existing ones. Updates use functional composition with the extensive `pipe` utility and conditional helpers like `when`/`unless`.

### Functional Programming Architecture

The codebase extensively uses functional programming patterns:

#### Core Functional Utilities (`src/utils/functions.ts`)
- **`pipe`**: Function composition for chaining transformations
- **`when`/`unless`**: Conditional function application
- **`branch`**: Conditional branching with true/false paths
- **`filter`**: Predicate-based function application
- **`tap`**: Side effects without changing values (debugging)
- **`attempt`**: Try-catch wrapper with fallback
- **`memoize`**: Result caching for performance
- **`compose`**: Reverse pipe for right-to-left composition
- **`repeat`**: Function repetition
- **`whilst`**: Conditional looping

#### Rendering Pattern (`RenderContext`)
```typescript
interface RenderContext {
    readonly ctx: CanvasRenderingContext2D;
    readonly state: GameState;
}

// Functional rendering pipeline
pipe(
    renderCtx,
    clearCanvas,
    drawBackground,
    drawPlayer,
    drawSpeechBubble,
    when(state.gameMode === 'paused', drawPauseOverlay)
);
```

### Input and Actions System Architecture

The input and actions systems work together functionally:
1. **Input State**: Immutable set of currently pressed keys (`src/input.ts`)
2. **Action Creation**: Maps input state to typed game actions (`src/actions/input-action-mapper.ts`)
3. **Action Application**: Pure functions that apply actions to game state:
   - `src/actions/system-actions.ts`: System-level actions (pause/resume, loading, sprites, errors, canvas resize)
   - `src/actions/player-actions.ts`: Player-specific actions (movement, animation state, idle timeout)
4. **Action Types**: Type definitions for all game actions (`src/types/actions.ts`)

### Sprite Animation System

The game features a comprehensive sprite animation system:
- **Multiple Characters**: Bob, Adam, Amelia, Alex with individual sprite sheets
- **Animation States**: 8 animation states per character (idle/walk × 4 directions)
- **JSON Configuration**: Each character has a `config.json` defining frames, timing, and paths
- **Frame-based Animation**: Automatic frame progression with configurable timing
- **Fallback Rendering**: Colored rectangles when sprites fail to load
- **State-driven Animation**: Animation automatically switches based on movement and facing direction

### System Configuration

The game state includes system-level configuration:
```typescript
interface SystemConfig {
    readonly canvas: { width: number; height: number };
    readonly error: GameError | null;
}
```

### Tilemap System (Prepared for Future Use)

The codebase includes type definitions for a 2D tilemap system:
- **TileConfig**: Defines tile properties (solid, trigger, etc.)
- **MapConfig**: Complete map configuration with tileset and layers
- **Character-based maps**: Maps use string arrays where each character represents a tile type
- **Sample Map**: `src/assets/map.json` contains a Level 1 with walls, water, trees, and spawn points

### Project Structure

```
src/
├── index.html           # HTML template for the game
├── main.ts              # Entry point with game initialization and window resize handling
├── canvas.ts            # Canvas utilities and context management
├── input.ts             # Consolidated input system with immutable state
├── sprites.ts           # Legacy sprite utilities (being phased out)
├── actions/
│   ├── input-action-mapper.ts  # Maps input to game actions
│   ├── system-actions.ts       # System-level actions (pause, loading, errors, resize)
│   ├── player-actions.ts       # Player-specific actions (movement, animation, idle timeout)
│   └── index.ts                # Actions exports
├── game/
│   ├── create-event-emitter.ts  # Event system implementation
│   ├── create-game.ts           # Game engine with action dispatch and lifecycle
│   ├── create-initial-state.ts  # Initial state factory with system config
│   ├── update.ts                # Core game state update logic with functional composition
│   ├── render.ts                # Main rendering orchestration using functional pipeline
│   ├── sprite-loader.ts         # Async sprite asset loading with error handling
│   └── index.ts                 # Game exports
├── render/
│   ├── canvas-helpers.ts        # RenderContext pattern and base functions
│   ├── player.ts                # Player sprite rendering with animation
│   ├── speech-bubble.ts         # Speech bubble with red exclamation mark
│   ├── overlays.ts              # Loading, error, pause, and debug overlays
│   ├── sprite.ts                # Core sprite rendering utilities
│   └── index.ts                 # Render exports
├── types/
│   ├── actions.ts       # Action type definitions (including canvas resize)
│   ├── game.ts          # Game state, player, and system types
│   ├── input.ts         # Input system types
│   ├── sprites.ts       # Comprehensive sprite system types
│   └── index.ts         # Type exports
├── utils/
│   ├── functions.ts     # Comprehensive functional programming toolkit
│   └── index.ts         # Utility exports
├── assets/
│   ├── map.json         # Sample tilemap data
│   └── sprite/          # Character sprite sheets and configurations
│       ├── adam/        # Adam character sprites and config.json
│       ├── alex/        # Alex character sprites and config.json
│       ├── amelia/      # Amelia character sprites and config.json
│       └── bob/         # Bob character sprites and config.json
└── css/
    ├── normalize.css    # CSS reset
    └── styles.css       # Game styles
```

### Technical Notes

- **Vite configuration**: Serves from `src/` directory, builds to `dist/`
- **TypeScript**: Strict typing with comprehensive type definitions in `src/types/`
- **Functional architecture**: Emphasizes pure functions, immutable data, and functional composition
- **Modular design**: Game systems are composed together using functional patterns rather than class inheritance
- **Canvas Size**: Dynamically configurable through system state, automatically resizes with window
- **Player Speed**: Configurable per-player (default 2.6 pixels per frame) with frame-based movement
- **Performance**: Memoization available for expensive operations through functional utilities
- **Error Recovery**: Comprehensive error handling with graceful fallbacks throughout the system
- **Asset Loading**: Async sprite loading with loading states and error recovery
- **Animation System**: Frame-based sprite animation with automatic state management

### Development Patterns

The codebase follows these key patterns:
- **Immutable State**: All state changes return new objects
- **Functional Composition**: Extensive use of `pipe` and conditional helpers
- **RenderContext Pattern**: Threading context through render functions
- **Action-Based Updates**: All changes go through typed actions
- **Error Boundaries**: Graceful handling of sprite loading and rendering failures
- **Conditional Rendering**: Smart rendering based on game state using functional helpers

The game loop is designed to be deterministic, easily testable, and highly maintainable due to the functional approach and modular architecture.

## Development Patterns

The codebase is designed for extensibility with these architectural principles:
- **Scene-Based Architecture**: Support for multiple game states (menu, gameplay, etc.)
- **Modular Systems**: Core systems (movement, rendering, input) designed for reuse
- **Progressive Enhancement**: Building on the existing functional foundation