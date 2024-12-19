import { GameManager } from "../helper/GameManager.js";
import { AudioManager } from "../helper/AudioManager.js";
import { Player } from "../model/Player.js";
import { Enemy } from "../model/Enemy.js";
let canvas;
let context;
let cw;
let ch;
let gameManager;
let ship;
let enemies = [];
// let bullets;

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


    // Player
    ship = new Player(context, canvas, cw / 2, ch - 40)

    // enemies
    renderEnemies()
    
    // sprite ship
    let shipImage = 1;
    setInterval(() => {
        shipImage = (shipImage % 5) + 1; // Lặp từ 1 đến 5
        ship.changeImage(shipImage);
    }, 100);

    // sprite enemy
    let enemyImage = 1;
        setInterval(() => {
            enemyImage = (enemyImage % 6) + 1; // Lặp từ 1 đến 6
            enemies.forEach(e => {
                e.changeImage(enemyImage)
            })
        }, 100);



    // Audio
    get_star = new AudioManager();
    game_over = new AudioManager();
    // game_over.loadSound('gameOver', '../audio/');


    requestAnimationFrame(gameLoop)
}
function update() {
    enemies.forEach(enemy => {
        ship.update(enemy)
    })
}

function draw() {
    ship.draw()
    
    enemies.forEach(enemy => {
        // update score when hit the enemy
        if (ship.collidingBullet_Enemy(enemy)) {
            gameManager.updateScore(1)
        }
        // update color when collide with enemy
        if (!ship.collidingShip_Enemy(enemy)) {
            enemy.color = 'black'
            enemy.draw()
            
        }
        else if (ship.collidingShip_Enemy(enemy)){
            enemy.color = 'white'
            enemy.draw()
        }
        
    })
    drawHUD(gameManager.score, 3)

}
function gameLoop() {
    context.clearRect(0, 0, cw, ch)
    update()

    draw()

    window.requestAnimationFrame(gameLoop)
}

function renderEnemies() {
    let col = 8; // Số cột
    let row = 1; // Số hàng
    let spacingX = 100; // Khoảng cách giữa các cột (trục X)
    let spacingY = 100; // Khoảng cách giữa các hàng (trục Y)

    for (let i = 0; i < row; i++) {
        for (let j = 0; j < col; j++) {
            const enemy = new Enemy(context, j * spacingX + 50, i * spacingY + 100);
            enemies.push(enemy);
        }
    }
}



function drawHUD(score, lives) {
    context.fillStyle = 'white';
    context.font = '20px Arial';
    context.fillText(`Score: ${score}`, 10, 20);
    context.fillText(`Lives: ${lives}`, 10, 40);
}

