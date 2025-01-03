import { GameManager } from "../helper/GameManager.js";
import { AudioManager } from "../helper/AudioManager.js";
import { Enemy } from "../model/Enemy.js";
import { Grid } from "../model/Grid.js";
import { WaveManager } from "../model/WaveManager.js";

/**
 * TODO: 
    * Set up CD (cooldown) for weapons.
    * Set up level for game (Wave 1, wave 2, final).
    * Create spawn enemy function.
 */

let canvas;
let context;
let cw;
let ch;
let gameManager;
let waveManager;
let grid;

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

    // enemies
    // renderEnemies()
    waveManager = new WaveManager(context, gameManager.score)
    waveManager.renderEnemy()
    // waveManager.renderWave()
    
    waveManager.renderEnemy()
    setInterval(()=> {
        waveManager.renderEnemy()
        console.log(enemies.length + 1);
    }, 3500)

    // setInterval(() => {
    //     gameManager.score += 1
    // }, 1000)

    // grid
    grid = new Grid(6, 9, context, cw, ch)

    // Audio
    get_star = new AudioManager();
    game_over = new AudioManager();
    // game_over.loadSound('gameOver', '../audio/');



    requestAnimationFrame(gameLoop)
}
function update() {
    enemies = waveManager.enemies.filter(enemy => enemy.isAlive);
    weapons = grid.weapons.filter(weapon => weapon.isAlive);

    let kills = waveManager.enemies.filter(enemy => !enemy.isAlive)
    gameManager.score = kills.length;

    // Cập nhật Weapons và kiểm tra va chạm
    weapons.forEach(weapon => {
        weapon.update(enemies);
    });

    // Cập nhật Enemies và kiểm tra va chạm
    enemies.forEach(enemy => {
        enemy.update(grid.weapons);
    });

    // Kiểm tra va chạm giữa Weapons và Enemies
    checkCollisions(grid.weapons, enemies);

}

function checkCollisions(weapons, enemies) {
    weapons.forEach(weapon => {
        weapon.bullets.forEach(bullet => {
            enemies.forEach(enemy => {
                if (bullet.checkCollision(enemy)) {
                    // vien dan bien mat
                    bullet.visible = false;
                    // - HP enemy
                    enemy.isDamaged = true;
                    enemy.DTPB = bullet.damage;
                    enemy.HP -= enemy.DTPB
                }

                if (enemy.checkCollision(weapon)) {
                    weapon.decreaseHP(enemy.damage); // Giảm 1 HP mỗi lần
                }
            });
        });
    });
}


function draw() {
    const backgroundImage = new Image();
    backgroundImage.src = '../img/Far_Future_Lawn.jpg'; // Đường dẫn tới ảnh
    context.drawImage(backgroundImage, 0, 0, cw, ch);
    grid.draw()
    grid.drawWeaponIcon()

    enemies.forEach(enemy => {
        enemy.draw()
    })

    drawHUD(gameManager.score, 3)

}


function gameLoop() {
    context.clearRect(0, 0, cw, ch)
    update()

    draw()

    window.requestAnimationFrame(gameLoop)
}


function drawHUD(score, lives) {
    context.fillStyle = 'white';
    context.font = '20px Arial';
    context.fillText(`Score: ${score}`, 10, 20);
    context.fillText(`Lives: ${lives}`, 10, 40);
}

