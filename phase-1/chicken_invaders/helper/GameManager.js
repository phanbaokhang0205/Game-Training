export class GameManager {
    constructor() {
        this.score = 0;
        this.suns = 200;
        this.state = 'playing'; // Possible states: 'playing', 'paused', 'gameOver'
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

    resetGame() {
        this.score = 0;
        this.state = 'playing';
    }
}

// const gameManager = new GameManager();
// gameManager.updateScore(10);  // Updates the score
// gameManager.setState('paused'); // Changes the game state

