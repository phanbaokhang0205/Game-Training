import { Enemy } from "../model/Enemy.js";

export class EnemyManager {
    static instance = null
    constructor() {
        this.enemies = [];
        EnemyManager.instance = this
    }

    draw() {
        
    }

    update() { }

    addEnemy() {
        let enemy = new Enemy()
        this.enemies.push(enemy)
    }

}