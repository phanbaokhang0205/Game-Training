import { AudioManager } from "../helper/AudioManager.js";
import RectCollider from "../helper/RectCollider.js";
import { Enemy } from "./Enemy.js";

export class Bullet {
    constructor(context, x, y, belongTo, damage) {
        this.context = context;
        this.canvas = this.context.canvas;
        this.x = x;
        this.y = y;
        this.speed = 10;
        this.image = new Image;

        this.au_hitEnemy = new AudioManager()

        this.belongTo = belongTo;
        this.damage = damage;

        // sprite
        this.loadImage();

        // collider
        this.collider = null;
    }

    loadImage() {
        this.image.src = `../img/new_weapon/${this.belongTo}/bullet.png`;
        this.image.onload = () => {
            this.width = this.image.width;     // Chiều rộng cố định của ảnh bullet
            this.height = this.image.height;

            this.collider = new RectCollider(
                this.x, this.y,
                this.width, this.height,
                this.onCollision.bind(this)
            )

        };
        this.image.onerror = () => {
            console.error("Failed to load Bullet image");
        };

    }

    update(other) {
        this.x += this.speed / window.dt;
        this.onCollision(other)
    }

    onCollision(enemy) {
        if (!this.collider || !enemy.collider) return

        if (this.collider.checkCollision(enemy.collider)) {
            this.au_hitEnemy.loadSound('pipe_hit', '../audio/pipe_hit.mp3')
            this.au_hitEnemy.playSound('pipe_hit')
            enemy.isDamaged = true;
            enemy.DTPB = this.damage;
            enemy.HP -= enemy.DTPB
            console.log(enemy.HP);

            return true
        }
    }


    draw() {
        if (this.image.complete) {
            this.context.drawImage(
                this.image,              // Ảnh nguồn
                this.x, // Tọa độ x để vẽ (canh giữa)
                this.y,// Tọa độ y để vẽ (canh giữa)
                this.width,              // Chiều rộng vẽ
                this.height              // Chiều cao vẽ
            );

            this.drawHitBox();
        }
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



}