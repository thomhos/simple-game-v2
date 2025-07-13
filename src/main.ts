import { createCanvas } from './canvas';
import { createGame } from './game';
import { createInputSystem } from './input';
import { update } from './update';
import { render } from './render';

const ctx = createCanvas('gameCanvas', 800, 600);
const input = createInputSystem();
const game = createGame(input, ctx, update, render);

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

// Start without initialState, but maybe later we need to provide some
game.start();

// Pause game when window loses focus, resume when it gains focus
// window.addEventListener('blur', () => {
//     game.pause();
// });

// window.addEventListener('focus', () => {
//     game.resume();
// });
