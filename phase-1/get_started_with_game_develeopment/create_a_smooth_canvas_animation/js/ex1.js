"use strict";
let canvas;
let context;
let secondsPassed = 0;
let oldTimeStamp = 0;
let movingSpeed = 10;
let degX = 0;
let degY = 0;
let radius = 150;

let rectX;
let rectY;
window.onload = init;

function gameLoop(timeStamp) {
    // Calculate how much time has passed
    secondsPassed = (timeStamp - oldTimeStamp) / 1000;
    // Move forward in time with a maximum amount
    secondsPassed = Math.min(secondsPassed, 0.1);
    oldTimeStamp = timeStamp;

    console.log(secondsPassed);
    // Pass the time to the update
    update(secondsPassed);
    draw();

    window.requestAnimationFrame(gameLoop);
}

function draw() {
    // Clear the entire canvas
    context.clearRect(0, 0, canvas.width, canvas.height);

    context.fillStyle = "#ff8080";
    context.fillRect(rectX, rectY, 150, 100);

    context.beginPath();
    context.arc(250, 250, radius, 0, Math.PI * 2);
    context.strokeStyle = "lightgray";
    context.stroke();
}

function update(secondsPassed) {
    // Use time to calculate new position
    degX += movingSpeed * secondsPassed;
    degY += movingSpeed * secondsPassed;
    rectX = 250 + Math.cos((degX * Math.PI) / 12) * radius;
    rectY = 250 + Math.sin((degY * Math.PI) / 12) * radius;
}

function init() {
    // Get a reference to the canvas
    canvas = document.getElementById("canvas");
    context = canvas.getContext("2d");

    window.requestAnimationFrame(gameLoop);
}