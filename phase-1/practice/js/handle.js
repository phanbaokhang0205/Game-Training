class GameObject {
    constructor(context, x, y, vx, vy, mass) {
        this.context = context;
        this.x = x;
        this.y = y;
        this.vx = vx;
        this.vy = vy;
        this.mass = mass;

        this.isColliding = false;
    }
}

class Square extends GameObject {
    constructor(context, x, y, vx, vy, mass) {
        super(context, x, y, vx, vy, mass);

        this.width = 50;
        this.height = 50;
        this.mass = mass
    }

    draw() {
        this.context.fillStyle = this.isColliding ? '#ff8080' : '#0099b0';
        this.context.fillRect(this.x, this.y, this.width, this.height);
    }

    update(secondsPassed) {
        this.x += this.vx * secondsPassed;
        this.y += this.vy * secondsPassed;
    }

    static rectIntersect(x1, y1, w1, h1, x2, y2, w2, h2) {
        return !(x1 + w1 < x2 || x2 + w2 < x1 || y1 + h1 < y2 || y2 + h2 < y1);
    }

}

class Circle extends GameObject {
    constructor(context, x, y, vx, vy, radius, mass, restitution ) {
        super(context, x, y, vx, vy, mass);

        this.radius = radius || 25;
        this.mass = mass || 25;
        this.g = 9.81;
        this.restitution = restitution;
    }

    draw() {
        this.context.beginPath();
        this.context.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
        this.context.fillStyle = this.isColliding ? '#ff8080' : '#0099b0';
        this.context.fill()

        // Draw heading vector
        this.context.beginPath();
        this.context.moveTo(this.x, this.y);
        this.context.lineTo(this.x + this.vx, this.y + this.vy);
        this.context.stroke();
    }

    update(secondsPassed) {
        this.vy += this.g * secondsPassed;

        this.x += this.vx * secondsPassed;
        this.y += this.vy * secondsPassed;

        // Calculate the angle (vy before vx)
        let radians = Math.atan2(this.vy, this.vx);

        // Convert to degrees
        let degrees = 180 * radians / Math.PI;
    }

    static circleIntersect(x1, y1, r1, x2, y2, r2) {
        let squareDistance = (x1 - x2) * (x1 - x2) + (y1 - y2) * (y1 - y2);

        return squareDistance <= ((r1 + r2) * (r1 + r2))
    }


}

let gameObject;
let oldTimeStamp = 0;
let secondsPassed = 0;
let context;
let canvas;
let canvasW;
let canvasH;

const restitution = 0.90;

window.onload = init;

function init() {
    canvas = document.getElementById('canvas');
    context = canvas.getContext("2d");
    canvasW = canvas.width;
    canvasH = canvas.height;
    createWorld();

    window.requestAnimationFrame(gameLoop)
}

function createWorld() {
    gameObject = [
        // new Square(context, 250, 50, 0, 50),
        // new Square(context, 250, 300, 0, -50),
        // new Square(context, 350, 75, -55, 50),
        new Circle(context, 250, 50, 10, 50, 50, 50, 0.5),
        new Circle(context, 350, 300, 10, -50, 50, 50, 0.5),
        new Circle(context, 350, 75, -20, 50, 10, 10, 0.98),
        new Circle(context, 350, 205, -50, 50, 10, 10, 0.98),
        new Circle(context, 450, 85, -50, 50, 10, 10, 0.98),

    ]
}
function clearCanvas() {
    context.clearRect(0, 0, canvasW, canvasH);
}

function gameLoop(timeStamp) {
    secondsPassed = (timeStamp - oldTimeStamp) / 1000;
    oldTimeStamp = timeStamp;
    for (let i = 0; i < gameObject.length; i++) {
        gameObject[i].update(secondsPassed);
    }

    detectCollision();
    detectEdgeCollisions();
    clearCanvas();

    for (let i = 0; i < gameObject.length; i++) {
        gameObject[i].draw();
    }

    window.requestAnimationFrame(gameLoop);
}

function detectEdgeCollisions() {
    let obj;
    for (let i=0; i< gameObject.length; i++) {
        obj = gameObject[i];

        if (obj.x < obj.radius) {
            obj.vx = Math.abs(obj.vx) * restitution;
            obj.x = obj.radius;
        } else if (obj.x > canvasW - obj.radius) {
            obj.vx = -Math.abs(obj.vx) * restitution;
            obj.x = canvasW - obj.radius;
        }

        if (obj.y < obj.radius){
            obj.vy = Math.abs(obj.vy) * restitution;
            obj.y = obj.radius;
        } else if (obj.y > canvasH - obj.radius){
            obj.vy = -Math.abs(obj.vy) * restitution;
            obj.y = canvasH - obj.radius;
        }
    }
}

function detectCollision() {
    let obj1;
    let obj2;


    for (let i = 0; i < gameObject.length; i++) {
        gameObject[i].isColliding = false;
    }

    for (let i = 0; i < gameObject.length; i++) {
        obj1 = gameObject[i];
        for (let j = i + 1; j < gameObject.length; j++) {
            obj2 = gameObject[j];

            // if (Square.rectIntersect(obj1.x, obj1.y, obj1.width, obj1.height, obj2.x, obj2.y, obj2.width, obj2.height)) {
            //     obj1.isColliding = true;
            //     obj2.isColliding = true;
            // }
            /**
             * Tìm hướng và tốc độ va chạm
             * 1. Tính vector va chạm:
             *      let vCollision = {x: obj2.x - obj1.x, y: obj2.y - obj1.y}
             */
            let vCollision = { x: obj2.x - obj1.x, y: obj2.y - obj1.y };
            /**2. Loại bỏ hệ số khoảng cách để có được hướng vector.
             *      let distance = Math.sqrt((obj2.x-obj1.x)*(obj2.x-obj1.x) + (obj2.y-obj1.y)*(obj2.y-obj1.y));
             * 
             */
            let distance = Math.sqrt((obj2.x - obj1.x) * (obj2.x - obj1.x) + (obj2.y - obj1.y) * (obj2.y - obj1.y));
            let vCollisionNorm = { x: vCollision.x / distance, y: vCollision.y / distance };
            /**3. Sau khi có hướng là vector chuẩn vCollisionNorm 
             * thì tính tốc độ va chạm.
             */
            let vRelativeVelocity = { x: obj1.vx - obj2.vx, y: obj1.vy - obj2.vy };
            let speed = vRelativeVelocity.x * vCollisionNorm.x + vRelativeVelocity.y * vCollisionNorm.y;
            speed *= Math.min(obj1.restitution, obj2.restitution);
            /**4. Lấy vector v tương đối để tính tích vô hướng lên va chạm pháp tuyến
             *  hay nói cách khác là tính độ dài của vector vận tốc khi nó theo hướng va chạm
             *  (Tích vô hướng = tốc độ va chạm).
             */

            /**Theem khoi luong (mass), dong luong (impulse),... */
            let impulse = 2 * speed / (obj1.mass + obj2.mass);



            if (Circle.circleIntersect(obj1.x, obj1.y, obj1.radius, obj2.x, obj2.y, obj2.radius)) {
                obj1.isColliding = true;
                obj2.isColliding = true;

                if (speed < 0) {
                    break;
                }

                obj1.vx -= (impulse * obj2.mass * vCollisionNorm.x);
                obj1.vy -= (impulse * obj2.mass * vCollisionNorm.y);
                obj2.vx += (impulse * obj1.mass * vCollisionNorm.x);
                obj2.vy += (impulse * obj1.mass * vCollisionNorm.y);
            }
        }
    }

}