import { GameManager } from "../helper/GameManager.js";
import { AudioManager } from "../helper/AudioManager.js";
import { Enemy } from "../model/Enemy.js";
import { Weapon } from "../model/Weapon.js";
import { Grid } from "../model/Grid.js";
import { Lobby } from "../model/Lobby.js";
let canvas;
let context;
let cw;
let ch;
let gameManager;
let enemies = [];

let grid;


// audio
let get_star
let game_over

window.onload = init

function init() {
    canvas = document.getElementById('canvas')
    context = canvas.getContext('2d')
    cw = canvas.width
    ch = canvas.height

    // enemies
    renderEnemies()

    // status game
    gameManager = new GameManager()

    // grid
    grid = new Grid(6, 10, context, cw, ch)

    // Audio
    get_star = new AudioManager();
    game_over = new AudioManager();
    // game_over.loadSound('gameOver', '../audio/');



    requestAnimationFrame(gameLoop)
}
function update() {
    enemies = enemies.filter(enemy => enemy.isAlive);
    // Cập nhật Weapons và kiểm tra va chạm
    grid.weapons.forEach(weapon => {
        weapon.update(enemies);
    });

    // Cập nhật Enemies và kiểm tra va chạm
    enemies.forEach(enemy => {
        enemy.update(grid.weapons);
    });

    // Kiểm tra va chạm giữa Weapons và Enemies
    checkCollisions(grid.weapons, enemies);
    // grid.weapons.forEach(obj => {
    //     if (obj.collidingBullet_Enemy(enemies)) {
    //         gameManager.updateScore(1)
    //     }
    //     obj.update(enemies)
    // })

    // enemies.forEach(enemy => {
    //     enemy.update(grid.weapons)
    // })
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
                    if (!weapon.isDamaged) {
                        weapon.isDamaged = true;
                        console.log("-1 HP Weapon");
                    }
                    setInterval(()=> {
                        weapon.isDamaged = false;
                    }, 2000*3)
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
        // // update color when collide with enemy
        // if (!ship.collidingShip_Enemy(enemy)) {
        //     enemy.color = 'black'
        //     enemy.draw()
        // }
        // else if (ship.collidingShip_Enemy(enemy)){
        //     enemy.color = 'white'
        //     enemy.draw()
        // }
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
    let col = 1; // Số cột
    let row = 5; // Số hàng
    let spacingX = 100; // Khoảng cách giữa các cột (trục X)
    let spacingY = 120; // Khoảng cách giữa các hàng (trục Y)

    for (let i = 0; i < row; i++) {
        for (let j = 0; j < col; j++) {
            const enemy = new Enemy(context, j * spacingX + cw, i * spacingY + 170 , 1000*100, 1);
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

