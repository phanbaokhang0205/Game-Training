import { Collider } from "../helper/Collider.js";

export class Bullet extends Collider{
    constructor(context, x, y) {
        super(x, y)
        this.context = context;
        this.canvas = this.context.canvas;
        this.x = x;
        this.y = y;
        this.speed = 0.2;
        this.image = new Image;
        this.visible = true;
        
        // sprite
        this.imageIndex = 1; // Chỉ số ảnh ban đầu
        this.width = 40;     // Chiều rộng cố định của ảnh bullet
        this.height = 40;   // Chiều cao cố định của ảnh bullet

        this.loadImage();
    }

    loadImage() {
        this.image.src = `../img/Bullet/bullet_${this.imageIndex}.png`;
        this.image.onload = () => {
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
                this.x - this.width / 2, // Tọa độ x để vẽ (canh giữa)
                this.y - this.height / 2,// Tọa độ y để vẽ (canh giữa)
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
        this.y -= this.speed;
        this.checkCollision(other);
    }
    
}