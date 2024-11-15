import { Circle } from "../handle/circleClass.js";
import { Rectangle } from "../handle/rectangleClass.js";

let gameObjects;
let secondsPassed = 0;
let oldTimeStamp = 0;
let canvas;
let context;
let canvasW;
let canvasH;
let collisionPoint;
let normalVector;

window.onload = init;

function init() {
    canvas = document.getElementById("canvas");
    context = canvas.getContext("2d");
    canvasW = canvas.width;
    canvasH = canvas.height;
    createWorld();
    // Start the first frame request
    window.requestAnimationFrame(gameLoop);
}

function createWorld() {
    gameObjects = [
        new Circle(context,300, 10,20,600,20,30),
        new Rectangle(context, 350,150, -600,-20),
    ];
}

function gameLoop(timeStamp) {
    secondsPassed = (timeStamp - oldTimeStamp) / 1000;
    oldTimeStamp = timeStamp;

    // Loop over all game objects
    for (let i = 0; i < gameObjects.length; i++) {
        gameObjects[i].update(secondsPassed);
    }
    detectCollisions();
    clearCanvas();

    // Do the same to draw
    for (let i = 0; i < gameObjects.length; i++) {
        gameObjects[i].draw();
    }

    window.requestAnimationFrame(gameLoop);
}

function clearCanvas() {
    context.clearRect(0, 0, canvasW, canvasH);
}

function reactIntersect(cirX, cirY, radius, rectX, rectY, width, height) {
    // Tìm điểm gần nhất trên hình chữ nhật
    const nearestX = Math.max(rectX, Math.min(cirX, rectX + width));
    const nearestY = Math.max(rectY, Math.min(cirY, rectY + height));

    // Tính khoảng cách từ tâm hình tròn đến điểm gần nhất
    const dx = cirX - nearestX;
    const dy = cirY - nearestY;
    const distance = Math.sqrt(dx * dx + dy * dy);
    collisionPoint = {x: nearestX, y: nearestY};
    normalVector = {x: dx / distance, y: dy / distance};

    // Nếu k/c <= bán kính thì chạm
    return distance <= radius;
}

function detectCollisions() {
    let obj1;
    let obj2;

    // reset collision state
    for (let i = 0; i < gameObjects.length; i++) {
        gameObjects[i].isColliding = false;
    }

    for (let i=0; i < gameObjects.length; i++) {
        obj1 = gameObjects[i];
        for (let j=i+1; j<gameObjects.length; j++) {
            obj2 = gameObjects[j];

            // Compare obj2 with obj 1
            if (reactIntersect(obj1.x, obj1.y, obj1.radius, obj2.x, obj2.y, obj2.width, obj2.height)) {
                obj1.isColliding = true;
                obj2.isColliding = true;
                console.log("Collision Point: ",collisionPoint);
                console.log("Normal Vector: ",normalVector);
            }
            
        }
    }
    // returns the collision point and normal vector.
}