// import level data to here

export default class LevelLoader {
    async loadLevel(levelId) {
        const response = await fetch(`../level/data/level_${levelId}.json`);
        const data = await response.json(); // Chuyển phản hồi thành JSON
        console.log(data);
        return data; 
    }
}