export class Vector {
    
    constructor(x = 0, y = 0) {
        this.x = x;
        this.y = y;
    }
    
    // Hàm cộng hai vector
    addVectors(v) {
        return new Vector(this.x + v.x, this.y + v.y);
        // return { x: v1.x + v2.x, y: v1.y + v2.y };
    }

    // Hàm trừ hai vector
    subtractVectors(v) {
        return new Vector(this.x - v.x, this.y - v.y);
        // return { x: v1.x - v2.x, y: v2.y - v2.y };
    }

    // Hàm nhân vector với một số vô hướng
    multiplyVector(scalar) {
        return new Vector(this.x * scalar, this.y * scalar);
        // return { x: v.x * scalar, y: v.y * scalar };
    }

    // Hàm tính độ lớn của vector
    magnitude() {
        return Math.sqrt(this.x * this.x + this.y * this.y);
    }

    // Hàm chuẩn hóa vector
    normalize() {
        const mag = this.magnitude();
        return new Vector(this.x/mag, this.y/mag);
        // return { x: v.x / mag, y: v.y / mag };
    }
}
