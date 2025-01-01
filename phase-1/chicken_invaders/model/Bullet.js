import { Collider } from "../helper/Collider.js";

export class Bullet extends Collider {
    constructor(context, x, y, belongTo, damage) {
        super(x, y)
        this.context = context;
        this.canvas = this.context.canvas;
        this.x = x;
        this.y = y;
        this.speed = 1;
        this.image = new Image;
        this.visible = true;
        this.belongTo = belongTo;
        this.damage = damage;

        // sprite
        this.imageIndex = 1; // Chỉ số ảnh ban đầu
        // this.width = this.image.width;     // Chiều rộng cố định của ảnh bullet
        // this.height = this.image.height;   // Chiều cao cố định của ảnh bullet

        this.loadImage();
    }

    loadImage() {
        
        this.image.src = `../img/bullet/bullet1/bullet1_${this.imageIndex}.png`;
        this.image.onload = () => {
            this.width = this.image.width / 3;     // Chiều rộng cố định của ảnh bullet
            this.height = this.image.height / 3;
            // console.log("Bullet image loaded successfully");
        };
        this.image.onerror = () => {
            console.error("Failed to load Bullet image");
        };
        
    }

    changeImage(index) {
        // Cập nhật chỉ số ảnh và load ảnh mới
        this.imageIndex = index;
        this.loadImage();
    }


    draw() {
        if (!this.visible) return

        if (this.image.complete) {
            this.context.drawImage(
                this.image,              // Ảnh nguồn
                this.x , // Tọa độ x để vẽ (canh giữa)
                this.y ,// Tọa độ y để vẽ (canh giữa)
                this.width,              // Chiều rộng vẽ
                this.height              // Chiều cao vẽ
            );

            // this.drawHitBox();
        }
    }

    drawHitBox() {
        this.context.beginPath();
        this.context.strokeStyle = 'blue';
        this.context.strokeRect(
            this.x - this.width / 2,
            this.y - this.height / 2,
            this.width,
            this.height
        );
        this.context.stroke();
    }

    update(other) {
        
        if (this.belongTo == 'weapon') {
            this.x += this.speed;
            this.checkCollision(other);
        }
        if (this.belongTo == 'enemy') {
            this.x -= this.speed;
            this.checkCollision(other);
        }

    }

}