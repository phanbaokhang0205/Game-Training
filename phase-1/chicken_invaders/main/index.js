import { GameManager } from "../helper/GameManager.js";
import { AudioManager } from "../helper/AudioManager.js";
import { Collider } from '../helper/Collider.js';
import { Player } from "../model/Player.js";
import { Computer } from "../model/Computer.js";

let canvas;
let context;
let cw;
let ch;
let gameManager;
let ship;
let enemy;
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
    console.log(ship.checkCollision());
    // Enemy
    enemy = new Computer(context, cw / 2, 100)

    // Chicken


    // Audio
    get_star = new AudioManager();
    game_over = new AudioManager();
    // game_over.loadSound('gameOver', '../audio/');


    requestAnimationFrame(gameLoop)
}
function update() {
    ship.update()
    ship.detectCollision(enemy)
}

function draw() {
    ship.draw()
    enemy.draw()
}
function gameLoop() {
    context.clearRect(0, 0, cw, ch)
    update()

    draw()

    window.requestAnimationFrame(gameLoop)
}



// function test() {
//     let col = 5; // Số cột
//     let row = 3; // Số hàng
//     let result = "";

//     for (let i = 0; i < row; i++) {
//         for (let j = 0; j < col; j++) {
//             result += "*";
//         }
//         result += "\n"; // Xuống dòng sau mỗi hàng
//     }

//     console.log(result);
// }

// test()