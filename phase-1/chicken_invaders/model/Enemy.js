import { Collider } from "../helper/Collider.js";
import { Bullet } from "./Bullet.js";

export class Enemy extends Collider {
    constructor(context, x, y, HP, level) {
        super(x, y)
        this.context = context;
        this.x = x;
        this.y = y;
        this.speed = 0.1;
        this.color = 'red'
        this.image = new Image;

        this.imageIndex = 1;
        this.width = 100;
        this.height = 90;
        this.bullets = []

        this.state = 'walk'

        this.walkSprite = 8
        this.shootSprite = 8
        this.attackSprite = 7
        this.hurtSprite = 3
        this.deadSprite = 7

        this.isDamaged = false
        this.HP = HP;
        this.DTPB = 0; // damage taken per bullet
        this.isAlive = true;
        this.level = level;
        this.damage = this.level * 10

        // load image
        this.loadImage();

        // walk animation
        setInterval(() => {
            if (this.state === "walk") {
                this.imageIndex = (this.imageIndex % this.walkSprite) + 1;
            }
            this.loadImage();
        }, 250);

        // hurt animation
        setInterval(() => {
            if (this.state === "hurt") {
                this.imageIndex = (this.imageIndex % this.hurtSprite) + 1;
            }
            this.loadImage();
        }, 110);
        // Goi ham isHurt ngay lap tuc khi isDamaged = true
        // setInterval(() => this.isHurt(), 1)

        // attack
        setInterval(() => {
            if (this.state === "attack") {
                this.imageIndex = (this.imageIndex % this.attackSprite) + 1;
            }
            this.loadImage();
        }, 200);

        // dead
        // **Chưa được**
        setInterval(() => {
            if (this.state === "dead") {
                this.imageIndex = (this.imageIndex % this.deadSprite) + 1;
            }
            this.loadImage();
        }, 300);
    }

    loadImage() {
        // this.image.src = `../img/enemy_1/robot1/${this.state}_${this.imageIndex}.png`;
        this.image.src = `../img/enemy_1/robot1/${this.state}/tile00_${this.imageIndex}.png`;
    }

    changeImage(index) {
        // Cập nhật chỉ số ảnh và load ảnh mới
        this.imageIndex = index;
        this.loadImage();
    }

    shoot() {
        this.state = "shoot"; // Chuyển sang trạng thái bắn
        this.imageIndex = 1; // Reset chỉ số ảnh cho trạng thái bắn
        this.speed = 0; // Đứng yên để bắn
        this.loadImage();

        const bullet = new Bullet(this.context, this.x - 50, this.y, "enemy");
        this.bullets.push(bullet)
        // this.au_shooting.loadSound('shooting_4', '../audio/shooting_4.mp3')
        // this.au_shooting.playSound('shooting_4')


        setTimeout(() => {
            this.state = "walk";
            this.imageIndex = 1;
            this.speed = 0.5;
            this.loadImage();
        }, 1000);
    }

    // isHurt() {
    //     if (!this.isDamaged) return

    //     this.state = 'hurt';
    //     this.imageIndex = 1;
    //     this.speed = 0;
    //     this.loadImage()
    //     this.isDamaged = false

    //     this.HP -= this.DTPB;

    //     setTimeout(() => {
    //         this.state = "walk";
    //         this.imageIndex = 1;
    //         this.speed = 0.5;
    //         this.loadImage();
    //     }, 120 * 3);
    // }

    /** Logic attack
     * 1. Kiem tra va cham với Weapon
     * 2. Phát hiện va chạm.
     * 3. Gọi hàm attack()
     * 4. 
     */

    attack() {
        this.state = 'attack';
        this.imageIndex = 1;
        this.speed = 0;
        this.loadImage()
    }

    dead() {
        if (this.HP <= 0) {
            this.state = 'dead';
            this.isAlive = false;
            this.imageIndex = 1;
            this.speed = 0;
            this.loadImage()
        }
    }

    draw() {
        if (!this.isAlive) return;

        this.context.drawImage(
            this.image,              // Ảnh nguồn
            this.x - this.width / 2, // Tọa độ x để vẽ (canh giữa)
            this.y - this.height / 2,// Tọa độ y để vẽ (canh giữa)
            this.width,              // Chiều rộng vẽ
            this.height              // Chiều cao vẽ
        );
        this.drawHitBox();

        // Enemy bắn đạn
        // this.bullets.forEach(bullet => {
        //     if (bullet.visible) {
        //         bullet.draw()
        //     }
        //     return
        // });

    }

    drawHitBox() {
        this.context.beginPath();
        this.context.strokeStyle = this.color;
        this.context.strokeRect(
            this.x - this.width / 2,
            this.y - this.height / 2,
            this.width,
            this.height
        );
        this.context.stroke();
    }

    update(weapons) {
        if (this.state == 'walk') {
            this.x -= this.speed
        }
        
        weapons.forEach(weapon => {
            // Kiểm tra va chạm với Weapon
            if (this.checkCollision(weapon) && this.state !== 'attack') {
                this.attack()
            }
        })

        // Kiem tra trang thai alive 
        // **Chưa được**
        this.dead()

    }
}