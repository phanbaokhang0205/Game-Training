export class Collider {
    constructor(x, y, onCollide, owner) {
        this.x = x;
        this.y = y;
        this.isColliding = false;
        this.onCollide = onCollide;
        this.owner = owner;
    }

    checkCollision(other) {
        throw new Error("checkCollision() must be implemented in a subclass");
    }

    onCollision(other) {
        this.isColliding = true;
        this.onCollide?.(other)
    }
}

