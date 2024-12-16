import { Collider } from "../helper/Collider.js";
import { Bullet } from "./Bullet.js";

export class Player extends Collider{
    constructor(context, canvas, x, y) {
        super(x, y);
        this.x = x;
        this.y = y;
        this.context = context;
        this.canvas = canvas;
        this.image = new Image()
        
        this.bullets = []
        // load image
        this.loadImage()

        // move based on mousemove
        this.move()

        // shoot
        this.shoot()

    }

    // bullets = []

    loadImage() {
        this.image.src = '../img/ship_2.jpg';
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
        this.context.drawImage(this.image, -this.image.width/16, -this.image.height/16, this.image.width/8, this.image.height/8);
        this.context.restore();

        // draw bullets
        this.bullets.forEach(bullet => bullet.draw());

        // draw hitbox
        this.drawHitBox();
    }

    drawHitBox() {
        this.context.beginPath();
        this.context.strokeStyle = 'green';
        this.context.strokeRect(
            this.x - this.image.width / 16,
            this.y - this.image.height / 16,
            this.image.width / 8,
            this.image.height / 8
        );
        this.context.stroke();
    }


    update() {
        this.bullets.forEach(bullet => bullet.update());
    }

    move() {
        this.canvas.addEventListener('mousemove', (e) => {
            this.x = e.offsetX
            this.y = e.offsetY
        });
    }

    shoot() {
        this.canvas.addEventListener('click', ()=> {
            const bullet = new Bullet(this.context, this.x, this.y - 50);
            this.bullets.push(bullet)
            bullet.x = this.x;
            
            console.log("shoot!!!!");
            console.log(this.x);
            console.log(this.y);
            console.log("Bullet x: " + bullet.x);
            console.log("Bullet y: " + bullet.y);
            console.log(bullet.x);
            console.log(bullet.checkCollision(this));
        })
    }

    detectCollision(enemy) {
        this.bullets.forEach(b => {
            if (b.visible && b.checkCollision(enemy)) {
                b.visible = false;
                // get_star.loadSound('getStar', '../audio/get_star.mp3');
                // get_star.playSound('getStar'); 
            }

        })
    }
}

