import RectCollider from "../helper/RectCollider.js";
import { CollisionManager } from "../helper/CollisionManager.js";
import { Weapon } from "./Weapon.js";
import { Bullet } from "./Bullet.js";


export class Enemy {
    constructor(x, y, level, HP, speed, damage, walkSprite, attackSprite, atkSpeed) {
        // properties
        this.isDamaged = false
        this.HP = HP;
        this.level = level;
        this.damage = damage
        this.speed = speed;
        this.baseSpeed = speed;

        this.image = new Image;

        this.bullets = []

        this.state = 'Walk'
        this.isAttack = false;

        // number of sprites
        this.walkSprite = walkSprite
        this.attackSprite = attackSprite
        this.hurtSprite = 3
        this.deadSprite = 7

        this.numberSprites = 8
        this.currentFrame = 8;

        

        this.isAlive = true;
        this.targetWeapons = null;


        // collider
        this.collider = new RectCollider(
            x, y,
            1, 1,
            this.onCollision.bind(this), this
        );

        CollisionManager.instance.addCollider(this.collider)


        // walk animation
        setInterval(() => {
            if (this.state == 'Walk') {
                this.currentFrame--;
            }
        }, 250)

        // attack
        setInterval(() => {
            if (this.state === "attack") {
                this.currentFrame--;
            }
        }, atkSpeed);

        console.log(this.atkSpeed);

        this.loadImage();
    }

    loadImage() {
        this.image.src = `../img/enemy_1/robot${this.level}/${this.state}.png`;

        this.image.onload = () => {
            this.width = this.image.width / this.numberSprites; // Đảm bảo width được gán đúng
            this.height = this.image.height;

            this.collider.width = this.width;
            this.collider.height = this.height;

        };

        this.image.onerror = () => {
            console.error("Failed to load enemy image");
        };
    }


    loadAnimation(sprite, cols, rows, context) {
        let maxFrame = cols * rows - 1;

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
        context.drawImage(
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

    dead() {
        if (this.HP <= 0) {
            this.state = 'dead';
            this.isAlive = false;
            this.loadImage()
        }
    }

    update() {
        if (!this.isAlive) return;

        if (this.isAttack && this.targetWeapons && !this.targetWeapons.isAlive) {
            this.targetWeapons = null;
            this.isAttack = false;
            this.state = 'Walk';
            this.speed = this.baseSpeed;
            this.loadImage();
        }

        if (!this.isAttack) {
            this.x -= this.speed;
        }

    }

    onCollision(otherCollider) {
        if (otherCollider.owner instanceof Bullet) {
            this.isDamaged = true;
            this.HP -= otherCollider.owner.damage
            console.log(otherCollider.owner.damage);

            if (this.HP <= 0) {
                this.isAlive = false
                CollisionManager.instance.removeCollider(this.collider)
            }

        } else if (otherCollider.owner instanceof Weapon) {
            this.isAttack = true;
            this.state = 'attack';
            this.speed = 0;
            this.targetWeapons = otherCollider.owner;
            this.loadImage();
        }


    }

    draw(context) {
        if (!this.isAlive) return;

        if (this.state == 'Walk') {
            this.numberSprites = this.walkSprite
            this.loadAnimation(this.image, this.walkSprite, 1, context)
        }
        else if (this.state == 'attack') {
            this.numberSprites = this.attackSprite
            this.loadAnimation(this.image, this.attackSprite, 1, context)
        }
        else if (this.state == 'hurt') {

        }
        else if (this.state == 'dead') {

        }

        // Vẽ thanh máu
        context.fillStyle = "red";
        const hpBarWidth = ((this.width) * this.HP) / this.HP; // Giả sử max HP là 1000
        context.fillRect(this.x, this.y - 10, hpBarWidth, 5);

        this.drawHitBox(context);
    }

    drawHitBox(context) {
        context.beginPath();
        context.strokeStyle = this.color;
        context.strokeRect(
            this.x,
            this.y,
            this.width,
            this.height
        );
        context.stroke();
    }

    get x() {
        return this.collider.x;
    }

    get y() {
        return this.collider.y;
    }

    set x(value) {
        this.collider.x = value;
    }

    set y(value) {
        this.collider.y = value;
    }
}