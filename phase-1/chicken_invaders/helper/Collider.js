export class Collider {
    constructor(x, y, onCollide) {
        this.x = x;
        this.y = y;
        this.isColliding = false;
        this.onCollide = onCollide
    }

    checkCollision(other) {
        throw new Error("checkCollision() must be implemented in a subclass");
    }

    onCollision(other) {
        if (!this.isColliding) {
            this.isColliding = true;
            this.onCollide?.(other)
        }
    }
}

