const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// PANTALLA COMPLETA
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// IMAGENES
const captor = new Image();
captor.src = "assets/captor.png";

const spike = new Image();
spike.src = "assets/spike.png";

const heart = new Image();
heart.src = "assets/heart.png";

const maze = new Image();
maze.src = "assets/maze.png";

// JUGADOR (2 VECES MAS GRANDE)
let player = {
  x: 200,
  y: canvas.height - 200,
  width: 120,
  height: 120,
  velocityY: 0,
  gravity: 0.8,
  jump: -18,
  grounded: true
};

let spikes = [];
let hearts = [];
let backgroundX = 0;
let speed = 6;
let heartCount = 0;
let gameStarted = false;

// CREAR OBSTACULOS
function createSpike() {
  spikes.push({
    x: canvas.width,
    y: canvas.height - 100,
    width: 60,
    height: 60
  });
}

function createHeart() {
  hearts.push({
    x: canvas.width,
    y: canvas.height - 250,
    width: 50,
    height: 50
  });
}

setInterval(createSpike, 2000);
setInterval(createHeart, 4000);

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

// REINICIAR
function resetGame() {
  player.y = canvas.height - 200;
  player.velocityY = 0;
  spikes = [];
  hearts = [];
  heartCount = 0;
  backgroundX = 0;
  gameStarted = false;
}

// LOOP
function gameLoop() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // FONDO SIN DEFORMAR (cubrir pantalla)
  ctx.drawImage(maze, backgroundX, 0, canvas.width, canvas.height);
  ctx.drawImage(maze, backgroundX + canvas.width, 0, canvas.width, canvas.height);

  if (gameStarted) {
    backgroundX -= speed;
    if (backgroundX <= -canvas.width) backgroundX = 0;

    // GRAVEDAD
    player.velocityY += player.gravity;
    player.y += player.velocityY;

    if (player.y >= canvas.height - 200) {
      player.y = canvas.height - 200;
      player.grounded = true;
    }

    // SPIKES
    spikes.forEach((s, index) => {
      s.x -= speed;
      ctx.drawImage(spike, s.x, s.y, s.width, s.height);

      if (collision(player, s)) {
        resetGame();
      }

      if (s.x + s.width < 0) spikes.splice(index, 1);
    });

    // HEARTS
    hearts.forEach((h, index) => {
      h.x -= speed;
      ctx.drawImage(heart, h.x, h.y, h.width, h.height);

      if (collision(player, h)) {
        heartCount++;
        hearts.splice(index, 1);
      }

      if (h.x + h.width < 0) hearts.splice(index, 1);
    });
  }

  // DIBUJAR JUGADOR
  ctx.drawImage(captor, player.x, player.y, player.width, player.height);

  // CONTADOR DE CORAZONES
  ctx.fillStyle = "white";
  ctx.font = "30px Arial";
  ctx.fillText("❤️ x " + heartCount, 40, 60);

  // CARTEL INICIO
  if (!gameStarted) {
    ctx.fillStyle = "white";
    ctx.font = "40px Arial";
    ctx.fillText("Presiona ESPACIO para comenzar", canvas.width / 2 - 300, canvas.height / 2);
  }

  requestAnimationFrame(gameLoop);
}

gameLoop();
