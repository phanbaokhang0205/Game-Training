import { Collider } from "../helper/Collider.js";
import { Bullet } from "./Bullet.js";
import { AudioManager } from "../helper/AudioManager.js";

export class Weapon extends Collider {
    constructor(context, x, y, imgSrc, idleSprite, shootSprite, level, isShoot, HP) {
        super(x, y);
        this.context = context;
        this.x = x;
        this.y = y;
        this.imgSrc = imgSrc;
        this.src = `../img/weapon/${this.imgSrc}/idle_1.png`
        this.idleSprite = idleSprite
        this.shootSprite = shootSprite;


        this.level = level;
        this.isShoot = isShoot;
        this.HP = HP
        this.DTPE = 0; // damage taken per Enemy
        this.isDamaged = false;

        this.image = new Image()
        this.bullets = []
        this.state = 'idle'
        this.shootSpeed = 0;

        // sprite
        this.imageIndex = 1; // Chỉ số ảnh ban đầu
        this.width = 80;
        this.height = 80;

        // audio
        this.au_shooting = new AudioManager()
        this.au_hitEnemy = new AudioManager()


        // load image
        this.loadImage()

        // sprite bullet
        let bulletSprite = 1;
        setInterval(() => {
            bulletSprite = (bulletSprite % 4) + 1; // Lặp từ 1 đến 5
            this.bullets.forEach(b => {
                b.changeImage(bulletSprite);
            })
        }, 50);

        // Tốc độ bắn tùy thuộc vào level
        if (!this.isShoot) return
        if (this.level == 1) {
            this.shootSpeed = 3000
        }
        if (this.level == 2) {
            this.shootSpeed = 2100
        }
        if (this.level == 3) {
            this.shootSpeed = 800
        }
        setInterval(() => this.shooting(), this.shootSpeed)


        setInterval(() => {
            if (this.state === "idle") {
                this.imageIndex = (this.imageIndex % this.idleSprite) + 1;
            }
            this.loadImage();

        }, 150);

        setInterval(() => {
            if (this.state === "shoot") {
                this.imageIndex = (this.imageIndex % this.shootSprite) + 1;
            }
            this.loadImage();

        }, 100);
    }

    changeImage(index) {
        // Cập nhật chỉ số ảnh và load ảnh mới
        this.imageIndex = index;
        this.loadImage();
    }

    setShootSpeed() {

    }

    loadImage() {
        if (this.state == 'idle') {
            this.image.src = `../img/weapon/${this.imgSrc}/idle_${this.imageIndex}.png`;

        } else if (this.state == 'shoot') {
            this.image.src = `../img/weapon/${this.imgSrc}/shoot_${this.imageIndex}.png`;
        }
        this.image.onerror = () => {
            console.error("Failed to load weapon image");
        };
    }

    shooting() {
        this.state = "shoot"; // Chuyển sang trạng thái bắn
        this.imageIndex = 1; // Reset chỉ số ảnh cho trạng thái bắn
        this.loadImage();

        const bullet = new Bullet(this.context, this.x + 50, this.y, 'weapon', this.level * 10);
        this.bullets.push(bullet)
        this.au_shooting.loadSound('shooting_4', '../audio/shooting_4.mp3')
        this.au_shooting.playSound('shooting_4')


        setTimeout(() => {
            this.state = "idle"; // Trả về trạng thái idle
            this.imageIndex = 1; // Reset chỉ số ảnh cho trạng thái idle
            this.loadImage();
        }, 500);
    }

    draw(x = this.x, y = this.y) {
        if (this.image.complete) {
            this.context.drawImage(
                this.image,              // Ảnh nguồn
                x - this.width / 2, // Tọa độ x để vẽ (canh giữa)
                y - this.height / 2,// Tọa độ y để vẽ (canh giữa)
                this.width,              // Chiều rộng vẽ
                this.height              // Chiều cao vẽ
            );

            this.drawHitBox();
        }
        // draw bullets
        this.bullets.forEach(bullet => {
            if (bullet.visible) {
                bullet.draw()
            }
            return
        });
    }

    drawHitBox() {
        this.context.beginPath();
        this.context.strokeStyle = 'black';
        this.context.strokeRect(
            this.x - this.width / 2,
            this.y - this.height / 2,
            this.width,
            this.height
        );
        this.context.stroke();
    }

    update(enemies) {
        enemies.forEach(e => {

            this.collidingBullet_Enemy(e)
            this.bullets.forEach(bullet => bullet.update(e));
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
}