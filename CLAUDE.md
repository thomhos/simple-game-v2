# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

- **Development server**: `npm run dev` (starts Vite dev server on port 3000)
- **Build for production**: `npm run build` (outputs to `dist/` directory)  
- **Preview production build**: `npm run preview`

## Architecture Overview

This is a TypeScript 2D game built with functional programming principles and a clean separation of concerns.

### Core Game Loop Architecture

The game uses a **functional game loop** with immutable state management:

- **Entry point** (`src/main.ts`): Initializes the game system, creates canvas, input system, and starts the game loop
- **Game engine** (`src/game/game.ts`): Manages the core game loop with `requestAnimationFrame`, handles start/stop/pause/resume lifecycle
- **State management**: Purely functional - `UpdateFn` takes current state and returns new state, never mutating existing state
- **Rendering**: Separate `RenderFn` that takes state and renders to canvas context

### Key Components

- **Canvas system** (`src/game/canvas.ts`): Canvas creation and context management
- **Input system** (`src/game/input.ts`): Keyboard input handling with immutable state
- **Event system** (`src/game/game-events.ts`): Game lifecycle event emitter (start, stop, pause, resume)
- **Update function** (`src/update.ts`): Core game logic that transforms state each frame
- **Render function** (`src/render.ts`): Renders current game state to canvas

### State Management Pattern

The game state is **immutable** and follows this pattern:
```typescript
type UpdateFn = (state: GameState, input: InputState, deltaTime: number) => GameState
type RenderFn = (ctx: CanvasRenderingContext2D, state: GameState) => void
```

All state changes must return new state objects rather than mutating existing ones.

### Tilemap System

The codebase includes type definitions for a 2D tilemap system:
- **TileConfig**: Defines tile properties (solid, trigger, etc.)
- **MapConfig**: Complete map configuration with tileset and layers
- **Character-based maps**: Maps use string arrays where each character represents a tile type

### Project Structure Notes

- **Vite configuration**: Serves from `src/` directory, builds to `dist/`
- **TypeScript**: Strict typing with separate type definitions in `src/types/`
- **Functional architecture**: Emphasizes pure functions and immutable data
- **Modular design**: Game systems are composed together rather than using class inheritance

The game loop is designed to be deterministic and easily testable due to the functional approach.