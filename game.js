const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const mazeImg = new Image();
mazeImg.src = "assets/maze.png";

const captorImg = new Image();
captorImg.src = "assets/captor.png";

const heartImg = new Image();
heartImg.src = "assets/heart.png";

const spikeImg = new Image();
spikeImg.src = "assets/spike.png";

const portalImg = new Image();
portalImg.src = "assets/portal.png";

let player = { x: 80, y: 380, size: 70, life: 100 };
let collected = 0;
let damageCooldown = false;

const hearts = [
 {x:200,y:350},{x:300,y:350},{x:400,y:350},{x:500,y:350},{x:600,y:350},
 {x:700,y:350},{x:800,y:350},{x:900,y:350},{x:1000,y:350},{x:1100,y:350},
 {x:250,y:200},{x:450,y:200},{x:650,y:200},{x:850,y:200},{x:1050,y:200}
];

const spikes = [
 {x:350,y:420},{x:550,y:420},{x:750,y:420},{x:950,y:420}
];

const portal = { x: 1250, y: 360, size: 120 };

mazeImg.onload = () => {
  canvas.width = mazeImg.width;
  canvas.height = mazeImg.height;
  requestAnimationFrame(gameLoop);
};

document.addEventListener("keydown", e => {
  const speed = 6;
  if (e.key === "ArrowUp" || e.key === "w") player.y -= speed;
  if (e.key === "ArrowDown" || e.key === "s") player.y += speed;
  if (e.key === "ArrowLeft" || e.key === "a") player.x -= speed;
  if (e.key === "ArrowRight" || e.key === "d") player.x += speed;
});

function collide(a,b,sizeA,sizeB=60){
  return a.x < b.x + sizeB &&
         a.x + sizeA > b.x &&
         a.y < b.y + sizeB &&
         a.y + sizeA > b.y;
}

function update(){

  hearts.forEach((h,i)=>{
    if(collide(player,h,player.size,50)){
      hearts.splice(i,1);
      collected++;
      document.getElementById("hearts").innerText = "❤️ " + collected + "/15";
    }
  });

  spikes.forEach(s=>{
    if(collide(player,s,player.size,80) && !damageCooldown){
      player.life -= 10;
      damageCooldown = true;
      setTimeout(()=>damageCooldown=false,800);
      document.getElementById("life").innerText = "💚 Vida: " + player.life + "%";
      if(player.life<=0) location.reload();
    }
  });

  if(collide(player,portal,player.size,portal.size)){
    if(collected===15){
      window.location.href="victory.html";
    }
  }
}

function draw(){
  ctx.drawImage(mazeImg,0,0);
  hearts.forEach(h=>ctx.drawImage(heartImg,h.x,h.y,50,50));
  spikes.forEach(s=>ctx.drawImage(spikeImg,s.x,s.y,80,80));
  ctx.drawImage(portalImg,portal.x,portal.y,portal.size,portal.size);
  ctx.drawImage(captorImg,player.x,player.y,player.size,player.size);
}

function gameLoop(){
  update();
  draw();
  requestAnimationFrame(gameLoop);
}
