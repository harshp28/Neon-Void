/* script.js */
const canvas = document.getElementById("bgCanvas");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const stars = [];
const numStars = 100;

for (let i = 0; i < numStars; i++) {
    stars.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        radius: Math.random() * 2 + 1,
        speed: Math.random() * 0.5 + 0.2,
        twinkle: Math.random() * 0.05
    });
}

function drawStars() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (let star of stars) {
        ctx.fillStyle = `hsl(${Math.random() * 360}, 50%, 50%)`;
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
        ctx.fill();
        star.twinkle += 0.02;
    }
}

function updateStars() {
    for (let star of stars) {
        star.y += star.speed;
        if (star.y > canvas.height) {
            star.y = 0;
            star.x = Math.random() * canvas.width;
        }
    }
}

function animate() {
    drawStars();
    updateStars();
    requestAnimationFrame(animate);
}

animate();

window.addEventListener("resize", () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
});

// Smooth transition between menus
document.getElementById("play-now").addEventListener("click", function() {
    document.getElementById("main-menu").classList.add("hidden");
    setTimeout(() => {
        document.getElementById("main-menu").style.display = "none";
        document.getElementById("game-mode-menu").classList.remove("hidden");
        document.getElementById("game-mode-menu").classList.add("fade-in");
    }, 700);
});

// Add back button functionality
document.getElementById("back-button").addEventListener("click", function() {
    document.getElementById("game-mode-menu").classList.add("hidden");
    setTimeout(() => {
        document.getElementById("game-mode-menu").style.display = "none";
        document.getElementById("main-menu").classList.remove("hidden");
        document.getElementById("main-menu").classList.add("fade-in");
    }, 1000);
});
