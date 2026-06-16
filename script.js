let mood = "calm";
let startTime = Date.now();

function start() {
  switchPage("control");
}

function switchPage(id) {
  document.querySelectorAll(".page").forEach(p => p.classList.remove("active"));
  document.getElementById(id).classList.add("active");
}

function setMood(m) {
  mood = m;
}

function generate() {

  let energy = document.getElementById("energy").value;
  let duration = Math.floor((Date.now() - startTime) / 1000);

  let world = document.getElementById("world");

  let data = engine(mood, energy);

  world.style.background = data.bg;
  world.style.filter = `blur(${data.blur}px)`;

  document.getElementById("title").innerText = data.title;

  document.getElementById("desc").innerText =
    `Mood: ${mood} | Energy: ${energy} | Time: ${duration}s`;

  switchPage("art");
}

function engine(mood, energy) {

  if (mood === "calm") {
    return {
      bg: "linear-gradient(#0f2027,#203a43,#2c5364)",
      blur: 0,
      title: "Ocean Mind Field"
    };
  }

  if (mood === "anxiety") {
    return {
      bg: "linear-gradient(#20002c,#cbb4d4)",
      blur: 2,
      title: "Neon Stress City"
    };
  }

  if (mood === "tired") {
    return {
      bg: "linear-gradient(#232526,#414345)",
      blur: 4,
      title: "Fade Out Space"
    };
  }

  return {
    bg: "linear-gradient(#ff416c,#ff4b2b)",
    blur: 1,
    title: "Chaos Bloom Field"
  };
}

function restart() {
  startTime = Date.now();
  switchPage("control");
}