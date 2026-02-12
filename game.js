const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

ctx.fillStyle = "purple";
ctx.fillRect(0, 0, canvas.width, canvas.height);

ctx.fillStyle = "white";
ctx.font = "60px Arial";
ctx.fillText("YA FUNCIONA 🎮💘", 100, 200);

console.log("GAME.JS CARGADO OK");
