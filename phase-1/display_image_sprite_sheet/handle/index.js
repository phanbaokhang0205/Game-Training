let canvas;
let context;
let cw;
let ch;

window.onload = init
let oldTime = performance.now(); // Lưu thời gian ban đầu


function init() {
    canvas = document.getElementById("canvas")
    context = canvas.getContext("2d")

    cw = canvas.width,
    ch = canvas.height

    const smallPotions = [
        new Circle(context, 100, 100, 200, -100, 0.4, 10),
        new Circle(context, 400, 100, 200, 60, 0.4, 30),
        new Circle(context, 300, 200, 200, -300, 0.4, 10),
        new Circle(context, 400, 300, 200, 40, 0.4, 40),
        new Circle(context, 500, 500, 200, 50, 0.4, 40),
        new Circle(context, 600, 100, 200, 60, 0.4, 10),
        new Circle(context, 700, 200, 200, 73, 0.4, 10),
        new Circle(context, 800, 300, 200, 82, 0.4, 10),
    ]

    setInterval(function () {
        const currentTime = performance.now(); // Lấy thời gian hiện tại
        const secondsPassed = (currentTime - oldTime) / 1000; // Tính thời gian trôi qua (giây)
        oldTime = currentTime; // Cập nhật thời gian trước đó
        context.clearRect(0, 0, cw, ch); // Xóa canvas
        smallPotions.forEach(obj => {
            obj.update(secondsPassed)
            obj.handleCollision(); // Cập nhật frame
            obj.draw(); // Vẽ vòng tròn và sprite
        })
    }, 1);
}
class GameObject {
    constructor(x, y, vx, vy, mass) {
        this.x = x;
        this.y = y;
        this.vx = vx;
        this.vy = vy;
        this.mass=mass;
        this.isColliding = false;
    }
}
class Circle extends GameObject {
    // Define the number of columns and rows in the sprite
    static numColumns = 5;
    static numRows = 2;
    static frameWidth = 0;
    static frameHeight = 0;
    static sprite;

    constructor(context, x, y, vx, vy, mass, radius) {
        // Pass params to super class
        super(x, y, vx, vy, mass);

        // Set the size of the hitbox
        this.context = context;
        this.currentFrame = 0;
        this.radius = radius;

        // Supply the sprite. Only load it once and reuse it
        this.loadImage();
    }

    loadImage() {
        // Check for an existing image
        if (!Circle.sprite) {
            // No image found, create a new element
            Circle.sprite = new Image();
            // Handle a successful load
            Circle.sprite.onload = () => {
                // Define the size of a frame
                Circle.frameWidth = Circle.sprite.width / Circle.numColumns;
                Circle.frameHeight = Circle.sprite.height / Circle.numRows;
            };

            // Start loading the image
            Circle.sprite.src = '../img/sprite_animation.webp';

        }
    }

    draw() {
        if (!Circle.sprite || !Circle.sprite.complete) {
            console.log("Image not loaded");
            return;
        }
        

        // Limit the maximum frame
        let maxFrame = Circle.numColumns * Circle.numRows - 1;
        if (this.currentFrame > maxFrame) {
            this.currentFrame = 0; 
        }

        // Update rows and columns
        let column = this.currentFrame % Circle.numColumns;
        let row = Math.floor(this.currentFrame / Circle.numColumns);

        // Set the origin to the center of the circle, rotate the context, move the origin back
        this.context.translate(this.x, this.y);
        this.context.rotate(Math.PI / 180 * (this.angle + 90));
        this.context.translate(-this.x, -this.y);
        // Draw the image
        this.context.drawImage(
            Circle.sprite, 
            column * Circle.frameWidth, 
            row * Circle.frameHeight, 
            Circle.frameWidth, 
            Circle.frameHeight, 
            (this.x - this.radius), 
            // (this.y - this.radius) - this.radius * 0.4, 
            this.y - this.radius,
            this.radius * 2, 
            // this.radius * 2.42
            this.radius * 2
        );

        // Reset transformation matrix
        this.context.setTransform(1, 0, 0, 1, 0, 0);
        
        // Draw hitbox
        this.context.beginPath();
        this.context.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
        this.context.fillStyle = 'transparent'
        this.context.fill();
    }

    handleCollision() {
        // Pick the next frame of the animation
        this.currentFrame++;
    }

    update(secondsPassed) {
        // Move with velocity x/y
        this.x += this.vx * secondsPassed;
        this.y += this.vy * secondsPassed;
        
        // Calculate the angle
        let radians = Math.atan2(this.vy, this.vx);
        this.angle = 180 * radians / Math.PI;

        if (this.x - this.radius < 0 || this.x + this.radius > cw) this.vx *= -1;
        if (this.y - this.radius < 0 || this.y + this.radius > ch) this.vy *= -1;
    }
}