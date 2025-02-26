"use strict";

let canvas = document.getElementById('canvas');
let context = canvas.getContext('2d');

let cirX = 0;
let cirY = 150;
let radius = 50;

let cappedFPS = true;
let fps = 30; // Capped FPS
const frameInterval = 1000 / fps; // Interval between frames in milliseconds
let lastTime = 0; // Store the last time the frame was updated
let secondsPassed;
let oldTimeStamp;
let currentFPS;

// Toggle Button
const toggleButton = document.getElementById('toggle');
toggleButton.addEventListener('click', () => {
    cappedFPS = !cappedFPS;
    toggleButton.textContent = `Toggle FPS Cap (Currently: ${cappedFPS ? '30 FPS' : 'Uncapped'})`;
});

// Initialize Game Loop
window.onload = () => {
    window.requestAnimationFrame(gameLoop);
};

// Game Loop Function
function gameLoop(timeStamp) {
    // Calculate FPS
    secondsPassed = (timeStamp - oldTimeStamp) / 1000;
    oldTimeStamp = timeStamp;
    currentFPS = Math.round(1 / secondsPassed);

    // Capped or Uncapped FPS
    if (cappedFPS) {
        const timeElapsed = timeStamp - lastTime;
        /**
         * Kiểm tra xem đã đủ thời gian vẽ khung hình tiếp theo chưa.
         * Nếu thời gian trôi qua (timeElapsed) > thời gian yêu cầu để vẽ 1 frame (frameInterval)
         * thì ta vẽ frame.
         * Vì lý do đợi cho timeElapsed phải lớn hơn frameInterval cho nên mới xảy ra hiện tượng trễ.
         * Do đó việc thiết lập giới hạn 30fps tương ứng với câu điều kiện dưới đây.
        **/
        if (timeElapsed > frameInterval) {
            lastTime = timeStamp;
            update();
            draw(Math.round(timeElapsed));
        }


    } else {
        update();
        draw(currentFPS);
    }


    window.requestAnimationFrame(gameLoop);
}

// Update Function
function update() {
    cirX += 3;
    if (cirX > canvas.width) {
        cirX = 0;
    }
}

// Draw Function
function draw(fps) {
    context.clearRect(0, 0, canvas.width, canvas.height);
    drawCircle();
    displayFPS(fps);
}

// Draw Circle
function drawCircle() {
    context.beginPath();
    context.arc(cirX, cirY, radius, 0, 2 * Math.PI);
    context.strokeStyle = 'red';
    context.fillStyle = 'blue';
    context.lineWidth = 10;
    context.stroke();
    context.fill();
}

// Display FPS
function displayFPS(fps) {
    context.beginPath();
    context.fillStyle = 'white';
    context.fillRect(0, 0, 150, 50); // Clear background for FPS display
    context.font = '20px Arial';
    context.fillStyle = 'black';
    context.fillText("FPS: " + fps, 10, 30);
}