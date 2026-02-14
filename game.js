const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// ===== IMÁGENES =====
const captorImg = new Image();
captorImg.src = "./assets/captor.png";

const mazeImg = new Image();
mazeImg.src = "./assets/maze.png";

const spikeImg = new Image();
spikeImg.src = "./assets/spike.png";

const heartImg = new Image();
heartImg.src = "./assets/heart.png";

const cetroImg = new Image();
cetroImg.src = "./assets/cetro.png";

// ===== CONFIG =====
let gravity = 0.8;
let gameStarted = false;
let cameraX = 0;
let totalHearts = 14;
let portalActive = false;

// ===== PLAYER =====
const player = {
    x: 100,
    y: 400,
    width: 70,
    height: 70,
    velocityY: 0,
    jumpCount: 0,
    maxJumps: 2,
    speed: 5,
    alive: true
};

// ===== PLATAFORMAS =====
const platforms = [
    { x: 0, y: 500, width: 3000, height: 50 },
    { x: 600, y: 400, width: 200, height: 20 },
    { x: 950, y: 350, width: 200, height: 20 },
    { x: 1350, y: 300, width: 200, height: 20 },
    { x: 1750, y: 450, width: 300, height: 20 }
];

// ===== PINCHES =====
const spikes = [
    { x: 500, y: 470, width: 50, height: 30 },
    { x: 1200, y: 470, width: 50, height: 30 },
    { x: 1600, y: 470, width: 50, height: 30 }
];

// ===== CORAZONES =====
let hearts = [];
for (let i = 0; i < totalHearts; i++) {
    hearts.push({
        x: 300 + i * 180,
        y: 450 - (i % 3) * 80,
        size: 40,
        collected: false
    });
}

// ===== CETRO FINAL =====
const cetro = {
    x: 2600,
    y: 420,
    width: 80,
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

document.addEventListener("keydown", function(e) {
    if (e.code === "Space") {
        jump();
    }
});

canvas.addEventListener("click", function() {
    jump();
});

function update() {
    if (!gameStarted || !player.alive) return;

    player.velocityY += gravity;
    player.y += player.velocityY;
    player.x += player.speed;

    // Plataformas
    platforms.forEach(function(platform) {
        if (
            player.x < platform.x + platform.width &&
            player.x + player.width > platform.x &&
            player.y + player.height <= platform.y + 10 &&
            player.y + player.height >= platform.y
        ) {
            player.y = platform.y - player.height;
            player.velocityY = 0;
            player.jumpCount = 0;
        }
    });

    // Pinches
    spikes.forEach(function(spike) {
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
    hearts.forEach(function(heart) {
        if (!heart.collected &&
            player.x < heart.x + heart.size &&
            player.x + player.width > heart.x &&
            player.y < heart.y + heart.size &&
            player.y + player.height > heart.y
        ) {
            heart.collected = true;
        }
    });

    if (hearts.filter(function(h){ return h.collected; }).length === totalHearts) {
        portalActive = true;
    }

    // Cetro
    if (portalActive &&
        player.x < cetro.x + cetro.width &&
        player.x + player.width > cetro.x &&
        player.y < cetro.y + cetro.height &&
        player.y + player.height > cetro.y
    ) {
        window.location.href = "victory.html";
    }

    cameraX += ((player.x - canvas.width / 3) - cameraX) * 0.08;
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.drawImage(mazeImg, 0, 0, canvas.width, canvas.height);

    ctx.save();
    ctx.translate(-cameraX, 0);

    spikes.forEach(function(s) {
        ctx.drawImage(spikeImg, s.x, s.y, s.width, s.height);
    });

    hearts.forEach(function(heart) {
        if (!heart.collected) {
            ctx.drawImage(heartImg, heart.x, heart.y, heart.size, heart.size);
        }
    });

    if (portalActive) {
        ctx.drawImage(cetroImg, cetro.x, cetro.y, cetro.width, cetro.height);
    }

    ctx.drawImage(captorImg, player.x, player.y, player.width, player.height);

    ctx.restore();

    ctx.fillStyle = "white";
    ctx.font = "30px Arial";
    ctx.fillText(
        "❤️ " + hearts.filter(function(h){ return h.collected; }).length + " / " + totalHearts,
        30,
        50
    );

    if (!gameStarted) {
        ctx.font = "50px Arial";
        ctx.fillText(
            "TOCÁ O PRESIONÁ ESPACIO PARA COMENZAR",
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
