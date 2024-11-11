export class Vector {
    
    constructor(x = 0, y = 0) {
        this.x = x;
        this.y = y;
    }
    // Hàm cộng hai vector
    static addVectors(v1, v2) {
        return { x: v1.x + v2.x, y: v1.y + v2.y };
    }

    // Hàm trừ hai vector
    static subtractVectors(v1, v2) {
        return { x: v1.x - v2.x, y: v2.y - v2.y };
    }

    // Hàm nhân vector với một số vô hướng
    static multiplyVector(v, scalar) {
        return { x: v.x * scalar, y: v.y * scalar };
    }

    // Hàm tính độ lớn của vector
    static magnitude(v) {
        return Math.sqrt(v.x * v.x + v.y * v.y);
    }

    // Hàm chuẩn hóa vector
    static normalize(v) {
        const mag = magnitude(v);
        return { x: v.x / mag, y: v.y / mag };
    }
}
