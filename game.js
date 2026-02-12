const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

canvas.width = 1280;
canvas.height = 720;

/* --- IMÁGENES --- */
const bg = new Image();
bg.src = "assets/portal.jpg";

const playerImg = new Image();
playerImg.src = "assets/captor.jpg";

const heartImg = new Image();
heartImg.src = "assets/hearts.jpg";

const spikeImg = new Image();
spikeImg.src = "assets/spike.png";

const portalImg = new Image();
portalImg.src = "assets/portal.jpg";

let gameWon = false;

/* --- JUGADOR --- */
let player = {
  x: 80,
  y: 80,
  size: 60,
  speed: 5
};

/* --- CHECKPOINT --- */
let checkpoint = { x: 600, y: 350 };

/* --- CORAZONES (15) --- */
let hearts = [];
for (let i = 0; i < 15; i++) {
  hearts.push({
    x: 150 + Math.random() * 1000,
    y: 120 + Math.random() * 500,
    collected: false
  });
}

/* --- PINCHOS --- */
let spikes = [
  { x: 300, y: 200 },
  { x: 500, y: 500 },
  { x: 700, y: 250 },
  { x: 900, y: 450 },
  { x: 1100, y: 300 }
];

/* --- PORTAL FINAL --- */
let portal = { x: 1150, y: 600, size: 80 };

/* --- CONTROLES --- */
let keys = {};
window.addEventListener("keydown", e => keys[e.key] = true);
window.addEventListener("keyup", e => keys[e.key] = false);

/* --- COLISIONES --- */
function collision(a, b, size = 50) {
  return (
    a.x < b.x + size &&
    a.x + a.size > b.x &&
    a.y < b.y + size &&
    a.y + a.size > b.y
  );
}

/* --- UPDATE --- */
function update() {

  if (gameWon) return;

  // Movimiento
  if (keys["ArrowUp"] || keys["w"]) player.y -= player.speed;
  if (keys["ArrowDown"] || keys["s"]) player.y += player.speed;
  if (keys["ArrowLeft"] || keys["a"]) player.x -= player.speed;
  if (keys["ArrowRight"] || keys["d"]) player.x += player.speed;

  // Limites
  player.x = Math.max(0, Math.min(canvas.width - player.size, player.x));
  player.y = Math.max(0, Math.min(canvas.height - player.size, player.y));

  // Corazones
  hearts.forEach(h => {
    if (!h.collected && collision(player, h, 50)) {
      h.collected = true;
    }
  });

  // Pinchos (reinicio)
  spikes.forEach(s => {
    if (collision(player, s, 60)) {
      player.x = checkpoint.x;
      player.y = checkpoint.y;
    }
  });

  // Checkpoint (cuando llega)
  if (player.x > checkpoint.x - 20 && player.x < checkpoint.x + 20) {
    checkpoint.x = player.x;
    checkpoint.y = player.y;
  }

  // Portal final
  let collectedCount = hearts.filter(h => h.collected).length;
  if (collectedCount === 15 && collision(player, portal, portal.size)) {
    gameWon = true;
    setTimeout(() => {
      window.location.href = "victory.html";
    }, 800);
  }
}

/* --- DRAW --- */
function draw() {

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Fondo
  ctx.drawImage(bg, 0, 0, canvas.width, canvas.height);

  // Pinchos
  spikes.forEach(s => {
    ctx.drawImage(spikeImg, s.x, s.y, 60, 60);
  });

  // Corazones
  hearts.forEach(h => {
    if (!h.collected) {
      ctx.drawImage(heartImg, h.x, h.y, 50, 50);
    }
  });

  // Portal
  ctx.drawImage(portalImg, portal.x, portal.y, portal.size, portal.size);

  // Jugador
  ctx.drawImage(playerImg, player.x, player.y, player.size, player.size);

  // HUD
  let collectedCount = hearts.filter(h => h.collected).length;
  ctx.fillStyle = "white";
  ctx.font = "28px Arial";
  ctx.fillText(`Corazones: ${collectedCount}/15`, 30, 50);

  if (collectedCount === 15) {
    ctx.fillText("¡Ve al portal final!", 30, 90);
  }
}

/* --- LOOP --- */
function loop() {
  update();
  draw();
  requestAnimationFrame(loop);
}

loop();
