// CANVAS
let canvas;
let context;
let canvasW;
let canvasH;

// FPS
let fps;
let secondPassed = 0;
let oldTimeStamp = 0;

// BALL
let remoteBall = {
    position: { x: 100, y: 100 },
    velocity: { x: 3, y: 0 },
    radius: 20,
    color: "blue",
};

let balls = [
    {
        position: { x: 200, y: 0 },
        velocity: { x: 2, y: 0 },
        radius: 15,
        color: "red",
    },
    {
        position: { x: 300, y: 50 },
        velocity: { x: 2, y: 0 },
        radius: 25,
        color: "green",
    },
    {
        position: { x: 400, y: 100 },
        velocity: { x: 2, y: 10 },
        radius: 25,
        color: "pink",
    },
];

// PHYSICS
let gravity = 0.5;
let jumpHeight = 20;
let speed = 100;
let dx = 0;
let dy = 0;

window.onload = init;

function init() {
    canvas = document.getElementById("canvas");
    context = canvas.getContext("2d");
    canvasW = canvas.width;
    canvasH = canvas.height;

    // Start the first frame request
    window.requestAnimationFrame(gameLoop);
}

function gameLoop(timeStamp) {
    secondPassed = (timeStamp - oldTimeStamp) / 1000;
    oldTimeStamp = timeStamp;
    fps = Math.round(1/secondPassed)


    update(remoteBall, secondPassed);
    draw(remoteBall, balls, fps);
    requestAnimationFrame(gameLoop);
}

function update(remoteBall, secondPassed) {
    control(remoteBall, secondPassed);
    applyGravity(remoteBall, balls);
    checkCollision(remoteBall, balls);
}

function applyGravity(remoteBall, balls) {
    // Apply gravity to the velocity
    remoteBall.velocity.y += gravity;

    // Update position by the velocity
    remoteBall.position.y += remoteBall.velocity.y;
    remoteBall.position.x += remoteBall.velocity.x;

    // Apply gravity for balls array
    balls.forEach(ball => {
        ball.velocity.y += gravity;

        ball.position.y += ball.velocity.y;
        ball.position.x += ball.velocity.x;
    })
}

function checkCollision(remoteBall, balls) {
    // Check if remoteBall hits the bottom of the canvas
    if (remoteBall.position.y + remoteBall.radius > canvasH) {
        // Reverse the velocity to simulate a bounce
        remoteBall.velocity.y *= -0.7; // 0.7 to lose energy each bounce
        remoteBall.velocity.x *= 0.7; // 0.7 to lose energy each bounce
        remoteBall.position.y = canvasH - remoteBall.radius; // Keep the remoteBall above the floor
    
    } else if (remoteBall.position.x + remoteBall.radius > canvasW) {
        remoteBall.position.x = canvasW - remoteBall.radius; // Keep the remoteBall above the floor
    } else if (remoteBall.position.x < 0 + remoteBall.radius) {
        remoteBall.position.x = 0 + remoteBall.radius;
    }

    balls.forEach(ball => {
        if (ball.position.y + ball.radius > canvasH) {
            // Reverse the velocity to simulate a bounce
            ball.velocity.y *= -0.7; // 0.7 to lose energy each bounce
            ball.velocity.x *= 0.7; // 0.7 to lose energy each bounce
            ball.position.y = canvasH - ball.radius; // Keep the ball above the floor
        
        } else if (ball.position.x + ball.radius > canvasW) {
            ball.position.x = canvasW - ball.radius; // Keep the ball above the floor
        } else if (ball.position.x < 0 + ball.radius) {
            ball.position.x = 0 + ball.radius;
        }
    })
}

function control(remoteBall, secondPassed) {
    remoteBall.velocity.x += dx;
    remoteBall.velocity.y += dy;

    window.addEventListener("keydown", (e) => {
        if (e.key == "ArrowUp") {
            remoteBall.velocity.y = jumpHeight;
        }
        if (e.key == "ArrowRight") {
            dx = (speed * secondPassed);
        }
        if (e.key == "ArrowLeft") {
            dx = -(speed * secondPassed);
        }
    });
    window.addEventListener("keyup", (e) => {
        if (e.key == "ArrowRight") {
            dx = 0;
        }
        if (e.key == "ArrowLeft") {
            dx = 0;
        }
    });
}

function draw(remoteBall, balls, fps) {
    // remote ball
    context.clearRect(0, 0, canvasW, canvasH);
    context.beginPath();
    context.arc(
        remoteBall.position.x,
        remoteBall.position.y,
        remoteBall.radius,
        0,
        2 * Math.PI
    );
    context.fillStyle = remoteBall.color;
    context.fill();

    // balls
    balls.forEach(ball => {
        context.beginPath();
        context.arc(ball.position.x, ball.position.y, ball.radius, 0, 2 * Math.PI);
        context.fillStyle = ball.color;
        context.fill();
    });

    // FPS
    context.beginPath();
    context.fillStyle = 'red';
    context.textAlign = 'center';
    context.font = '20px Arial';
    context.fillText(`FPS: ${fps}`, canvasW/2, 30)
}
