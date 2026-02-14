const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let gravity = 0.8;
let keys = {};
let totalHearts = 14;
let portalActive = false;

const player = {
    x: 100,
    y: canvas.height - 150,
    width: 50,
    height: 50,
    color: "cyan",
    velocityY: 0,
    jumpCount: 0,
    maxJumps: 2
};

const ground = {
    x: 0,
    y: canvas.height - 50,
    width: canvas.width,
    height: 50
};

const portal = {
    x: canvas.width - 150,
    y: canvas.height - 120,
    width: 60,
    height: 70
};

let hearts = [];

for (let i = 0; i < totalHearts; i++) {
    hearts.push({
        x: 200 + i * 200,
        y: canvas.height - 120,
        size: 30,
        collected: false
    });
}

function jump() {
    if (player.jumpCount < player.maxJumps) {
        player.velocityY = -15;
        player.jumpCount++;
    }
}

document.addEventListener("keydown", (e) => {
    if (e.code === "Space") jump();
});

canvas.addEventListener("click", () => {
    jump();
});

function update() {
    player.velocityY += gravity;
    player.y += player.velocityY;

    // Colisión suelo
    if (player.y + player.height >= ground.y) {
        player.y = ground.y - player.height;
        player.velocityY = 0;
        player.jumpCount = 0;
    }

    // Movimiento automático hacia adelante
    player.x += 4;

    // Colisión corazones
    hearts.forEach(heart => {
        if (!heart.collected &&
            player.x < heart.x + heart.size &&
            player.x + player.width > heart.x &&
            player.y < heart.y + heart.size &&
            player.y + player.height > heart.y
        ) {
            heart.collected = true;
        }
    });

    // Activar portal
    if (hearts.filter(h => h.collected).length === totalHearts) {
        portalActive = true;
    }

    // Entrar al portal
    if (portalActive &&
        player.x < portal.x + portal.width &&
        player.x + player.width > portal.x &&
        player.y < portal.y + portal.height &&
        player.y + player.height > portal.y
    ) {
        window.location.href = "victory.html";
    }
}

function drawHeart(x, y, size) {
    ctx.fillStyle = "red";
    ctx.beginPath();
    ctx.moveTo(x + size / 2, y + size / 5);
    ctx.bezierCurveTo(x + size, y, x + size, y + size / 2, x + size / 2, y + size);
    ctx.bezierCurveTo(x, y + size / 2, x, y, x + size / 2, y + size / 5);
    ctx.fill();
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Fondo
    ctx.fillStyle = "#111";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Suelo
    ctx.fillStyle = "white";
    ctx.fillRect(ground.x, ground.y, ground.width, ground.height);

    // Jugador
    ctx.fillStyle = player.color;
    ctx.fillRect(player.x, player.y, player.width, player.height);

    // Corazones
    hearts.forEach(heart => {
        if (!heart.collected) {
            drawHeart(heart.x, heart.y, heart.size);
        }
    });

    // Portal
    if (portalActive) {
        ctx.fillStyle = "purple";
        ctx.fillRect(portal.x, portal.y, portal.width, portal.height);
    }

    // Contador
    ctx.fillStyle = "white";
    ctx.font = "30px Arial";
    ctx.fillText(
        "❤️ " + hearts.filter(h => h.collected).length + " / " + totalHearts,
        30,
        50
    );
}

function gameLoop() {
    update();
    draw();
    requestAnimationFrame(gameLoop);
}

gameLoop();
