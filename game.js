const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

/* =========================
   IMÁGENES
========================= */
const maze = new Image();
maze.src = "./assets/maze.png";

const captorImg = new Image();
captorImg.src = "./assets/captor.png";

const heartImg = new Image();
heartImg.src = "./assets/heart.png";

const spikeImg = new Image();
spikeImg.src = "./assets/spike.png";

const portalImg = new Image();
portalImg.src = "./assets/portal.png";

/* =========================
   JUGADOR (3x MÁS GRANDE)
========================= */
let player = {
  x: canvas.width * 0.05,
  y: canvas.height * 0.85,
  width: 180,
  height: 180,
  speed: 7,
  lives: 100
};

/* =========================
   RANDOM LIBRE (NO LINEAL)
========================= */
function randomPosition() {
  return {
    x: Math.random() * (canvas.width - 200),
    y: Math.random() * (canvas.height - 200)
  };
}

/* =========================
   CORAZONES
========================= */
let hearts = [];
for (let i = 0; i < 10; i++) {
  let pos = randomPosition();
  hearts.push({
    x: pos.x,
    y: pos.y,
    collected: false
  });
}

let collectedCount = 0;

/* =========================
   PINCHOS DESORDENADOS
========================= */
let spikes = [];
for (let i = 0; i < 8; i++) {
  let pos = randomPosition();
  spikes.push({
    x: pos.x,
    y: pos.y
  });
}

/* =========================
   PORTAL 3x MÁS GRANDE
========================= */
let portal = {
  x: canvas.width * 0.85,
  y: canvas.height * 0.05,
  width: 360,
  height: 360
};

let keys = {};

document.addEventListener("keydown", e => keys[e.key] = true);
document.addEventListener("keyup", e => keys[e.key] = false);

function movePlayer() {
  if (keys["ArrowUp"]) player.y -= player.speed;
  if (keys["ArrowDown"]) player.y += player.speed;
  if (keys["ArrowLeft"]) player.x -= player.speed;
  if (keys["ArrowRight"]) player.x += player.speed;

  if (player.x < 0) player.x = 0;
  if (player.y < 0) player.y = 0;
  if (player.x + player.width > canvas.width)
    player.x = canvas.width - player.width;
  if (player.y + player.height > canvas.height)
    player.y = canvas.height - player.height;
}

function checkCollisions() {

  // CORAZONES
  hearts.forEach(heart => {
    if (!heart.collected &&
      player.x < heart.x + 70 &&
      player.x + player.width > heart.x &&
      player.y < heart.y + 70 &&
      player.y + player.height > heart.y
    ) {
      heart.collected = true;
      collectedCount++;
    }
  });

  // PINCHOS
  spikes.forEach(spike => {
    if (
      player.x < spike.x + 100 &&
      player.x + player.width > spike.x &&
      player.y < spike.y + 100 &&
      player.y + player.height > spike.y
    ) {
      player.lives -= 1;
    }
  });

  // GAME OVER
  if (player.lives <= 0) {
    player.lives = 100;
    collectedCount = 0;
    hearts.forEach(h => h.collected = false);
  }

  // PORTAL
  if (
    collectedCount === hearts.length &&
    player.x < portal.x + portal.width &&
    player.x + player.width > portal.x &&
    player.y < portal.y + portal.height &&
    player.y + player.height > portal.y
  ) {
    window.location.href = "./victory.html";
  }
}

function drawUI() {

  // Barra corazones
  ctx.fillStyle = "white";
  ctx.font = "30px Arial";
  ctx.fillText("Corazones: " + collectedCount + " / 10", 30, 50);

  // Barra vida fondo
  ctx.fillStyle = "red";
  ctx.fillRect(30, 70, 300, 25);

  // Vida actual
  ctx.fillStyle = "lime";
  ctx.fillRect(30, 70, player.lives * 3, 25);

  ctx.strokeStyle = "white";
  ctx.strokeRect(30, 70, 300, 25);
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  ctx.drawImage(maze, 0, 0, canvas.width, canvas.height);

  hearts.forEach(heart => {
    if (!heart.collected) {
      ctx.drawImage(heartImg, heart.x, heart.y, 70, 70);
    }
  });

  spikes.forEach(spike => {
    ctx.drawImage(spikeImg, spike.x, spike.y, 100, 100);
  });

  ctx.drawImage(portalImg, portal.x, portal.y, portal.width, portal.height);
  ctx.drawImage(captorImg, player.x, player.y, player.width, player.height);

  drawUI();
}

function gameLoop() {
  movePlayer();
  checkCollisions();
  draw();
  requestAnimationFrame(gameLoop);
}

maze.onload = () => {
  gameLoop();
};
