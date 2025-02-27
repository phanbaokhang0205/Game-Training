import LevelManager from "../level/LevelManager.js";
import { EnemyManager } from "./enemyManager.js";
import { Grid } from "../model/Grid.js";

export class GameManager {
    static instance = null;
    constructor() {
        GameManager.instance = this;
        this.score = 0;
        this.suns = 130;
        this.state = 'start'; // Possible states: 'playing', 'pause', 'gameOver', 'gameWin'
        this.lives = 5;
    }

    setState(newState) {
        this.state = newState;
    }

    updateScore(points) {
        this.score += points;
    }

    updateSun(sun) {
        this.suns += sun
    }

    restartGame() {
        this.suns = 150;
        EnemyManager.instance.clearEnemies()
        Grid.instance.clearWeapons()
        LevelManager.instance.currentLevelId = 1;
        LevelManager.instance.startLevel();
        this.state = 'playing';
    }

    onWon(winMenu, winPoints, winSuns, winLives) {
        if (LevelManager.instance.currentLevelId > 3 && EnemyManager.instance.checkClearEnemies()) {
            winMenu.classList.add("show");
            winPoints.textContent = EnemyManager.instance.enemiesKilled.length;
            winSuns.textContent = GameManager.instance.suns;
            winLives.textContent = GameManager.instance.lives;
            return;
        }
    }

}


