import { GameManager } from "../helper/GameManager.js";
import { AudioManager } from "../helper/AudioManager.js";
import { Grid } from "../model/Grid.js";
import { CollisionManager } from "../helper/CollisionManager.js";
import { EnemyManager } from "../managers/enemyManager.js";
import LevelManager from "../level/LevelManager.js";
import { MenuGame } from "./menuGame.js";

/**
    * TODO: BUG
* 5. Khi đặt 1 Enemy vào giữa 2 Weapon thì nó colide với cả 2 Weapon lun.
* ------fixed-----
    * 1. Weapon chết nhưng không bị xóa khỏi game 
    *  - Đã remove ra khỏi objec Collider.
    *  - Đã xóa khỏi mảng weapons trong class Grid.
    *  - Đã xóa khỏi ô của Grid.
    * trong mảng của weapon thì mất nhưng vẫn nghe tiếng đạn, enemy vẫn bị dính damge.
    * 2. Enemy khi collide lần đầu tiên với Weapon thì chuyển state = 'attack', dù không còn Weapon nào trước mặt
    * (không còn collide với weapon nữa) nhưng Enemy vẫn ở trong state='attack'.
    * 3. Lỗi sprite attack của enemey.
    * 4. Khi kéo để đặt, Weapon vẫn collide được với Enemy.
    * 
    * ------fixed-----
*/

/**
 * TODO: 
 * 4. thêm hiệu ứng bullet collide enemey.
 * 7. Update level.
 * 8. Khi nhiều enemy tấn công 1 weapon thì làm thế nào để Weapon nhận được tất cả sát thương của các Enemy.
 * 10. Tạo Menu Game:
    * 10.1. Pause.
    * 10.2. Resume.
    * 10.3. Restart.
 * --------DONE--------
 * 9. Tạo cách chơi:
    * 9.1. Khởi tạo 100 suns.
    * 9.2. Weapon lv1 = 10 suns, lv2 = 20 suns, lv3 = 40 suns
    * 9.3. Giết được 1 Enemy +5 sun
 * 5. Enemy đi tới cuối đường thì trừ điểm.
 * 6. Đạn biến mất sau khi bay tới cuối biên.
 * 2. Tạo tầm bắn cho weapon.
 * 3. sửa lại tầm đánh, nếu có quái trước mặt trên cùng 1 hàng thì bắn.
 * 5. auto đặt vào giữa ô.
 * --------DONE--------
 * 
 */

let canvas;
let context;
let cw;
let ch;
let gameManager;
let grid;
let colliderManager;

// audio
let get_star;
let game_over;

let levelMng;
let enemyMng;

let menuGame;

window.onload = init

async function init() {
    canvas = document.getElementById('canvas')
    context = canvas.getContext('2d')
    cw = canvas.width
    ch = canvas.height

    // status game
    gameManager = new GameManager()
    colliderManager = new CollisionManager()

    // grid
    grid = new Grid(6, 9, context, cw, ch, gameManager)

    enemyMng = new EnemyManager(gameManager)

    // Audio
    get_star = new AudioManager();
    game_over = new AudioManager();


    levelMng = new LevelManager();
    await levelMng.startLevel();

    menuGame = new MenuGame(gameManager);

    requestAnimationFrame(gameLoop);
}

function update() {
    grid.updateWeapon(enemyMng.enemies);
    menuGame.update();

    if (!levelMng) return;

    if (levelMng.currentLevel) {
        levelMng.currentLevel.update();
        gameManager.lives = 5 - enemyMng.enemyReachEnd.length;
    }

}

const backgroundImage = new Image();
backgroundImage.src = '../img/Far_Future_Lawn.jpg'; // Đường dẫn tới ảnh

function draw() {

    context.drawImage(backgroundImage, 0, 0, cw, ch);
    grid.draw();
    grid.drawWeaponIcon();

    if (levelMng && levelMng.currentLevel) {
        levelMng.currentLevel.draw(context);
    } else {
        console.log("Level MNG null");
    }

    drawHUD(gameManager.suns, gameManager.lives);

}

window.dt = 0;
let lastTime = performance.now();

function gameLoop() {
    if (gameManager.state === 'pause' || gameManager.lives === 0) {
        menuGame.update();
        draw();
        return;
    }

    let now = performance.now();
    window.dt = now - lastTime;
    lastTime = now;

    update();
    CollisionManager.instance.checkCollisions();
    draw();

    window.requestAnimationFrame(gameLoop);
}


function drawHUD(sun, lives) {
    context.fillStyle = 'white';
    context.font = '25px Arial';
    context.fillText(`Sun: ${sun} ☀️`, 10, 30);
    context.fillText(`Lives: ${lives} ❤️`, 10, 60);
}
