// import level data to here

export default class LevelLoader {
    loadLevel(levelId) {
        const data = require(`./data/level_${levelId}.json`);
        return data;
    }
}