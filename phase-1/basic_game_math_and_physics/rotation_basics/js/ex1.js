let ctx
let canvas
let cw
let ch

window.onload = init

function init() {
    canvas = document.getElementById("canvas")
    ctx = canvas.getContext("2d")
    cw = canvas.width
    ch = canvas.height

    window.requestAnimationFrame(gameLoop)
}

let rectangles = [
    {
        position: { x: 100, y: 200 },
        width: 100,
        height: 50,
        rotation: 0,
        speed: 0.01,
        color: "red"
    },
    {
        position: { x: 300, y: 300 },
        width: 50,
        height: 150,
        rotation: 0,
        speed: 0.05,
        color: "blue"
    },
    {
        position: { x: 600, y: 400 },
        width: 200,
        height: 50,
        rotation: 0,
        speed: 0.1,
        color: "green"
    }
]
function update(rects) {
    rects.forEach(obj => {
        obj.rotation += obj.speed
    })
}

function draw(rects) {
    rects.forEach(obj => {
        ctx.save()
        ctx.translate(obj.position.x, obj.position.y);

        // Rotate the ctx by the rectangle’s rotation
        ctx.rotate(obj.rotation);

        // Draw the rectangle (centered at the origin now)
        ctx.fillStyle = obj.color;
        ctx.fillRect(-obj.width / 2, -obj.height / 2, obj.width, obj.height);
        
        ctx.restore()
    });
}


function gameLoop() {
    ctx.clearRect(0, 0, cw, ch)

    update(rectangles)
    draw(rectangles)

    window.requestAnimationFrame(gameLoop)
}