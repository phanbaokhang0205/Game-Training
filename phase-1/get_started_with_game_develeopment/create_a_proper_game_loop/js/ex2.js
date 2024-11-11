"use strict";
let canvas;
let context;
let secondsPassed;
let oldTimeStamp;
let fps;
let cirX = 0;
let cirY = 150;
let radius = 50;

window.onload = init;

function init() {
    canvas = document.getElementById('canvas');
    context = canvas.getContext('2d');

    // Start the first frame request
    window.requestAnimationFrame(gameLoop);

}

function gameLoop(timeStamp) {

    update();
    draw(timeStamp);

    // Keep requesting new frames
    window.requestAnimationFrame(gameLoop);
}

function update() {
    cirX += 3;


    if (cirX > canvas.width) {
        cirX = 0;
    }
}

function draw(timeStamp) {
    context.clearRect(0, 0, canvas.width, canvas.height);
    displayFPS(timeStamp);
    drawCirle();

}

function drawCirle() {
    context.beginPath();
    context.arc(cirX, cirY, radius, 0, 2 * Math.PI);
    context.strokeStyle = 'red';
    context.fillStyle = 'blue';
    context.lineWidth = 10;
    context.stroke();
    context.fill();
}

function displayFPS(timeStamp) {

    // Calculate the number of seconds passed since the last frame
    secondsPassed = (timeStamp - oldTimeStamp) / 1000;
    oldTimeStamp = timeStamp;

    // Calculate fps
    fps = Math.round(1 / secondsPassed);

    // Draw number to the screen
    context.beginPath();
    context.fillStyle = 'white';
    context.fillRect(0, 0, 200, 100);
    context.font = '25px Arial';
    context.fillStyle = 'black';
    context.fillText("FPS: " + fps, 10, 30);
}