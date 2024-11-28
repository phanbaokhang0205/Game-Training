let canvas
let context

window.onload = init

function init() {
    canvas = document.getElementById("canvas")
    context = canvas.getContext("2d")

    requestAnimationFrame(animateBall);
}

// Ham noi suy tuyen tinh (linear)
function lerp(start, end, t) {
    return start + (end - start) * t
}

let circle = {
    position: { x: 400, y: 300 },
    radius: 200,
    color: "black",
};

let ball = {
    position: { x: 400, y: 300 },
    radius: 20,
    color: "blue",
};

let animation = {
    startAngle: 0, // Độ
    endAngle: 360, // Độ
    duration: 2000, // Thời gian chạy (ms)
    startTime: null,
};

// easing function
function easeInOutQuad(t) {
    if (t < 0.5) {
        return 2 * t ** 2
    } else {
        return 1 - ((-2 * t + 2) ** 2) / 2
    }
}

function animateBall(time) {
    if (!animation.startTime) animation.startTime = time;

    const elapsed = time - animation.startTime;
    let t = Math.min(elapsed / animation.duration, 1);
    t = easeInOutQuad(t); // Apply easing

    // Chuyển đổi góc sang radian
    const startAngle = (animation.startAngle * Math.PI) / 180;
    const endAngle = (animation.endAngle * Math.PI) / 180;

    // Tính vị trí hiện tại của bóng
    const currentAngle = lerp(startAngle, endAngle, t);
    ball.position.x = circle.position.x + circle.radius * Math.cos(currentAngle);
    ball.position.y = circle.position.y + circle.radius * Math.sin(currentAngle);

    // Clear the canvas and draw the circle at its new position
    context.clearRect(0, 0, canvas.width, canvas.height);
    drawCircle(circle);
    drawBall(ball)
    // Continue animation until `t` reaches 1
    if (t < 1) requestAnimationFrame(animateBall);
    else {
        animation.startTime = null; // Đặt lại thời gian bắt đầu
        requestAnimationFrame(animateBall); // Lặp lại hoạt ảnh
    }
}

function drawCircle({ position, radius, color }) {
    context.beginPath();
    context.arc(position.x, position.y, radius, 0, 2 * Math.PI)
    context.strokeStyle = color;
    context.stroke();
}

function drawBall({ position, radius, color }) {
    context.beginPath();
    context.arc(position.x, position.y, radius, 0, 2 * Math.PI)
    context.fillStyle = color;
    context.fill();
}




