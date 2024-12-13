const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

let ship = {
    x: canvas.width / 2,
    y: canvas.height / 2,
    image: new Image()
};

let bullet = {
    x: 0,
    y: 0,
    speed: 3,
    image: new Image()
}

ship.image.src = '../img/ship_2.jpg';
bullet.image.src = '../img/bullet_blue.png'

function update() {
    canvas.addEventListener('click', () => {
        bullet.x = bullet.x
        console.log(bullet.x);
        shoot()
    })
}
function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawShip()
    drawBullet()

}

function drawShip() {
    ctx.save();
    ctx.translate(ship.x, ship.y);
    ctx.drawImage(ship.image, -ship.image.width / 16, -ship.image.height / 16, ship.image.width / 8, ship.image.height / 8);
    ctx.restore();
}
function drawBullet() {
    ctx.save();
    ctx.translate(bullet.x + 10, bullet.y);
    ctx.drawImage(bullet.image, -bullet.image.width, -bullet.image.height);
    ctx.restore();
}
function shoot() {
    bullet.x = ship.x
    bullet.y -= bullet.speed
}
canvas.addEventListener('mousemove', (e) => {
    ship.x = e.offsetX
    ship.y = e.offsetY
    bullet.x = e.offsetX
    bullet.y = e.offsetY
});

function gameLoop() {
    update()

    draw()

    window.requestAnimationFrame(gameLoop)
}

gameLoop()