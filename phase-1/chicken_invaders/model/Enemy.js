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
        this.bullets = []
        
        this.state = 'Walk'
        
        // number of sprites
        this.walkSprite = 8
        this.shootSprite = 8
        this.attackSprite = 4
        this.hurtSprite = 3
        this.deadSprite = 7
        
        this.numberSprites = 8
        this.currentFrame = 8;

        // properties
        this.isDamaged = false
        this.HP = HP * level;
        this.DTPB = 0; // damage taken per bullet
        this.isAlive = true;
        this.level = level;
        this.damage = this.level * 10
        this.targetWeapons = null;

        // load image
        this.loadImage();

        // walk animation
        setInterval(()=> {
            if(this.state == 'Walk') {
                this.currentFrame--;
            }
        }, 250)

        // attack
        setInterval(() => {
            if (this.state === "attack") {
                this.currentFrame--;
            }
        }, 250);

        // hurt animation
        setInterval(() => {
            if (this.state === "hurt") {
                this.imageIndex = (this.imageIndex % this.hurtSprite) + 1;
            }
            this.loadImage();
        }, 110);
        // setInterval(() => this.isHurt(), 1)

        

        // dead
        // **Chưa được**
        // setInterval(() => {
        //     if (this.state === "dead") {
        //         this.imageIndex = (this.imageIndex % this.deadSprite) + 1;
        //     }
        //     this.loadImage();
        // }, 300);
    }

    loadImage() {
        // this.image.src = `../img/enemy_1/robot1/${this.state}/tile00_${this.imageIndex}.png`;
        this.image.onload = () => {
            this.width = this.image.width / this.numberSprites;
            this.height = this.image.height / 1;
        };
        this.image.src = `../img/enemy_1/robot1/Destroyer/${this.state}.png`;
    }
    

    loadAnimation(sprite, cols, rows) {

        let maxFrame = cols * rows - 1;

        // let maxFrame = cols * rows - 1;
        // let currentFrame = 0;
        if (this.currentFrame < 0) {
            this.currentFrame = maxFrame;
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
            this.x - this.width / 2, // Tọa độ x vẽ trên canvas
            this.y - this.height / 2, // Tọa độ y vẽ trên canvas
            this.width, // Chiều rộng trên canvas
            this.height // Chiều cao trên canvas
        );

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

    walk() {
        this.state = "Walk";
        this.speed = 0.5;
        this.loadImage();
    }

    attack() {
        this.state = 'attack';
        this.speed = 0;
        this.loadImage()
    }

    dead() {
        if (this.HP <= 0) {
            this.state = 'dead';
            this.isAlive = false;
            this.speed = 0;
            this.loadImage()
        }
    }

    draw() {
        if (!this.isAlive) return;
        
        if (this.state == 'Walk') {
            this.numberSprites = 8
            this.loadAnimation(this.image, this.walkSprite, 1)
        }
        if (this.state == 'attack') {
            this.numberSprites = 4
            this.loadAnimation(this.image, this.attackSprite, 1)
        }
        if (this.state == 'hurt') {
            
        }
        if (this.state == 'dead') {

        }

        // Vẽ thanh máu
        this.context.fillStyle = "red";
        const hpBarWidth = (this.width * this.HP) / 1000; // Giả sử max HP là 1000
        this.context.fillRect(this.x - this.width / 2, this.y - this.height / 2 - 10, hpBarWidth, 5);

        // this.drawHitBox();
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
        if (!this.isAlive) return;

        if (this.state == 'Walk') {
            this.x -= this.speed
        }

        // Kiểm tra va chạm với Weapon
        weapons.forEach(weapon => {
            if (this.checkCollision(weapon) && this.state !== 'attack') {
                this.targetWeapons = weapon
                this.attack()
            }
        })

        // Kiểm tra nếu đang tấn công một Weapon
        if (this.targetWeapons) {
            // Nếu Weapon đã chết, trở về trạng thái "walk"
            if (!this.targetWeapons.isAlive) {
                this.targetWeapons = null
                this.walk()
            }
            return // Không kiểm tra các Weapon của các Enemy khác chỉ kiểm tra đối với weapon mà Enemy va chạm
        }



        // Kiem tra trang thai alive 
        // **Chưa được**
        this.dead()

    }
}