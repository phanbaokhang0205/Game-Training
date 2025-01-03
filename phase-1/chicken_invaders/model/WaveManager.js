import { Enemy } from "./Enemy.js"

/**
 * Mỗi wave có số lượng và kiểu enemy khác nhau.
 * Wave 1: enemy 1, enemy 2: renderTime = 3500ms.
 * Wave 2: enemy 2, enemy 3: renderTime = 2500ms.
 * Wave 3 (Final):enemy 3: renderTime = 2000ms, hoặc 1 Boss.
 */
export class WaveManager {
    constructor(context, score) {
        this.context = context
        this.rows = 6
        this.cols = 9
        this.cw = context.canvas.width
        this.ch = context.canvas.height
        this.cellWidth = Math.floor(this.cw / this.cols);
        this.cellHeight = Math.floor(this.ch / this.rows);
        this.enemyHeight = 79;

        this.enemies = [];
        this.score = score;
        this.wave = 1;
        this.renderTime = 3500;

    }

    renderEnemy() {
        /**
         * Random vi tri x = cw, vi tri y bất kỳ
         */
        // Chỉ render trong 5 rows dưới cùng, bỏ row đầu tiên
        const randomRow = Math.floor(Math.random() * 5) + 1;

        const paddingY = 50; // Padding trên trục y

        // Tọa độ góc trên trái của cell
        const cellY = randomRow * this.cellHeight;

        const centerY = cellY + (this.cellHeight / 2) - (this.enemyHeight / 2) + paddingY;

        // Tạo enemy tại vị trí random
        const enemy = new Enemy(this.context, this.cw, centerY, 1000, 1);
        this.enemies.push(enemy);
    }

    renderWave() {
        // Wave 1: enemy 1(90%), enemy 2(10%): renderTime = 3500ms.
        if (this.score < 30) {
            this.wave = 1;
            this.renderTime = 3500;
            console.log("Wave 1 starts!");
            // render enemy
            this.enemyInterval = setInterval(() => {
                console.log(this.score);
                let randomEnemy = Math.floor(Math.random() * 100) + 1
                if (randomEnemy <= 10) {
                    console.log("Enemy 2 was generated.");
                } else {
                    console.log("Enemy 1 was generated.");
                }
            }, this.renderTime)
        }

        //  Wave 2:enemy 1(60%), enemy 2 (30%), enemy 3(10%): renderTime = 2500ms.
        if (this.score >= 30 && this.score < 60) {
            this.wave = 2
            this.renderTime = 2500;
            console.log("Wave 2 starts!");
            // render enemy
            clearInterval(this.enemyInterval);
            this.enemyInterval = setInterval(() => {
                let randomEnemy = Math.floor(Math.random() * 100) + 1
                if (randomEnemy <= 10) {
                    console.log("Enemy 3 was generated.");
                } else if (randomEnemy <= 70) {
                    console.log("Enemy 1 was generated.");
                } else {
                    console.log("Enemy 2 was generated.");
                }

            }, this.renderTime)
        }

        // Wave 3 (Final):enemy 3: renderTime = 2000ms, hoặc 1 Boss.
        if (this.score > 120) {
            console.log("Wave 3 starts!");
            this.wave = 3
            this.renderTime = 1500;

            // render enemy
            clearInterval(this.enemyInterval);
            this.enemyInterval = setInterval(() => {
                console.log("Enemy 3 was generated.");
            }, this.renderTime);
        }
    }


}