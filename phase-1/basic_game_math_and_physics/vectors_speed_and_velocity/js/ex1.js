"use strict";
import { Vector } from "../js/vectorFunction.js";

let canvas;
let context;
let position = { x: 100, y: 100 }; // Starting position
let velocity = { x: 3, y: 3 };     // Speed and direction of movement



window.onload = init;

function init() {
    canvas = document.getElementById('canvas');
    context = canvas.getContext('2d');

    // Start the first frame request
    window.requestAnimationFrame(gameLoop);


}

function drawCircle(position) {
    context.clearRect(0, 0, canvas.width, canvas.height); // Clear the canvas
    context.beginPath();
    context.arc(position.x, position.y, 20, 0, Math.PI * 2); // Draw circle
    context.fillStyle = "blue";
    context.fill();
    context.closePath();
}

function updatePosition() {
    position = Vector.addVectors(position, velocity);
    velocity = Vector.normalize(velocity); // Set to unit vector
    velocity = Vector.multiplyVector(velocity, 5); // Scale to desired speed
}

function gameLoop() {

    updatePosition();
    drawCircle(position);

    // Keep requesting new frames
    window.requestAnimationFrame(gameLoop);
}