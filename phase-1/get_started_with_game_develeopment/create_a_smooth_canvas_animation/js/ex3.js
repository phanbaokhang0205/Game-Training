"use strict";
let canvas;
let context;

let ballRadius = 20;
let x = 100 / 2;
let y = 100 - 30;
let dx = 3;
let dy = -3;



window.onload = init;

function gameLoop() {

    // Pass the time to the update
    update();
    draw();

    window.requestAnimationFrame(gameLoop);
}

function draw() {
    // Clear the entire canvas
    context.clearRect(0, 0, canvas.width, canvas.height);

    // draw ball
    context.beginPath();
    context.arc(x, y, ballRadius, 0, Math.PI * 2);
    context.fillStyle = "lightblue";
    context.fill();
}

function update() {
    if (x + dx > canvas.width - ballRadius || x + dx < ballRadius) {
        dx = -dx;
    }
    if (y + dy > canvas.height - ballRadius || y + dy < ballRadius) {
        dy = -dy;
    }
    x += dx;
    y += dy;

}

function init() {
    // Get a reference to the canvas
    canvas = document.getElementById("canvas");
    context = canvas.getContext("2d");

    window.requestAnimationFrame(gameLoop);
}