class Grid {
    constructor(gridWidth, gridHeight, cellSize) {
        this.gridWidth = gridWidth;    // Chiều rộng của toàn bộ grid
        this.gridHeight = gridHeight; // Chiều cao của toàn bộ grid
        this.cellSize = cellSize;     // Kích thước 1 ô (giả sử vuông: cellSize x cellSize)

        // Số ô theo hàng và cột
        this.numCols = Math.ceil(gridWidth / cellSize);
        this.numRows = Math.ceil(gridHeight / cellSize);

        // Mảng 2D lưu trữ các bucket (mỗi bucket chứa danh sách các đối tượng)
        this.cells = Array.from({ length: this.numCols }, () =>
            Array.from({ length: this.numRows }, () => [])
        );
    }


    // Hàm xác định các ô (cells) mà một đối tượng chiếm giữ
    getOccupiedCells(obj) {
        const startCol = Math.floor((obj.x - obj.radius) / CELLSIZE);
        const startRow = Math.floor((obj.y - obj.radius) / CELLSIZE);

        const endCol = Math.floor((obj.x + obj.radius) / CELLSIZE);
        const endRow = Math.floor((obj.y + obj.radius) / CELLSIZE);

        const occupiedCells = [];
        for (let col = startCol; col <= endCol; col++) {
            for (let row = startRow; row <= endRow; row++) {
                // occupiedCells.push({ col, row });
                if (col >= 0 && col < this.numCols && row >= 0 && row < this.numRows) {
                    occupiedCells.push({ col, row });
                }
            }
        }

        return occupiedCells;
    }

    // Hàm thêm đối tượng vào ô mà nó chiếm giữ
    addObject(object) {
        const occupiedCells = this.getOccupiedCells(object);

        for (const { col, row } of occupiedCells) {
            this.cells[col][row].push(object);
        }
    }


    // Lấy danh sách các ô liền kề
    getAdjacentCells(col, row) {
        const adjacent = [];
        for (let dx = -1; dx <= 1; dx++) {
            for (let dy = -1; dy <= 1; dy++) {
                if (dx === 0 && dy === 0) continue; // Bỏ qua ô hiện tại
                adjacent.push({ col: col + dx, row: row + dy });
            }
        }
        return adjacent;
    }

    // Hàm kiểm tra objs trong cùng 1 ô
    checkCollisions() {
        const collisions = [];

        for (let x = 0; x < this.numCols; x++) {
            for (let y = 0; y < this.numRows; y++) {
                const cell = this.cells[x][y];

                // Kiểm tra các đối tượng trong cùng một ô
                for (let i = 0; i < cell.length; i++) {
                    for (let j = i + 1; j < cell.length; j++) {
                        if (this.isColliding(cell[i], cell[j])) {
                            collisions.push([cell[i], cell[j]]);
                        }
                    }
                }

                // Kiểm tra va chạm với các ô liền kề
                const adjacentCells = this.getAdjacentCells(x, y);
                for (const { col, row } of adjacentCells) {
                    if (!this.cells[col] || !this.cells[col][row]) continue;

                    const adjacentCell = this.cells[col][row];
                    for (const obj1 of cell) {
                        for (const obj2 of adjacentCell) {
                            if (this.isColliding(obj1, obj2)) {
                                collisions.push([obj1, obj2]);
                            }
                        }
                    }
                }
            }
        }

        return collisions;
    }


    // Kiểm tra va chạm giữa hai đối tượng (AABB)
    // isColliding(objA, objB) {
    //     if (objA.radius && objB.radius) {
    //         const squareDistance = (objA.x - objB.x) ** 2 + (objA.y - objB.y) ** 2;
    //         const radiusSum = objA.radius + objB.radius;
    
    //         const isColliding = squareDistance <= radiusSum ** 2;
    
    //         if (isColliding) {
    //             console.log(`Collision detected between objects at (${objA.x}, ${objA.y}) and (${objB.x}, ${objB.y})`);
    //         }
    
    //         return isColliding;
    //     }
    
    //     return false;
    // }

    isColliding(objA, objB) {
        let squareDistance = (objA.x1 - objB.x2) * (objA.x1 - objB.x2) + (objA.y1 - objB.y2) * (objA.y1 - objB.y2);

        return squareDistance <= ((objA.r1 + objB.r2) * (objA.r1 + objB.r2))
    }


    // Xóa tất cả các đối tượng trong grid (reset lại mảng cells)
    clear() {
        for (let col = 0; col < this.numCols; col++) {
            for (let row = 0; row < this.numRows; row++) {
                this.cells[col][row] = [];
            }
        }
    }
}

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
    constructor(context, x, y, vx, vy, radius, mass, restitution) {
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
        for (let i = 0; i < gameObject.length; i++) {
            obj = gameObject[i];

            if (obj.x < obj.radius) {
                obj.vx = Math.abs(obj.vx) * restitution;
                obj.x = obj.radius;
            } else if (obj.x > canvasW - obj.radius) {
                obj.vx = -Math.abs(obj.vx) * restitution;
                obj.x = canvasW - obj.radius;
            }

            if (obj.y < obj.radius) {
                obj.vy = Math.abs(obj.vy) * restitution;
                obj.y = obj.radius;
            } else if (obj.y > canvasH - obj.radius) {
                obj.vy = -Math.abs(obj.vy) * restitution;
                obj.y = canvasH - obj.radius;
            }
        }
    }
}


let context;
let canvas;
let canvasW;
let canvasH;
let gameObject;
let oldTimeStamp = 0;
let secondsPassed = 0;

const restitution = 0.90;
const CELLSIZE = 50;
window.onload = init;

function init() {
    canvas = document.getElementById('canvas');
    context = canvas.getContext("2d");
    canvasW = canvas.width;
    canvasH = canvas.height;

    createWorld()

    window.requestAnimationFrame(gameLoop)
}
// Kích thước mỗi ô là 50x50 pixels
const grid = new Grid(canvasW, canvasH, CELLSIZE);

function createWorld() {
    return gameObject = [
        new Circle(context, 120, 75, 120, 150, 30, 10, 0.89),
        new Circle(context, 320, 75, 215, 300, 30, 10, 0.89),
        new Circle(context, 420, 175, 40, 150, 30, 10, 0.89),
        new Circle(context, 120, 175, 40, 150, 30, 10, 0.89),
        new Circle(context, 320, 175, 40, 150, 30, 10, 0.89),
    ]
}


function drawGrid() {
    for (let x = 0; x < canvasW; x += grid.cellSize) {
        for (let y = 0; y < canvasH; y += grid.cellSize) {
            context.strokeStyle = '#ccc';
            context.strokeRect(x, y, grid.cellSize, grid.cellSize);
            // console.log(x, y)
        }
    }
}

function drawgameObject() {
    for (const obj of gameObject) {
        obj.draw()
    }
}

function updategameObject(secondsPassed) {
    grid.clear(); // Xóa grid cũ

    // Cập nhật vị trí đối tượng và thêm lại vào grid
    for (const obj of gameObject) {
        obj.update(secondsPassed);
        obj.isColliding = false; // Reset isColliding trước mỗi vòng lặp
        grid.addObject(obj);
    }
}

function clearCanvas() {
    context.clearRect(0, 0, canvasW, canvasH);
}

function gameLoop(timeStamp) {
    secondsPassed = (timeStamp - oldTimeStamp) / 1000;
    oldTimeStamp = timeStamp;


    updategameObject(secondsPassed);
    detectCollision();
    Circle.detectEdgeCollisions(restitution);

    clearCanvas();
    drawGrid();
    drawgameObject();


    window.requestAnimationFrame(gameLoop)
}


function detectCollision() {
    const collisions = grid.checkCollisions();

    for (const [obj1, obj2] of collisions) {
        resolveCollision(obj1, obj2);
    }
}

function resolveCollision(obj1, obj2) {
    let vCollision = { x: obj2.x - obj1.x, y: obj2.y - obj1.y };

    let distance = Math.sqrt((obj2.x - obj1.x) * (obj2.x - obj1.x) + (obj2.y - obj1.y) * (obj2.y - obj1.y));
    let vCollisionNorm = { x: vCollision.x / distance, y: vCollision.y / distance };

    let vRelativeVelocity = { x: obj1.vx - obj2.vx, y: obj1.vy - obj2.vy };
    let speed = vRelativeVelocity.x * vCollisionNorm.x + vRelativeVelocity.y * vCollisionNorm.y;

    let impulse = 2 * speed / (obj1.mass + obj2.mass);

    if (speed > 0) {
        return; // Không xử lý nếu không có va chạm thực tế
    }


    obj1.vx -= impulse * obj2.mass * vCollisionNorm.x;
    obj1.vy -= impulse * obj2.mass * vCollisionNorm.y;
    obj2.vx += impulse * obj1.mass * vCollisionNorm.x;
    obj2.vy += impulse * obj1.mass * vCollisionNorm.y;

    obj1.isColliding = true;
    obj2.isColliding = true;
}



