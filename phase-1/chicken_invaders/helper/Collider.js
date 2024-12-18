export class Collider {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.width = 0;
        this.height = 0;
    }

    checkCollision(other) {
        if (other instanceof Collider) {
            return (
                this.x < other.x + other.width &&
                this.x + this.width > other.x &&
                this.y < other.y + other.height &&
                this.y + this.height > other.y
            );
        }
        return false;
    }

    

    onCollision(other) {
        console.log("Collision detected with:", other);
    }
}