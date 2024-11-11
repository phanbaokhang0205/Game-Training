'use strict'
let canvas;
let context;

window.onload = init;

function draw() {
    // draw a roof
    context.lineWidth = 5;


    // Draw circle
    context.beginPath();
    context.arc(400, 200, 50, 0, 2 * Math.PI);
    context.strokeStyle = '#0099b0';
    context.fillStyle = '#ffff';
    context.stroke();
    context.fill();

    // Draw Text
    context.fillStyle = 'black';
    context.fillText("My logo :>", 385, 205);

    // Stroke retangle
    context.strokeRect(325, 135, 150, 130);

    context.beginPath();
    context.moveTo(0, 600);
    context.lineTo(350, 237);
    context.stroke();

    context.beginPath();
    context.moveTo(600, 0);
    context.lineTo(450, 162);
    context.stroke();
}

function init() {
    // Get a reference to the canvas
    canvas = document.getElementById("canvas");
    context = canvas.getContext("2d");

    draw();
}