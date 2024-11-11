'use strict'
let canvas;
let context;
let width;
let height;
let radius = 150;
let two_pi = 2 * Math.PI;


window.onload = init;

function draw() {
    context.clearRect(0, 0, canvas.width, canvas.height);

    context.arc(width, height, radius, 0, two_pi);
    context.stroke();

    drawMaker();

    context.beginPath();
    context.arc(width, height, 5, 0, two_pi);
    context.fill();

    drawHands();


}

function updateClock() {
    context.beginPath();
    draw();
    requestAnimationFrame(updateClock)
}

function drawMaker() {
    for (let i = 0; i < 12; i++) {
        const angle = (i) * (Math.PI * 2) / 12;
        const innerX = width + Math.cos(angle) * (radius - 10);
        const innerY = height + Math.sin(angle) * (radius - 10);
        const outerX = width + Math.cos(angle) * (radius - 20);
        const outerY = height + Math.sin(angle) * (radius - 20);

        context.beginPath();
        context.moveTo(innerX, innerY);
        context.lineTo(outerX, outerY);
        context.lineWidth = 3;
        context.stroke();
    }
}

function drawHands() {
    const now = new Date();
    const hour = now.getHours() % 12;
    const minute = now.getMinutes();
    const second = now.getSeconds();

    const hourAngle = ((hour + minute / 60) * Math.PI * 2) / 12 - Math.PI / 2;
    const minuteAngle = ((minute + second / 60) * Math.PI * 2) / 60 - Math.PI / 2;

    drawHand(hourAngle, radius * 0.5, 'black')
    drawHand(minuteAngle, radius * 0.7, 'black')
}

function drawHand(angle, length, color) {
    context.beginPath()
    context.moveTo(width, height);
    context.lineTo(
        width + Math.cos(angle) * length,
        height + Math.sin(angle) * length
    );
    context.strokeStyle = color;
    context.stroke();
}

function init() {
    // Get a reference to the canvas
    canvas = document.getElementById("canvas");
    context = canvas.getContext("2d");
    width = canvas.width / 2;
    height = canvas.height / 2;

    draw();
    updateClock();
}