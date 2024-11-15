import { Square } from "./squareClass.js";
import { Circle } from "./circleClass.js";


let gameObjects;
let secondsPassed = 0;
let oldTimeStamp = 0;
let canvas;
let context;
let canvasW;
let canvasH;

// Set a restitution, a lower value will lose more energy when colliding

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
    
    // 
    
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
            let vCollision = {x: obj2.x - obj1.x, y: obj2.y - obj1.y};
            let distance = Math.sqrt((obj2.x-obj1.x)*(obj2.x-obj1.x) + (obj2.y-obj1.y)*(obj2.y-obj1.y));
            let vCollisionNorm = {x: vCollision.x / distance, y: vCollision.y / distance};
            let vRelativeVelocity = {x: obj1.vx - obj2.vx, y: obj1.vy - obj2.vy};
            let speed = vRelativeVelocity.x * vCollisionNorm.x + vRelativeVelocity.y * vCollisionNorm.y;

            // Apply restitution to the speed
            speed *= Math.min(obj1.restitution, obj2.restitution);

            if (circleIntersect(obj1.x, obj1.y, obj1.radius, obj2.x, obj2.y, obj2.radius)){
                obj1.isColliding = true;
                obj2.isColliding = true;
                if (speed < 0) {
                    break;
                }

                let impulse = 2 * speed / (obj1.mass + obj2.mass);
                obj1.vx -= (impulse * obj2.mass * vCollisionNorm.x);
                obj1.vy -= (impulse * obj2.mass * vCollisionNorm.y);
                obj2.vx += (impulse * obj1.mass * vCollisionNorm.x);
                obj2.vy += (impulse * obj1.mass * vCollisionNorm.y);

            }
        }
    }
}

function detectEdgeCollisions()
 {
     let obj;
     for (let i = 0; i < gameObjects.length; i++)
     {
         obj = gameObjects[i];

         // Check for left and right
         if (obj.x < obj.radius){
             obj.vx = Math.abs(obj.vx) * obj.restitution;
             obj.x = obj.radius;
         }else if (obj.x > canvasW - obj.radius){
             obj.vx = -Math.abs(obj.vx) * obj.restitution;
             obj.x = canvasW - obj.radius;
         }

         // Check for bottom and top
         if (obj.y < obj.radius){
             obj.vy = Math.abs(obj.vy) * obj.restitution;
             obj.y = obj.radius;
         } else if (obj.y > canvasH - obj.radius){
             obj.vy = -Math.abs(obj.vy) * obj.restitution;
             obj.y = canvasH - obj.radius;
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
        new Circle(context, 250, 50, 0, 10, 35, 35),
        new Circle(context, 250, 300, 0, -10, 1, 10),
        new Circle(context, 150, 0, 50, 10, 1, 10),
        new Circle(context, 250, 450, 0, -10, 35, 35),
        new Circle(context, 350, 70, -50, 10, 1, 10),
        new Circle(context, 370, 70, -50, 10, 1, 10),
        new Circle(context, 380, 80, -50, 10, 1, 10),
        new Circle(context, 390, 90, -50, 20, 1, 10),

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
    detectEdgeCollisions();
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