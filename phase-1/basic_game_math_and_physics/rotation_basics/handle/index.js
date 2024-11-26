let context;
let canvas;
let cw;
let ch;
window.onload = init

function init() {
    canvas = document.getElementById("canvas")
    context = canvas.getContext("2d");
    cw = canvas.width;
    ch = canvas.height;

    gameLoop()
}
const shapes = [
    {
        name: "rectangle",
        position: { x: 100, y: 200 },
        width: 100,
        height: 50,
        rotation: 0,
        speed: 0.01,
    },
    {
        name: "line",
        center: { x: 500, y: 200 },
        length: 150,
        rotation: 0
    },
    {
        name: "cake",
        center: { x: 400, y: 400 },
        radius: 50,
        rotation: 0,
    }
]

let remoteRect = {
    position: { x: 100, y: 500 },
    width: 100,
    height: 150,
    rotation: 0,
    speed: 0.01,
    vx:0.01,
}

// Hàm vẽ shapes
function drawRotated(shapes) {
    shapes.forEach(obj => {
        context.save();
        if (obj.name == "rectangle") {
            // Move the origin to the rectangle's center
            context.translate(obj.position.x, obj.position.y);

            // Rotate the context by the rectangle’s rotation
            context.rotate(obj.rotation);

            // Draw the rectangle (centered at the origin now)
            context.fillStyle = "green";
            context.fillRect(-obj.width / 2, -obj.height / 2, obj.width, obj.height);
        }
        if (obj.name == "line") {
            // Move the origin to the rectangle's center
            context.translate(obj.center.x, obj.center.y);

            // Rotate the context by the rectangle’s rotation
            context.rotate(obj.rotation);

            // Draw the rectangle (centered at the origin now)
            context.strokeStyle = "blue";
            context.beginPath();
            context.lineWidth = 5;
            context.moveTo(-obj.length / 2, 0);  // Điểm bắt đầu (x1, y1)
            context.lineTo(obj.length / 2, 0); // Điểm kết thúc (x2, y2)
            context.stroke();
        }

        if (obj.name == "cake") {
            context.translate(obj.center.x, obj.center.y);

            context.rotate(obj.rotation);

            context.beginPath();
            context.fillStyle = 'red';
            context.arc(obj.radius, 0, obj.radius, 0, 3 * Math.PI / 2)
            context.fill()
        }

        context.restore(); // Restore the context to its original state

    });

}

// Hàm vẽ remote rect
function drawRemoteRect(rect) {
    context.save();
    context.translate(rect.position.x, rect.position.y);

    // Rotate the context by the rectangle’s rotation
    context.rotate(rect.rotation);

    // Draw the rectangle (centered at the origin now)
    context.fillStyle = "pink";
    context.fillRect(-rect.width / 2, -rect.height / 2, rect.width, rect.height);

    context.restore()
}

// Hàm update và điều khiển rect xanh
function updateRotationRect(rect, speed) {
    rect.rotation += speed;
    window.addEventListener("keydown", e => {
        if (e.key == "ArrowUp") {
            console.log("Current speed:", rect.speed)
            rect.speed += 0.0005/10
            console.log("After speed:", rect.speed)
        }
        if (e.key == "ArrowDown") {
            rect.speed -= 0.0005/10
            console.log(rect.speed)
        }
    })

}

// Hàm update rotation line và cake 
function updateRotation(shapes, speedRect, speedLine, speedCake, speed) {
    shapes.forEach(obj => {
        if (speed != null){
            obj.rotation += speed
        }
        else {
            if(speedRect !== null && obj.name == 'rectangle') {
                obj.rotation += speedRect;
                
                obj.position.x +=10;
                obj.position.y +=1
                if(obj.position.x > cw) {
                    obj.position.x =0;
                }
                if(obj.position.y > ch) {
                    obj.position.y =0;
                }
            }

            if(speedLine !== null && obj.name == 'line') {
                obj.rotation += speedLine;
            }
    
            if(speedCake !== null && obj.name == 'cake') {
                obj.rotation += speedCake;
            }
        }
    });
}

function moveRect(rect) {
    context.clearRect(0, 0, cw, ch);
    rect.position.x += rect.vx
}

function gameLoop() {
    context.clearRect(0, 0, cw, ch); // Clear the canvas

    updateRotation(shapes, 0.1, 100, 0.08, null)
    updateRotationRect(remoteRect, remoteRect.speed)

    drawRotated(shapes)
    drawRemoteRect(remoteRect)

    requestAnimationFrame(gameLoop); // Continue the loop
}

