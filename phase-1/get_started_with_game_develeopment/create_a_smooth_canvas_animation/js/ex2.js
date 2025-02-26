"use strict";
let canvas;
let context;
let secondsPassed = 0;
let oldTimeStamp = 0;
let movingSpeed = 10;
let degX1 = 0;
let degY1 = 0;

let degX2 = 32;
let degY2 = 32;
let radius = 200;

let rectX1;
let rectY1;

let rectX2;
let rectY2;
window.onload = init;

function gameLoop(timeStamp) {
    // Calculate how much time has passed
    secondsPassed = (timeStamp - oldTimeStamp) / 1000;
    // Move forward in time with a maximum amount
    secondsPassed = Math.min(secondsPassed, 0.1);
    oldTimeStamp = timeStamp;

    // Pass the time to the update
    update(secondsPassed);
    draw();

    window.requestAnimationFrame(gameLoop);
}

function draw() {
    // Clear the entire canvas
    context.clearRect(0, 0, canvas.width, canvas.height);

    // // Rect 1
    context.beginPath();
    context.fillStyle = "#ff8080";
    context.fillRect(rectX1, rectY1, 150, 100);

    // Rect 2
    context.beginPath();
    context.fillStyle = "#ff4040";
    context.fillRect(rectX2, rectY2, 150, 100);

    // draw circle
    context.beginPath();
    context.arc(350, 300, radius, 0, Math.PI * 2);
    context.strokeStyle = "lightgray";
    context.stroke();
}

function update(secondsPassed) {
    // Use time to calculate new position
    degX1 += (movingSpeed * secondsPassed);
    degY1 += (movingSpeed * secondsPassed);
    rectX1 = radius + Math.cos((degX1 * Math.PI) / 32) * radius;
    rectY1 = radius + Math.sin((degY1 * Math.PI) / 32) * radius;

    degX2 -= (movingSpeed * secondsPassed);
    degY2 -= (movingSpeed * secondsPassed);
    rectX2 = radius + Math.cos((degX2 * Math.PI) / 32) * radius;
    rectY2 = radius + Math.sin((degY2 * Math.PI) / 32) * radius;
}

function init() {
    // Get a reference to the canvas
    canvas = document.getElementById("canvas");
    context = canvas.getContext("2d");

    window.requestAnimationFrame(gameLoop);
}