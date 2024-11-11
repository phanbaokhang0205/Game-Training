'use strict'
let canvas;
let context;

window.onload = init;

function draw() {
    // draw a roof
    context.lineWidth = 3;
    context.beginPath();
    context.moveTo(100, 200)
    context.strokeStyle = '#0099b0';
    context.lineTo(200, 100);
    context.lineTo(300, 200);
    context.lineTo(100, 200);
    context.stroke();

    // draw a wall
    context.beginPath();
    context.strokeStyle = '#0099b0';
    context.strokeRect(100, 200, 200, 150);

    // draw a door
    context.beginPath();
    context.strokeRect(160, 250, 80, 100);
}

function init() {
    // Get a reference to the canvas
    canvas = document.getElementById("canvas");
    context = canvas.getContext("2d");

    draw();
}
