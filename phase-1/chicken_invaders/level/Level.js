import { EnemyManager } from "../managers/enemyManager.js";
import LevelManager from "./LevelManager.js";

export default class Level {
    constructor() {
        this.isLoaded = false;
        this.isPaused = false;
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
        if (EnemyManager.instance.checkClearEnemies()) {
            this.onWon()
        }
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
        LevelManager.instance.loadNextLevel()
    }

    onLose() {
        // Handle level failure
    }
}