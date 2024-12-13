import { GameManager } from "../handle/GameManager.js";
import { InputController } from "../handle/InputController.js";
import { AudioManager } from "../handle/AudioManager.js";
import { Collider } from '../handle/Collider.js';
// import { CircleCollider } from "../handle/CircleCollider.js";
// import { CollisionManager } from "../handle/CollisionManager.js";

class Player extends Collider {
    static numColumns = 3;
    static numRows = 1;
    static frameWidth = 0;
    static frameHeight = 0;
    static sprite;
    
    constructor(context, inputController, x = cw / 2, y = ch - 50) {
        super(x, y);
        this.x = x;
        this.y = y;
        this.width = 120;
        this.height = 100;
        this.speed = 3;
        this.image = new Image();
        this.context = context;
        this.inputController = inputController;

        this.loadImage();
    }
    

    checkCollision(other) {
        if (other instanceof Collider) {
            return (
                this.x < other.x + other.width &&
                this.x + this.width > other.x &&
                this.y < other.y + other.height &&
                this.y + this.height > other.y
            );
        }
        return false;
    }

    loadImage() {
        this.image.src = '../img/mario_right.jpg';
        this.image.onload = () => {
            console.log("Mario image loaded successfully");
        };
        this.image.onerror = () => {
            console.error("Failed to load Mario image");
        };
    }

    draw() {
        if (!this.image) {
            console.log("Image not loaded");
            return;
        }

        this.context.save();
        this.context.translate(this.x, this.y);
        this.context.rotate(this.angle);
        this.context.drawImage(this.image, -this.width / 2, -this.height / 2, this.width, this.height);
        this.context.restore();

        // this.drawHitBox()
    }

    drawHitBox() {
        this.context.beginPath();
        this.context.strokeStyle = 'blue';
        this.context.strokeRect(
            this.x - this.width / 2,
            this.y - this.height / 2,
            this.width,
            this.height
        );
        this.context.stroke();
    }

    moving() {
        if (this.inputController.isKeyPressed('ArrowLeft')) {
            this.x -= this.speed; // Di chuyển trái
            this.image.src = '../img/mario_left.jpg';
        }
        if (this.inputController.isKeyPressed('ArrowRight')) {
            this.x += this.speed; // Di chuyển phải
            this.image.src = '../img/mario_right.jpg';
        }
    }
}

class Star extends Collider {
    constructor(context, x, y, speed = 1.5) {
        super(x, y)
        this.speed = speed;
        this.width = 60;
        this.height = 60;
        this.visible = true;
        this.image = new Image();
        this.context = context

        this.loadImage();
    }

    checkCollision(other) {
        if (other instanceof Collider) {
            return (
                this.x < other.x + other.width &&
                this.x + this.width > other.x &&
                this.y < other.y + other.height &&
                this.y + this.height > other.y
            );
        }
        return false;
    }

    loadImage() {
        this.image.src = '../img/star.jpg';
        this.image.onload = () => {
            console.log("Star image loaded successfully");
        };
        this.image.onerror = () => {
            console.error("Failed to load star image");
        };
    }

    draw() {
        if (!this.image) {
            console.log("Image not loaded");
            return;
        }

        if (!this.visible) return;
        // draw image
        this.context.save();
        this.context.translate(this.x, this.y);
        this.context.rotate(this.angle);
        this.context.drawImage(this.image, -this.width / 2, -this.height / 2, this.width, this.height);
        this.context.restore();

        // draw hitbox
        // this.drawHitBox();
    }

    drawHitBox() {
        this.context.beginPath();
        this.context.strokeStyle = 'red';
        this.context.strokeRect(
            this.x - this.width / 2,
            this.y - this.height / 2,
            this.width,
            this.height
        );
        this.context.stroke();
    }

    falling() {
        this.y += this.speed
    }

}




let canvas;
let context;
let cw;
let ch;
let gameManager;
let mario;
let stars;
let inputController;

// audio
let get_star;
let game_over;

// status game
let lives = 3;

// reset button
let reset_btn;

// let starSpawnTimer = 0;
// const SPAWN_INTERVAL_SLOW = 2000; // 2 giây khi điểm < 5
// const SPAWN_INTERVAL_FAST = 1000; // 1 giây khi điểm >= 5
let lastSpawnTime = 0;

window.onload = init

// Random vị trí X , Y của star
function randPosition(max, min) {
    return Math.floor(Math.random() * (max - min)) + min;
}

function init() {
    canvas = document.getElementById('canvas')
    context = canvas.getContext('2d')
    cw = canvas.width
    ch = canvas.height

    // status game
    gameManager = new GameManager()

    // Input controller
    inputController = new InputController()
    // Player
    mario = new Player(context, inputController)
    // star
    stars = Array.from({ length: 7 }, () => new Star(context, randPosition(cw - 50, 50), randPosition(0, -1000)));

    // Audio
    get_star = new AudioManager();
    game_over = new AudioManager();
    game_over.loadSound('gameOver', '../audio/game_over.mp3');
    
    // reset_btn
    reset_btn = document.getElementById("resetButton")
    reset_btn.addEventListener('click', resetGame);

    requestAnimationFrame(gameLoop)
}

function getStarSpeed(score) {
    if (score >= 20) return 2.5;
    if (score >= 5) return 2;
    return 1.5;
}

function getSpawnInterval(score) {
    if (score >= 20) return 800;  // 0.8 giây khi điểm >= 20
    if (score >= 5) return 1000;  // 1 giây khi điểm >= 5
    return 2000;                  // 2 giây khi điểm < 5
}


function gameLoop(timestamp) {

    if (gameManager.state == 'playing') {
        reset_btn.style.display = 'none';
        
        // Logic sinh sao mới
        if (!lastSpawnTime) lastSpawnTime = timestamp;
        const deltaTime = timestamp - lastSpawnTime;
        
        // Xác định khoảng thời gian sinh sao dựa trên điểm số
        const spawnInterval = getSpawnInterval(gameManager.score);
        
        if (deltaTime >= spawnInterval) {
            // Tạo sao mới với tốc độ phù hợp
            const starSpeed = getStarSpeed(gameManager.score);
            const newStar = new Star(context, randPosition(cw - 50, 50), randPosition(-100, -50), starSpeed);
            stars.push(newStar);
            
            // Giới hạn số lượng sao trên màn hình
            stars = stars.filter(star => star.visible && star.y <= ch);
            
            lastSpawnTime = timestamp;
        }
        
        update(stars)
        detecteCollision(stars, mario)
        draw(stars, gameManager.score, lives)
        requestAnimationFrame(gameLoop)
    }

    if (gameManager.state == 'pause') {
        game_over.playSound('gameOver');
        reset_btn.style.display = 'block';
    }

}


function resetGame() {
    // Khởi tạo lại trạng thái game
    gameManager.resetGame()
    lives = 3;

    // tạo lại star
    stars = Array.from({ length: 3 }, () => new Star(context, randPosition(cw - 50, 50), randPosition(-100, -50), 1.5));
    
    // đặt player lại vị trí ban đầu
    mario.x = cw / 2;
    mario.y = ch - 50

    lastSpawnTime = 0; // Reset thời gian sinh sao
    
    requestAnimationFrame(gameLoop); 
}

function update(stars) {
    context.clearRect(0, 0, cw, ch)
    mario.moving()
    stars.forEach(obj => {
        obj.falling()
    });
}

function draw(stars, s, l) {
    mario.draw()
    stars.forEach(obj => {
        obj.draw()
    });
    drawHUD(s, l)

}

function detecteCollision(stars, player) {
    stars.forEach(s => {
        // Hàm kiểm tra va chạm star-mario
        if (s.visible && s.checkCollision(player)) {
            s.visible = false;
            gameManager.updateScore(1)
            get_star.loadSound('getStar', '../audio/get_star.mp3');
            get_star.playSound('getStar'); 
        }
        
        
        // Hàm kiểm tra va chạm star và mặt đất
        if (s.visible && s.y - s.height/2 > ch) {
            s.visible = false
            lives--;
        }

        if (lives === 0) {
            gameManager.state = 'pause'
        }
        
    });

    
}


function drawHUD(score, lives) {
    context.fillStyle = 'black';
    context.font = '20px Arial';
    context.fillText(`Score: ${score}`, 10, 20);
    context.fillText(`Lives: ${lives}`, 10, 40);
}
