const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

let heartsCollected = 0;
const totalHearts = 15;

const player = {
  x: 200,
  y: 200,
  size: 60,
  speed: 6
};

let checkpoint = { x: 200, y: 200 };

const hearts = [];
for (let i = 0; i < totalHearts; i++) {
  hearts.push({
    x: 300 + Math.random() * 1400,
    y: 200 + Math.random() * 700,
    size: 35
  });
}

const enemies = [
  { x: 1500, y: 300, size: 60, speed: 2.2 },
  { x: 1400, y: 800, size: 60, speed: 2.2 }
];

const spikes = [
  { x: 700, y: 500, size: 70 },
  { x: 1000, y: 600, size: 70 }
];

const scepter = { x: 1750, y: 900, size: 80 };

let keys = {};

document.addEventListener("keydown", e => keys[e.key] = true);
document.addEventListener("keyup", e => keys[e.key] = false);

function collide(a, b) {
  return (
    a.x < b.x + b.size &&
    a.x + a.size > b.x &&
    a.y < b.y + b.size &&
    a.y + a.size > b.y
  );
}

function update() {
  if (keys["w"] || keys["ArrowUp"]) player.y -= player.speed;
  if (keys["s"] || keys["ArrowDown"]) player.y += player.speed;
  if (keys["a"] || keys["ArrowLeft"]) player.x -= player.speed;
  if (keys["d"] || keys["ArrowRight"]) player.x += player.speed;

  hearts.forEach((h, index) => {
    if (collide(player, h)) {
      hearts.splice(index, 1);
      heartsCollected++;
      document.getElementById("count").textContent = heartsCollected;
    }
  });

  enemies.forEach(e => {
    let dx = player.x - e.x;
    let dy = player.y - e.y;
    let dist = Math.sqrt(dx*dx + dy*dy);
    e.x += (dx / dist) * e.speed;
    e.y += (dy / dist) * e.speed;

    if (collide(player, e)) {
      player.x = checkpoint.x;
      player.y = checkpoint.y;
    }
  });

  spikes.forEach(s => {
    if (collide(player, s)) {
      player.x = checkpoint.x;
      player.y = checkpoint.y;
    }
  });

  if (heartsCollected === 5) checkpoint = { x: 800, y: 300 };
  if (heartsCollected === 10) checkpoint = { x: 1200, y: 700 };

  if (heartsCollected === totalHearts && collide(player, scepter)) {
    document.getElementById("victoryScreen").classList.remove("hidden");
  }
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = "#123";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = "pink";
  hearts.forEach(h => {
    ctx.beginPath();
    ctx.arc(h.x, h.y, h.size/2, 0, Math.PI*2);
    ctx.fill();
  });

  ctx.fillStyle = "red";
  spikes.forEach(s => {
    ctx.fillRect(s.x, s.y, s.size, s.size);
  });

  ctx.fillStyle = "black";
  enemies.forEach(e => {
    ctx.fillRect(e.x, e.y, e.size, e.size);
  });

  ctx.fillStyle = "gold";
  ctx.fillRect(scepter.x, scepter.y, scepter.size, scepter.size);

  ctx.fillStyle = "white";
  ctx.fillRect(player.x, player.y, player.size, player.size);
}

function gameLoop() {
  update();
  draw();
  requestAnimationFrame(gameLoop);
}

gameLoop();
