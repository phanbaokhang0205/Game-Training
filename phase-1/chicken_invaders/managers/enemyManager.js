import { Enemy } from "../model/Enemy.js";

export class EnemyManager {
    static instance = null;

    constructor(gameMng) {
        this.enemies = [];
        this.enemyReachEnd = [];
        this.gameMng = gameMng
        EnemyManager.instance = this;
    }

    init(data) {
        this.enemies = []
        data.forEach(enemy => {
            this.addEnemy(
                enemy.x, enemy.y,
                enemy.level, enemy.HP,
                enemy.speed, enemy.damage,
                enemy.walkSpr, enemy.attackSpr, enemy.atkSpeed
            )
        });
    }

    draw(context) {
        this.enemies.forEach(enemy => {
            enemy.draw(context)
        })
    }

    update() {
        this.enemies.forEach(enemy => {
            enemy.update()
            if (!enemy.isAlive && enemy.x <= 0) {
                this.enemyReachEnd.push(enemy)
            }

            if (enemy.HP <= 0) {
                let sunPoints = 0;

                switch (enemy.level) {
                    case 1:
                        sunPoints = 5;
                        break;
                    case 2:
                        sunPoints = 10;
                        break;
                    default:
                        sunPoints = 20;
                        break;
                }

                this.gameMng.updateSun(sunPoints);
            }
        })
        this.enemies = this.enemies.filter((enemy) => enemy.isAlive);

    }

    addEnemy(x, y, level, HP, speed, damage, walkSpr, attackSpr, atkSpeed) {
        let enemy = new Enemy(x, y, level, HP, speed, damage, walkSpr, attackSpr, atkSpeed)
        this.enemies.push(enemy)
    }

    checkClearEnemies() {
        return this.enemies.length === 0;
    }

    checkEnemyReachEnd() {
        return this.enemyReachEnd.length >= 5;
    }

}