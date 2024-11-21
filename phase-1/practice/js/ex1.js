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

class Retangle extends GameObject {
    constructor(context, x, y, vx, vy, mass, restitution) {
        super(context, x, y, vx, vy, mass);

        this.width = 80;
        this.height = 50;
        this.mass = mass;
        this.g = 9.81;
        this.restitution = restitution;

    }

    draw() {
        this.context.fillStyle = this.isColliding ? '#ff8080' : '#0099b0';
        this.context.fillRect(this.x, this.y, this.width, this.height);
    }

    update(secondsPassed) {
        this.vy += this.g * secondsPassed;
        this.x += this.vx * secondsPassed;
        this.y += this.vy * secondsPassed;
    }

    static rectIntersect(x1, y1, w1, h1, x2, y2, w2, h2) {
        return !(x1 + w1 < x2 || x2 + w2 < x1 || y1 + h1 < y2 || y2 + h2 < y1);
    }

    static detectEdgeCollisions(restitution) {
        let obj;
        for (let i = 0; i < gameObject.length; i++) {
            obj = gameObject[i];
    
            // Nếu là hình chữ nhật
            if (obj.width && obj.height) {
                if (obj.x < 0) {
                    obj.vx = Math.abs(obj.vx) * restitution;
                    obj.x = 0;
                } else if (obj.x + obj.width > canvasW) {
                    obj.vx = -Math.abs(obj.vx) * restitution;
                    obj.x = canvasW - obj.width;
                }
    
                if (obj.y < 0) {
                    obj.vy = Math.abs(obj.vy) * restitution;
                    obj.y = 0;
                } else if (obj.y + obj.height > canvasH) {
                    obj.vy = -Math.abs(obj.vy) * restitution;
                    obj.y = canvasH - obj.height;
                }
            }
        }
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

    }

    update(secondsPassed) {
        this.vy += this.g * secondsPassed;

        this.x += this.vx * secondsPassed;
        this.y += this.vy * secondsPassed;
    }

    static circleIntersect(x1, y1, r1, x2, y2, r2) {
        let squareDistance = (x1 - x2) * (x1 - x2) + (y1 - y2) * (y1 - y2);

        return squareDistance <= ((r1 + r2) * (r1 + r2))
    }

    static detectEdgeCollisions(restitution) {
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
        new Retangle(context, 300, 200, 500, 100, 1, 0.9),
        new Circle(context, 700, 200, -80, 500, 50, 1, 0.8)
    ]
}

function clearCanvas() {
    context.clearRect(0, 0, canvasW, canvasH);
}

function gameLoop(timeStamp) {
    secondsPassed = (timeStamp - oldTimeStamp) / 1000;
    oldTimeStamp = timeStamp;

    window.requestAnimationFrame(gameLoop);
    for (let i = 0; i < gameObject.length; i++) {
        gameObject[i].update(secondsPassed);
    }
    
    Retangle.detectEdgeCollisions(restitution)
    Circle.detectEdgeCollisions(restitution)
    detectCollision();

    clearCanvas();

    for (let i = 0; i < gameObject.length; i++) {
        gameObject[i].draw();
    }
}

// Hàm phát hiện pha chạm rect và circle
function rectCircleIntersect(rectX, rectY, rectWidth, rectHeight, circleX, circleY, circleRadius) {
    // Tìm điểm gần nhất trên hình chữ nhật (x, y)
    let closestX = Math.max(rectX, Math.min(circleX, rectX + rectWidth));
    let closestY = Math.max(rectY, Math.min(circleY, rectY + rectHeight));

    // Tính khoảng cách giữa điểm gần nhất và tâm hình tròn
    let dx = circleX - closestX;
    let dy = circleY - closestY;
    let distanceSquared = dx * dx + dy * dy;

    // Kiểm tra xem khoảng cách này có nhỏ hơn bán kính của hình tròn không
    return distanceSquared <= (circleRadius * circleRadius);
}

function collisionPoint(rect, cir) {
    let closestX = Math.max(rect.x, Math.min(cir.x, rect.x + rect.width));
    let closestY = Math.max(rect.y, Math.min(cir.y, rect.y + rect.height));
    return { x: closestX, y: closestY };
}

function normalVector(cir, vCollision) {
    let dx = cir.x - vCollision.x;
    let dy = cir.y - vCollision.y;
    let magnitude = Math.sqrt(dx * dx + dy * dy);
    return { x: dx / magnitude, y: dy / magnitude };
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

            // /**
            //  * Tìm hướng và tốc độ va chạm
            //  * 1. Tính vector va chạm:
            //  *      let vCollision = {x: obj2.x - obj1.x, y: obj2.y - obj1.y}
            //  */
            let vCollision = collisionPoint(obj1, obj2)
            
            // /**2. Loại bỏ hệ số khoảng cách để có được hướng vector.
            //  *      let distance = Math.sqrt((obj2.x-obj1.x)*(obj2.x-obj1.x) + (obj2.y-obj1.y)*(obj2.y-obj1.y));
            //  * 
            //  */
            let vCollisionNorm = normalVector(obj2, vCollision)
            // /**3. Sau khi có hướng là vector chuẩn vCollisionNorm 
            //  * thì tính tốc độ va chạm.
            //  */
            let vRelativeVelocity = { x: obj1.vx - obj2.vx, y: obj1.vy - obj2.vy };
            let speed = vRelativeVelocity.x * vCollisionNorm.x + vRelativeVelocity.y * vCollisionNorm.y;
            speed *= Math.min(obj1.restitution, obj2.restitution);
            // /**4. Lấy vector v tương đối để tính tích vô hướng lên va chạm pháp tuyến
            //  *  hay nói cách khác là tính độ dài của vector vận tốc khi nó theo hướng va chạm
            //  *  (Tích vô hướng = tốc độ va chạm).
            //  */

            // /**Theem khoi luong (mass), dong luong (impulse),... */
            let impulse = 2 * speed / (obj1.mass + obj2.mass);


            if (rectCircleIntersect(obj1.x, obj1.y, obj1.width, obj1.height, obj2.x, obj2.y, obj2.radius)) {
                obj1.isColliding = true;
                obj2.isColliding = true;
                addInfo(vCollision, vCollisionNorm)
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

function addInfo(vCollision, vCollisionNorm) {
    const info = document.getElementById('info')
    info.innerText = "";
    info.innerText = `
        Collision Vector:
        x: ${vCollision.x.toFixed(2)}, y: ${vCollision.y.toFixed(2)}

        Normal Vector:
        x: ${vCollisionNorm.x.toFixed(2)}, y: ${vCollisionNorm.y.toFixed(2)}
    `;
}