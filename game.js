const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

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
  x: 50,
  y: 500,
  width: 40,
  height: 40,
  speed: 4
};

let hearts = [
  { x: 200, y: 450, collected: false },
  { x: 500, y: 300, collected: false },
  { x: 650, y: 150, collected: false }
];

let spikes = [
  { x: 300, y: 520 },
  { x: 400, y: 520 },
  { x: 500, y: 520 }
];

let portal = { x: 730, y: 50 };

let keys = {};
let collectedCount = 0;

document.addEventListener("keydown", e => keys[e.key] = true);
document.addEventListener("keyup", e => keys[e.key] = false);

function movePlayer() {
  if (keys["ArrowUp"]) player.y -= player.speed;
  if (keys["ArrowDown"]) player.y += player.speed;
  if (keys["ArrowLeft"]) player.x -= player.speed;
  if (keys["ArrowRight"]) player.x += player.speed;

  // límites del canvas
  if (player.x < 0) player.x = 0;
  if (player.y < 0) player.y = 0;
  if (player.x + player.width > canvas.width)
    player.x = canvas.width - player.width;
  if (player.y + player.height > canvas.height)
    player.y = canvas.height - player.height;
}

function checkCollisions() {

  // corazones
  hearts.forEach(heart => {
    if (!heart.collected &&
      player.x < heart.x + 30 &&
      player.x + player.width > heart.x &&
      player.y < heart.y + 30 &&
      player.y + player.height > heart.y
    ) {
      heart.collected = true;
      collectedCount++;
    }
  });

  // pinchos
  spikes.forEach(spike => {
    if (
      player.x < spike.x + 40 &&
      player.x + player.width > spike.x &&
      player.y < spike.y + 40 &&
      player.y + player.height > spike.y
    ) {
      player.x = 50;
      player.y = 500;
      collectedCount = 0;
      hearts.forEach(h => h.collected = false);
    }
  });

  // portal
  if (
    collectedCount === hearts.length &&
    player.x < portal.x + 50 &&
    player.x + player.width > portal.x &&
    player.y < portal.y + 50 &&
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
      ctx.drawImage(heartImg, heart.x, heart.y, 30, 30);
    }
  });

  spikes.forEach(spike => {
    ctx.drawImage(spikeImg, spike.x, spike.y, 40, 40);
  });

  ctx.drawImage(portalImg, portal.x, portal.y, 50, 50);
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
