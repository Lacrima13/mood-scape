const canvas = document.getElementById("bg");
const ctx = canvas.getContext("2d");

canvas.width = innerWidth;
canvas.height = innerHeight;

const video = document.getElementById("video");

let mood = "neutral";
let immersion = false;

/* 🌈 情绪映射 */
const map = {
happy: [0,255,200],
sad: [120,120,255],
angry: [255,60,120],
neutral: [0,200,255]
};

/* 🎥 摄像头 */
navigator.mediaDevices.getUserMedia({video:true})
.then(stream=>{
video.srcObject = stream;
});

/* 🤖 AI模型 */
Promise.all([
faceapi.nets.tinyFaceDetector.loadFromUri("https://cdn.jsdelivr.net/npm/face-api.js/models"),
faceapi.nets.faceExpressionNet.loadFromUri("https://cdn.jsdelivr.net/npm/face-api.js/models")
]).then(startAI);

async function startAI(){
setInterval(async ()=>{
const d = await faceapi.detectSingleFace(video,
new faceapi.TinyFaceDetectorOptions()
).withFaceExpressions();

if(d){
const exp = d.expressions;
const max = Object.keys(exp).reduce((a,b)=>exp[a]>exp[b]?a:b);

mood = max;

document.getElementById("emotion").innerText =
"emotion: " + mood;

document.getElementById("state").innerText =
"system reacting...";
}
},500);
}

/* 🌌 粒子场 */
let particles = [];

for(let i=0;i<500;i++){
particles.push({
x:Math.random()*innerWidth,
y:Math.random()*innerHeight,
vx:(Math.random()-0.5),
vy:(Math.random()-0.5)
});
}

/* 🧲 渲染 */
function draw(){

ctx.fillStyle="rgba(0,0,0,0.08)";
ctx.fillRect(0,0,innerWidth,innerHeight);

ctx.globalCompositeOperation="lighter";

const c = map[mood] || map.neutral;

ctx.fillStyle=`rgba(${c[0]},${c[1]},${c[2]},0.7)`;

particles.forEach(p=>{

p.x += p.vx;
p.y += p.vy;

p.vx *= 0.98;
p.vy *= 0.98;

if(p.x<0)p.x=innerWidth;
if(p.x>innerWidth)p.x=0;
if(p.y<0)p.y=innerHeight;
if(p.y>innerHeight)p.y=0;

ctx.beginPath();
ctx.arc(p.x,p.y,2.2,0,Math.PI*2);
ctx.fill();
});

requestAnimationFrame(draw);
}

draw();

/* 🌌 沉浸模式 */
function toggleImmersion(){

immersion = !immersion;

document.querySelector(".ui").style.display =
immersion ? "none" : "flex";

document.querySelector(".hud").style.opacity =
immersion ? "1" : "0.7";
}

/* ESC退出 */
window.addEventListener("keydown",e=>{
if(e.key==="Escape"){
immersion=false;
document.querySelector(".ui").style.display="flex";
}
});
