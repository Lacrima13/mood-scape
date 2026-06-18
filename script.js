const state = {
  identity: "",
  task: "",
  style: "",
  prompt: "",
  resultIndex: 0,
  colorIndex: 0
};

const totalScreens = 9;

const progressLine = document.getElementById("progressLine");
const toast = document.getElementById("toast");

const themeMap = {
  "清新治愈": "theme-fresh",
  "高级极简": "theme-minimal",
  "活力撞色": "theme-pop",
  "科技商务": "theme-tech",
  "可爱潮流": "theme-cute",
  "国潮醒目": "theme-china"
};

const colorThemes = [
  "theme-fresh",
  "theme-minimal",
  "theme-pop",
  "theme-tech",
  "theme-cute",
  "theme-china"
];

const resultPool = [
  {
    title: "自律学习计划",
    subtitle: "从今天开始，成为更稳定的自己",
    advice: "建议采用大标题居中构图，搭配清爽留白和低饱和背景，适合知识类、小红书干货类内容传播。"
  },
  {
    title: "新品灵感上新",
    subtitle: "把日常变成值得记录的瞬间",
    advice: "建议使用高对比标题和场景化副标题，突出新品氛围与生活方式，让用户快速产生点击兴趣。"
  },
  {
    title: "招新进行时",
    subtitle: "加入我们，让热爱被看见",
    advice: "建议采用活力撞色和强节奏卡片排版，增强年轻感和活动感，适合社团、校园、品牌活动传播。"
  },
  {
    title: "3分钟搞定设计",
    subtitle: "从空白画布，到专业视觉表达",
    advice: "建议强调Canva可画的模板、素材和在线编辑能力，突出低门槛、高效率、易上手的品牌价值。"
  },
  {
    title: "内容创作急救包",
    subtitle: "灵感不够，模板来救",
    advice: "建议将创作焦虑转化为互动体验，通过结果反馈强化用户对Canva可画的工具记忆。"
  }
];

const titlePool = [
  "你的灵感正在加载",
  "从空白开始，也能很好看",
  "今天也要好好创作",
  "让设计变简单一点",
  "下一张爆款封面",
  "创作不再卡住"
];

function goTo(num) {
  document.querySelectorAll(".screen").forEach(screen => {
    screen.classList.remove("active");
  });

  const target = document.getElementById(`screen-${num}`);

  if (!target) return;

  target.classList.add("active");

  const percent = (num / totalScreens) * 100;
  progressLine.style.width = `${percent}%`;
}

function showToast(text) {
  toast.textContent = text;
  toast.classList.add("show");

  setTimeout(() => {
    toast.classList.remove("show");
  }, 1600);
}

document.querySelectorAll("[data-type]").forEach(card => {
  card.addEventListener("click", () => {
    const type = card.dataset.type;
    const value = card.dataset.value;

    state[type] = value;

    document.querySelectorAll(`[data-type="${type}"]`).forEach(item => {
      item.classList.remove("selected");
    });

    card.classList.add("selected");
  });
});

function nextWithCheck(nextPage, key) {
  if (!state[key]) {
    showToast("请先选择一个选项");
    return;
  }

  goTo(nextPage);
}

function fillPrompt(text) {
  const input = document.getElementById("promptInput");
  input.value = text;
}

function startGenerate() {
  const input = document.getElementById("promptInput");
  const value = input.value.trim();

  if (!value) {
    showToast("请先输入一句创作需求");
    return;
  }

  state.prompt = value;

  goTo(7);

  const loaderBar = document.getElementById("loaderBar");
  const loadingText = document.getElementById("loadingText");

  const steps = [
    document.getElementById("g1"),
    document.getElementById("g2"),
    document.getElementById("g3"),
    document.getElementById("g4"),
    document.getElementById("g5")
  ];

  steps.forEach(step => step.classList.remove("done"));
  loaderBar.style.width = "0%";

  let progress = 0;

  const loadingTexts = [
    "正在理解你的创作需求……",
    "正在分析创作者身份和传播场景……",
    "正在匹配Canva模板结构……",
    "正在生成标题、配色和视觉建议……",
    "正在输出完整方案……"
  ];

  const timer = setInterval(() => {
    progress += 4;
    loaderBar.style.width = `${progress}%`;

    if (progress >= 18) {
      steps[0].classList.add("done");
      loadingText.textContent = loadingTexts[1];
    }

    if (progress >= 38) {
      steps[1].classList.add("done");
      loadingText.textContent = loadingTexts[2];
    }

    if (progress >= 58) {
      steps[2].classList.add("done");
      loadingText.textContent = loadingTexts[3];
    }

    if (progress >= 78) {
      steps[3].classList.add("done");
      loadingText.textContent = loadingTexts[4];
    }

    if (progress >= 96) {
      steps[4].classList.add("done");
    }

    if (progress >= 100) {
      clearInterval(timer);

      setTimeout(() => {
        renderResult();
        goTo(8);
      }, 450);
    }
  }, 80);
}

function renderResult() {
  const posterCard = document.getElementById("posterCard");
  const posterType = document.getElementById("posterType");
  const posterTitle = document.getElementById("posterTitle");
  const posterSubtitle = document.getElementById("posterSubtitle");
  const aiAdvice = document.getElementById("aiAdvice");

  const current = resultPool[state.resultIndex % resultPool.length];

  posterType.textContent = state.task || "社媒封面";
  posterTitle.textContent = getSmartTitle(current.title);
  posterSubtitle.textContent = getSmartSubtitle(current.subtitle);
  aiAdvice.textContent = getAdvice(current.advice);

  posterCard.className = "poster-card";

  if (state.style && themeMap[state.style]) {
    posterCard.classList.add(themeMap[state.style]);
  } else {
    posterCard.classList.add(colorThemes[state.colorIndex % colorThemes.length]);
  }
}

function getSmartTitle(defaultTitle) {
  const text = state.prompt;

  if (text.includes("咖啡")) return "咖啡新品上新";
  if (text.includes("学习")) return "自律学习计划";
  if (text.includes("招新")) return "社团招新季";
  if (text.includes("招聘")) return "寻找发光的你";
  if (text.includes("产品")) return "新品推荐指南";
  if (text.includes("活动")) return "活动预告来了";
  if (text.includes("PPT") || text.includes("汇报")) return "汇报封面提案";
  if (text.includes("小红书")) return "小红书爆款封面";

  return defaultTitle;
}

function getSmartSubtitle(defaultSubtitle) {
  const text = state.prompt;

  if (text.includes("咖啡")) return "一口进入今日松弛感";
  if (text.includes("学习")) return "从今天开始，成为更稳定的自己";
  if (text.includes("招新")) return "加入我们，让热爱被看见";
  if (text.includes("产品")) return "把卖点讲清楚，把选择变简单";
  if (text.includes("活动")) return "让每一次参与都值得期待";

  return defaultSubtitle;
}

function getAdvice(defaultAdvice) {
  const identity = state.identity ? `针对${state.identity}的真实创作场景，` : "";
  const task = state.task ? `系统将${state.task}作为主要传播载体，` : "";
  const style = state.style ? `采用${state.style}的视觉语言，` : "";

  return `${identity}${task}${style}${defaultAdvice}`;
}

function changeResult() {
  state.resultIndex += 1;
  renderResult();
  showToast("已为你换一版方案");
}

function changeColor() {
  const posterCard = document.getElementById("posterCard");

  colorThemes.forEach(theme => {
    posterCard.classList.remove(theme);
  });

  state.colorIndex += 1;

  posterCard.classList.add(colorThemes[state.colorIndex % colorThemes.length]);

  showToast("配色已调整");
}

function optimizeTitle() {
  const posterTitle = document.getElementById("posterTitle");
  const randomIndex = Math.floor(Math.random() * titlePool.length);

  posterTitle.textContent = titlePool[randomIndex];

  showToast("标题已优化");
}

function showFinal() {
  document.getElementById("finalIdentity").textContent = state.identity || "个人博主";
  document.getElementById("finalTask").textContent = state.task || "小红书封面";
  document.getElementById("finalStyle").textContent = state.style || "清新治愈";
  document.getElementById("finalKeywords").textContent = getKeywords();

  goTo(9);
}

function getKeywords() {
  const map = {
    "清新治愈": "清新 / 柔和 / 留白 / 治愈",
    "高级极简": "极简 / 质感 / 留白 / 专业",
    "活力撞色": "醒目 / 年轻 / 高对比 / 传播感",
    "科技商务": "效率 / 秩序 / 科技 / 专业",
    "可爱潮流": "趣味 / 亲和 / 潮流 / IP感",
    "国潮醒目": "文化 / 节奏 / 识别度 / 国潮"
  };

  return map[state.style] || "高效 / 清晰 / 吸睛 / 轻松";
}

function openCanva() {
  window.open("https://www.canva.cn/", "_blank");
}

function copyReport() {
  const report = `
《灵感急救站：3分钟生成你的社媒封面》答辩说明

本作品选择AIGC方向中的Canva可画H5互动广告赛道，面向社媒创作者、企业新媒体运营、中小创业者和大学生内容创作者等目标人群展开设计。

作品从“临时赶稿、缺少灵感、不会设计、素材分散”的真实痛点出发，将Canva可画设定为一个“灵感急救站”。用户进入H5后，可以依次完成身份选择、创作任务选择、视觉风格选择和一句话需求输入，系统随后模拟AIGC生成过程，输出一张符合用户需求的社媒视觉方案。

作品的交互路径包括：开场代入、痛点洞察、身份选择、任务选择、风格测试、AI生成模拟、结果展示和最终转化。视觉风格采用年轻、清爽、科技感与亲和力结合的移动端界面语言，突出Canva可画“低门槛、高效率、强模板、启发创作”的品牌价值。

在制作过程中，本作品可使用Google AI Studio辅助生成文案和交互脚本，使用Figma AI辅助完成界面原型，使用CODEBUDDY辅助生成H5代码，并使用Canva可画完成视觉素材、展示图和最终排版。整体作品体现了AIGC工具在设计调研、创意生成、界面设计、交互实现和作品展示中的综合应用价值。

创作者身份：${state.identity || "个人博主"}
创作任务：${state.task || "小红书封面"}
推荐风格：${state.style || "清新治愈"}
创作关键词：${getKeywords()}
用户输入需求：${state.prompt || "未填写"}
  `.trim();

  if (navigator.clipboard) {
    navigator.clipboard.writeText(report).then(() => {
      showToast("答辩说明已复制");
    });
  } else {
    showToast("当前浏览器不支持自动复制");
  }
}

function restart() {
  state.identity = "";
  state.task = "";
  state.style = "";
  state.prompt = "";
  state.resultIndex = 0;
  state.colorIndex = 0;

  document.querySelectorAll(".selected").forEach(item => {
    item.classList.remove("selected");
  });

  const input = document.getElementById("promptInput");
  if (input) input.value = "";

  goTo(1);
}

function openIntro() {
  document.getElementById("introModal").classList.add("show");
}

function closeIntro() {
  document.getElementById("introModal").classList.remove("show");
}

window.addEventListener("keydown", event => {
  if (event.key === "Escape") {
    closeIntro();
  }
});
