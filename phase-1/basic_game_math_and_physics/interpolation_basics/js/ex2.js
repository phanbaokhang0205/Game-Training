let canvas
let context

window.onload = init

function init() {
    canvas = document.getElementById("canvas")
    context = canvas.getContext("2d")

    requestAnimationFrame(animateSquare);
}

// Ham noi suy tuyen tinh (linear)
function lerp(start, end, t) {
    return start + (end - start) * t
}

let square = {
    position: { x: 250, y: 200 },
    size: 20,
    color: "blue"
};

let animation = {
    startSize: 20,
    endSize: 200,
    duration: 2000, // in milliseconds
    startTime: null
};
// easing function
function easeInOutQuad(t) {
    if (t < 0.5) {
        return 2 * t**2
    } else {
        return 1 - ((-2*t + 2)**2) /2
    }
}

function animateSquare(time) {
    if (!animation.startTime) animation.startTime = time;


    const elapsed = time - animation.startTime;
    let t = Math.min(elapsed / animation.duration, 1);
    t = easeInOutQuad(t); // Apply easing

    // Interpolate position using `lerp`
    square.size = lerp(animation.startSize, animation.endSize, t);


    // Clear the canvas and draw the circle at its new position
    context.clearRect(0, 0, canvas.width, canvas.height);
    drawSquare(square);

    // Continue animation until `t` reaches 1
    if (t < 1) requestAnimationFrame(animateSquare);
    else {
        animation.startTime = null
        requestAnimationFrame(animateSquare);
    }
}

function drawSquare({ position, size, color }) {
    context.beginPath();
    context.fillRect(position.x, position.y, size, size)
    context.fillStyle = color;
    context.fill();
}



