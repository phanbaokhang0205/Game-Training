let ctx;
let canvas;
let cw;
let ch;
window.onload = init

function init() {
    canvas = document.getElementById("canvas")
    ctx = canvas.getContext("2d");
    cw = canvas.width;
    ch = canvas.height;
    window.requestAnimationFrame(gameLoop)
}

function getDegrees(r, mx, my) {
    let dx = mx - r.position.x
    let dy = my - r.position.y

    let angleRadians = Math.atan2(dy, dx)
    return angleRadians
}

const ship = {
    position: { x: 400, y: 300 },
    width: 200,
    height: 50,
    rotation: 0,
    speed: 0.01,
}

function update(r) {
    addEventListener("mousemove", e => {
        let mouseX = e.offsetX
        let mouseY = e.offsetY
        let dg = getDegrees(r, mouseX, mouseY)
        r.rotation = dg
        r.position.x = e.offsetX
        r.position.y = e.offsetY
    })
}

function draw(r) {
    ctx.save()
    ctx.translate(r.position.x, r.position.y)
    ctx.rotate(r.rotation)
    ctx.fillStyle = "green";
    ctx.fillRect(-r.width / 2, -r.height / 2, r.width, r.height);
    ctx.restore()
}


function gameLoop() {
    ctx.clearRect(0, 0, cw, ch)
    update(rectangle)
    draw(rectangle)
    window.requestAnimationFrame(gameLoop)
}
