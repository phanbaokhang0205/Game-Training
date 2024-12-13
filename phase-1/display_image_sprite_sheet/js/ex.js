const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

let ship = {
    x: canvas.width / 2,
    y: canvas.height / 2,
    angle: 0,
    speed: 2,
    image: new Image()
};

ship.image.src = '../img/ship.png';

function update(mouseX, mouseY) {
    // Calculate angle between ship and mouse
    let dx = mouseX - ship.x;
    let dy = mouseY - ship.y;
    ship.angle = Math.atan2(dy, dx) + Math.PI/2;
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.save();
    ctx.translate(ship.x, ship.y);
    ctx.rotate(ship.angle);
    ctx.drawImage(ship.image, -ship.image.width/2, -ship.image.height/2);
    ctx.restore();
}

canvas.addEventListener('mousemove', (e) => {
    update(e.offsetX, e.offsetY);
});
let keys = {}
window.addEventListener('keydown', (event) => {
    keys[event.code] = true;
});
window.addEventListener('keyup', (event) => {
    keys[event.code] = false;
});

// Add movement controls and game loop here
function moveControl(ship) {
    // Di chuyển phi thuyền
    if (keys['ArrowUp']) {
        // spaceship.x += spaceship.speed 
        ship.y -= ship.speed
    }
    if (keys['ArrowLeft']) {
        ship.x -= ship.speed;
    }
    if (keys['ArrowRight']) {
        ship.x += ship.speed;
    }
    if (keys['ArrowDown']) {
        ship.y += ship.speed;
    }
}

function gameLoop() {
    moveControl(ship)

    draw()

    window.requestAnimationFrame(gameLoop)
}

gameLoop()