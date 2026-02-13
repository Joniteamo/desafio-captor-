const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

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
   JUGADOR
========================= */
let player = {
  x: canvas.width * 0.05,
  y: canvas.height * 0.85,
  width: 120,
  height: 120,
  speed: 7
};

/* =========================
   FUNCION RANDOM SEGURA
========================= */
function randomX() {
  return Math.random() * (canvas.width - 150);
}

function randomY() {
  return Math.random() * (canvas.height - 150);
}

/* =========================
   10 CORAZONES RANDOM
========================= */
let hearts = [];
for (let i = 0; i < 10; i++) {
  hearts.push({
    x: randomX(),
    y: randomY(),
    collected: false
  });
}

/* =========================
   PINCHOS RANDOM
========================= */
let spikes = [];
for (let i = 0; i < 6; i++) {
  spikes.push({
    x: randomX(),
    y: randomY()
  });
}

/* =========================
   PORTAL FIJO EN META
========================= */
let portal = {
  x: canvas.width * 0.88,
  y: canvas.height * 0.05,
  width: 300,
  height: 300
};

let keys = {};
let collectedCount = 0;

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

  hearts.forEach(heart => {
    if (!heart.collected &&
      player.x < heart.x + 60 &&
      player.x + player.width > heart.x &&
      player.y < heart.y + 60 &&
      player.y + player.height > heart.y
    ) {
      heart.collected = true;
      collectedCount++;
    }
  });

  spikes.forEach(spike => {
    if (
      player.x < spike.x + 90 &&
      player.x + player.width > spike.x &&
      player.y < spike.y + 90 &&
      player.y + player.height > spike.y
    ) {
      // reinicia todo y vuelve a randomizar
      player.x = canvas.width * 0.05;
      player.y = canvas.height * 0.85;
      collectedCount = 0;

      hearts.forEach(h => {
        h.collected = false;
        h.x = randomX();
        h.y = randomY();
      });

      spikes.forEach(s => {
        s.x = randomX();
        s.y = randomY();
      });
    }
  });

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

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  ctx.drawImage(maze, 0, 0, canvas.width, canvas.height);

  hearts.forEach(heart => {
    if (!heart.collected) {
      ctx.drawImage(heartImg, heart.x, heart.y, 60, 60);
    }
  });

  spikes.forEach(spike => {
    ctx.drawImage(spikeImg, spike.x, spike.y, 90, 90);
  });

  ctx.drawImage(portalImg, portal.x, portal.y, portal.width, portal.height);
  ctx.drawImage(captorImg, player.x, player.y, player.width, player.height);
}

function gameLoop() {
  movePlayer();
  checkCollisions();
  draw();
  requestAnimationFrame(gameLo
