class Player {
    constructor(context, canvas, x, y) {
        this.x = x;
        this.y = y;
        this.context = context;
        this.canvas = canvas;
        this.image = new Image();

        this.imageIndex = 1; // Chỉ số ảnh ban đầu
        this.width = 60;     // Chiều rộng cố định của ảnh ship
        this.height = 100;   // Chiều cao cố định của ảnh ship

        this.loadImage();
        this.move();
    }

    loadImage() {
        this.image.src = `../img/main_ship/ship_${this.imageIndex}.jpg`;
        this.image.onload = () => {
            // console.log(`Ship image ${this.imageIndex} loaded successfully`);
        };
        this.image.onerror = () => {
            console.error(`Failed to load Ship image ${this.imageIndex}`);
        };
    }

    changeImage(index) {
        // Cập nhật chỉ số ảnh và load ảnh mới
        this.imageIndex = index;
        this.loadImage();
    }

    move() {
        this.canvas.addEventListener('mousemove', (e) => {
            this.x = e.offsetX;
            this.y = e.offsetY;
        });
    }

    draw() {
        if (this.image.complete) {
            this.context.drawImage(
                this.image,              // Ảnh nguồn
                this.x - this.width / 2, // Tọa độ x để vẽ (canh giữa)
                this.y - this.height / 2,// Tọa độ y để vẽ (canh giữa)
                this.width,              // Chiều rộng vẽ
                this.height              // Chiều cao vẽ
            );

            this.drawHitBox();
        }
    }

    drawHitBox() {
        this.context.beginPath();
        this.context.strokeStyle = 'green';
        this.context.strokeRect(
            this.x - this.width / 2,
            this.y - this.height / 2,
            this.width,
            this.height
        );
        this.context.stroke();
    }
}

let ship;
let canvas;
let context;
let cw;
let ch;

window.onload = init;

function init() {
    canvas = document.getElementById('canvas');
    context = canvas.getContext('2d');
    cw = canvas.width;
    ch = canvas.height;

    ship = new Player(context, canvas, cw / 2, ch - 60);

    // Thay đổi ảnh mỗi 2 giây
    let imageIndex = 1;
    setInterval(() => {
        imageIndex = (imageIndex % 5) + 1; // Lặp từ 1 đến 5
        ship.changeImage(imageIndex);
    }, 100);

    requestAnimationFrame(gameLoop);
}

function draw() {
    ship.draw();
}

function update() {}

function gameLoop() {
    context.clearRect(0, 0, cw, ch);
    update();
    draw();
    window.requestAnimationFrame(gameLoop);
}
