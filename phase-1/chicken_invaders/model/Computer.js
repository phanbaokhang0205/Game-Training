import { Collider } from "../helper/Collider.js";

export class Computer extends Collider{
    constructor(context, x, y) {
        super(x, y)
        this.context = context;
        this.x = x;
        this.y = y;
        this.image = new Image;
        
        // load image
        this.loadImage();
    }

    loadImage() {
        this.image.src = '../img/enemy_1.jpg';
        this.image.onload = () => {
            console.log("Ship image loaded successfully");
        };
        this.image.onerror = () => {
            console.error("Failed to load Ship image");
        };
    }

    draw() {
        this.context.save();
        this.context.translate(this.x, this.y);
        this.context.drawImage(this.image, -this.image.width/20, -this.image.height/20, this.image.width/10, this.image.height/10);
        this.context.restore();


        // draw hitbox
        this.drawHitBox();
    }
    
    drawHitBox() {
        this.context.beginPath();
        this.context.strokeStyle = 'red';
        this.context.strokeRect(
            this.x - this.image.width / 20,
            this.y - this.image.height / 20,
            this.image.width / 10,
            this.image.height / 10
        );
        this.context.stroke();
    }
    update() {
        
    }
}