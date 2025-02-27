import { AudioManager } from "../managers/AudioManager.js";
import { CollisionManager } from "../managers/CollisionManager.js";
import { GameManager } from "../managers/GameManager.js";
import RectCollider from "../helper/RectCollider.js";
import { Enemy } from "./Enemy.js";
import { Weapon } from "./Weapon.js";

export class Bullet {
    constructor(x, y, belongTo, damage) {
        this.speed = 400;
        this.image = new Image;
        this.collider = new RectCollider(
            x, y,
            1, 1,
            this.onCollision.bind(this), this
        );

        CollisionManager.instance.addCollider(this.collider)

        this.au_hitEnemy = new AudioManager()
        this.au_hitEnemy.loadSound('pipe_hit', '../asset/audio/pipe_hit.mp3')

        this.belongTo = belongTo;
        this.damage = damage;

        // sprite
        this.imageIndex = 1;
        this.bulletAnimation = setInterval(() => {
            this.imageIndex = (this.imageIndex % 4) + 1;
            this.loadImage();
        }, 50);

        this.isHit = false;
        this.loadImage();

    }

    loadImage() {
        this.image.src = `../asset/img/bullet/${this.belongTo}/bullet${this.imageIndex}.png`;
        this.image.onload = () => {
            if (this.belongTo === 'weapon3') {
                this.width = this.image.width / 2;
                this.height = this.image.height / 2;
            } else if (this.belongTo === 'weapon2') {
                this.width = this.image.width;
                this.height = this.image.height;
            } else {
                this.width = this.image.width / 4;
                this.height = this.image.height / 4;
            }

            this.collider.width = this.width;
            this.collider.height = this.height;

        };
        this.image.onerror = () => {
            console.error("Failed to load Bullet image");
        };

    }

    update() {
        if (this.x >= 1000) {
            this.isHit = true
            CollisionManager.instance.removeCollider(this.collider);
        }

        this.x += this.speed * window.dt / 1000;
    }

    onCollision(otherCollider) {
        if (otherCollider.owner instanceof Enemy) {
            this.au_hitEnemy.playSound('pipe_hit')
            this.isHit = true;
            CollisionManager.instance.removeCollider(this.collider);
        } if (otherCollider.owner instanceof Weapon) {
            // console.log("collide with weapon");
        }
    }


    draw(context) {
        if (this.image.complete) {
            context.drawImage(this.image, this.x, this.y, this.width, this.height);
        }
        this.drawHitBox(context)
    }

    drawHitBox(context) {
        context.beginPath();
        context.strokeStyle = 'blue';
        context.strokeRect(
            this.x,
            this.y,
            this.width,
            this.height
        );
        context.stroke();
    }

    removeBullets() {
        CollisionManager.instance.removeCollider(this.collider);
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