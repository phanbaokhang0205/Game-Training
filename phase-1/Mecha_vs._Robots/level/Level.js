import { GameManager } from "../managers/GameManager.js";
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

    update(winMenu, winPoints, winSuns, winLives) {
        // Update game logic
        EnemyManager.instance.update()
        if (EnemyManager.instance.checkClearEnemies()) {
            this.onWon(winMenu, winPoints, winSuns, winLives)
        }
        if (EnemyManager.instance.checkEnemiesReachEnd()) {
            this.onLose()
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

    onWon(winMenu, winPoints, winSuns, winLives) {
        LevelManager.instance.loadNextLevel();

        if (LevelManager.instance.currentLevelId > 3) {
            winMenu.classList.add("show");
            winPoints.textContent = EnemyManager.instance.enemiesKilled.length;
            winSuns.textContent = GameManager.instance.suns;
            winLives.textContent = GameManager.instance.lives;
            return;         
        }

    }

    onLose() {
        // Handle level failure
        console.log("THUA");
    }
}