const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let gravity = 0.8;
let gameStarted = false;
let cameraX = 0;
let totalHearts = 14;
let portalActive = false;

const player = {
    x: 100,
    y: 400,
    width: 50,
    height: 50,
    velocityY: 0,
    jumpCount: 0,
    maxJumps: 2,
    speed: 5,
    alive: true
};

const platforms = [
    { x: 0, y: 500, width: 2000, height: 50 },
    { x: 600, y: 400, width: 200, height: 20 },
    { x: 900, y: 350, width: 200, height: 20 },
    { x: 1300, y: 300, width: 200, height: 20 },
    { x: 1700, y: 450, width: 300, height: 20 }
];

const spikes = [
    { x: 500, y: 470, width: 50, height: 30 },
    { x: 1100, y: 470, width: 50, height: 30 },
    { x: 1600, y: 470, width: 50, height: 30 }
];

let hearts = [];
for (let i = 0; i < totalHearts; i++) {
    hearts.push({
        x: 300 + i * 150,
        y: 450 - (i % 3) * 80,
        size: 25,
        collected: false
    });
}

const portal = {
    x: 2200,
    y: 420,
    width: 60,
    height: 80
};

function resetGame() {
    player.x = 100;
    player.y = 400;
    player.velocityY = 0;
    player.jumpCount = 0;
    player.alive = true;
    cameraX = 0;
    hearts.forEach(h => h.collected = false);
    portalActive = false;
}

function jump() {
    if (!gameStarted) {
        gameStarted = true;
        return;
    }

    if (player.jumpCount < player.maxJumps) {
        player.velocityY = -15;
        player.jumpCount++;
    }
}

document.addEventListener("keydown", e => {
    if (e.code === "Space") jump();
});

canvas.addEventListener("click", jump);

function update() {
    if (!gameStarted || !player.alive) return;

    player.velocityY += gravity;
    player.y += player.velocityY;
    player.x += player.speed;

    // Colisión plataformas
    platforms.forEach(platform => {
        if (
            player.x < platform.x + platform.width &&
            player.x + player.width > platform.x &&
            player.y + player.height < platform.y + 20 &&
            player.y + player.height > platform.y
        ) {
            player.y = platform.y - player.height;
            player.velocityY = 0;
            player.jumpCount = 0;
        }
    });

    // Colisión pinches
    spikes.forEach(spike => {
        if (
            player.x < spike.x + spike.width &&
            player.x + player.width > spike.x &&
            player.y < spike.y + spike.height &&
            player.y + player.height > spike.y
        ) {
            player.alive = false;
            setTimeout(resetGame, 1000);
        }
    });

    // Corazones
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

    if (hearts.filter(h => h.collected).length === totalHearts) {
        portalActive = true;
    }

    // Portal
    if (portalActive &&
        player.x < portal.x + portal.width &&
        player.x + player.width > portal.x &&
        player.y < portal.y + portal.height &&
        player.y + player.height > portal.y
    ) {
        window.location.href = "victory.html";
    }

    // Cámara sigue jugador
    cameraX = player.x - canvas.width / 3;
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

    ctx.save();
    ctx.translate(-cameraX, 0);

    // Fondo
    ctx.fillStyle = "#0a0a1f";
    ctx.fillRect(cameraX, 0, canvas.width, canvas.height);

    // Plataformas
    ctx.fillStyle = "white";
    platforms.forEach(p => {
        ctx.fillRect(p.x, p.y, p.width, p.height);
    });

    // Pinches
    ctx.fillStyle = "red";
    spikes.forEach(s => {
        ctx.beginPath();
        ctx.moveTo(s.x, s.y + s.height);
        ctx.lineTo(s.x + s.width / 2, s.y);
        ctx.lineTo(s.x + s.width, s.y + s.height);
        ctx.fill();
    });

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

    // Jugador (acá después podés poner la imagen del captor)
    ctx.fillStyle = "cyan";
    ctx.fillRect(player.x, player.y, player.width, player.height);

    ctx.restore();

    // HUD fijo
    ctx.fillStyle = "white";
    ctx.font = "30px Arial";
    ctx.fillText(
        "❤️ " + hearts.filter(h => h.collected).length + " / " + totalHearts,
        30,
        50
    );

    if (!gameStarted) {
        ctx.font = "50px Arial";
        ctx.fillText("TOCÁ O PRESIONÁ ESPACIO PARA COMENZAR",
            canvas.width / 2 - 450,
            canvas.height / 2
        );
    }
}

function loop() {
    update();
    draw();
    requestAnimationFrame(loop);
}

loop();
