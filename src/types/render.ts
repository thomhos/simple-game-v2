import { GameState } from './game';

export interface RenderContext {
    readonly ctx: CanvasRenderingContext2D;
    readonly state: GameState;
}
