const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

canvas.width = 900;
canvas.height = 450;

// CARGAR IMAGENES
const captor = new Image();
captor.src = "assets/captor.png";

const spike = new Image();
spike.src = "assets/spike.png";

const heart = new Image();
heart.src = "assets/heart.png";

const maze = new Image();
maze.src = "assets/maze.png";

// JUGADOR
let player = {
  x: 150,
  y: 330,
  width: 60,
  height: 60,
  velocityY: 0,
  gravity: 0.6,
  jump: -13,
  grounded: true
};

let spikes = [];
let hearts = [];
let backgroundX = 0;
let speed = 4;
let score = 0;
let gameStarted = false;

// CREAR OBSTACULOS
function createSpike() {
  spikes.push({
    x: canvas.width,
    y: 360,
    width: 40,
    height: 40
  });
}

function createHeart() {
  hearts.push({
    x: canvas.width,
    y: 250,
    width: 30,
    height: 30
  });
}

setInterval(createSpike, 2000);
setInterval(createHeart, 5000);

// CONTROLES
document.addEventListener("keydown", (e) => {
  if (e.code === "Space") {
    if (!gameStarted) gameStarted = true;

    if (player.grounded) {
      player.velocityY = player.jump;
      player.grounded = false;
    }
  }
});

// COLISION
function collision(a, b) {
  return (
    a.x < b.x + b.width &&
    a.x + a.width > b.x &&
    a.y < b.y + b.height &&
    a.y + a.height > b.y
  );
}

// LOOP
function gameLoop() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // FONDO
  ctx.drawImage(maze, backgroundX, 0, canvas.width, canvas.height);
  ctx.drawImage(maze, backgroundX + canvas.width, 0, canvas.width, canvas.height);

  if (gameStarted) {
    backgroundX -= speed;
    if (backgroundX <= -canvas.width) {
      backgroundX = 0;
    }

    // GRAVEDAD
    player.velocityY += player.gravity;
    player.y += player.velocityY;

    if (player.y >= 330) {
      player.y = 330;
      player.grounded = true;
    }

    // SPIKES
    spikes.forEach((s, index) => {
      s.x -= speed;
      ctx.drawImage(spike, s.x, s.y, s.width, s.height);

      if (collision(player, s)) {
        alert("Perdiste!");
        location.reload();
      }

      if (s.x + s.width < 0) spikes.splice(index, 1);
    });

    // HEARTS
    hearts.forEach((h, index) => {
      h.x -= speed;
      ctx.drawImage(heart, h.x, h.y, h.width, h.height);

      if (collision(player, h)) {
        score += 10;
        hearts.splice(index, 1);
      }

      if (h.x + h.width < 0) hearts.splice(index, 1);
    });

    score++;
  }

  // DIBUJAR JUGADOR
  ctx.drawImage(captor, player.x, player.y, player.width, player.height);

  // SCORE
  ctx.fillStyle = "white";
  ctx.font = "20px Arial";
  ctx.fillText("Puntaje: " + score, 20, 30);

  // CARTEL INICIO
  if (!gameStarted) {
    ctx.fillStyle = "white";
    ctx.font = "30px Arial";
    ctx.fillText("Presiona ESPACIO para comenzar", 250, 200);
  }

  requestAnimationFrame(gameLoop);
}

gameLoop();
