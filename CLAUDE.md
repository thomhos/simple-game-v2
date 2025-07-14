# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

- **Development server**: `npm run dev` (starts Vite dev server on port 3000)
- **Build for production**: `npm run build` (outputs to `dist/` directory)  
- **Preview production build**: `npm run preview`
- **Format code**: `npm run format` (formats code with Prettier)
- **Check formatting**: `npm run format:check` (checks if code is properly formatted)

## Architecture Overview

This is a TypeScript 2D game built with functional programming principles and a clean separation of concerns.

### Core Game Loop Architecture

The game uses a **functional game loop** with immutable state management:

- **Entry point** (`src/main.ts`): Initializes the game system, creates canvas, input system, and starts the game loop
- **HTML template** (`src/index.html`): Base HTML structure for the game canvas
- **Game engine** (`src/game/game.ts`): Manages the core game loop with `requestAnimationFrame`, handles start/stop/pause/resume lifecycle
- **State management**: Purely functional - `UpdateFn` takes current state and returns new state, never mutating existing state
- **Rendering**: Separate `RenderFn` that takes state and renders to canvas context

### Key Components

- **Canvas system** (`src/canvas.ts`): Canvas creation and context management
- **Input system** (`src/input.ts`): Consolidated keyboard input handling with immutable state
- **Actions system** (`src/actions/`): Modular action processing
  - `input-action-mapper.ts`: Maps input state to game actions (movement, etc.)
  - `game-actions.ts`: Applies game-level actions (pause/resume)
  - `player-actions.ts`: Applies player-specific actions (movement with bounds checking)
- **Game system** (`src/game/`): Modular game engine components
  - `create-event-emitter.ts`: Event system for game lifecycle events
  - `create-game.ts`: Core game loop with fixed timestep and pause/resume functionality
  - `create-initial-state.ts`: Factory for initial game state
- **Update function** (`src/update.ts`): Core game logic that transforms state each frame using functional composition
- **Render function** (`src/render.ts`): Renders current game state to canvas
- **Utilities** (`src/utils/functions.ts`): Functional utilities like `pipe` for composition

### Current Game Features

- **Player Movement**: Blue square controlled with WASD or arrow keys at 200 pixels/second
- **Boundary Checking**: Player stays within 800x600 canvas bounds
- **Fixed Timestep**: 60fps game loop with accumulator for consistent physics
- **Debug Display**: Shows player coordinates and controls on screen
- **Event System**: Emits game lifecycle events with console logging
- **Pause/Resume Controls**: Manual pause/resume with Escape key (window focus handlers available but commented out)

### State Management Pattern

The game state is **immutable** and follows this pattern:
```typescript
type UpdateFn = (state: GameState, input: InputState, deltaTime: number) => GameState
type RenderFn = (ctx: CanvasRenderingContext2D, state: GameState) => void
```

All state changes must return new state objects rather than mutating existing ones. Updates use functional composition with the `pipe` utility.

### Input and Actions System Architecture

The input and actions systems work together functionally:
1. **Input State**: Immutable set of currently pressed keys (`src/input.ts`)
2. **Action Creation**: Maps input state to typed game actions (`src/actions/input-action-mapper.ts`)
3. **Action Application**: Pure functions that apply actions to game state:
   - `src/actions/game-actions.ts`: Game-level actions (pause/resume)
   - `src/actions/player-actions.ts`: Player-specific actions (movement)
4. **Action Types**: Type definitions for all game actions (`src/types/actions.ts`)

### Tilemap System

The codebase includes type definitions for a 2D tilemap system:
- **TileConfig**: Defines tile properties (solid, trigger, etc.)
- **MapConfig**: Complete map configuration with tileset and layers
- **Character-based maps**: Maps use string arrays where each character represents a tile type
- **Sample Map**: `src/assets/map.json` contains a Level 1 with walls, water, trees, and spawn points

### Project Structure

```
src/
├── index.html           # HTML template for the game
├── main.ts              # Entry point with game initialization
├── canvas.ts            # Canvas utilities
├── input.ts             # Consolidated input system
├── update.ts            # Core game loop logic
├── render.ts            # Rendering system
├── actions/
│   ├── input-action-mapper.ts  # Maps input to game actions
│   ├── game-actions.ts         # Applies game-level actions
│   ├── player-actions.ts       # Applies player-specific actions
│   └── index.ts                # Actions exports
├── game/
│   ├── create-event-emitter.ts  # Event system implementation
│   ├── create-game.ts           # Game engine with event system
│   ├── create-initial-state.ts  # Initial state factory
│   └── index.ts                 # Game exports
├── types/
│   ├── actions.ts       # Action type definitions
│   ├── game.ts          # Game state and map types
│   ├── input.ts         # Input system types
│   └── index.ts         # Type exports
├── utils/
│   ├── functions.ts     # Functional utilities
│   └── index.ts         # Utility exports
├── assets/
│   └── map.json         # Sample tilemap data
└── css/
    ├── normalize.css    # CSS reset
    └── styles.css       # Game styles
```

### Technical Notes

- **Vite configuration**: Serves from `src/` directory, builds to `dist/`
- **TypeScript**: Strict typing with separate type definitions in `src/types/`
- **Functional architecture**: Emphasizes pure functions and immutable data
- **Modular design**: Game systems are composed together rather than using class inheritance
- **Canvas Size**: Currently hardcoded to 800x600 pixels
- **Player Speed**: 200 pixels per second with deltaTime-based movement

The game loop is designed to be deterministic and easily testable due to the functional approach.