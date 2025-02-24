import LevelLoader from "./LevelLoader.js";
import Level from "./Level.js";

export default class LevelManager {
    static instance = null;
    constructor() {
        LevelManager.instance = this
        this.currentLevel = null;
        this.currentLevelId = 1
        this.levelLoader = new LevelLoader();
    }

    async loadLevel() {
        // Cleanup current level if exists
        if (this.currentLevel) {
            this.unloadCurrentLevel();
        }

        // Load new level data
        const levelData = await this.levelLoader.loadLevel(this.currentLevelId);

        // Create and initialize new level
        this.currentLevel = new Level();
        this.currentLevel.init(levelData);
    }

    unloadCurrentLevel() {
        // Cleanup resources
        this.currentLevel = null;
    }

    startLevel() {
        this.loadLevel();
    }

    loadNextLevel() {
        if (this.currentLevelId > 3) {
            return;
        } else {
            this.currentLevelId++;
            this.loadLevel();
        }
    }
}