import { Bullet } from "./Bullet.js";
import { AudioManager } from "../helper/AudioManager.js";
import { Collider } from "../helper/Collider.js";
import RectCollider from "../helper/RectCollider.js";

export class Weapon {
    constructor(context, x, y, imgSrc, idleSprite, shootSprite, level, isShoot, HP) {
        this.context = context;
        this.x = x;
        this.y = y;
        this.imgSrc = imgSrc;
        this.src = `../img/weapon/${this.imgSrc}/idle_1.png`
        this.idleSprite = idleSprite
        this.shootSprite = shootSprite;


        this.isAlive = true;
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

        // load image
        // this.numberSprites = 14;
        // this.currentFrame = 0;
        this.loadImage()

        // sprite bullet
        let bulletSprite = 1;
        setInterval(() => {
            bulletSprite = (bulletSprite % 4) + 1; // Lặp từ 1 đến 5
            this.bullets.forEach(b => {
                b.changeImage(bulletSprite);
            })
        }, 50);

        // collider
        this.collider = null;

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


    decreaseHP(DTPE) {
        if (!this.isDamaged) {

            this.isDamaged = true;
            this.DTPE = DTPE;

            // Tạo một bộ đếm định kỳ
            this.HP -= this.DTPE;
            // Kiểm tra nếu HP <= 0 thì dừng giảm máu
            if (this.HP <= 0) {
                this.isAlive = false;
            }

            // Reset trạng thái `isDamaged` sau 2 giây
            setTimeout(() => {
                this.isDamaged = false;
            }, 550);
        }
    }


    loadImage() {
        if (this.state == 'idle') {
            this.image.src = `../img/weapon/${this.imgSrc}/idle_${this.imageIndex}.png`;

        } else if (this.state == 'shoot') {
            this.image.src = `../img/weapon/${this.imgSrc}/shoot_${this.imageIndex}.png`;
        }
        this.image.onload = () => {
            if (this.level === 1) {
                this.width = this.image.width / 1.2
                this.height = this.image.height / 1.2
            }
            else if (this.level === 2) {
                this.width = this.image.width / 1.5
                this.height = this.image.height / 1.5
            }
            else {
                this.width = this.image.width / 1.7
                this.height = this.image.height / 1.7
            }

            this.collider = new RectCollider(
                this.x, this.y,
                this.width, this.height,
                this.onCollision.bind(this)
            )


        };
        this.image.onerror = () => {
            console.error("Failed to load weapon image");
        };
    }

    onCollision(other) {

    }

    loadAnimation(sprite, cols, rows) {

        let maxFrame = cols * rows - 1;

        if (this.currentFrame > maxFrame) {
            this.currentFrame = 0;
        }

        // Define the size of a frame
        let frameWidth = this.image.width / cols;
        let frameHeight = this.image.height / rows;

        // Update rows and columns
        let column = this.currentFrame % cols;
        let row = Math.floor(this.currentFrame / cols);

        // Clear and draw
        this.context.drawImage(
            sprite,
            column * frameWidth, // Tọa độ x của khung hình
            row * frameHeight, // Tọa độ y của khung hình
            frameWidth, // Chiều rộng khung hình
            frameHeight, // Chiều cao khung hình
            this.x, // Tọa độ x vẽ trên canvas
            this.y, // Tọa độ y vẽ trên canvas
            this.width, // Chiều rộng trên canvas
            this.height // Chiều cao trên canvas
        );

    }

    shooting() {
        this.state = "shoot"; // Chuyển sang trạng thái bắn
        this.loadImage();

        const bullet = new Bullet(this.context, this.x, this.y + (this.height / 2), this.imgSrc, this.level * 1);
        this.bullets.push(bullet)
        this.au_shooting.loadSound('shooting_4', '../audio/shooting_4.mp3')
        this.au_shooting.playSound('shooting_4')


        setTimeout(() => {
            this.state = "idle"; // Trả về trạng thái idle
            this.loadImage();
        }, 400);
    }

    draw(x = this.x, y = this.y) {
        if (!this.isAlive) return;

        if (this.image.complete) {
            this.context.drawImage(
                this.image,              // Ảnh nguồn
                x, // Tọa độ x để vẽ (canh giữa)
                y,// Tọa độ y để vẽ (canh giữa)
                this.width,              // Chiều rộng vẽ
                this.height              // Chiều cao vẽ
            );

            // Vẽ thanh máu
            this.context.fillStyle = "green";
            const hpBarWidth = (this.width * this.HP) / 100; // Giả sử max HP là 100
            this.context.fillRect(this.x, this.y - 10, hpBarWidth, 5);

            // this.drawHitBox();
        }


        this.bullets.forEach(bullet => {
            bullet.draw()
        });

        this.drawHitBox();

    }

    drawHitBox() {
        this.context.beginPath();
        this.context.strokeStyle = 'blue';
        this.context.strokeRect(
            this.x,
            this.y,
            this.width,
            this.height
        );
        this.context.stroke();
    }

    update() {
        this.bullets.forEach((bullet) => {
            bullet.update()
        })
    }

    // update(enemies) {
    //     this.bullets.forEach((bullet, index) => {
    //         enemies.forEach(e => {
    //             if (bullet.onCollision(e)) {
    //                 this.bullets.splice(index, 1)
                    
    //             }
    //         });
    //         bullet.update()
    //     })
    // }
}