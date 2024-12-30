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
                this.x - this.width / 2 < other.x + other.width / 2 &&
                this.x + this.width / 2 > other.x - other.width / 2 &&
                this.y - this.height / 2 < other.y + other.height / 2 &&
                this.y + this.height > other.y - other.height / 2
            );
        }
        return false;
    }

    onCollision(other) {
        console.log("Collision detected with:", other);
    }
}