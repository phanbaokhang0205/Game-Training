export class CollisionManager {
    constructor() {
        this.colliders = [];
    }

    addCollider(collider) {
        this.colliders.push(collider);
    }

    removeCollider(collider) {
        const index = this.colliders.indexOf(collider);
        if (index > -1) this.colliders.splice(index, 1);
    }

    checkCollisions() {
        for (let i = 0; i < this.colliders.length; i++) {
            for (let j = i + 1; j < this.colliders.length; j++) {
                const colliderA = this.colliders[i];
                const colliderB = this.colliders[j];

                if (colliderA.checkCollision(colliderB)) {
                    colliderA.onCollision(colliderB);
                    colliderB.onCollision(colliderA);
                }
            }
        }
    }
}

// const collisionManager = new CollisionManager();