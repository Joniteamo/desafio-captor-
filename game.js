// ===============================
// DESAFÍO CAPTOR 💘 (JoniTeamo)
// ===============================

const canvas = document.createElement("canvas");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
document.body.appendChild(canvas);

// ===============================
// CARGA DE IMÁGENES
// ===============================

function loadImage(src) {
  const img = new Image();
  img.src = src;
  return img;
}

// Assets
const playerImg = loadImage("assets/captor.jpg");
const heartImg = loadImage("assets/hearts.jpg");
const portalImg = loadImage("assets/portal.jpg");
const spikeImg = loadImage("assets/spike.png");
const victoryImg = loadImage("assets/victory.jpg");

// ===============================
// JUGADOR
// ===============================

const player = {
  x: 100,
  y: 300,
  size: 80,
  speed: 6,
};

// ===============================
// CORAZONES
// ===============================

let hearts = [];
const totalHearts = 15;

for (let i = 0; i < totalHearts; i++) {
  hearts.push({
    x: Math.random() * (canvas.width - 200) + 100,
    y: Math.random() * (canvas.height - 200) + 100,
    size: 50,
    collected: false,
  });
}

// ===============================
// PINCHES (TRAMPAS)
// ===============================

let spikes = [];

for (let i = 0; i < 6; i++) {
  spikes.push({
    x: Math.random() * (canvas.width - 200) + 100,
    y: Math.random() * (canvas.height - 200) + 100,
    size: 70,
  });
}

// ===============================
// PORTAL FINAL
// ===============================

const portal = {
  x: canvas.width - 200,
  y: canvas.height / 2 - 100,
  size: 150,
};

// ===============================
// CONTADOR
// ===============================

let collectedCount = 0;
let gameWon = false;

// ===============================
// CONTROLES
// ===============================

let keys = {};

window.addEventListener("keydown", (e) => {
  keys[e.key.toLowerCase()] = true;
});

window.addEventListener("keyup", (e) => {
  keys[e.key.toLowerCase()] = false;
});

// ===============================
// COLISIONES
// ===============================

function isColliding(a, b) {
  return (
    a.x < b.x + b.size &&
    a.x + a.size > b.x &&
    a.y < b.y + b.size &&
    a.y + a.size > b.y
  );
}

// ===============================
// GAME LOOP
// ===============================

function update() {
  if (gameWon) return;

  // Movimiento (Flechas + WASD)
  if (keys["arrowup"] || keys["w"]) player.y -= player.speed;
  if (keys["arrowdown"] || keys["s"]) player.y += player.speed;
  if (keys["arrowleft"] || keys["a"]) player.x -= player.speed;
  if (keys["arrowright"] || keys["d"]) player.x += player.speed;

  // Límites
  player.x = Math.max(0, Math.min(canvas.width - player.size, player.x));
  player.y = Math.max(0, Math.min(canvas.height - player.size, player.y));

  // Recolectar corazones
  hearts.forEach((h) => {
    if (!h.collected && isColliding(player, h)) {
      h.collected = true;
      collectedCount++;
    }
  });

  // Pinches (reinicio si toca)
  spikes.forEach((s) => {
    if (isColliding(player, s)) {
      player.x = 100;
      player.y = 300;
      collectedCount = 0;
      hearts.forEach((h) => (h.collected = false));
    }
  });

  // Ganar
  if (collectedCount === totalHearts && isColliding(player, portal)) {
    gameWon = true;
    setTimeout(() => {
      window.location.href = "victory.html";
    }, 800);
  }
}

// ===============================
// DIBUJAR
// ===============================

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Fondo
  ctx.fillStyle = "#000";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Corazones
  hearts.forEach((h) => {
    if (!h.collected) {
      ctx.drawImage(heartImg, h.x, h.y, h.size, h.size);
    }
  });

  // Pinches
  spikes.forEach((s) => {
    ctx.drawImage(spikeImg, s.x, s.y, s.size, s.size);
  });

  // Portal
  ctx.drawImage(portalImg, portal.x, portal.y, portal.size, portal.size);

  // Jugador
  ctx.drawImage(playerImg, player.x, player.y, player.size, player.size);

  // HUD contador
  ctx.fillStyle = "white";
  ctx.font = "28px Arial";
  ctx.fillText(`❤️ ${collectedCount}/${totalHearts}`, 20, 50);
}

// ===============================
// LOOP PRINCIPAL
// ===============================

function loop() {
  update();
  draw();
  requestAnimationFrame(loop);
}

loop();
