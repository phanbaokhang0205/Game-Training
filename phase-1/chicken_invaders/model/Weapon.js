import { Bullet } from "./Bullet.js";
import { AudioManager } from "../helper/AudioManager.js";

export class Weapon{
    constructor(context, x, y, imgSrc, idleSprite, shootSprite, level, isShoot, HP) {
        this.context = context;
        this.x = x;
        this.y = y;
        this.imgSrc = imgSrc;
        this.src = `../img/new_weapon/${this.imgSrc}/idle_1.png`
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

        // audio
        this.au_shooting = new AudioManager()

        // load image
        this.numberSprites = 4;
        this.currentFrame = 0;
        this.loadImage()

        // collider
        this.collider = null;

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
                this.currentFrame++
            }
        }, 150);

        setInterval(() => {
            if (this.state === "shoot") {
                this.currentFrame++
            }

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
            this.image.src = `../img/new_weapon/${this.imgSrc}/Idle.png`;

        } else if (this.state == 'shoot') {
            this.image.src = `../img/new_weapon/${this.imgSrc}/Shoot.png`;
        }
        this.image.onload = () => {
            if (this.level === 3) {
                this.width = this.image.width / this.numberSprites
                this.height = this.image.height
            }
            else {
                this.width = (this.image.width / this.numberSprites) * 1.5
                this.height = (this.image.height) * 1.5
            }

            
        };
        this.image.onerror = () => {
            console.error("Failed to load weapon image");
        };
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

        // const bullet = new Bullet(this.context, this.x, this.y, 'weapon', this.level * 1);
        // this.bullets.push(bullet)
        this.au_shooting.loadSound('shooting_4', '../audio/shooting_4.mp3')
        this.au_shooting.playSound('shooting_4')


        setTimeout(() => {
            this.state = "idle"; // Trả về trạng thái idle
            this.loadImage();
        }, 400);
    }

    draw() {
        if (!this.isAlive) return;

        if (this.state == 'idle') {
            this.numberSprites = 4
            this.loadAnimation(this.image, 4, 1)
        }
        if (this.state == 'shoot') {
            if (this.level === 3) {
                this.numberSprites = 4
                this.loadAnimation(this.image, 4, 1)
            }
            else {
                this.numberSprites = 6
                this.loadAnimation(this.image, 6, 1)
            }
        }
        // if (this.image.complete) {
        //     this.context.drawImage(
        //         this.image,              // Ảnh nguồn
        //         x - this.width / 2, // Tọa độ x để vẽ (canh giữa)
        //         y - this.height / 2,// Tọa độ y để vẽ (canh giữa)
        //         this.width,              // Chiều rộng vẽ
        //         this.height              // Chiều cao vẽ
        //     );

        //     // Vẽ thanh máu
        //     this.context.fillStyle = "green";
        //     const hpBarWidth = (this.width * this.HP) / 100; // Giả sử max HP là 100
        //     this.context.fillRect(this.x - this.width / 2, this.y - this.height / 2 - 10, hpBarWidth, 5);

        //     // this.drawHitBox();
        // }
        // draw bullets
        // Vẽ thanh máu
        // this.context.fillStyle = "green";
        // const hpBarWidth = ((this.width) * this.HP) / 20; // Giả sử max HP là 1000
        // this.context.fillRect(this.x, this.y - 10, hpBarWidth, 5);

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

    update(enemies) {
        enemies.forEach(e => {
            this.bullets.forEach((bullet, index) => {
                if (bullet.onCollision(e)) {
                    this.bullets.splice(index, 1)
                }
                bullet.update(e)
            });
        })
    }

    // collidingBullet_Enemy(other) {
    //     this.bullets.forEach((b) => {
    //         if (b.checkCollision(other)) {
    //             this.au_hitEnemy.loadSound('pipe_hit', '../audio/pipe_hit.mp3')
    //             this.au_hitEnemy.playSound('pipe_hit')
    //             return true
    //         }
    //     })

    //     return false
    // }
}