class Rectangle {
    constructor(context, x, y, vx, vy, mass) {
        this.context = context;
        this.x = x;
        this.y = y;
        this.vx = vx;
        this.vy = vy;
        this.mass = mass;
        this.width = 100;
        this.height = 80;
    }

    draw() {
        this.context.beginPath();
        this.context.fillStyle = 'gray';
        this.context.fillRect(this.x, this.y, this.width, this.height);
    }

    update(secondsPassed) {
        // Move with set velocity
        this.x += this.vx * secondsPassed;
        this.y += this.vy * secondsPassed;
    }
}

let context;
let canvas;
let secondsPassed = 0;
let oldTimeStamp = 0
let canvasW;
let canvasH;
let rect1;
let rect2;
let objs;


window.onload = init;



function init() {
    canvas = document.getElementById("canvas");
    context = canvas.getContext("2d");
    canvasW = canvas.width;
    canvasH = canvas.height;

    rect1 = new Rectangle(context, 100, 50, -130, 50, 50);
    rect2 = new Rectangle(context, 100, 450, 0, -130, 30);
    objs = [rect1, rect2];



    // Start the first frame request
    window.requestAnimationFrame(gameLoop);
}


function gameLoop(timeStamp) {
    // TimeStamp
    secondsPassed = (timeStamp - oldTimeStamp) / 1000;
    oldTimeStamp = timeStamp;

    // Update
    rect1.update(secondsPassed);
    rect2.update(secondsPassed);


    // Phát hiện va chạm
    collisionCanvas();
    detectCollisions();

    // Clear
    clearFrame();

    // Vẽ
    rect1.draw();
    rect2.draw();

    window.requestAnimationFrame(gameLoop);
}

// Xóa frame trước
function clearFrame() {
    context.clearRect(0, 0, canvasW, canvasH);
}

function rectIntersect(x1, y1, w1, h1, x2, y2, w2, h2) {
    // Check x and y for overlap
    if (x2 > w1 + x1 || x1 > w2 + x2 || y2 > h1 + y1 || y1 > h2 + y2) {
        return false;
    }
    return true;
}

function detectCollisions() {
    let obj1;
    let obj2;

    for (let i = 0; i < objs.length; i++) {
        obj1 = objs[i];
        for (let j = i + 1; j < objs.length; j++) {
            obj2 = objs[j];

            let vCollision = { x: obj2.x - obj1.x, y: obj2.y - obj1.y };
            let distance = Math.sqrt((obj2.x - obj1.x) * (obj2.x - obj1.x) + (obj2.y - obj1.y) * (obj2.y - obj1.y));
            let vCollisionNorm = { x: vCollision.x / distance, y: vCollision.y / distance };
            let vRelativeVelocity = { x: obj1.vx - obj2.vx, y: obj1.vy - obj2.vy };
            let speed = vRelativeVelocity.x * vCollisionNorm.x + vRelativeVelocity.y * vCollisionNorm.y;

            if (rectIntersect(obj1.x, obj1.y, obj1.width, obj1.height, obj2.x, obj2.y, obj2.width, obj2.height)) {
                let mass1 = obj1.mass;
                let mass2 = obj2.mass;


                obj1.vx -= (2 * mass2 / (mass1 + mass2)) * speed * vCollisionNorm.x;
                obj1.vy -= (2 * mass2 / (mass1 + mass2)) * speed * vCollisionNorm.y;
                obj2.vx += (2 * mass1 / (mass1 + mass2)) * speed * vCollisionNorm.x;
                obj2.vy += (2 * mass1 / (mass1 + mass2)) * speed * vCollisionNorm.y;

               
                console.log("Vận tốc sau va chạm hình 1: V(x): ", obj1.vx, " V(y): " ,obj1.vy);
                console.log("Vận tốc sau va chạm hình 2: V(x): ", obj2.vx, "V(y): " ,obj2.vy);
            }
        }
    }



}

// Phát hiện va chạm đối với canvas
function collisionCanvas() {

    if (rect1.x < 0) {
        rect1.x = 0;
        rect1.vx = -rect1.vx;
    }

    // Kiểm tra va chạm cạnh phải
    if (rect1.x + rect1.width > canvasW) {
        rect1.x = canvasW - rect1.width;
        rect1.vx = -rect1.vx;
    }

    // Kiểm tra va chạm cạnh trên
    if (rect1.y < 0) {
        rect1.y = 0;
        rect1.vy = -rect1.vy;
    }

    // Kiểm tra va chạm cạnh dưới
    if (rect1.y + rect1.height > canvasH) {
        rect1.y = canvasH - rect1.height;
        rect1.vy = -rect1.vy;
    }

    if (rect2.x < 0) {
        rect2.x = 0;
        rect2.vx = -rect2.vx;
    }

    // Kiểm tra va chạm cạnh phải
    if (rect2.x + rect2.width > canvasW) {
        rect2.x = canvasW - rect2.width;
        rect2.vx = -rect2.vx;
    }

    // Kiểm tra va chạm cạnh trên
    if (rect2.y < 0) {
        rect2.y = 0;
        rect2.vy = -rect2.vy;
    }

    // Kiểm tra va chạm cạnh dưới
    if (rect2.y + rect2.height > canvasH) {
        rect2.y = canvasH - rect2.height;
        rect2.vy = -rect2.vy;
    }
}

