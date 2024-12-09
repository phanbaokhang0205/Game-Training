import { GameManager } from "../handle/GameManager.js";
import { InputController } from "../handle/InputController.js";
import { AudioManager } from "../handle/AudioManager.js";
import { RectCollider } from "../handle/RectCollider.js";
import { CollisionManager } from "../handle/CollisionManager.js";

class Player {
    constructor(context, inputController) {
        this.x = cw / 2;
        this.y = ch-50;
        this.width = 120;
        this.height = 100;
        this.speed = 3;
        this.image = new Image();
        this.context = context;
        this.inputController = inputController;

        this.loadImage();
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

        this.drawHitBox()
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

class Star {
    constructor(context, x, y) {
        this.x = x;
        this.y = y;
        this.speed = 1.2;
        this.width = 60;
        this.height = 60;
        this.image = new Image();
        this.context = context

        this.loadImage();
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

        // draw image
        this.context.save();
        this.context.translate(this.x, this.y);
        this.context.rotate(this.angle);
        this.context.drawImage(this.image, -this.width / 2, -this.height / 2, this.width, this.height);
        this.context.restore();

        // draw hitbox
        this.drawHitBox();
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
window.onload = init

// Random vị trí X của star
function randPosition(max, min) {
    return Math.floor(Math.random() * (max - min)) + min;
}

function init() {
    canvas = document.getElementById('canvas')
    context = canvas.getContext('2d')
    cw = canvas.width
    ch = canvas.height
    gameManager = new GameManager()
    inputController = new InputController()
    mario = new Player(context, inputController)
    stars = [
        new Star(context, randPosition(cw - 50, 50), randPosition(0, -1000)),
        new Star(context, randPosition(cw - 50, 50), randPosition(0, -1000)),
        new Star(context, randPosition(cw - 50, 50), randPosition(0, -1000)),
        new Star(context, randPosition(cw - 50, 50), randPosition(0, -1000)),
        new Star(context, randPosition(cw - 50, 50), randPosition(0, -1000)),
        new Star(context, randPosition(cw - 50, 50), randPosition(0, -1000)),
        new Star(context, randPosition(cw - 50, 50), randPosition(0, -1000)),
    ]

    requestAnimationFrame(gameLoop)
}


function gameLoop() {

    update(stars)

    draw(stars)

    requestAnimationFrame(gameLoop)
}

function update(stars) {
    context.clearRect(0, 0, cw, ch)
    mario.moving()
    stars.forEach(obj => {
        obj.falling()
    });
}

function draw(stars) {
    mario.draw()
    stars.forEach(obj => {
        obj.draw()
    });
}