import LevelLoader from "./LevelLoader.js";
import Level from "./Level.js";

export default class LevelManager {
    static instance = null;
    constructor() {
        LevelManager.instance = this
        this.currentLevel = null;
        this.levelLoader = new LevelLoader();
        this.currentLevelId = 1
    }

    async loadLevel() {
        // Cleanup current level if exists
        if (this.currentLevel) {
            this.unloadCurrentLevel();
        }

        // Load new level data
        const levelData = await this.levelLoader.loadLevel(this.currentLevelId);
        console.log("Loaded Level Data:", levelData);

        // Create and initialize new level
        this.currentLevel = new Level();
        console.log(this.currentLevel);
        this.currentLevel.init(levelData);
    }

    unloadCurrentLevel() {
        // Cleanup resources
        this.currentLevel = null;
    }

    async startLevel() {
        await this.loadLevel();
    }

    loadNextLevel() {
        this.currentLevelId++;
        this.loadLevel();
    }
}