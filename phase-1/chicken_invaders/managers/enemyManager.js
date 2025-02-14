import { Enemy } from "../model/Enemy.js";

export class EnemyManager {
    static instance = null;
    
    constructor() {
        this.enemies = [];
        EnemyManager.instance = this;
    }

    init(data) {
        this.enemies=[]
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
}