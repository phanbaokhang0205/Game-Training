export class Collider {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }

    checkCollision(other) {
        throw new Error("checkCollision() must be implemented in a subclass");
    }

    onCollision(other) {
        console.log("Collision detected with:", other);
    }
}