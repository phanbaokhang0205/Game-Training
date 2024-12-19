import { Collider } from "../helper/Collider.js";

export class Enemy extends Collider{
    constructor(context, x, y) {
        super(x, y)
        this.context = context;
        this.x = x;
        this.y = y;
        this.color = 'red'
        this.image = new Image;

        this.imageIndex = 1; // Chỉ số ảnh ban đầu
        this.width = 50;     // Chiều rộng cố định của ảnh ship
        this.height = 90;   // Chiều cao cố định của ảnh ship

        // load image
        this.loadImage();
    }

    loadImage() {
        this.image.src = `../img/enemy_1/ship_${this.imageIndex}.png`;
        this.image.onload = () => {
            // console.log("Ship image loaded successfully");
        };
        this.image.onerror = () => {
            console.error(`Failed to load Ship image ${this.imageIndex}`);
        };
    }

    changeImage(index) {
        // Cập nhật chỉ số ảnh và load ảnh mới
        this.imageIndex = index;
        this.loadImage();
    }

    draw() {
        if (this.image.complete) {
            this.context.drawImage(
                this.image,              // Ảnh nguồn
                this.x - this.width / 2, // Tọa độ x để vẽ (canh giữa)
                this.y - this.height / 2,// Tọa độ y để vẽ (canh giữa)
                this.width,              // Chiều rộng vẽ
                this.height              // Chiều cao vẽ
            );
            this.drawHitBox();
        }

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

    update() {
        
    }
}