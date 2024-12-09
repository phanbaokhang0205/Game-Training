export class GameManager {
    constructor() {
        this.score = 0;
        this.state = 'playing'; // Possible states: 'playing', 'paused', 'gameOver'
    }

    setState(newState) {
        this.state = newState;
    }

    updateScore(points) {
        this.score += points;
    }

    resetGame() {
        this.score = 0;
        this.state = 'playing';
    }
}

// const gameManager = new GameManager();
// gameManager.updateScore(10);  // Updates the score
// gameManager.setState('paused'); // Changes the game state

