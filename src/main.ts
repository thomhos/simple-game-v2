import { createGame } from './game';
import { createCanvas } from './utils';
import { createInputSystem } from './input';

const ctx = createCanvas('gameCanvas', 800, 600);
const input = createInputSystem();
const game = createGame(input, ctx);
// window.Game = game;

game.on('start', () => {
    console.log('started');
});

game.on('stop', () => {
    console.log('stop');
});

game.start();
