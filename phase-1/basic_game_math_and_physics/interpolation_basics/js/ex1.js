let canvas
let context

let circle = {
    position: { x: 50, y: 200 },
    radius: 100,
    color: "black"
};

let ball = {
    position: {x: 50, y: 200},
    radius: 20,
    color: "black"
}

let animation = {
    start: { x: 50, y: 200 },
    end: { x: 500, y: 200 },
    duration: 2000, // in milliseconds
    startTime: null
};

window.onload = init

function init() {
    canvas = document.getElementById("canvas")
    context = canvas.getContext("2d")

    requestAnimationFrame(animateCircle);
}

// Ham noi suy tuyen tinh (linear)
function lerp(start, end, t) {
    return start + (end - start) * t
}

let lastTime = 0

function animateCircle(time) {
    if (!animation.startTime) animation.startTime = time;

    const deltaTime = time - lastTime;
    lastTime = time;

    const elapsed = time - animation.startTime;
    let t = Math.min(elapsed / animation.duration, 1);
    t = easeInOutQuad(t); // Apply easing

    // Interpolate position using `lerp`
    circle.position.x = lerp(animation.start.x, animation.end.x, t);
    circle.position.y = lerp(animation.start.y, animation.end.y, t);

    // Clear the canvas and draw the circle at its new position
    context.clearRect(0, 0, canvas.width, canvas.height);
    drawCircle(circle);

    // Continue animation until `t` reaches 1
    if (t < 1) requestAnimationFrame(animateCircle);
}

function drawCircle({ position, radius, color }) {
    context.beginPath();
    context.arc(position.x, position.y, radius, 0, Math.PI * 2);
    context.fillStyle = color;
    context.fill();
}


function easeInOutQuad(t) {
    if (t < 0.5) {
        return 2 * t**2
    } else {
        return 1 - ((-2*t + 2)**2) /2
    }
}