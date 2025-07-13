import { createCanvas } from './canvas';
import { createInitialState, createGame } from './game';
import { createInputSystem } from './input';
import { update } from './update';
import { render } from './render';

const ctx = createCanvas('gameCanvas', 800, 600);
const initialGameState = createInitialState();
const input = createInputSystem();
const game = createGame(input, ctx, update, render);

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

game.start(initialGameState);

// console.log(game.getState());

// game.stop()

// const FIXED_TIMESTEP = 1000 / 60; // 16.67ms
// let lastTime = 0;
// let accumulator = 0;

// // FPS and UPS tracking
// let frameCount = 0;
// let updateCount = 0;
// let lastFpsTime = 0;
// let currentFps = 0;
// let currentUps = 0;

// function gameLoop(currentTime: number) {
//     const deltaTime = currentTime - lastTime;
//     lastTime = currentTime;
//     accumulator += deltaTime;

//     while (accumulator >= FIXED_TIMESTEP) {
//         update(FIXED_TIMESTEP);
//         updateCount++;
//         accumulator -= FIXED_TIMESTEP;
//     }

//     // Calculate FPS and UPS
//     frameCount++;
//     if (currentTime - lastFpsTime >= 1000) {
//         currentFps = frameCount;
//         currentUps = updateCount;
//         frameCount = 0;
//         updateCount = 0;
//         lastFpsTime = currentTime;
//     }

//     render();
//     requestAnimationFrame(gameLoop);
// }

// function update(deltaTime: number) {
//     gameState.time += deltaTime;
//     gameState.frameCount++;
// }

// function render() {
//     ctx.fillStyle = '#2d4a2b';
//     ctx.fillRect(0, 0, canvas.width, canvas.height);

//     ctx.fillStyle = '#ffffff';
//     ctx.font = '24px Arial';
//     ctx.fillText('Simple 2D Game', 300, 280);

//     ctx.font = '16px Arial';
//     ctx.fillText(`FPS: ${currentFps}`, 300, 320);
//     ctx.fillText(`UPS: ${currentUps}`, 300, 340);
//     ctx.fillText(`Time: ${(gameState.time / 1000).toFixed(1)}s`, 300, 360);
//     ctx.fillText(`Frames: ${gameState.frameCount}`, 300, 380);
// }

// requestAnimationFrame(gameLoop);
