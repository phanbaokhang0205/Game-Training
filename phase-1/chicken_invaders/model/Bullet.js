import { Collider } from "../helper/Collider.js";

export class Bullet extends Collider{
    constructor(context, x, y) {
        super(x, y)
        this.context = context;
        this.canvas = this.context.canvas;
        this.x = x;
        this.y = y;
        this.speed = 0.5;
        this.image = new Image;
        this.visible = true;

        this.loadImage();
    }

    loadImage() {
        this.image.src = '../img/blue_bullet.png';
        this.image.onload = () => {
            this.width = this.image.width;
            this.height = this.image.height;
            console.log("Bullet image loaded successfully");
        };
        this.image.onerror = () => {
            console.error("Failed to load Bullet image");
        };
    }
    greeting() {
        console.log("Bullets hi.");
    }


    draw() {
        if (!this.visible) return

        this.context.save();
        this.context.translate(this.x, this.y);
        this.context.drawImage(this.image, -this.image.width/2, -this.image.height/2, this.image.width, this.image.height);
        this.context.restore();
        // this.drawHitBox();
    }
    
    drawHitBox() {
        this.context.beginPath();
        this.context.strokeStyle = 'blue';
        this.context.strokeRect(
            this.x - this.image.width / 2,
            this.y - this.image.height / 2,
            this.image.width,
            this.image.height
        );
        this.context.stroke();
    }

    update(other) {
        this.y -= this.speed;
        this.checkCollision(other);
    }
    
}