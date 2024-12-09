import { CircleCollider } from './CircleCollider.js';
import { RectCollider } from './RectCollider.js';
import { CollisionManager } from './CollisionManager.js';

let canvas;
let context;

window.onload = init

function init() {
    canvas = document.getElementById("canvas")
    context = canvas.getContext('2d')

    requestAnimationFrame(gameLoop);
}

const player = new RectCollider(50, 50, 20, 20);
const enemy = new CircleCollider(100, 100, 15);
const collisionManager = new CollisionManager();


collisionManager.addCollider(player);
collisionManager.addCollider(enemy);

// Game loop (simplified)
function gameLoop() {
    collisionManager.checkCollisions();
    drawCir(enemy)
    drawRect(player)
    drawHUD(50, 3)
    requestAnimationFrame(gameLoop);
}

function drawRect(rect) {
    context.beginPath();
    context.fillStyle = 'blue'
    context.fillRect(rect.x, rect.y, rect.width, rect.height)
}

function drawCir(cir) {
    context.beginPath();
    context.fillStyle = 'red';
    context.arc(cir.x, cir.y, cir.radius, 0, 2*Math.PI)
    context.fill()
}

function drawHUD(score, health) {
    context.fillStyle = 'black';
    context.font = '20px Arial';
    context.fillText(`Score: ${score}`, 10, 20);
    context.fillText(`Health: ${health}`, 10, 40);
}



