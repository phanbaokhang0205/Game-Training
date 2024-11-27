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

const shapes = [
    {
        name: "head",
        type: "circle",
        radius: 50,
        color: "lightblue"
    },
    {
        name: "body",
        type: "rect",
        color:"lightblue",
        position: {x: 400, y: 300},
        width: 50,
        height: 150,
    },
    {
        name: "arm",
        type: "rect",
        color:"lightblue",
        position: {x: 400, y: 300},
        width: 20,
        height: 120,
        rotation: 180*Math.PI / 180,
        speed: 0.01,
    }
]

function update(shapes) {
    shapes.forEach(obj => {
        if(obj.name == "arm") {
            obj.rotation += obj.speed
        }
    })
}

function draw(shapes) {
    shapes.forEach(obj => {
        if (obj.name == "head") {
            ctx.beginPath()
            ctx.fillStyle = obj.color
            ctx.arc(400+25, 300-30, obj.radius, 0, 2*Math.PI)
            ctx.fill()
        }
        if (obj.name == "body") {
            ctx.beginPath()
            ctx.fillStyle = obj.color;
            ctx.fillRect(obj.position.x, obj.position.y, obj.width, obj.height);
        }
        if (obj.name == "arm") {
            ctx.save()
            ctx.translate(obj.position.x + 25, obj.position.y)
            ctx.rotate(obj.rotation)
            ctx.fillStyle = obj.color;
            ctx.fillRect(-obj.width/2, -obj.height, obj.width, obj.height);
            ctx.restore()
        }
        
    })
}

function gameLoop() {
    ctx.clearRect(0, 0, cw, ch)
    update(shapes)
    draw(shapes)
    window.requestAnimationFrame(gameLoop)
}