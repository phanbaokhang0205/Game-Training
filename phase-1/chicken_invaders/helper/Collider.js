export class Collider {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }

    checkCollision(other) {
        if (other instanceof Collider) {
            return (
                this.x < other.x + other.image.width &&
                this.x + this.image.width > other.x &&
                this.y < other.y + other.image.height &&
                this.y + this.image.height > other.y
            );
        }
        return false;
    }

    onCollision(other) {
        console.log("Collision detected with:", other);
    }
}