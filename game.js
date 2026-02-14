const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// ===== IMÁGENES =====
const captorImg = new Image();
captorImg.src = "assets/captor.png";

const mazeImg = new Image();
mazeImg.src = "assets/maze.png";

const spikeImg = new Image();
spikeImg.src = "assets/spike.png";

const heartImg = new Image();
heartImg.src = "assets/heart.png";

const cetroImg = new Image();
cetroImg.src = "assets/cetro.png";

// ===== CONTROL DE CARGA =====
let imagesLoaded = 0;
const totalImages = 5;

function imageLoaded() {
    imagesLoaded++;
}

captorImg.onload = imageLoaded;
mazeImg.onload = imageLoaded;
spikeImg.onload = imageLoaded;
heartImg.onload = imageLoaded;
cetroImg.onload = imageLoaded;

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

// ===== RESET =====
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

// ===== SALTO =====
function jump() {
    if (!gameStarted) {
        gameStarted = true;
        return;
    }

    if (player.jumpCount <
