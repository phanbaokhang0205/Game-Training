import { GameManager } from "../helper/GameManager.js";
import { AudioManager } from "../helper/AudioManager.js";
import { Collider } from '../helper/Collider.js';


class Player extends Collider {
    constructor(context, x = cw / 2, y = ch - 50) {
        super(x, y);
        this.x = x;
        this.y = y;
        this.width = 120;
        this.height = 100;
        this.speed = 3;
        this.image = new Image();
        this.context = context;

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
        this.image.src = '../img/ship_2.jpg';
        this.image.onload = () => {
            console.log("Ship image loaded successfully");
        };
        this.image.onerror = () => {
            console.error("Failed to load Ship image");
        };
    }

    draw() {
        if (!this.image) {
            console.log("Image not loaded");
            return;
        }

        this.context.save();
        this.context.translate(this.x, this.y);
        // this.context.rotate(this.angle);
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
}

class Computer extends Collider {

}

let canvas;
let context;
let cw;
let ch;
let gameManager;
let ship;
let chicken;

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
    ship = new Player(context)
    console.log(ship);
    // Chicken

    // Audio
    get_star = new AudioManager();
    game_over = new AudioManager();
    // game_over.loadSound('gameOver', '../audio/');
    
    

    requestAnimationFrame(gameLoop)
}



function update() {
    
}

function draw() {
    ship.draw()
}
function gameLoop() {
    update()

    draw()

    window.requestAnimationFrame(gameLoop)
}
gameLoop()

canvas.addEventListener('mousemove', (e) => {
    ship.x = e.offsetX
    ship.y = e.offsetY
});