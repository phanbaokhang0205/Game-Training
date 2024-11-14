let gameObjects;
let secondsPassed = 0;
let oldTimeStamp = 0;
let canvas;
let context;
let canvasW;
let canvasH;
import { Square } from "./squareClass.js";
import { Circle } from "./circleClass.js";


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


function rectIntersect(x1, y1, w1, h1, x2, y2, w2, h2) {
    // Check x and y for overlap
    if (x2 > w1 + x1 || x1 > w2 + x2 || y2 > h1 + y1 || y1 > h2 + y2){
        return false;
    }
    return true;
}

function circleIntersect(x1, y1, r1, x2, y2, r2) {

    // Calculate the distance between the two circles
    let squareDistance = (x1-x2)*(x1-x2) + (y1-y2)*(y1-y2);

    // When the distance is smaller or equal to the sum
    // of the two radius, the circles touch or overlap
    return squareDistance <= ((r1 + r2) * (r1 + r2))
}

function detectCollisions(){
    let obj1;
    let obj2;

    // Reset collision state of all objects
    for (let i = 0; i < gameObjects.length; i++) {
        gameObjects[i].isColliding = false;
    }

    // Start checking for collisions
    for (let i = 0; i < gameObjects.length; i++)
    {
        obj1 = gameObjects[i];
        for (let j = i + 1; j < gameObjects.length; j++)
        {
            obj2 = gameObjects[j];

            // Compare object1 with object2
            // if (rectIntersect(obj1.x, obj1.y, obj1.width, obj1.height, obj2.x, obj2.y, obj2.width, obj2.height)){
            //     obj1.isColliding = true;
            //     obj2.isColliding = true;
            // }
            if (circleIntersect(obj1.x, obj1.y, obj1.radius, obj2.x, obj2.y, obj2.radius)){
                obj1.isColliding = true;
                obj2.isColliding = true;
                obj1.vx = -obj1.vx;
                obj1.vy = -obj1.vy;
                obj2.vx = -obj2.vx;
                obj2.vy = -obj2.vy;
            }
        }
    }
}


function createWorld(){
    gameObjects = [
        // new Square(context, 250, 50, 0, 50),
        // new Square(context, 250, 300, 0, -50),
        // new Square(context, 150, 0, 50, 50),
        // new Square(context, 250, 150, 50, 50),
        // new Square(context, 350, 75, -50, 50),
        // new Square(context, 300, 300, 50, -50)
        new Circle(context, 250, 50, 0, 50, 35),
        new Circle(context, 250, 300, 0, -50, 35),
        new Circle(context, 150, 0, 50, 50, 35),
        new Circle(context, 250, 450, 0, -50, 35),
        new Circle(context, 350, 70, -50, 50, 35),

    ];
}

function gameLoop(timeStamp)
{
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