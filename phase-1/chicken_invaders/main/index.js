import { GameManager } from "../helper/GameManager.js";
import { AudioManager } from "../helper/AudioManager.js";
import { Enemy } from "../model/Enemy.js";
import { Grid } from "../model/Grid.js";
import { WaveManager } from "../model/WaveManager.js";
import { CollisionManager } from "../helper/CollisionManager.js";

/**
 * TODO: BUG
 * 1. Weapon chết nhưng không bị xóa khỏi game 
 *  - Đã remove ra khỏi objec Collider.
 *  - Đã xóa khỏi mảng weapons trong class Grid.
 *  - Đã xóa khỏi ô của Grid.
 * trong mảng của weapon thì mất nhưng vẫn nghe tiếng đạn, enemy vẫn bị dính damge.
 * 
 * 
 * 2. Enemy khi collide lần đầu tiên với Weapon thì chuyển state = 'attack', dù không còn Weapon nào trước mặt
 * (không còn collide với weapon nữa) nhưng Enemy vẫn ở trong state='attack'.
 * 
 * 3. Lỗi sprite attack của enemey.
 */

let canvas;
let context;
let cw;
let ch;
let gameManager;
let waveManager;
let grid;
let colliderManager;

// 
let enemies;
let weapons;

// audio
let get_star
let game_over

window.onload = init

function init() {
    canvas = document.getElementById('canvas')
    context = canvas.getContext('2d')
    cw = canvas.width
    ch = canvas.height

    // status game
    gameManager = new GameManager()
    colliderManager = new CollisionManager()

    // renderEnemies()
    waveManager = new WaveManager(context, gameManager.score)
    waveManager.renderEnemy()

    waveManager.renderEnemy()
    setInterval(() => {
        waveManager.renderEnemy()
    }, 100000000)

    // grid
    grid = new Grid(6, 9, context, cw, ch)

    // Audio
    get_star = new AudioManager();
    game_over = new AudioManager();


    requestAnimationFrame(gameLoop)
}

function update() {
    enemies = waveManager.enemies.filter(enemy => enemy.isAlive);
    // weapons = grid.weapons.filter(weapon => weapon.isAlive);

    let kills = waveManager.enemies.filter(enemy => !enemy.isAlive)
    gameManager.score = kills.length;

    grid.updateWeapon()
    // Cập nhật Weapons và kiểm tra va chạm
    // weapons.forEach(weapon => {
    //     weapon.update();
    // });

    waveManager.updateWave()
}

const backgroundImage = new Image();
backgroundImage.src = '../img/Far_Future_Lawn.jpg'; // Đường dẫn tới ảnh

function draw() {

    context.drawImage(backgroundImage, 0, 0, cw, ch);
    grid.draw()
    grid.drawWeaponIcon()

    enemies.forEach(enemy => {
        enemy.draw(context)
    })

    drawHUD(gameManager.score, 3)

}

window.dt = 0;
let lastTime = performance.now()

function gameLoop() {
    update()

    CollisionManager.instance.checkCollisions();

    draw()

    let now = performance.now()
    window.dt = now - lastTime;
    lastTime = now;
    

    window.requestAnimationFrame(gameLoop)
}


function drawHUD(score, lives) {
    context.fillStyle = 'white';
    context.font = '20px Arial';
    context.fillText(`Score: ${score}`, 10, 20);
    context.fillText(`Lives: ${lives}`, 10, 40);
}

