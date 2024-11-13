const canvas = document.getElementById("gameCanvas");
const context = canvas.getContext("2d");

// Gravity acceleration (in pixels per frame squared)
const gravity = 0.5;
const lowGravity = 0.05;

// Object properties
let ball = {
    position: { x: 300, y: 50 }, // Starting near the top
    velocity: { x: 1, y: 0 },     // Initial velocity
    radius: 20,                   // Size of the ball
    color: "blue"
};

function drawBall(ball) {
    context.clearRect(0, 0, canvas.width, canvas.height); // Clear canvas
    context.beginPath();
    context.arc(ball.position.x, ball.position.y, ball.radius, 0, Math.PI * 2);
    context.fillStyle = ball.color;
    context.fill();
    context.closePath();
}

function applyGravity(ball) {
    // Apply gravity to the velocity
    ball.velocity.y += lowGravity;

    // Update position by the velocity
    ball.position.y += ball.velocity.y;
    ball.position.x += ball.velocity.x;

}

function checkCollision(ball) {
    // Check if ball hits the bottom of the canvas
    if (ball.position.y + ball.radius > canvas.height) {
        // Reverse the velocity to simulate a bounce
        ball.velocity.y *= -0.7; // 0.7 to lose energy each bounce
        ball.position.y = canvas.height - ball.radius; // Keep the ball above the floor
    }
}

function gameLoop() {
    applyGravity(ball);
    checkCollision(ball);
    drawBall(ball);

    requestAnimationFrame(gameLoop); // Continue the loop
}

gameLoop(); // Start the animation

