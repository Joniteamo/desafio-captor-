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

let mazeData; // datos de pixeles

/* =========================
   JUGADOR PRO
========================= */
let player = {
  x: 100,
  y: canvas.height - 200,
  width: 180,
  height: 180,
  speed: 6,
  lives: 100,
  invulnerable: false
};

let keys = {};
document.addEventListener("keydown", e => keys[e.key] = true);
document.addEventListener("keyup", e => keys[e.key] = false);

/* =========================
   DETECTAR PAREDES
========================= */
function isWall(x, y) {

  const pixelX = Math.floor(x);
  const pixelY = Math.floor(y);

  if (
    pixelX < 0 ||
    pixelY < 0 ||
    pixelX >= canvas.width ||
    pixelY >= canvas.height
  ) return true;

  const index = (pixelY * canvas.width + pixelX) * 4;
  const r = mazeData.data[index];
  const g = mazeData.data[index + 1];
  const b = mazeData.data[index + 2];

  // Si es oscuro = pared
  return (r < 80 && g < 80 && b < 80);
}

/* =========================
   MOVIMIENTO CON COLISION
========================= */
function movePlayer() {

  let nextX = player.x;
  let nextY = player.y;

  if (keys["ArrowUp"]) nextY -= player.speed;
  if (keys["ArrowDown"]) nextY += player.speed;
  if (keys["ArrowLeft"]) nextX -= player.speed;
  if (keys["ArrowRight"]) nextX += player.speed;

  // Chequear 4 esquinas
  if (
    !isWall(nextX, nextY) &&
    !isWall(nextX + player.width, nextY) &&
    !isWall(nextX, nextY + player.height) &&
    !isWall(nextX + player.width, nextY + player.height)
  ) {
    player.x = nextX;
    player.y = nextY;
  }
}

/* =========================
   GENERAR POSICION VALIDA
========================= */
function getValidPosition(size) {
  let x, y;
  do {
    x = Math.random() * (canvas.width - size);
    y = Math.random() * (canvas.height - size);
  } while (
    isWall(x, y) ||
    isWall(x + size, y) ||
    isWall(x, y + size) ||
    isWall(x + size, y + size)
  );
  return { x, y };
}

/* =========================
   CORAZONES
========================= */
let hearts = [];
function generateHearts() {
  hearts = [];
  for (let i = 0; i < 10; i++) {
    let pos = getValidPosition(70);
    hearts.push({
      x: pos.x,
      y: pos.y,
      collected: false
    });
  }
}

let collectedCount = 0;

/* =========================
   PINCHOS
========================= */
let spikes = [];
function generateSpikes() {
  spikes = [];
  for (let i = 0; i < 8; i++) {
    let pos = getValidPosition(100);
    spikes.push({
      x: pos.x,
      y: pos.y
    });
  }
}

/* =========================
   PORTAL FIJO EN META
========================= */
let portal = {
  x: canvas.width * 0.85,
  y: canvas.height * 0.05,
  width: 360,
  height: 360
};

/* =========================
   COLISIONES
========================= */
function checkCollisions() {

  // Corazones
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

  // Pinchos (con daño controlado)
  spikes.forEach(spike => {
    if (
      !player.invulnerable &&
      player.x < spike.x + 100 &&
      player.x + player.width > spike.x &&
      player.y < spike.y + 100 &&
      player.y + player.height > spike.y
    ) {
      player.lives -= 10;
      player.invulnerable = true;

      setTimeout(() => {
        player.invulnerable = false;
      }, 800);
    }
  });

  // Game Over
  if (player.lives <= 0) {
    player.lives = 100;
    collectedCount = 0;
    generateHearts();
    generateSpikes();
  }

  // Portal
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

/* =========================
   UI
========================= */
function drawUI() {

  ctx.fillStyle = "white";
  ctx.font = "28px Arial";
  ctx.fillText("Corazones: " + collectedCount + " / 10", 30, 50);

  ctx.fillStyle = "red";
  ctx.fillRect(30, 70, 300, 25);

  ctx.fillStyle = "lime";
  ctx.fillRect(30, 70, player.lives * 3, 25);

  ctx.strokeStyle = "white";
  ctx.strokeRect(30, 70, 300, 25);
}

/* =========================
   DRAW
========================= */
function draw() {

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(maze, 0, 0, canvas.width, canvas.height);

  hearts.forEach(heart => {
    if (!heart.collected)
      ctx.drawImage(heartImg, heart.x, heart.y, 70, 70);
  });

  spikes.forEach(spike => {
    ctx.drawImage(spikeImg, spike.x, spike.y, 100, 100);
  });

  ctx.drawImage(portalImg, portal.x, portal.y, portal.width, portal.height);

  if (player.invulnerable) {
    ctx.globalAlpha = 0.5;
  }

  ctx.drawImage(captorImg, player.x, player.y, player.width, player.height);
  ctx.globalAlpha = 1;

  drawUI();
}

/* =========================
   LOOP
========================= */
function gameLoop() {
  movePlayer();
  checkCollisions();
  draw();
  requestAnimationFrame(gameLoop);
}

/* =========================
   INICIO
========================= */
maze.onload = () => {

  ctx.drawImage(maze, 0, 0, canvas.width, canvas.height);
  mazeData = ctx.getImageData(0, 0, canvas.width, canvas.height);

  generateHearts();
  generateSpikes();

  gameLoop();
};
