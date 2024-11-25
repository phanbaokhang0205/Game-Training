const canvas = document.getElementById("canvas");
const ctx = canvas.getContext('2d');


// physics
const gravity = 0.5;
const restitution = 0.8;
const gridSize = 60;

let gameObject = [];

function drawGrid() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.strokeStyle = '#ccc';
    for (let x = 0; x <= canvas.width; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
        ctx.stroke();
    }
    for (let y = 0; y <= canvas.height; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();
    }
}

class GameObject {
    constructor(x, y, vx, vy) {
        this.x = x;
        this.y = y;
        this.vx = vx;
        this.vy = vy;
        this.isColliding = false;
    }

    update(secondsPassed) {
        // Apply gravity
        this.vy += gravity;

        // Update position
        this.x += this.vx * secondsPassed;
        this.y += this.vy * secondsPassed;

        // Handle boundary collisions
        if (this.x <= 0 || this.x + (this.width || this.radius * 2) >= canvas.width) {
            this.vx = -this.vx * restitution;
            this.x = Math.max(0, Math.min(this.x, canvas.width - (this.width || this.radius * 2)));
        }
        if (this.y <= 0 || this.y + (this.height || this.radius * 2) >= canvas.height) {
            this.vy = -this.vy * restitution;
            this.y = Math.max(0, Math.min(this.y, canvas.height - (this.height || this.radius * 2)));
        }
    }

    highlightGrid() {
        const startRow = Math.floor(this.y / gridSize);
        const endRow = Math.floor((this.y + (this.height || this.radius * 2)) / gridSize);
        const startCol = Math.floor(this.x / gridSize);
        const endCol = Math.floor((this.x + (this.width || this.radius * 2)) / gridSize);

        ctx.fillStyle = 'rgba(211, 211, 211, 0.3)';
        for (let row = startRow; row <= endRow; row++) {
            for (let col = startCol; col <= endCol; col++) {
                ctx.fillRect(col * gridSize, row * gridSize, gridSize, gridSize);
            }
        }
    }
}

class Circle extends GameObject {
    constructor(x, y, vx, vy, radius) {
        super(x, y, vx, vy);
        this.radius = radius;
    }

    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = this.isColliding ? '#ff8080' : '#0099b0';
        ctx.fill();
        this.highlightGrid();
    }
}

class Square extends GameObject {
    constructor(x, y, vx, vy, width, height) {
        super(x, y, vx, vy);
        this.width = width;
        this.height = height;
    }

    draw() {
        ctx.fillStyle = this.isColliding ? '#ff8080' : '#0099b0';
        ctx.fillRect(this.x, this.y, this.width, this.height);
        this.highlightGrid();
    }
}

function detectCollisions() {
    for (let i = 0; i < gameObjects.length; i++) {
        for (let j = i + 1; j < gameObjects.length; j++) {
            const obj1 = gameObjects[i];
            const obj2 = gameObjects[j];

            if (obj1 instanceof Circle && obj2 instanceof Circle) {
                if (circleIntersect(obj1, obj2)) handleCollision(obj1, obj2);
            } else if (obj1 instanceof Square && obj2 instanceof Square) {
                if (rectIntersect(obj1, obj2)) handleCollision(obj1, obj2);
            } else {
                const circle = obj1 instanceof Circle ? obj1 : obj2;
                const rect = obj1 instanceof Square ? obj1 : obj2;
                if (circleRectIntersect(circle, rect)) handleCollision(circle, rect);
            }
        }
    }
}

function circleIntersect(c1, c2) {
    const dx = c1.x - c2.x;
    const dy = c1.y - c2.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    return distance < c1.radius + c2.radius;
}

function rectIntersect(r1, r2) {
    return !(r2.x > r1.x + r1.width || r2.x + r2.width < r1.x || r2.y > r1.y + r1.height || r2.y + r2.height < r1.y);
}

function circleRectIntersect(circle, rect) {
    const closestX = Math.max(rect.x, Math.min(circle.x, rect.x + rect.width));
    const closestY = Math.max(rect.y, Math.min(circle.y, rect.y + rect.height));
    const dx = circle.x - closestX;
    const dy = circle.y - closestY;
    return dx * dx + dy * dy < circle.radius * circle.radius;
}

function handleCollision(obj1, obj2) {
    obj1.isColliding = true;
    obj2.isColliding = true;

    // Tính toán vector giữa 2 đối tượng
    const dx = obj2.x - obj1.x;
    const dy = obj2.y - obj1.y;
    const distance = Math.sqrt(dx * dx + dy * dy);

    // Tách đối tượng nếu chúng đang chồng lấn
    const overlap = (obj1.radius || obj1.width / 2) + (obj2.radius || obj2.width / 2) - distance;
    if (overlap > 0) {
        const moveFactor = overlap / 2; // Mỗi đối tượng sẽ di chuyển một nửa khoảng chồng lấn
        const normalX = dx / distance;
        const normalY = dy / distance;

        // Di chuyển các đối tượng ra khỏi trạng thái chồng lấn
        obj1.x -= normalX * moveFactor;
        obj1.y -= normalY * moveFactor;

        obj2.x += normalX * moveFactor;
        obj2.y += normalY * moveFactor;
    }
    // Tính vận tốc phản hồi
    const relativeVelocity = { x: obj1.vx - obj2.vx, y: obj1.vy - obj2.vy };
    const speed = relativeVelocity.x * dx / distance + relativeVelocity.y * dy / distance;

    if (speed < 0) return; // Không xử lý nếu chúng không tiến lại gần nhau

    const impulse = (2 * speed) / (1 + 1); // Giả sử khối lượng bằng nhau

    obj1.vx -= impulse * dx / distance;
    obj1.vy -= impulse * dy / distance;

    obj2.vx += impulse * dx / distance;
    obj2.vy += impulse * dy / distance;
}
function createWorld() {
    gameObjects = [
        new Circle(100, 100, 50, 50, 30),
        new Circle(300, 200, -40, 30, 25),
        new Square(250, 300, 60, -50, 50, 50),
        new Square(400, 100, -30, 20, 60, 40)
    ];
}

function gameLoop(timestamp) {
    const secondsPassed = 1 / 60;

    gameObjects.forEach(obj => {
        obj.isColliding = false;
        obj.update(secondsPassed);
    });

    detectCollisions();

    drawGrid();
    gameObjects.forEach(obj => obj.draw());

    requestAnimationFrame(gameLoop);
}

createWorld();
requestAnimationFrame(gameLoop);