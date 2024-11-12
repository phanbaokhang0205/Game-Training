"use strict";
let canvas;
let context;
let canvasWidth;
let canvasHeight;
let fps;
let secondsPassed = 0;
let oldTimeStamp = 0;
let x = 0;
let y = 0;
let dx = 0;
let dy = 0;
let speed = 500;
const shapeW = 100;
const shapeH = 50;

window.onload = init;

function init() {
    // Get a reference to the canvas
    canvas = document.getElementById("canvas");
    context = canvas.getContext("2d");
    canvasWidth = canvas.width;
    canvasHeight = canvas.height;
    window.requestAnimationFrame(gameLoop);
}


function gameLoop(timeStamp) {
    secondsPassed = (timeStamp - oldTimeStamp) / 1000;
    oldTimeStamp = timeStamp;
    fps = Math.round(1/secondsPassed)

    update(secondsPassed)
    draw(fps)
    window.requestAnimationFrame(gameLoop)
}

function draw(fps) {
    context.clearRect(0, 0, canvas.width, canvas.height);

    // draw rectangle
    context.beginPath();
    context.fillStyle = 'blue';
    context.fillRect(x, y, shapeW, shapeH);

    // draw fps
    context.beginPath();
    context.fillStyle = 'red';
    context.textAlign = 'center';
    context.font = '20px Arial';
    context.fillText(`FPS: ${fps}`, canvasWidth/2, 30)
}

function update(secondsPassed) {
    x += dx;
    y += dy;

    if(x > canvasWidth - shapeW) {
        x = canvasWidth - shapeW;
    } else if (x < 0) {
        x = 0;
    } else if(y > canvasHeight - shapeH) {
        y = canvasHeight - shapeH;
    } else if (y < 0) {
        y = 0;
    }
    window.addEventListener("keydown", event => {
        if (event.key == 'ArrowLeft') {
            dx = -(speed * secondsPassed);
        } else if (event.key == 'ArrowRight') {
            dx = (speed * secondsPassed);
        } else if (event.key == 'ArrowUp') {
            dy = -(speed * secondsPassed);
        } else if (event.key == 'ArrowDown') {
            dy = (speed * secondsPassed);
        }
    })
    window.addEventListener("keyup", event => {
        if (event.key == 'ArrowLeft') {
            dx = 0;
        } else if (event.key == 'ArrowRight') {
            dx = 0;
        } else if (event.key == 'ArrowUp') {
            dy = 0;
        } else if (event.key == 'ArrowDown') {
            dy = 0;
        }
    })
}
