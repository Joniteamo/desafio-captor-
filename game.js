const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// =====================
// IMÁGENES (assets)
// =====================
function load(src) {
  const img = new Image();
  img.src = src;
  return img;
}

const captorImg = load("assets/captor.jpg");
const heartImg = load("assets/hearts.jpg");
const spikeImg = load("assets/spike.png");
const portalImg = load("assets/portal.jpg");

// =====================
// JUGADOR
// =====================
const player = {
  x: 100,
  y: 200,
  size: 80,
  speed: 6,
};

// =====================
// CORAZONES
// =====================
const totalHearts = 15;
let collected = 0;

let hearts = [];
for (let i = 0; i < totalHearts; i++) {
  hearts.push({
    x: Math.random() * (canvas.width - 200) + 100,
    y: Math.random() * (canvas.height - 200) + 100,
    size: 50,
    taken: false,
  });
}

// =====================
// PINCHOS
// =====================
let spikes = [];
for (let i = 0; i < 7; i++) {
  spikes.push({
    x: Math.random() * (canvas.width - 200) + 100,
    y: Math.random() * (canvas.height - 200) + 100,
    size: 70,
  });
}

// =====================
// PORTAL FINAL
// =====================
const portal = {
  x: canvas.width - 200,
  y: canvas.height / 2 - 80,
  size: 140,
};

// =====================
// CONTROLES
// =====================
let keys = {};

window.addEventListener("keydown", (e) => {
  keys[e.key.toLowerCase()] = true;
});

window.addEventListener("keyup", (e) => {
  keys[e.key.toLowerCase()] = false;
});

// =====================
// COLISIÓN SIMPLE
// =====================
function hit(a, b) {
  return (
    a.x < b.x + b.size &&
    a.x + a.size > b.x &&
    a.y < b.y + b.size &&
    a.y + a.size > b.y
  );
}

// =====================
// RESET
// =====================
function resetGame() {
  player.x = 100;
  player.y = 200;
  collected = 0;
  hearts.forEach((h) => (h.taken = false));
}

// =====================
// LOOP
// =====================
function update() {
  // Movimiento WASD + Flechas
  if (keys["w"] || keys["arrowup"]) player.y -= player.speed;
  if (keys["s"] || keys["arrowdown"]) player.y += player.speed;
  if (keys["a"] || keys["arrowleft"]) player.x -= player.speed;
  if (keys["d"] || keys["arrowright"]) player.x += player.speed;

  // Limites pantalla
  player.x = Math.max(0, Math.min(canvas.width - player.size, player.x));
  player.y = Math.max(0, Math.min(canvas.height - player.size, player.y));

  // Recolectar corazones
  hearts.forEach((h) => {
    if (!h.taken && hit(player, h)) {
      h.taken = true;
      collected++;
    }
  });

  // Pinchos reinician
  spikes.forEach((s) => {
    if (hit(player, s)) {
      resetGame();
    }
  });

  // Victoria
  if (collected === totalHearts && hit(player, portal)) {
    window.location.href = "victory.jpg";
  }
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Fondo oscuro estilo Fortnite
  ctx.fillStyle = "#050505";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Corazones
  hearts.forEach((h) => {
    if (!h.taken) {
      ctx.drawImage(heartImg, h.x, h.y, h.size, h.size);
    }
  });

  // Pinchos
  spikes.forEach((s) => {
    ctx.drawImage(spikeImg, s.x, s.y, s.size, s.size);
  });

  // Portal
  ctx.drawImage(portalImg, portal.x, portal.y, portal.size, portal.size);

  // Jugador captor
  ctx.drawImage(captorImg, player.x, player.y, player.size, player.size);

  // HUD
  ctx.fillStyle = "white";
  ctx.font = "30px Arial";
  ctx.fillText(`💘 Corazones: ${collected}/${totalHearts}`, 20, 50);
}

function loop() {
  update();
  draw();
  requestAnimationFrame(loop);
}

loop();
