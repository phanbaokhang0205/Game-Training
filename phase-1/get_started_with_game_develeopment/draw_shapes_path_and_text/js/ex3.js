'use strict'
let canvas;
let context;

window.onload = init;

function draw() {

    context.fillRect(0, 380, 1200, 150);
    context.fillRect(0, 0, 20, 1200);

    context.beginPath();
    context.fillStyle = "#ff8080";
    context.fillRect(50, 260, 50, 120);
    context.fillStyle = 'white';
    context.fillText("2020", 60, 395);


    context.fillStyle = "#ff8080";
    context.fillRect(150, 200, 50, 180);
    context.fillStyle = 'white';
    context.fillText("2021", 165, 395);

    context.fillStyle = "#ff8080";
    context.fillRect(250, 150, 50, 230);
    context.fillStyle = 'white';
    context.fillText("2022", 265, 395);

    context.fillStyle = "#ff8080";
    context.fillRect(350, 280, 50, 100);
    context.fillStyle = 'white';
    context.fillText("2023", 365, 395);

    context.fillStyle = "#ff8080";
    context.fillRect(450, 330, 50, 50);
    context.fillStyle = 'white';
    context.fillText("2024", 465, 395);

}


function init() {
    // Get a reference to the canvas
    canvas = document.getElementById("canvas");
    context = canvas.getContext("2d");
    draw();
}