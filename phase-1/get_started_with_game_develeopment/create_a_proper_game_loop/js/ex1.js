"use strict";
let canvas;
let context;
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

function gameLoop() {

    update();
    draw();

    // Keep requesting new frames
    window.requestAnimationFrame(gameLoop);
}

function update() {
    cirX += 3;

    if (cirX > canvas.width) {
        cirX = 0;
    }
}

function draw() {
    context.clearRect(0, 0, canvas.width, canvas.height);
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