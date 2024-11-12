"use strict";
import { Vector } from "./vector.js";

let canvas;
let context;
let canvasW;
let canvasH;

// timeStamp
let fps;
let secondsPassed = 0;
let oldTimeStamp = 0;
let radius = 20;

// circle 1
let position1 = new Vector(100, 100);
let velocity1 = new Vector(3, 3);

// circle 2
let position2 = new Vector(200, 100);
let velocity2 = new Vector(6, 3);

// circle 3
let position3 = new Vector(300, 100);
let velocity3 = new Vector(9, 3);

// remote circle
let position_r = new Vector(200, 200);
let dx = 0;
let dy = 0;
let speed = 20;
let velocity_r = new Vector(dx, dy);
window.onload = init;

function init() {
    canvas = document.getElementById('canvas');
    context = canvas.getContext('2d');
    canvasW = canvas.width;
    canvasH = canvas.height;

    // Start the first frame request
    window.requestAnimationFrame(gameLoop);
}

function drawCircle(p1, p2, p3, pr) {
    context.clearRect(0, 0, canvas.width, canvas.height);
    // circle 1
    circleSample(p1, 'red');
    // circle 2
    circleSample(p2, 'blue');
    // circle 3
    circleSample(p3, 'green');
    // remote circle
    circleSample(pr, 'black');
}

function circleSample(position, color) {
    context.beginPath();
    context.arc(position.x, position.y, radius, 0, Math.PI * 2); // Draw circle
    context.fillStyle = color;
    context.fill();
    context.closePath();
}

function updatePosition(secondsPassed) {

    position1 = position1.addVectors(velocity1);

    position2 = position2.addVectors(velocity2);

    position3 = position3.addVectors(velocity3);

    velocity_r.x += dx;
    velocity_r.y += dy;
    position_r = position_r.addVectors(velocity_r);
    control(secondsPassed);

    collisionControl(position_r);
    collisionAuto(position1, velocity1);
    collisionAuto(position2, velocity2);
    collisionAuto(position3, velocity3);

}

function control(secondsPassed) {
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
        if (event.key == 'ArrowLeft' || event.key == 'ArrowRight') {
            dx = 0;
            velocity_r.x = dx;
        } else if (event.key == 'ArrowUp' || event.key == 'ArrowDown') {
            dy = 0;
            velocity_r.y = dy;
        }
    })
}

function collisionControl(pr) {
    if (pr.x > canvasW - radius) {
        pr.x = canvasW - radius;
    } else if (pr.x < 0 + radius) {
        pr.x = radius;   
    } else if (pr.y > canvasH - radius) {
        pr.y = canvasH - radius;
    } else if (pr.y < 0 + radius) {
        pr.y = radius;
    }
}

function collisionAuto(p, v) {
    if (p.x > canvasW - radius || p.x < radius) {
        v.x = -v.x; 
    }
    if (p.y  > canvasH - radius || p.y  < radius) {
        v.y = -v.y; 
    }
}

function gameLoop(timeStamp) {
    secondsPassed = (timeStamp - oldTimeStamp) / 1000;
    oldTimeStamp = timeStamp;

    updatePosition(secondsPassed);
    drawCircle(position1, position2, position3, position_r);

    // Keep requesting new frames
    window.requestAnimationFrame(gameLoop);
}
