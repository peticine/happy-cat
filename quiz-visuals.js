// Photo options for the screening flow — cropped image + short label below.

const QUIZ_IMAGE_BASE = "./images/quiz";

const QUIZ_IMAGES = {
  "water:empty_bowl": `${QUIZ_IMAGE_BASE}/water-empty_bowl.png`,
  "water:refills": `${QUIZ_IMAGE_BASE}/water-refills.png`,
  "water:longer": `${QUIZ_IMAGE_BASE}/water-longer.png`,
  "water:none": `${QUIZ_IMAGE_BASE}/water-none.png`,
  "water:unsure": `${QUIZ_IMAGE_BASE}/water-unsure.png`,

  "urination:larger": `${QUIZ_IMAGE_BASE}/urination-larger.png`,
  "urination:more": `${QUIZ_IMAGE_BASE}/urination-more.png`,
  "urination:both": `${QUIZ_IMAGE_BASE}/urination-both.png`,
  "urination:same": `${QUIZ_IMAGE_BASE}/urination-same.png`,
  "urination:unsure": `${QUIZ_IMAGE_BASE}/urination-unsure.png`,

  "weight:ribs": `${QUIZ_IMAGE_BASE}/weight-ribs.png`,
  "weight:slight": `${QUIZ_IMAGE_BASE}/weight-slight.png`,
  "weight:same": `${QUIZ_IMAGE_BASE}/weight-same.png`,
  "weight:heavier": `${QUIZ_IMAGE_BASE}/weight-heavier.png`,
  "weight:unsure": `${QUIZ_IMAGE_BASE}/weight-unsure.png`,

  "appetite:leaving": `${QUIZ_IMAGE_BASE}/appetite-leaving.png`,
  "appetite:less": `${QUIZ_IMAGE_BASE}/appetite-less.png`,
  "appetite:same": `${QUIZ_IMAGE_BASE}/appetite-same.png`,
  "appetite:more": `${QUIZ_IMAGE_BASE}/appetite-more.png`,
  "appetite:unsure": `${QUIZ_IMAGE_BASE}/appetite-unsure.png`,

  "vomiting:four_plus": `${QUIZ_IMAGE_BASE}/vomiting-four_plus.png`,
  "vomiting:two_three": `${QUIZ_IMAGE_BASE}/vomiting-two_three.png`,
  "vomiting:once": `${QUIZ_IMAGE_BASE}/vomiting-once.png`,
  "vomiting:never": `${QUIZ_IMAGE_BASE}/vomiting-never.png`,
  "vomiting:unsure": `${QUIZ_IMAGE_BASE}/vomiting-unsure.png`,
};

function getQuizVisualSrc(questionId, optionId) {
  const key = `${questionId}:${optionId}`;
  return QUIZ_IMAGES[key] || `${QUIZ_IMAGE_BASE}/water-unsure.png`;
}

function renderQuizVisual(questionId, optionId, label) {
  const src = getQuizVisualSrc(questionId, optionId);
  const safeLabel = label.replace(/"/g, "&quot;");
  return `<span class="flow-visual-media flow-visual-media--photo"><img class="flow-visual-photo" src="${src}" alt="" loading="lazy" decoding="async" aria-hidden="true" /></span><span class="flow-visual-caption"><span class="flow-visual-caption-title">${safeLabel}</span></span>`;
}
