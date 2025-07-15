import { createGame } from './game';

const game = createGame('gameCanvas', 800, 600);
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
