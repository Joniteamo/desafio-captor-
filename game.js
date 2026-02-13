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

let player = {
  x: 80,
  y: canvas.height - 120,
  width: 80,   // MÁS GRANDE
  height: 80,
  speed: 6
};

// 🔥 10 CORAZONES
let hearts = [];
for (let i = 0; i < 10; i++) {
  hearts.push({
    x: 150 + Math.random() * (canvas.width - 300),
    y: 100 + Math.random() * (canvas.height - 300),
    collected: false
  });
}

// 🔥 PINCHOS VISIBLES
let spikes = [
  { x: 400, y: canvas.height - 150 },
  { x: 500, y: canvas.height - 200 },
  { x: 600, y: canvas.height - 150 },
  { x: 700, y: canvas.height - 200 },
  { x: 800, y: canvas.height - 150 }
];

// 🔥 PORTAL EN META (arriba derecha)
let portal = {
  x: canvas.width - 180,
  y: 60
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
      player.x < heart.x + 40 &&
      player.x + player.width > heart.x &&
      player.y < heart.y + 40 &&
      player.y + player.height > heart.y
    ) {
      heart.collected = true;
      collectedCount++;
    }
  });

  spikes.forEach(spike => {
    if (
      player.x < spike.x + 60 &&
      player.x + player.width > spike.x &&
      player.y < spike.y + 60 &&
      player.y + player.height > spike.y
    ) {
      player.x = 80;
      player.y = canvas.height - 120;
      collectedCount = 0;
      hearts.forEach(h => h.collected = false);
    }
  });

  if (
    collectedCount === hearts.length &&
    player.x < portal.x + 100 &&
    player.x + player.width > portal.x &&
    player.y < portal.y + 100 &&
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
      ctx.drawImage(heartImg, heart.x, heart.y, 40, 40);
    }
  });

  spikes.forEach(spike => {
    ctx.drawImage(spikeImg, spike.x, spike.y, 60, 60);
  });

  ctx.drawImage(portalImg, portal.x, portal.y, 100, 100);
  ctx.drawImage(captorImg, player.x, player.y, player.width, player.height);
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
