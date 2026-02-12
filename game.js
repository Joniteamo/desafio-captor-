const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

canvas.width = 1280;
canvas.height = 720;

let heartsCollected = 0;
const totalHearts = 15;

const playerImg = new Image();
playerImg.src = "captor.jpg";

const heartImg = new Image();
heartImg.src = "hearts.jpg";

const portalImg = new Image();
portalImg.src = "portal.jpg";

const spikeImg = new Image();
spikeImg.src = "spike.png";

let player = {
  x: 100,
  y: 100,
  size: 70,
  speed: 5
};

let hearts = [];
for (let i = 0; i < totalHearts; i++) {
  hearts.push({
    x: Math.random() * 1100 + 50,
    y: Math.random() * 600 + 50,
    size: 50,
    collected: false
  });
}

let spikes = [];
for (let i = 0; i < 8; i++) {
  spikes.push({
    x: Math.random() * 1100 + 50,
    y: Math.random() * 600 + 50,
    size: 60
  });
}

let portal = {
  x: 1150,
  y: 600,
  size: 90
};

let keys = {};
document.addEventListener("keydown", e => keys[e.key] = true);
document.addEventListener("keyup", e => keys[e.key] = false);

function resetPlayer() {
  player.x = 100;
  player.y = 100;
}

function gameLoop() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Movimiento
  if (keys["ArrowUp"] || keys["w"]) player.y -= player.speed;
  if (keys["ArrowDown"] || keys["s"]) player.y += player.speed;
  if (keys["ArrowLeft"] || keys["a"]) player.x -= player.speed;
  if (keys["ArrowRight"] || keys["d"]) player.x += player.speed;

  // Dibujar corazones
  hearts.forEach(h => {
    if (!h.collected) {
      ctx.drawImage(heartImg, h.x, h.y, h.size, h.size);

      let dist = Math.hypot(player.x - h.x, player.y - h.y);
      if (dist < 50) {
        h.collected = true;
        heartsCollected++;
      }
    }
  });

  // Dibujar pinchos
  spikes.forEach(s => {
    ctx.drawImage(spikeImg, s.x, s.y, s.size, s.size);

    let dist = Math.hypot(player.x - s.x, player.y - s.y);
    if (dist < 50) {
      resetPlayer();
    }
  });

  // Dibujar portal
  ctx.drawImage(portalImg, portal.x, portal.y, portal.size, portal.size);

  // Dibujar jugador
  ctx.drawImage(playerImg, player.x, player.y, player.size, player.size);

  // UI
  ctx.fillStyle = "white";
  ctx.font = "28px Arial";
  ctx.fillText(`💘 Corazones: ${heartsCollected}/${totalHearts}`, 30, 50);

  // Victoria
  if (heartsCollected === totalHearts) {
    let dist = Math.hypot(player.x - portal.x, player.y - portal.y);
    if (dist < 80) {
      window.location.href = "victory.jpg";
    }
  }

  requestAnimationFrame(gameLoop);
}

gameLoop();
