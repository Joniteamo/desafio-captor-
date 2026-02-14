const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

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

// CONFIGURACION GD
const groundHeight = 120;
const gravity = 1;
const jumpForce = -22;
const speed = 8;

// JUGADOR
let player = {
  x: canvas.width * 0.2,
  y: canvas.height - groundHeight - 140,
  width: 140,
  height: 140,
  velocityY: 0,
  grounded: true
};

let spikes = [];
let hearts = [];
let heartCount = 0;
let gameStarted = false;
let cameraX = 0;

// CREAR OBSTACULOS
function createSpike() {
  spikes.push({
    x: canvas.width + cameraX,
    y: canvas.height - groundHeight - 70,
    size: 70
  });
}

setInterval(createSpike, 1500);

// CONTROLES
document.addEventListener("keydown", (e) => {
  if (e.code === "Space") {
    if (!gameStarted) gameStarted = true;

    if (player.grounded) {
      player.velocityY = jumpForce;
      player.grounded = false;
    }
  }
});

// COLISION EXACTA
function isColliding(a, b) {
  return (
    a.x < b.x - cameraX + b.size &&
    a.x + a.width > b.x - cameraX &&
    a.y < b.y + b.size &&
    a.y + a.height > b.y
  );
}

// REINICIAR
function resetGame() {
  cameraX = 0;
  spikes = [];
  heartCount = 0;
  player.y = canvas.height - groundHeight - 140;
  player.velocityY = 0;
  player.grounded = true;
  gameStarted = false;
}

// LOOP
function gameLoop() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // FONDO TIPO GD (CAMARA)
  ctx.drawImage(maze, -cameraX %

            
