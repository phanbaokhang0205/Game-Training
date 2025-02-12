import Level from "./Level.js";
import LevelLoader from "./LevelLoader.js";

export default class LevelManager {
    constructor() {
        this.currentLevel = null;
        this.levelLoader = new LevelLoader();
    }

    async loadLevel(levelId) {
        // Cleanup current level if exists
        if (this.currentLevel) {
            this.unloadCurrentLevel();
        }

        // Load new level data
        const levelData = await this.levelLoader.loadLevel(levelId);

        // Create and initialize new level
        this.currentLevel = new Level();
        this.currentLevel.init(levelData);
    }

    unloadCurrentLevel() {
        // Cleanup resources
        this.currentLevel = null;
    }
}