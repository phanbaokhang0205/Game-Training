import { Collider } from "./Collider.js";

export default class RectCollider extends Collider {
    constructor(x, y, width, height, onCollide, owner) {
        super(x, y, onCollide, owner);
        this.width = width;
        this.height = height;
    }

    checkCollision(other) {
        if (other instanceof RectCollider) {
            return (
                this.x < other.x + other.width &&
                this.x + this.width > other.x &&
                this.y < other.y + other.height &&
                this.y + this.height > other.y
            );
        }
        return false;
    }

    updatePosition(x, y) {
        this.x = x;
        this.y = y;
    }
}