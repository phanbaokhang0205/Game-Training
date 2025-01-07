import { Collider } from "./Collider.js";

export default class RectCollider extends Collider {
    constructor(x, y, width, height, onCollide) {
        super(x, y, onCollide);
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
}