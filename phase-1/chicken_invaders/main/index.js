import { GameManager } from "../helper/GameManager.js";
import { AudioManager } from "../helper/AudioManager.js";
import { Player } from "../model/Player.js";
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

// let weaponLobby = []
let weapons = [];
let weapon1;
let weapon2;
let weapon3;

let grid;
let lobby;


// audio
let get_star
let game_over

window.onload = init

function init() {
    canvas = document.getElementById('canvas')
    context = canvas.getContext('2d')
    cw = canvas.width
    ch = canvas.height
    


    // Weapons
    // weapon1 = new Weapon(context, lobby.x - lobby.width + 0, 0 + 100, "weapon1", 4, 4, 1)
    // weapon2 = new Weapon(context, lobby.x - lobby.width + 200, 0 + 100, "weapon2", 6, 6, 2)
    // weapon3 = new Weapon(context, lobby.x - lobby.width + 400, 0 + 100, "weapon3", 4, 6, 3)
    
    // weapons.push(weapon1);
    // weapons.push(weapon2);
    // weapons.push(weapon3);

    // weaponLobby.push(weapon1);
    // weaponLobby.push(weapon2);
    // weaponLobby.push(weapon3);

    // enemies
    renderEnemies()

    // status game
    gameManager = new GameManager()

    // grid
    grid = new Grid(6, 10, context, cw, ch)

    

    // sprite enemy
    let enemyImage = 1;
    setInterval(() => {
        enemyImage = (enemyImage % 8) + 1; // Lặp từ 1 đến 6
        enemies.forEach(e => {
            e.changeImage(enemyImage)
        })
    }, 300);

    // Audio
    get_star = new AudioManager();
    game_over = new AudioManager();
    // game_over.loadSound('gameOver', '../audio/');



    requestAnimationFrame(gameLoop)
}
function update() {
    enemies.forEach(enemy => {
        weapons.forEach(obj => {
            if (obj.collidingBullet_Enemy(enemy)) {
                gameManager.updateScore(1)
            }
            obj.update(enemy)
        })

        enemy.update()
    })
}

function draw() {
    // const backgroundImage = new Image();
    // backgroundImage.src = '../img/Far_Future_Lawn.jpg'; // Đường dẫn tới ảnh
    // context.drawImage(backgroundImage, 0, 0, cw, ch);
    grid.draw()
    grid.drawWeaponIcon()

    // weapons.forEach(obj => {
    //     obj.draw()
    // })

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
    let spacingY = 100; // Khoảng cách giữa các hàng (trục Y)

    for (let i = 0; i < row; i++) {
        for (let j = 0; j < col; j++) {
            // const enemy = new Enemy(context, j * spacingX + cw, i * spacingY + 50);
            const enemy = new Enemy(context, j * spacingX + cw, i * spacingY + 150);
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

