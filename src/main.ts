import { createGame } from './game';
import { createCanvas } from './canvas';
import { createInputSystem } from './input';

const ctx = createCanvas('gameCanvas', 800, 600);
const input = createInputSystem();
const game = createGame(input, ctx);
// window.Game = game;

game.on('start', () => {
    console.log('started');
});

game.on('pause', () => {
    console.log('paused');
});

game.on('resume', () => {
    console.log('resume');
});

game.on('stop', () => {
    console.log('stop');
});

game.start();

// Pause game when window loses focus, resume when it gains focus
window.addEventListener('blur', () => {
    game.pause();
});
