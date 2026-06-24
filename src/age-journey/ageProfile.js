export function catToHumanAge(years) {
  if (years <= 0) return 0;
  if (years === 1) return 15;
  if (years === 2) return 24;
  return 24 + (years - 2) * 4;
}

/** e.g. 64 → "their 60s", 56 → "their 50s" */
export function humanAgeDecade(humanYears) {
  const decade = Math.floor(humanYears / 10) * 10;
  if (decade < 20) return "their teens";
  if (decade === 20) return "their 20s";
  return `their ${decade}s`;
}

export const SYMPTOMS = [
  { id: "thirst", label: "Drinking more water" },
  { id: "urinate", label: "Urinating more often" },
  { id: "weight", label: "Weight loss" },
  { id: "appetite", label: "Reduced appetite" },
];

export const RECOMMENDED_TESTS = [
  "Blood chemistry",
  "CBC",
  "Urinalysis",
  "Blood pressure",
];

export function getAgeProfile(years) {
  const humanYears = catToHumanAge(years);
  const humanDecade = humanAgeDecade(humanYears);

  if (years <= 2) {
    return {
      theme: "young",
      headline: "They're still writing their story.",
      heroLine: "They're young — build the habits that protect their kidneys for decades.",
      humanDecade,
      conditions: ["Parasites & tummy troubles", "Dental disease", "Obesity"],
    };
  }

  if (years <= 6) {
    return {
      theme: "prime",
      headline: "Prime years — and the first quiet changes.",
      heroLine: "Prime years hide early kidney whispers. A baseline now means you'll notice when something shifts.",
      humanDecade,
      conditions: ["Dental disease", "Early kidney changes", "Weight gain", "Hypertension"],
    };
  }

  if (years <= 10) {
    return {
      theme: "mature",
      headline: "Something may already be changing. They won't tell you.",
      heroLine: "Mature cats hide illness. Screening turns silence into a plan.",
      humanDecade,
      conditions: ["Kidney disease", "Hyperthyroidism", "Arthritis", "Hypertension"],
    };
  }

  if (years <= 14) {
    return {
      theme: "senior",
      headline: "Every year now is time you earned together.",
      heroLine: "Senior years aren't a countdown if you catch what hides in plain sight.",
      humanDecade,
      conditions: ["Kidney disease", "Hyperthyroidism", "Arthritis", "Hypertension"],
    };
  }

  return {
    theme: "geriatric",
    headline: "They stayed for you longer than most cats get.",
    heroLine: "Geriatric love is fierce and tender. A steady plan makes every remaining day softer.",
    humanDecade,
    conditions: ["Kidney disease", "Hyperthyroidism", "Arthritis", "Hypertension"],
  };
}

export const JOURNEY_STEPS = [
  { id: "intake", label: "Age" },
  { id: "reveal", label: "About them" },
  { id: "screen", label: "Risk screen" },
  { id: "results", label: "Results" },
  { id: "consult", label: "Consult" },
];
