import { EnemyManager } from "../managers/enemyManager.js";

export default class Level {
    constructor() {
        this.isLoaded = false;
        this.isPaused = false;

        console.log(EnemyManager.instance);
    }

    init(data) {
        // Initialize level components
        EnemyManager.instance.init(data.enemies)
    }

    draw(context) {
        EnemyManager.instance.draw(context)
    }

    update() {
        // Update game logic
        EnemyManager.instance.update()
    }

    pause() {
        this.isPaused = true;
    }

    resume() {
        this.isPaused = false;
    }

    // Event handlers
    onLoaded() {
        this.isLoaded = true;
    }

    onWon() {
        // Handle level completion
    }

    onLose() {
        // Handle level failure
    }
}