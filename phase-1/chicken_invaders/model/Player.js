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
        
        // sprite
        this.imageIndex = 1; // Chỉ số ảnh ban đầu
        this.width = 60;     // Chiều rộng cố định của ảnh ship
        this.height = 100;   // Chiều cao cố định của ảnh ship

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

        // sprite bullet
        // Thay đổi ảnh mỗi 2 giây
        let bulletSprite = 1;
        setInterval(() => {
            bulletSprite = (bulletSprite % 6) + 1; // Lặp từ 1 đến 5
            this.bullets.forEach(b => {
                b.changeImage(bulletSprite);
            })
        }, 100);

        
    }


    loadImage() {
        // this.image.src = '../img/ship_2.jpg';
        this.image.src = `../img/main_ship/ship_${this.imageIndex}.jpg`;
        this.image.onload = () => {
            // console.log("Ship image loaded successfully");
        };
        this.image.onerror = () => {
            console.error("Failed to load Ship image");
        };
    }

    changeImage(index) {
        // Cập nhật chỉ số ảnh và load ảnh mới
        this.imageIndex = index;
        this.loadImage();
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

            // this.drawHitBox();
        }


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
            this.x - this.width / 2,
            this.y - this.height / 2,
            this.width,
            this.height
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
            return true
        }
        return false
    }

}

