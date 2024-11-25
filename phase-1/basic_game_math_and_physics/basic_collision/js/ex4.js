/**
 * 1. Kiểm tra đường thẳng và hình chữ nhật:
        Chia hình chữ nhật thành 4 cạnh, mỗi cạnh là một đoạn thẳng.
        Kiểm tra từng đoạn thẳng có cắt đường đi của viên đạn không.
 * 2. Kiểm tra 2 đoạn thẳng có cắt nhau không:
        Sử dụng toán học để tính giao điểm giữa hai đoạn thẳng.
    - Đoạn thằng (p1,p2):
        x=p1.x+t(p2.x−p1.x) và y=p1.y+t(p2.y−p1.y)
        t là tham số thuộc khaongr [0, 1]
    - Đoạn thằng (q1,q2):
        x=q1.x + u(q2.x−q1.x) và y=q1.y + u(q2.y−q1.y)
        u là tham số thuộc khaongr [0, 1] 
    ***
    t và u là tham số tỉ lệ, xác định vị trí của đoạn thẳng:
    t = 0: điểm nằm tại p1;
    t = 1: điểm nằm tại p2;
    t = (0, 1): điểm nằm giữa p1 và p2
    ***
    - det là định thức, quyết định hai đoạn thẳng có song song hay không.
    const det = (p2.x - p1.x) * (q2.y - q1.y) - (p2.y - p1.y) * (q2.x - q1.x);
    Nếu det === 0, hai đoạn thẳng song song hoặc trùng nhau, không cắt nhau.

    - Muốn tìm giao điểm thì tìm t và u sao cho 2 phương trình bằng nhau:
    const t = ((q1.x - p1.x) * (q2.y - q1.y) - (q1.y - p1.y) * (q2.x - q1.x)) / det;
    const u = ((q1.x - p1.x) * (p2.y - p1.y) - (q1.y - p1.y) * (p2.x - p1.x)) / det;

    return t >= 0 && t <= 1 && u >= 0 && u <= 1; // Có cắt nhau

 */

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
        // this.vy += gravity;

        // Update position
        this.x += this.vx * secondsPassed;
        this.y += this.vy * secondsPassed;

        // Handle boundary collisions
        if (this.x <= 0 || this.x + (this.width || this.radius * 2) >= canvas.width) {
            // this.vx = -this.vx * restitution;
            this.vx = -this.vx;
            this.x = Math.max(0, Math.min(this.x, canvas.width - (this.width || this.radius * 2)));
        }
        if (this.y <= 0 || this.y + (this.height || this.radius * 2) >= canvas.height) {
            this.vy = -this.vy * restitution;
            this.y = Math.max(0, Math.min(this.y, canvas.height - (this.height || this.radius * 2)));
        }
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
    }
}
class Bullet extends GameObject {
    constructor(x, y, vx, vy, radius) {
        super(x, y, vx, vy);
        this.radius = radius; // Kích thước viên đạn
    }

    draw() {
        ctx.fillStyle = '#ff5733'; // Màu cam cho viên đạn
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2); // Vẽ hình tròn
        ctx.fill();
    }

    // Hàm kiểm tra đường thẳng và hình chữ nhật:
    lineIntersectsRect(start, end, rect) {
        const rectLines = [
            // Mỗi canh có 2 điểm:
            [{ x: rect.x, y: rect.y }, { x: rect.x + rect.width, y: rect.y }], // Cạnh trên
            [{ x: rect.x, y: rect.y }, { x: rect.x, y: rect.y + rect.height }], // Cạnh trái
            [{ x: rect.x + rect.width, y: rect.y }, { x: rect.x + rect.width, y: rect.y + rect.height }], // Cạnh phải
            [{ x: rect.x, y: rect.y + rect.height }, { x: rect.x + rect.width, y: rect.y + rect.height }] // Cạnh dưới
        ];
        
        // Duyệt qua từng cạnh obj
        for (let point of rectLines) {
            // xét điểm đầu và điểm cuối của cạnh.
            // Nếu lineIntersect trả về true tức là có va chạm thì return true.
            if (this.lineIntersect(start, end, point[0], point[1])) {
                return true;
            }
        }
        return false;
    }

    // Hàm kiểm tra 2 đoạn thẳng có cắt nhau không:
    lineIntersect(p1, p2, q1, q2) {
        const det = (p2.x - p1.x) * (q2.y - q1.y) - (p2.y - p1.y) * (q2.x - q1.x);
        if (det === 0) return false; // Hai đoạn thẳng song song
    
        const t = ((q1.x - p1.x) * (q2.y - q1.y) - (q1.y - p1.y) * (q2.x - q1.x)) / det;
        const u = ((q1.x - p1.x) * (p2.y - p1.y) - (q1.y - p1.y) * (p2.x - p1.x)) / det;
    
        return t >= 0 && t <= 1 && u >= 0 && u <= 1; // Có cắt nhau
    }

    checkCollisionWithObjects(objects) {
        for (let obj of objects) {
            if (obj === this) continue; // Không kiểm tra chính viên đạn
    
            // Lấy thông tin biên của vật thể
            const objBounds = {
                x: obj.x,
                y: obj.y,
                width: obj.width || obj.radius * 2,
                height: obj.height || obj.radius * 2
            };
    
            // Tính đường đi của viên đạn
            const start = { x: this.x, y: this.y };
            const end = {
                x: this.x + this.vx * secondsPassed,
                y: this.y + this.vy * secondsPassed
            };
    
            // Kiểm tra va chạm giữa đường đi và biên của vật thể
            if (this.lineIntersectsRect(start, end, objBounds)) {
                this.isColliding = true;
                obj.isColliding = true;
                this.vx = 0; // Dừng viên đạn
                this.vy = 0;
                break; // Ngừng kiểm tra các vật thể khác
            }
        }
    }

    
    
    
}
let gameObject;
let oldTimeStamp = 0;
let secondsPassed = 0;
let ctx;
let canvas;
let canvasW;
let canvasH;

// physics
const gravity = 0.5;
const restitution = 0.8;
const gridSize = 60;

window.onload = init;

function init() {
    canvas = document.getElementById('canvas');
    ctx = canvas.getContext("2d");
    canvasW = canvas.width;
    canvasH = canvas.height;
    createWorld();

    window.requestAnimationFrame(gameLoop)
}

function createWorld() {
    gameObjects = [
        new Bullet(0, 450, 1800, -500, 5),
        new Square(canvasW - 100, canvasH, 0, 0, 50, 150)
    ];
}


function gameLoop(timestamp) {
    secondsPassed = (timestamp - oldTimeStamp) / 1000;
    oldTimeStamp = timestamp;

    ctx.clearRect(0, 0, canvasW, canvasH);
    gameObjects.forEach(obj => {
        obj.isColliding = false;
        obj.update(secondsPassed);
    });

    // Kiểm tra va chạm
    gameObjects.forEach(obj => {
        if (obj instanceof Bullet) {
            obj.checkCollisionWithObjects(gameObjects);
        }
    });

    gameObjects.forEach(obj => obj.draw());
    window.requestAnimationFrame(gameLoop)
}
