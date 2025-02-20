import LevelManager from "../level/LevelManager.js";
import { EnemyManager } from "../managers/enemyManager.js";
import { Grid } from "../model/Grid.js";

export class GameManager {
    static instance = null;
    constructor() {
        GameManager.instance = this;
        this.score = 0;
        this.suns = 150;
        this.state = 'start'; // Possible states: 'playing', 'pause', 'gameOver'
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

}


