const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

canvas.width = 800;
canvas.height = 400;

// IMAGENES
const captorImg = new Image();
captorImg.src = "assets/captor.png";

const spikeImg = new Image();
spikeImg.src = "assets/spike.png";

const heartImg = new Image();
heartImg.src = "assets/heart.png";

const mazeImg = new Image();
mazeImg.src = "assets/maze.png";

const portalImg = new Image();
portalImg.src = "assets/portal.png";

// JUGADOR
let player = {
  x: 100,
  y: 300,
  width: 50,
  height: 50,
  velocityY: 0,
  gravity: 0.6,
  jumpPower: -12,
  grounded: true
};

// VARIABLES
let spikes = [];
let hearts = [];
let score = 0;
let gameStarted = false;
let backgroundX = 0;
let speed = 4;

// CREAR OBSTACULOS
function spawnSpike() {
  spikes.push({
    x: canvas.width,
    y: 330,
    width: 40,
    height: 40
  });
}

function spawnHeart() {
  hearts.push({
    x: canvas.width,
    y: 250,
    width: 30,
    height: 30
  });
}

setInterval(spawnSpike, 2000);
setInterval(spawnHeart, 5000);

// CONTROLES
document.addEventListener("keydown", function(e) {
  if (e.code === "Space") {
    if (!gameStarted) {
      gameStarted = true;
    }
    if (player.grounded) {
      player.velocityY = player.jumpPower;
      player.grounded = false;
    }
  }
});

// DETECCION COLISION
function collision(a, b) {
  return (
    a.x < b.x + b.width &&
    a.x + a.width > b.x &&
    a.y < b.y + b.height &&
    a.y + a.height > b.y
  );
}

// GAME LOOP
function update() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // FONDO
  ctx.drawImage(mazeImg, backgroundX, 0, canvas.width, canvas.height);
  ctx.drawImage(mazeImg, backgroundX + canvas.width, 0, canvas.width, canvas.height);

  if (gameStarted) {
    backgroundX -= speed;
    if (backgroundX <= -canvas.width) {
      backgroundX = 0;
    }

    // GRAVEDAD
    player.velocityY += player.gravity;
    player.y += player.velocityY;

    if (player.y >= 300) {
      player.y = 300;
      player.grounded = true;
    }

    // MOVER SPIKES
    spikes.forEach((spike, index) => {
      spike.x -= speed;
      ctx.drawImage(spikeImg, spike.x, spike.y, spike.width, spike.height);

      if (collision(player, spike)) {
        alert("Perdiste!");
        location.reload();
      }

      if (spike.x + spike.width < 0) {
        spikes.splice(index, 1);
      }
    });

    // MOVER HEARTS
    hearts.forEach((heart, index) => {
      heart.x -= speed;
      ctx.drawImage(heartImg, heart.x, heart.y, heart.width, heart.height);

      if (collision(player, heart)) {
        score += 10;
        hearts.splice(index, 1);
      }

      if (heart.x + heart.width < 0) {
        hearts.splice(index, 1);
      }
    });

    score++;
  }

  // DIBUJAR JUGADOR
  ctx.drawImage(captorImg, player.x, player.y, player.width, player.height);

  // SCORE
  ctx.fillStyle = "white";
  ctx.font = "20px Arial";
  ctx.fillText("Puntaje: " + score, 20, 30);

  // CARTEL INICIO
  if (!gameStarted) {
    ctx.fillStyle = "white";
    ctx.font = "30px Arial";
    ctx.fillText("Presiona ESPACIO para comenzar", 200, 200);
  }

  requestAnimationFrame(update);
}

update();
