const canvas = document.getElementById("bg");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

/* 🌌 情绪宇宙系统 */
const world = {
  calm: { color: "0,220,255", speed: 0.3 },
  anxiety: { color: "255,80,160", speed: 1.5 },
  tired: { color: "180,180,180", speed: 0.2 },
  chaos: { color: "255,0,200", speed: 2.2 }
};

let mood = "calm";
let mouse = { x: canvas.width/2, y: canvas.height/2 };

/* 🧠 鼠标引力 */
window.addEventListener("mousemove", e => {
  mouse.x = e.clientX;
  mouse.y = e.clientY;
});

function setMood(m){
  mood = m;
}

/* 🌌 情绪生成器 */
function generateWorld(){

  const energy = document.getElementById("energy").value;

  const text =
`【宇宙生成完成】

当前情绪：${mood}
能量密度：${energy}

系统状态：
现实结构正在根据情绪参数重新编译。

观测者正在影响空间本身的物理规则。`;

  typeWriter(text);
}

/* ✨ 打字机 */
function typeWriter(text){
  const el = document.getElementById("output");
  el.innerHTML = "";
  let i = 0;

  function run(){
    if(i < text.length){
      el.innerHTML += text[i];
      i++;
      setTimeout(run, 18);
    }
  }
  run();
}

/* 🌌 高级粒子系统 */
let particles = [];

for(let i=0;i<320;i++){
  particles.push({
    x: Math.random()*canvas.width,
    y: Math.random()*canvas.height,
    vx:(Math.random()-0.5),
    vy:(Math.random()-0.5)
  });
}

/* 🌊 动画核心 */
function animate(){

  const w = world[mood];

  /* 🌑 空间残影（关键高级感） */
  ctx.fillStyle = "rgba(0,0,0,0.08)";
  ctx.fillRect(0,0,canvas.width,canvas.height);

  ctx.globalCompositeOperation = "lighter";
  ctx.fillStyle = `rgba(${w.color},0.7)`;

  particles.forEach(p=>{

    /* 🧲 鼠标引力 */
    let dx = mouse.x - p.x;
    let dy = mouse.y - p.y;

    p.vx += dx * 0.00002;
    p.vy += dy * 0.00002;

    /* 🌌 情绪扰动 */
    p.vx += (Math.random()-0.5)*0.02;
    p.vy += (Math.random()-0.5)*0.02;

    /* 🌊 阻尼（高级关键） */
    p.vx *= 0.96;
    p.vy *= 0.96;

    p.x += p.vx * w.speed;
    p.y += p.vy * w.speed;

    /* 🔁 空间循环 */
    if(p.x<0)p.x=canvas.width;
    if(p.x>canvas.width)p.x=0;
    if(p.y<0)p.y=canvas.height;
    if(p.y>canvas.height)p.y=0;

    ctx.beginPath();
    ctx.arc(p.x,p.y,2.6,0,Math.PI*2);
    ctx.fill();
  });

  requestAnimationFrame(animate);
}

animate();
