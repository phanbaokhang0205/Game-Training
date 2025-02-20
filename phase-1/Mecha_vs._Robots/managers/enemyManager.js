import { CollisionManager } from "../helper/CollisionManager.js";
import { GameManager } from "../helper/GameManager.js";
import { Enemy } from "../model/Enemy.js";

export class EnemyManager {
    static instance = null;

    constructor() {
        this.enemies = [];
        this.enemiesReachEnd = [];
        this.enemiesKilled = [];
        this.gameMng = GameManager.instance;
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
                this.enemiesReachEnd.push(enemy)
            }

            if (enemy.HP <= 0) {
                let sunPoints = 0;

                switch (enemy.level) {
                    case 1:
                        sunPoints = 10;
                        break;
                    case 2:
                        sunPoints = 20;
                        break;
                    default:
                        sunPoints = 30;
                        break;
                }
                this.enemiesKilled.push(enemy)
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

    checkEnemiesReachEnd() {
        return this.enemiesReachEnd.length >= 5;
    }

    clearEnemies() {
        this.enemies.forEach(enemy => {
            CollisionManager.instance.removeCollider(enemy.collider)
        });

    }
}