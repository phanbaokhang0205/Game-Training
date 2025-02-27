import RectCollider from "../helper/RectCollider.js";
import { CollisionManager } from "../managers/CollisionManager.js";
import { Weapon } from "./Weapon.js";
import { Bullet } from "./Bullet.js";
import { Grid } from "./Grid.js";


export class Enemy {
    constructor(x, y, level, HP, speed, damage, walkSprite, attackSprite, atkSpeed) {
        
        // properties
        this.isDamaged = false
        this.HP = HP;
        this.baseHP = HP;
        this.level = level;
        this.damage = damage
        this.speed = speed;
        this.baseSpeed = speed;

        this.image = new Image;

        this.bullets = []

        this.state = 'Walk'

        // number of sprites
        this.walkSprite = walkSprite
        this.attackSprite = attackSprite

        this.numberSprites = (this.state === 'Walk') ? walkSprite : attackSprite
        this.currentFrame = 8;

        this.rowEnemy = 0;


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

        this.loadImage();
    }

    loadImage() {
        this.image.src = `../asset/img/enemy_1/robot${this.level}/${this.state}.png`;

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
            column * frameWidth,
            row * frameHeight,
            frameWidth,
            frameHeight,
            this.x,
            this.y,
            this.width,
            this.height
        );
    }

    update() {
        this.rowEnemy = Math.floor(this.y / Grid.instance.cellHeight);

        if (!this.isAlive) return;

        if (this.x < - this.width) {
            this.isAlive = false
            CollisionManager.instance.removeCollider(this.collider)
        }

        if (this.targetWeapons && !this.targetWeapons.isAlive) {
            this.targetWeapons = null;
            this.state = 'Walk';
            this.speed = this.baseSpeed;
            this.loadImage();
        }

        this.x -= this.speed * window.dt / 1000;
    }

    onCollision(otherCollider) {
        if (otherCollider.owner instanceof Bullet) {

            this.isDamaged = true;
            this.HP -= otherCollider.owner.damage

            if (this.HP <= 0) {
                this.isAlive = false
                CollisionManager.instance.removeCollider(this.collider)
            }

        } else if (otherCollider.owner instanceof Weapon) {
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

        this.drawHUD(context)
        this.drawHitBox(context);
    }

    drawHUD(context) {
        context.fillStyle = "red";
        const hpBarWidth = (this.width * this.HP) / this.baseHP;
        context.fillRect(this.x, this.y - 10, hpBarWidth, 5);
    }

    drawHitBox(context) {
        context.beginPath();
        context.strokeStyle = "red";
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