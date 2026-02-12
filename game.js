const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let heartsCollected = 0;
const totalHearts = 15;

// ===== IMÁGENES =====
const bg = new Image();
bg.src = "./assets/background.png";

const playerImg = new Image();
playerImg.src = "./assets/captor.png";

const heartImg = new Image();
heartImg.src = "./assets/hearts.png";

const portalImg = new Image();
portalImg.src = "./assets/portal.png";

const spikeImg = new Image();
spikeImg.src = "./assets/spike.png";

// ===== HUD =====
const hud = document.getElementById("hud");

// ===== JUGADOR =====
let player = {
  x: 100,
  y: 200,
  w: 80,
  h: 80,
  speed: 6
};

// ===== OBJETOS =====
let hearts = [];
for (let i = 0; i < totalHearts; i++) {
  hearts.push({
    x: Math.random() * (canvas.width - 60),
    y: Math.random() * (canvas.height - 60),
    w: 50,
    h: 50,
    collected: false
  });
}

// ===== PORTAL =====
let portal = {
  x: canvas.width - 200,
  y: canvas.height / 2 - 80,
  w: 140,
  h: 140
};

// ===== MOVIMIENTO =====
let keys = {};
window.addEventListener("keydown", e => keys[e.key] = true);
window.addEventListener("keyup", e => keys[e.key] = false);

// ===== COLISION =====
function collide(a, b) {
  return (
    a.x < b.x + b.w &&
    a.x + a.w > b.x &&
    a.y < b.y + b.h &&
    a.y + a.h > b.y
  );
}

// ===== LOOP =====
function gameLoop() {

  // fondo
  ctx.drawImage(bg, 0, 0, canvas.width, canvas.height);

  // movimiento jugador
  if (keys["ArrowUp"] || keys["w"]) player.y -= player.speed;
  if (keys["ArrowDown"] || keys["s"]) player.y += player.speed;
  if (keys["ArrowLeft"] || keys["a"]) player.x -= player.speed;
  if (keys["ArrowRight"] || keys["d"]) player.x += player.speed;

  // dibujar jugador
  ctx.drawImage(playerImg, player.x, player.y, player.w, player.h);

  // corazones
  hearts.forEach(h => {
    if (!h.collected) {
      ctx.drawImage(heartImg, h.x, h.y, h.w, h.h);

      if (collide(player, h)) {
        h.collected = true;
        heartsCollected++;
        hud.innerHTML = `❤️ ${heartsCollected}/${totalHearts}`;
      }
    }
  });

  // portal aparece solo si juntó todos
  if (heartsCollected >= totalHearts) {
    ctx.drawImage(portalImg, portal.x, portal.y, portal.w, portal.h);

    if (collide(player, portal)) {
      window.location.href = "./victory.html";
    }
  }

  requestAnimationFrame(gameLoop);
}

gameLoop();
