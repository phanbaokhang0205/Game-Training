import { Collider } from "../helper/Collider.js";
import { Bullet } from "./Bullet.js";
import { AudioManager } from "../helper/AudioManager.js";

export class Player extends Collider {
    constructor(context, canvas, x, y) {
        super(x, y);
        this.x = x;
        this.y = y;
        this.context = context;
        this.canvas = canvas;
        this.image = new Image()
        
        // audio
        this.au_shooting = new AudioManager()
        this.au_hitEnemy = new AudioManager()

        this.bullets = []

        // load image
        this.loadImage()

        // move based on mousemove
        this.move()

        // shoot
        this.shoot()
    }


    loadImage() {
        this.image.src = '../img/ship_2.jpg';
        this.image.onload = () => {
            this.width = this.image.width/8;
            this.height = this.image.height/8;
            console.log("Ship image loaded successfully");
        };
        this.image.onerror = () => {
            console.error("Failed to load Ship image");
        };
    }

    draw() {
        this.context.save();
        this.context.translate(this.x, this.y);
        this.context.drawImage(this.image, -this.image.width / 16, -this.image.height / 16, this.image.width / 8, this.image.height / 8);
        this.context.restore();

        // draw bullets
        this.bullets.forEach(bullet => {
            if (bullet.visible) {
                bullet.draw()
            }
            return
        }
        );

        // draw hitbox
        // this.drawHitBox();
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

    // check collision and update bullet
    update(enemy) {
        this.collidingBullet_Enemy(enemy)
        this.collidingShip_Enemy(enemy)
        this.bullets.forEach(bullet => bullet.update(enemy));
    }

    move() {
        this.canvas.addEventListener('mousemove', (e) => {
            this.x = e.offsetX
            this.y = e.offsetY
        });
    }

    shoot() {
        this.canvas.addEventListener('click', () => {
            const bullet = new Bullet(this.context, this.x, this.y - 50);
            this.bullets.push(bullet)
            this.au_shooting.loadSound('shooting_4', '../audio/shooting_4.mp3')
            this.au_shooting.playSound('shooting_4')
        })
    }

    collidingBullet_Enemy(other) {
        let isShot = false

        this.bullets.forEach(b => {
            if (b.visible && b.checkCollision(other)) {
                b.visible = false;
                this.au_hitEnemy.loadSound('pipe_hit', '../audio/pipe_hit.mp3')
                this.au_hitEnemy.playSound('pipe_hit')
                isShot = true
            }
        })

        return isShot
    }

    collidingShip_Enemy(other) {
        if (this.checkCollision(other)) {
            console.log("Ship collided enemy.");
            return true
        }
        return false
    }

}

