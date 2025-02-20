import { GameManager } from "../helper/GameManager.js";
import { AudioManager } from "../helper/AudioManager.js";
import { Grid } from "../model/Grid.js";
import { CollisionManager } from "../helper/CollisionManager.js";
import { EnemyManager } from "../managers/enemyManager.js";
import LevelManager from "../level/LevelManager.js";
import { Hammer } from "../model/Hammer.js";
import { InputController } from "../helper/InputController.js";

/**
    * TODO: BUG
    * 5. Khi đặt 1 Enemy vào giữa 2 Weapon thì nó colide với cả 2 Weapon lun.
    * 
    * ------fixed-----
    * 6. Khi resume hoặc restart thì weapon vẫn bắn.
    * 1. Weapon chết nhưng không bị xóa khỏi game 
    *  - Đã remove ra khỏi objec Collider.
    *  - Đã xóa khỏi mảng weapons trong class Grid.
    *  - Đã xóa khỏi ô của Grid.
    * trong mảng của weapon thì mất nhưng vẫn nghe tiếng đạn, enemy vẫn bị dính damge.
    * 2. Enemy khi collide lần đầu tiên với Weapon thì chuyển state = 'attack', dù không còn Weapon nào trước mặt
    * (không còn collide với weapon nữa) nhưng Enemy vẫn ở trong state='attack'.
    * 3. Lỗi sprite attack của enemey.
    * 4. Khi kéo để đặt, Weapon vẫn collide được với Enemy.
    * ------fixed-----
*/

/**
 * TODO: 
 * 4. thêm hiệu ứng bullet collide enemey.
 * 8. Khi nhiều enemy tấn công 1 weapon thì làm thế nào để Weapon nhận được tất cả sát thương của các Enemy.
 * 13. Xử lý khi Win.
 * 14. Menu start game.
 * --------DONE--------
 * 12. Thêm sound:
    * Đặt, tháo Weapon.
    * bullet collide Enemy.
    * nhạc nền.
 * 7. Update level.
 * 11. Tạo 1 obj hammer để gỡ Weapon sau khi đặt.
    * 9.1 Tạo obj Hammer (x, y, imgSrc)
    * 9.2 Khi click vào kéo tới Weapon nào thì:
        * Xác định grid[row][col].
        * Gán grid[row][col] = null.
        * DraggingHammer = null.
 * 10. Tạo Menu Game:
    * 10.1. Pause.
    * 10.2. Resume.
    * 10.3. Restart.
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
 */


let canvas = document.getElementById('canvas')
let context = canvas.getContext('2d')
let cw;
let ch;
let gameManager;
let grid;
let colliderManager;
let inputController;

// audio
let get_star;
let game_over;

let levelMng;
let enemyMng;

// let menuGame;
let menuIcon = document.getElementById("menuIcon");
let pauseMenu = document.getElementById("pauseMenu");
let resume_btn = document.getElementById("resumeButton");
let restartButton = document.getElementById("restartButton");
let gameOverMenu = document.getElementById("gameOverMenu");
let retryButton = document.getElementById("retryButton");
let points = document.getElementById("points");
let pointsResume = document.getElementById("pointsResume");
let suns = document.getElementById("suns");
let bg_music = document.getElementById("bg_music");
let volumeSlider = document.getElementById("volumeSlider");
let startButton = document.getElementById("start_game");
let startMenu = document.getElementById("startMenu")

let hammer;

let backgroundImage = new Image();
backgroundImage.src = '../img/Far_Future_Lawn.jpg';

window.onload = init

async function init() {
    gameManager = new GameManager()
    colliderManager = new CollisionManager()
    inputController = new InputController()

    // status game
    colliderManager = new CollisionManager()
    inputController = new InputController()

    enemyMng = new EnemyManager()

    // Audio
    get_star = new AudioManager();
    game_over = new AudioManager();

    cw = canvas.width
    ch = canvas.height



    // grid
    grid = new Grid(6, 9, context, cw, ch)


    levelMng = new LevelManager();
    levelMng.startLevel();

    hammer = new Hammer(cw - 150, 0, context)

    menuIcon = document.getElementById("menuIcon");
    pauseMenu = document.getElementById("pauseMenu");

    // menu
    menuIcon.addEventListener("click", () => {
        pauseMenu.classList.toggle("show");
        pointsResume.textContent = enemyMng.enemiesKilled.length;
        if (gameManager.state === "playing") {
            gameManager.setState("pause")
        } else {
            gameManager.setState("playing")
        }
    });

    // reset_btn    
    resume_btn = document.getElementById("resumeButton")
    restartButton = document.getElementById("restartButton")

    resume_btn.addEventListener('click', () => {
        gameManager.setState("playing");
        pauseMenu.classList.toggle("show");

        requestAnimationFrame(gameLoop);
    });

    restartButton.addEventListener('click', () => {
        gameManager.setState('pause');
        gameManager.restartGame();
        gameManager.setState('playing');
        pauseMenu.classList.toggle("show");

        requestAnimationFrame(gameLoop);
    });

    // Gameover menu
    gameOverMenu = document.getElementById("gameOverMenu");
    retryButton = document.getElementById("retryButton");

    retryButton.addEventListener("click", () => {
        location.reload();
    });

    points = document.getElementById("points");
    pointsResume = document.getElementById("pointsResume");
    suns = document.getElementById("suns");

    volumeSlider.addEventListener("input", (e) => {
        let volume = parseFloat(e.target.value);

        // Đảm bảo giá trị nằm trong khoảng [0, 1]
        if (!isNaN(volume) && volume >= 0 && volume <= 1) {
            bg_music.volume = volume;
        }
    });

    startButton.addEventListener('click', () => {
        gameManager.setState("playing")
        console.log(gameManager.state);
        startMenu.style.display = "none";
        bg_music.play();
        requestAnimationFrame(gameLoop);
    })

    requestAnimationFrame(gameLoop);
}



function update() {
    inputController.checkMusicToggle(bg_music)
    grid.updateWeapon(enemyMng.enemies);
    if (!levelMng) return;

    if (levelMng.currentLevel) {
        levelMng.currentLevel.update();
        gameManager.lives = 5 - enemyMng.enemiesReachEnd.length;
        if (gameManager.lives < 0) gameManager.lives = 0;
    }
}



function draw() {
    context.drawImage(backgroundImage, 0, 0, cw, ch);
    grid.draw();
    hammer.draw();

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
    if (gameManager.state === 'start') {
        return;
    };

    if (gameManager.state === 'pause') {
        update();
        return;
    }

    if (gameManager.lives <= 0) {
        gameManager.setState('gameOver');
        showGameOverMenu()
        return
    }

    let now = performance.now();
    window.dt = now - lastTime;
    lastTime = now;
    context.clearRect(0, 0, cw, ch);
    update();
    CollisionManager.instance.checkCollisions();
    draw();

    window.requestAnimationFrame(gameLoop);
}

function showGameOverMenu() {
    gameOverMenu.classList.toggle("show");
    points.textContent = enemyMng.enemiesKilled.length;
    suns.textContent = gameManager.suns;
}



function drawHUD(sun, lives) {
    context.fillStyle = 'white';
    context.font = '25px Arial';
    context.fillText(`Sun: ${sun} ☀️`, 10, 30);
    context.fillText(`Lives: ${lives} ❤️`, 10, 60);
}

