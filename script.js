const interactionData = {
  "阿司匹林|华法林": {
    canTake: false,
    reason: "阿司匹林与华法林联合使用会增加出血风险，尤其是消化道出血。"
  },
  "阿司匹林|布洛芬": {
    canTake: false,
    reason: "阿司匹林与布洛芬同时服用可能降低阿司匹林抗血小板作用，并增加胃肠道刺激。"
  },
  "阿司匹林|对乙酰氨基酚": {
    canTake: true,
    reason: "通常情况下可以一起使用，但仍需按照剂量和医生建议服用。"
  },
  "华法林|甲氨蝶呤": {
    canTake: false,
    reason: "华法林与甲氨蝶呤可增加出血和骨髓抑制风险。"
  },
  "布洛芬|洛伐他汀": {
    canTake: true,
    reason: "这两种药物暂无明确严重相互作用，但请根据医生建议使用。"
  },
  "洛伐他汀|红霉素": {
    canTake: false,
    reason: "红霉素可抑制洛伐他汀代谢，增加肌病风险。"
  },
  "对乙酰氨基酚|酒精": {
    canTake: false,
    reason: "对乙酰氨基酚与酒精合用可增加肝损伤风险。"
  }
};

const sampleDrugs = [
  "阿司匹林",
  "华法林",
  "布洛芬",
  "对乙酰氨基酚",
  "甲氨蝶呤",
  "洛伐他汀",
  "红霉素",
  "酒精"
];

const drug1Input = document.getElementById("drug1");
const drug2Input = document.getElementById("drug2");
const checkButton = document.getElementById("checkButton");
const resultBox = document.getElementById("result");
const sampleTags = document.getElementById("sampleTags");

function normalizeDrugName(name) {
  return name.trim().replace(/\s+/g, "").toLowerCase();
}

function buildKey(nameA, nameB) {
  const a = normalizeDrugName(nameA);
  const b = normalizeDrugName(nameB);
  return a < b ? `${nameA}|${nameB}` : `${nameB}|${nameA}`;
}

function findInteraction(drugA, drugB) {
  if (!drugA || !drugB) {
    return null;
  }

  const lowerA = normalizeDrugName(drugA);
  const lowerB = normalizeDrugName(drugB);
  const result = Object.entries(interactionData).find(([key]) => {
    const [x, y] = key.split("|");
    return normalizeDrugName(x) === lowerA && normalizeDrugName(y) === lowerB
      || normalizeDrugName(x) === lowerB && normalizeDrugName(y) === lowerA;
  });

  if (result) {
    return result[1];
  }

  return {
    canTake: true,
    reason: "未收录该组合的严重相互作用，建议仍向医生或药师咨询后用药。"
  };
}

function showResult(drugA, drugB) {
  const interaction = findInteraction(drugA, drugB);

  if (!drugA || !drugB) {
    resultBox.innerHTML = `
      <p class="hint">请填写两种药物名称，才能获得更准确的判断。</p>
    `;
    return;
  }

  if (!interaction) {
    resultBox.innerHTML = `
      <p class="hint">无法识别该组合，请检查药物名称或咨询专业医疗人员。</p>
    `;
    return;
  }

  const statusText = interaction.canTake ? "通常可以一起服用" : "不建议同时服用";
  const statusClass = interaction.canTake ? "good" : "bad";

  resultBox.innerHTML = `
    <p class="${statusClass}">${statusText}</p>
    <p>药物组合：<strong>${drugA}</strong> + <strong>${drugB}</strong></p>
    <p>说明：${interaction.reason}</p>
  `;
}

function createSampleTags() {
  sampleDrugs.forEach((drug) => {
    const tag = document.createElement("button");
    tag.type = "button";
    tag.className = "tag";
    tag.textContent = drug;
    tag.addEventListener("click", () => {
      if (!drug1Input.value) {
        drug1Input.value = drug;
      } else if (!drug2Input.value) {
        drug2Input.value = drug;
      } else {
        drug1Input.value = drug;
      }
    });
    sampleTags.appendChild(tag);
  });
}

checkButton.addEventListener("click", () => {
  showResult(drug1Input.value, drug2Input.value);
});

createSampleTags();
