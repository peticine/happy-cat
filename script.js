const header = document.querySelector(".site-header");
const siteShell = document.getElementById("site-shell");
const assflow = document.getElementById("assflow");
const assflowMain = document.getElementById("assflow-main");
const assflowFooter = document.getElementById("assflow-footer");
const assflowContinue = document.getElementById("assflow-continue");
const assflowBack = document.getElementById("assflow-back");
const assflowExit = document.getElementById("assflow-exit");
const assflowProgressFill = document.getElementById("assflow-progress-fill");
const assflowProgramLabel = document.getElementById("assflow-program-label");
const ageGate = document.getElementById("age-gate");
const CAT_AGE_KEY = "peticine-cat-age";
const CAT_NAME_KEY = "peticine-cat-name";
const CAT_PROFILE_KEY = "peticine-cat-profile";
const AGE_DONE_KEY = "peticine-age-done";
const AGE_THEMES = ["young", "prime", "mature", "senior", "geriatric"];

let catAge = null;
let catName = null;
let catAgeProfile = null;

// ---- Analytics --------------------------------------------------------------
// Vendor-agnostic event layer. Pushes to window.dataLayer (GA4 / GTM style),
// dispatches a DOM CustomEvent ("felica:track"), and forwards funnel events
// to Meta Pixel (fbq) for conversion tracking.
const FUNNEL_EVENTS = [];

function trackMetaPixel(event, props = {}) {
  if (typeof window.fbq !== "function") return;
  try {
    switch (event) {
      case "screening_started":
        fbq("track", "ViewContent", {
          content_name: "cat_health_screening",
          content_category: "screening",
        });
        fbq("trackCustom", "ScreeningStarted", {
          source: props.source,
          has_saved_age: props.has_saved_age,
        });
        break;
      case "screening_step_completed":
        fbq("trackCustom", "ScreeningStepCompleted", {
          step: props.step,
          step_index: props.step_index,
        });
        break;
      case "screening_score_computed":
        if (props.source === "api") {
          fbq("track", "CompleteRegistration", {
            content_name: "cat_health_screening",
            status: props.risk_level,
          });
          fbq("trackCustom", "ScreeningCompleted", {
            risk_level: props.risk_level,
            score: props.score,
          });
        } else {
          fbq("trackCustom", "ScreeningQuestionsComplete", {
            risk_level: props.risk_level,
            score: props.score,
          });
        }
        break;
      case "whatsapp_number_collected":
        fbq("track", "Lead", {
          content_name: "cat_health_screening",
          content_category: "screening",
        });
        break;
      case "screening_closed":
        if (!props.completed) {
          fbq("trackCustom", "ScreeningAbandoned", {
            exited_at_step: props.exited_at_step,
          });
        }
        break;
      case "cta_clicked":
        if (props.intent === "start_screening") {
          fbq("trackCustom", "ScreeningCTAClicked", {
            location: props.location,
          });
        }
        break;
      default:
        break;
    }
  } catch (err) {
    /* pixel must never break the app */
  }
}

function track(event, props = {}) {
  const payload = {
    event,
    ts: Date.now(),
    ...props,
  };
  FUNNEL_EVENTS.push(payload);
  try {
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push(payload);
    if (typeof window.gtag === "function") window.gtag("event", event, props);
    window.dispatchEvent(new CustomEvent("felica:track", { detail: payload }));
    trackMetaPixel(event, props);
    if (window.location.search.includes("debugAnalytics")) {
      console.debug("[felica:track]", event, props);
    }
  } catch (err) {
    /* analytics must never break the app */
  }
}
window.felicaTrack = track;
window.feliCareTrack = track;
window.peticineTrack = track;

function ctaLocation(el) {
  if (!el) return "unknown";
  return el.dataset.cta || el.id || el.closest("section[id]")?.id || "page";
}

function catToHumanAge(years) {
  if (years <= 0) return 0;
  if (years === 1) return 15;
  if (years === 2) return 24;
  return 24 + (years - 2) * 4;
}

function applyAgeTheme(theme) {
  if (!ageGate) return;
  AGE_THEMES.forEach((t) => ageGate.classList.remove(`age-theme-${t}`));
  if (theme) {
    ageGate.classList.add(`age-theme-${theme}`);
    document.body.dataset.ageTheme = theme;
  }
}

function completeAgeGate() {
  if (catAge == null) return;
  localStorage.setItem(CAT_AGE_KEY, String(catAge));
  if (catAgeProfile) {
    localStorage.setItem(
      CAT_PROFILE_KEY,
      JSON.stringify({
        headline: catAgeProfile.headline,
        heroLine: catAgeProfile.heroLine,
        theme: catAgeProfile.theme,
      })
    );
  }
  if (catName) localStorage.setItem(CAT_NAME_KEY, catName);
  sessionStorage.setItem(AGE_DONE_KEY, "1");
  document.documentElement.classList.add("age-complete");
  if (ageGate) ageGate.hidden = true;
  siteShell?.removeAttribute("hidden");
  siteShell?.setAttribute("aria-hidden", "false");
  siteShell?.classList.add("is-visible");
  document.body.style.overflow = "";
  personalizeForAge(catAge, catAgeProfile);
  window.scrollTo({ top: 0, behavior: "instant" });
  onScroll();
}

function reopenAgeGate() {
  if (assflow && !assflow.hidden) closeFlow();

  document.documentElement.classList.remove("age-complete");
  ageGate?.classList.remove("age-gate-showing-result");
  applyAgeTheme(null);
  if (ageGate) ageGate.hidden = false;
  siteShell?.setAttribute("hidden", "");
  siteShell?.setAttribute("aria-hidden", "true");
  siteShell?.classList.remove("is-visible");
  document.body.style.overflow = "hidden";
  window.dispatchEvent(new CustomEvent("peticine-age-reset"));
}

function getStageForAge(years) {
  if (years <= 2) return "young";
  if (years <= 6) return "prime";
  if (years <= 10) return "mature";
  if (years <= 14) return "senior";
  return "geriatric";
}

const AGE_CAROUSEL_STAGES = [
  {
    id: "young",
    label: "Kitten",
    ages: "0–2 yrs",
    title: "Foundation years",
    image: "./images/stage-young.png?v=hc47",
    imageAlt: "Real kitten portrait",
    issues: ["Early nutrition affects kidney health for life", "Congenital issues may show up now", "Growth problems can signal metabolic issues"],
    symptoms: ["Slow growth or lag vs littermates", "Frequent vomiting or diarrhea", "Lethargy or unusual sleeping patterns"],
    note: "What happens now shapes lifelong organ function. Early problems often catch up in senior years.",
  },
  {
    id: "prime",
    label: "Prime",
    ages: "3–6 yrs",
    title: "The healthiest years — keep them that way",
    image: "./images/stage-prime.png?v=hc47",
    imageAlt: "Real adult cat portrait",
    issues: [
      "Weight creeps up slowly, often unnoticed",
      "Tartar and gum disease start building",
      "The ideal time to set baseline bloodwork",
    ],
    symptoms: [
      "Straining or frequent trips to the litter box",
      "Bad breath, or dropping food while eating",
      "A softening waistline, or jumping up less",
    ],
    note: "Cats look and act completely healthy. Blood work is the only way to catch what's changing inside.",
  },
  {
    id: "mature",
    label: "Mature",
    ages: "7–10 yrs",
    title: "The turning point",
    image: "./images/stage-mature.png?v=hc47",
    imageAlt: "Real mature cat portrait",
    issues: ["1 in 3 cats shows organ decline now", "Kidney disease becomes common", "Dental disease accelerates systemic problems"],
    symptoms: ["Drinking significantly more", "Weight loss despite eating", "Pickiness about food or water"],
    note: "This age window is critical. Early detection makes the difference between 6 months and 6 years.",
  },
  {
    id: "senior",
    label: "Senior",
    ages: "11–14 yrs",
    title: "Compensation fails",
    image: "./images/stage-senior.png?v=hc47",
    imageAlt: "Real senior cat portrait",
    issues: ["Kidney function severely compromised", "Chronic conditions often diagnosed now", "Cats stop hiding illness symptoms"],
    symptoms: ["Increased vomiting", "Noticeable weight loss", "Behavior changes — less playful, more hiding"],
    note: "By now, damage is often advanced. But knowing exactly what changed helps your vet intervene fast.",
  },
  {
    id: "geriatric",
    label: "Geriatric",
    ages: "15+ yrs",
    title: "Quality of life",
    image: "./images/stage-geriatric.png?v=hc47",
    imageAlt: "Real geriatric cat portrait",
    issues: ["Multiple organ systems failing together", "Even minor changes signal bigger problems", "Rapid decline possible"],
    symptoms: ["Sudden weight drop", "Refusing food for 24+ hours", "Weakness, wobbly gait, or disorientation"],
    note: "At this stage, knowing what's changed helps you and your vet make comfort-first decisions quickly.",
  },
];

function renderLifeStageCard(stage) {
  const issues = stage.issues.map((item) => `<li>${item}</li>`).join("");
  const symptoms = stage.symptoms.map((item) => `<li>${item}</li>`).join("");

  return `
    <article class="life-stage-card age-carousel-card" data-stage="${stage.id}" id="stage-${stage.id}" aria-labelledby="stage-title-${stage.id}">
      <div class="life-stage-visual age-carousel-visual">
        <img class="age-stage-photo" src="${stage.image}" alt="${stage.imageAlt}" loading="lazy" width="360" height="360" />
        <span class="age-carousel-badge" data-here-badge hidden>Current stage</span>
      </div>
      <div class="life-stage-content age-carousel-content">
        <p class="life-stage-ages">${stage.label} · ${stage.ages}</p>
        <h3 id="stage-title-${stage.id}">${stage.title}</h3>
        <div class="age-carousel-columns">
          <div class="age-carousel-col">
            <span class="age-carousel-col-label">What's actually happening</span>
            <ul class="age-carousel-list">${issues}</ul>
          </div>
          <div class="age-carousel-col age-carousel-col--watch">
            <span class="age-carousel-col-label">Watch for these signs</span>
            <ul class="age-carousel-list">${symptoms}</ul>
          </div>
        </div>
        <p class="age-carousel-note">${stage.note}</p>
      </div>
    </article>`;
}


function updateLifeJourneyForAge(years) {
  const stageId = years != null ? getStageForAge(years) : null;
  const lead = document.getElementById("life-journey-lead");
  const name = catName && catName !== "Your cat" ? catName : "Your cat";

  if (lead) {
    if (years != null) {
      const stage = AGE_CAROUSEL_STAGES.find((s) => s.id === stageId);
      lead.textContent = `${name} is ${years}. Review the ${stage?.label || "senior"} stage for age-specific guidance.`;
    } else {
      lead.textContent =
        "Swipe through each life stage. The same five screening questions catch what changes at every age.";
    }
  }

  document.querySelectorAll(".life-stage-card").forEach((card) => {
    const isCurrent = card.dataset.stage === stageId;
    card.classList.toggle("is-current", isCurrent);
    const badge = card.querySelector("[data-here-badge]");
    if (badge) badge.hidden = !isCurrent;
    if (badge && isCurrent) badge.classList.add("is-here");
  });

  document.querySelectorAll(".life-journey-nav-btn").forEach((btn) => {
    btn.classList.toggle("is-current", btn.dataset.stage === stageId);
  });

  if (stageId) {
    requestAnimationFrame(() => {
      scrollToLifeStage(stageId, "auto");
      syncLifeJourneyScroll();
    });
  }
}

function scrollToLifeStage(stageId, behavior = "smooth") {
  const scroller = document.getElementById("life-journey-scroller");
  const card = document.querySelector(`.life-stage-card[data-stage="${stageId}"]`);
  if (!scroller || !card) return;

  const offset = card.offsetLeft - (scroller.clientWidth - card.clientWidth) / 2;
  scroller.scrollTo({ left: Math.max(0, offset), behavior });
}

function syncLifeJourneyScroll() {
  const scroller = document.getElementById("life-journey-scroller");
  if (!scroller) return;

  const cards = [...scroller.querySelectorAll(".life-stage-card")];
  if (!cards.length) return;

  const center = scroller.scrollLeft + scroller.clientWidth / 2;
  let activeCard = cards[0];
  let minDistance = Infinity;

  cards.forEach((card) => {
    const cardCenter = card.offsetLeft + card.clientWidth / 2;
    const distance = Math.abs(center - cardCenter);
    if (distance < minDistance) {
      minDistance = distance;
      activeCard = card;
    }
  });

  const activeId = activeCard.dataset.stage;
  cards.forEach((card) => {
    card.classList.toggle("is-active", card.dataset.stage === activeId);
  });

  document.querySelectorAll(".life-journey-nav-btn").forEach((btn) => {
    btn.classList.toggle("is-active", btn.dataset.stage === activeId);
    btn.setAttribute("aria-selected", btn.dataset.stage === activeId ? "true" : "false");
  });

  const index = cards.indexOf(activeCard);
  const fill = document.getElementById("life-journey-rail-fill");
  if (fill && cards.length > 1) {
    fill.style.width = `${(index / (cards.length - 1)) * 100}%`;
  }
}

function initLifeJourney() {
  const track = document.getElementById("life-journey-track");
  const nav = document.getElementById("life-journey-nav");
  const scroller = document.getElementById("life-journey-scroller");

  if (!track || !nav || !scroller) return;

  track.innerHTML = AGE_CAROUSEL_STAGES.map(renderLifeStageCard).join("");
  nav.innerHTML = AGE_CAROUSEL_STAGES.map(
    (stage) =>
      `<button type="button" class="life-journey-nav-btn" role="tab" data-stage="${stage.id}" aria-controls="stage-${stage.id}" aria-selected="false">${stage.label}</button>`
  ).join("");

  nav.querySelectorAll(".life-journey-nav-btn").forEach((btn) => {
    btn.addEventListener("click", () => scrollToLifeStage(btn.dataset.stage));
  });

  scroller.addEventListener("scroll", syncLifeJourneyScroll, { passive: true });
  window.addEventListener("resize", syncLifeJourneyScroll, { passive: true });

  document.getElementById("journey-screening-cta")?.addEventListener("click", openFlow);

  syncLifeJourneyScroll();
  if (catAge != null) updateLifeJourneyForAge(catAge);
}

function personalizeForAge(years, profile) {
  if (profile) catAgeProfile = profile;

  document.querySelectorAll(".hero-cat-age-dynamic").forEach((el) => {
    el.textContent = String(years);
  });

  const heroLead = document.querySelector(".hero-lead-dynamic");
  if (heroLead && profile?.heroLine) heroLead.textContent = profile.heroLine;

  const heroTitle = document.querySelector(".hero-title-dynamic");
  if (heroTitle && profile?.headline) heroTitle.textContent = profile.headline;

  updateLifeJourneyForAge(years);

  if (typeof window.peticineUpdateCurve === "function") {
    window.peticineUpdateCurve(years, catName);
  }
}

function getSavedCatAge() {
  const saved = localStorage.getItem(CAT_AGE_KEY);
  const years = saved ? parseInt(saved, 10) : NaN;
  return years >= 1 && years <= 25 ? years : null;
}

function getSavedCatName() {
  return localStorage.getItem(CAT_NAME_KEY) || null;
}

window.peticineAgeBridge = {
  getSavedAge: getSavedCatAge,
  getSavedName: getSavedCatName,
  complete(years, profile, extra = {}) {
    catAge = years;
    catAgeProfile = profile || null;
    catName = extra.name || getSavedCatName() || null;
    completeAgeGate();
  },
  shouldSkip() {
    return sessionStorage.getItem(AGE_DONE_KEY) === "1" && getSavedCatAge() != null;
  },
};

const AGE_STAGE_LABELS = {
  young: "Kitten / young",
  prime: "Prime",
  mature: "Mature",
  senior: "Senior",
  geriatric: "Geriatric",
};

function getAgeProfileLocal(years) {
  const theme = getStageForAge(years);
  return { theme, stageLabel: AGE_STAGE_LABELS[theme] || "" };
}

function initAgeGate() {
  // Soft gate: the full site is always visible. Age only personalizes.
  siteShell?.removeAttribute("hidden");
  siteShell?.setAttribute("aria-hidden", "false");
  siteShell?.classList.add("is-visible");
  document.body.style.overflow = "";

  const savedAge = getSavedCatAge();
  if (savedAge != null) {
    catAge = savedAge;
    catName = getSavedCatName();
    catAgeProfile = getAgeProfileLocal(savedAge);
    document.documentElement.classList.add("age-complete");
    if (catAgeProfile.theme) document.body.dataset.ageTheme = catAgeProfile.theme;
    personalizeForAge(catAge, catAgeProfile);
  }
}

// ---- Felica screening --------------------------------------------------
const FELICA_NEWSLETTER_EMAIL = "hello@felica.in";
const FELICA_WHATSAPP_URL = "https://chat.whatsapp.com/placeholder-felica-community";
const SCREENING_API_BASE = "https://digi-clinic-tau.vercel.app";

const SCREENING_QUESTIONS = [
  {
    id: "water",
    title: "Drinking habits",
    lead: "Have you noticed any changes in your cat's water drinking?",
    storyId: "mochi",
    options: [
      { id: "empty_bowl", label: "Emptying the water bowl more often", shortLabel: "Emptying bowl more", points: 2 },
      { id: "refills", label: "Asking for refills more often", shortLabel: "More refills", points: 2 },
      { id: "longer", label: "Drinking for longer than usual", shortLabel: "Drinking longer", points: 3 },
      { id: "none", label: "None of the above", shortLabel: "None of the above", points: 0 },
      { id: "unsure", label: "Not sure", shortLabel: "Not sure", points: 1 },
    ],
  },
  {
    id: "urination",
    title: "Litter box",
    lead: "How has your cat's urination changed?",
    storyId: "mochi",
    options: [
      {
        id: "larger",
        shortLabel: "Bigger clumps",
        label: "Bigger clumps — more pee than before",
        points: 2,
      },
      {
        id: "more",
        shortLabel: "More clumps",
        label: "More clumps — going more often",
        points: 2,
      },
      {
        id: "both",
        shortLabel: "Bigger and more",
        label: "Bigger and more — both, really",
        points: 3,
      },
      {
        id: "same",
        shortLabel: "About the same",
        label: "About the same — looks normal to me",
        points: 0,
      },
      {
        id: "unsure",
        shortLabel: "Haven't noticed",
        label: "Haven't noticed — not something I track",
        points: 1,
      },
    ],
  },
  {
    id: "weight",
    title: "Weight",
    lead: "How has your cat's weight changed?",
    storyId: "theo",
    options: [
      { id: "ribs", label: "Ribs/spine are more noticeable", shortLabel: "Ribs/spine show", points: 3 },
      { id: "slight", label: "Slightly thinner", shortLabel: "Slightly thinner", points: 2 },
      { id: "same", label: "Looks about the same", shortLabel: "About the same", points: 0 },
      { id: "heavier", label: "Looks heavier", shortLabel: "Looks heavier", points: 0 },
      { id: "unsure", label: "Not sure", shortLabel: "Not sure", points: 1 },
    ],
  },
  {
    id: "appetite",
    title: "Appetite",
    lead: "How has your cat's appetite changed?",
    storyId: "pepper",
    options: [
      { id: "leaving", label: "Leaving food behind more often", shortLabel: "Leaving food", points: 2 },
      { id: "less", label: "Eating slightly less", shortLabel: "Eating less", points: 2 },
      { id: "same", label: "Eating about the same", shortLabel: "About the same", points: 0 },
      { id: "more", label: "Eating more", shortLabel: "Eating more", points: 2 },
      { id: "unsure", label: "Not sure", shortLabel: "Not sure", points: 1 },
    ],
  },
  {
    id: "vomiting",
    title: "Vomiting",
    lead: "How often has your cat vomited in the past week?",
    storyId: "theo",
    options: [
      { id: "four_plus", label: "4+ times", shortLabel: "4+ times", points: 3 },
      { id: "two_three", label: "2-3 times", shortLabel: "2-3 times", points: 2 },
      { id: "once", label: "Once", shortLabel: "Once", points: 1 },
      { id: "never", label: "Never", shortLabel: "Never", points: 0 },
      { id: "unsure", label: "Not sure", shortLabel: "Not sure", points: 1 },
    ],
  },
];

// Parent stories shown during the check — matched to question topic and result tier.
const FLOW_STORIES = {
  mochi: {
    before: "Extra water bowls, seemed like nothing",
    after: "Vet confirmed early CKD · stable 2 years on",
    quote: "I'd dismissed the extra water bowls as nothing. The screening gave me the words to ask for bloodwork. That changed everything.",
    who: "Daniel R.",
    cat: "Mochi, 13",
  },
  theo: {
    before: "Drinking more, losing weight. No one said kidneys yet",
    after: "Caught at stage 2 · two years of good days since",
    quote: "The screening flagged changes my vet confirmed weeks later. We started a plan before he ever got sick.",
    who: "Sarah M.",
    cat: "Theo, 11",
  },
  pepper: {
    before: "Just wanted peace of mind for an 8-year-old",
    after: "Low score, recheck in 6 months, sleeping better",
    quote: "Simple, honest, and not scary. It told me exactly what to watch and when to act, without guilt-tripping me.",
    who: "Aisha K.",
    cat: "Pepper, 8",
  },
  luna: {
    before: "Didn't know wet food mattered for kidneys",
    after: "Small habit changes · thriving at 3",
    quote: "The prevention check wasn't scary, just practical. We added wet food and I finally feel like I'm ahead of it.",
    who: "Priya S.",
    cat: "Luna, 3",
  },
  milo: {
    before: "Signed up after a friend recommended it",
    after: "Monthly reminders kept us on track",
    quote: "The community nudges are gentle: vet visit reminders, hydration tips, no guilt. Exactly what I needed as a new cat parent.",
    who: "James T.",
    cat: "Milo, 2",
  },
};

function renderFlowStory(storyId, { compact = false } = {}) {
  const s = FLOW_STORIES[storyId];
  if (!s) return "";
  if (compact) {
    return `
      <aside class="flow-story flow-story-compact" aria-label="Cat parent story">
        <div class="flow-story-ba">
          <span class="flow-story-before">${s.before}</span>
          <span class="flow-story-arrow" aria-hidden="true">→</span>
          <span class="flow-story-after">${s.after}</span>
        </div>
        <p class="flow-story-quote">"${s.quote}"</p>
        <p class="flow-story-cite">${s.who} · ${s.cat}</p>
      </aside>`;
  }
  return `
    <aside class="flow-story flow-story-result" aria-label="Cat parent story">
      <p class="flow-story-label">Someone like you</p>
      <div class="flow-story-ba">
        <span class="flow-story-before">${s.before}</span>
        <span class="flow-story-arrow" aria-hidden="true">→</span>
        <span class="flow-story-after">${s.after}</span>
      </div>
      <blockquote class="flow-story-quote">"${s.quote}"</blockquote>
      <cite class="flow-story-cite">${s.who} · ${s.cat}</cite>
    </aside>`;
}

function renderFlowTrustStrip() {
  return `
    <p class="flow-trust-strip">
      <span class="flow-trust-dot" aria-hidden="true"></span>
      28,000+ cat parents screened · not a diagnosis
    </p>`;
}

function getFlowQuestions() {
  return SCREENING_QUESTIONS;
}

function getFlowStepCount() {
  return 1 + SCREENING_QUESTIONS.length;
}

function getTotalFlowSteps() {
  return getFlowStepCount() + 1;
}

function getResultStep() {
  return getFlowStepCount() + 1;
}

function formatFlowStepLabel(stepNumber, suffix = "Questions") {
  return `Step ${stepNumber} of ${getFlowStepCount()} · ${suffix}`;
}

function getFlowStepSuffix() {
  return "Questions";
}

function setFlowProgramLabel() {
  if (!assflowProgramLabel) return;
  assflowProgramLabel.textContent = "Cat health screening";
}

function ageRiskPoints(years) {
  if (years == null) return 0;
  if (years < 7) return 0; // adult
  if (years <= 10) return 1; // mature
  if (years <= 14) return 2; // senior
  return 3; // geriatric
}

function ageBandLabel(years) {
  if (years == null) return "";
  if (years < 7) return "Adult";
  if (years <= 10) return "Mature";
  if (years <= 14) return "Senior";
  return "Geriatric";
}

const RISK_TIERS = {
  low: {
    id: "low",
    label: "Looking good",
    meterLabel: "Low",
    headline: "Looking good overall.",
    action: "Recheck in about 6 months",
    detail: "Nothing worrying in your answers. We'll remind you when it's time to screen again.",
    cta: "Got it",
    ctaTrust:
      "Recheck in 6 months. We'll remind you when it's time.",
    subject: "Screening reminder: recheck in 6 months",
    ctaIntent: "recheck_reminder",
  },
  medium: {
    id: "medium",
    label: "Worth a look",
    meterLabel: "Medium",
    headline: "Worth a closer look.",
    action: "Feline specialist calls within 24 hours",
    detail: "These answers together are worth checking. A specialist will call to explain what it means.",
    cta: "Got it",
    ctaTrust:
      "Not a diagnosis, just clarity on whether a vet visit makes sense and what to ask for.",
    subject: "Vet review from your screening",
    ctaIntent: "vet_contact",
  },
  high: {
    id: "high",
    label: "Let's check this",
    meterLabel: "High",
    headline: "Worth taking seriously.",
    action: "Feline specialist calls within 24 hours",
    detail: "A few answers flagged together need attention. A specialist will call with clear next steps.",
    cta: "Got it",
    ctaTrust:
      "We'll help you walk in with the right questions, so your clinic visit is worth the time.",
    subject: "Vet guidance from your screening",
    ctaIntent: "vet_contact",
  },
};

function tierForScore(score) {
  if (score >= 7) return RISK_TIERS.high;
  if (score >= 4) return RISK_TIERS.medium;
  return RISK_TIERS.low;
}

// A low score on the aging track — recheck timing depends on life stage.
function lowTierForAge(years) {
  return {
    ...RISK_TIERS.low,
    focus: "monitor",
  };
}

function resolveTier(score, years) {
  const base = tierForScore(score);
  if (base.id !== "low") return base;
  return lowTierForAge(years);
}

function scoreQuiz() {
  let score = ageRiskPoints(quizState.age);
  SCREENING_QUESTIONS.forEach((q) => {
    const answer = quizState.answers[q.id];
    if (answer) score += answer.points;
  });
  return score;
}

let quizState = {
  step: 1,
  age: null,
  answers: {},
  whatsappNumber: null,
  screeningResult: null,
};

function resetQuizState() {
  quizState = {
    step: 1,
    age: catAge != null ? catAge : null,
    answers: {},
    whatsappNumber: null,
    screeningResult: null,
  };
  setFlowProgramLabel();
}

function apiAnswerValue(questionId, answerId) {
  if (questionId === "urination" && answerId === "same") return "none";
  return answerId;
}

function buildScreeningQueryParams(phone) {
  const params = new URLSearchParams({
    catAge: String(quizState.age),
    phone,
  });

  SCREENING_QUESTIONS.forEach((q) => {
    const answer = quizState.answers[q.id];
    if (answer?.id) params.set(q.id, apiAnswerValue(q.id, answer.id));
  });

  return params;
}

async function fetchScreeningResult(phone) {
  const params = buildScreeningQueryParams(phone);
  const response = await fetch(`${SCREENING_API_BASE}/screening?${params.toString()}`);

  if (!response.ok) {
    const error = new Error("Screening request failed");
    error.status = response.status;
    throw error;
  }

  return response.json();
}

function answerLabel(qId) {
  const a = quizState.answers[qId];
  return a ? a.label : "Not answered";
}

function escapeHtml(text) {
  return String(text)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function renderScreeningSummary() {
  const ageRow =
    quizState.age != null
      ? `<li class="score-summary-item">
          <span class="score-summary-q">Cat's age</span>
          <span class="score-summary-a">${quizState.age} ${quizState.age === 1 ? "year" : "years"} · ${ageBandLabel(quizState.age)}</span>
        </li>`
      : "";

  const rows = SCREENING_QUESTIONS.map((q) => {
    const answer = quizState.answers[q.id];
    const label = answer?.label || "Not answered";
    return `<li class="score-summary-item">
      <span class="score-summary-q">${q.title}</span>
      <span class="score-summary-a">${escapeHtml(label)}</span>
    </li>`;
  }).join("");

  return `
    <div class="score-summary">
      <p class="score-summary-title">Your answers</p>
      <ul class="score-summary-list">${ageRow}${rows}</ul>
    </div>`;
}

function renderSpecialistCallout(riskLevel) {
  if (riskLevel === "low") {
    return `
      <p class="score-specialist score-specialist--low">
        Your answers look reassuring overall. We'll remind you when it's time to screen again — and a feline specialist is available if you'd like help understanding what they mean.
      </p>`;
  }

  return `
    <p class="score-specialist">
      A feline specialist will call you soon to walk through your answers, explain what they mean, and help you understand your cat's health better.
    </p>`;
}

function renderScoreResult(result) {
  const riskLevel = result?.risk_level || "low";
  const tier = RISK_TIERS[riskLevel] || RISK_TIERS.low;
  const headline = result?.risk_label || tier.headline;
  const detail = result?.message || tier.detail;

  return `
    <div class="quiz-result score-result score-result-${riskLevel}">
      <div class="score-meter" role="img" aria-label="Screening result: ${headline}">
        <span class="score-meter-seg seg-low ${riskLevel === "low" ? "is-active" : ""}">${RISK_TIERS.low.label}</span>
        <span class="score-meter-seg seg-medium ${riskLevel === "medium" ? "is-active" : ""}">${RISK_TIERS.medium.label}</span>
        <span class="score-meter-seg seg-high ${riskLevel === "high" ? "is-active" : ""}">${RISK_TIERS.high.label}</span>
      </div>

      <h2 class="quiz-title score-headline" id="assflow-title">${headline}</h2>
      <p class="score-detail">${detail}</p>

      ${renderScreeningSummary()}
      ${renderSpecialistCallout(riskLevel)}

      <button type="button" class="btn btn-block btn-get-started" data-flow-done>Done</button>
      <p class="score-reassure">Not a diagnosis. Your vet makes every treatment decision.</p>
    </div>
  `;
}

function setFlowProgress(step, total) {
  if (assflowProgressFill) {
    assflowProgressFill.style.width = `${((step + 1) / total) * 100}%`;
  }
}

function updateFlowChrome() {
  if (assflowBack) assflowBack.hidden = quizState.step <= 1 || quizState.step === getResultStep();
}

function setFlowFooter({ label = "Next", visible = true, disabled = true } = {}) {
  if (assflowFooter) assflowFooter.hidden = !visible;
  if (assflowContinue) {
    assflowContinue.textContent = label;
    assflowContinue.disabled = disabled;
  }
}

function bindFlowContinue(handler) {
  if (!assflowContinue) return;
  assflowContinue.onclick = handler;
}

let flowCompleted = false;

function openFlow(source = "unknown") {
  resetQuizState();
  flowCompleted = false;
  assflow.hidden = false;
  assflow.setAttribute("aria-hidden", "false");
  siteShell?.setAttribute("aria-hidden", "true");
  document.documentElement.classList.add("assflow-open");
  document.body.style.overflow = "hidden";
  track("screening_started", {
    source,
    has_saved_age: catAge != null,
    prefilled_age: catAge,
    traffic_source: new URLSearchParams(window.location.search).get("utm_source") || "direct",
  });
  renderFlowStep();
}

function closeFlow() {
  track("screening_closed", {
    completed: flowCompleted,
    exited_at_step: quizState.step,
  });
  assflow.hidden = true;
  assflow.setAttribute("aria-hidden", "true");
  siteShell?.setAttribute("aria-hidden", "false");
  document.documentElement.classList.remove("assflow-open");
  document.body.style.overflow = "";
}

function flowBack() {
  if (quizState.step > 1) {
    quizState.step -= 1;
    renderFlowStep();
  }
}

function renderAgeStep() {
  setFlowProgress(0, getTotalFlowSteps());
  const prefill = quizState.age != null ? quizState.age : "";
  assflowMain.innerHTML = `
    <div class="flow-step">
      <p class="flow-step-label">${formatFlowStepLabel(1, "About your cat")}</p>
      <h1 class="flow-title" id="assflow-title">How old is your cat?</h1>
      <p class="flow-lead">Age helps us interpret your answers. The same five questions apply at every life stage.</p>
      <div class="flow-age">
        <label class="flow-age-label" for="flow-age-input">Age in years</label>
        <input
          class="flow-age-input"
          id="flow-age-input"
          type="number"
          inputmode="numeric"
          min="1"
          max="25"
          step="1"
          value="${prefill}"
          placeholder="e.g. 11"
          autocomplete="off"
        />
        <div class="flow-age-readout" id="flow-age-readout" aria-live="polite" hidden></div>
      </div>
      <p class="flow-error" id="flow-error" hidden>Pop in an age between 1 and 25.</p>
      ${renderFlowTrustStrip()}
    </div>
  `;

  const input = document.getElementById("flow-age-input");
  const readout = document.getElementById("flow-age-readout");

  const update = () => {
    const years = parseInt(input.value, 10);
    const valid = years >= 1 && years <= 25;
    if (valid && readout) {
      readout.hidden = false;
      readout.innerHTML = `About <strong>${catToHumanAge(years)}</strong> in human years — <span class="flow-age-band">${ageBandLabel(years)}</span> stage.`;
    } else if (readout) {
      readout.hidden = true;
    }
    setFlowFooter({ visible: true, disabled: !valid, label: "Next" });
  };

  input.addEventListener("input", update);
  input.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      assflowContinue?.click();
    }
  });

  update();
  bindFlowContinue(() => {
    const years = parseInt(input.value, 10);
    const error = document.getElementById("flow-error");
    if (!(years >= 1 && years <= 25)) {
      if (error) error.hidden = false;
      return;
    }
    if (error) error.hidden = true;
    quizState.age = years;
    quizState.answers = {};
    setFlowProgramLabel();
    track("screening_step_completed", {
      step: "age",
      step_index: 1,
      cat_age: years,
      human_age: catToHumanAge(years),
      age_band: ageBandLabel(years),
    });
    quizState.step = 2;
    renderFlowStep();
  });

  window.setTimeout(() => input.focus(), 60);
}

function renderQuestionStep(qIndex) {
  const questions = getFlowQuestions();
  const q = questions[qIndex];
  setFlowProgress(qIndex + 1, getTotalFlowSteps());
  setFlowProgramLabel();

  const saved = quizState.answers[q.id];
  const story = q.storyId ? renderFlowStory(q.storyId, { compact: true }) : "";

  assflowMain.innerHTML = `
    <div class="flow-step">
      <p class="flow-step-label">${formatFlowStepLabel(qIndex + 2, getFlowStepSuffix())}</p>
      <h1 class="flow-title" id="assflow-title">${q.title}</h1>
      <p class="flow-lead">${q.lead}</p>
      <p class="flow-visual-hint">Select the option that best matches what you've seen.</p>
      <fieldset class="flow-fieldset flow-fieldset-visual flow-fieldset-visual-photo${q.options.length > 4 ? " flow-fieldset-visual-wide" : ""}">
        <legend class="visually-hidden">${q.title}</legend>
        <div class="flow-visual-grid">
        ${q.options
          .map((opt) => {
            const points = opt.points != null ? opt.points : 0;
            const tipKey = opt.tipKey || "";
            const gap = opt.gap ? "true" : "false";
            const caption = opt.shortLabel || opt.label;
            return `
          <label class="flow-visual-card flow-visual-card--photo">
            <input
              type="radio"
              name="answer"
              value="${opt.id}"
              data-points="${points}"
              data-label="${opt.label.replace(/"/g, "&quot;")}"
              data-tip-key="${tipKey}"
              data-gap="${gap}"
              aria-label="${opt.label.replace(/"/g, "&quot;")}"
              ${saved && saved.id === opt.id ? "checked" : ""}
            />
            ${renderQuizVisual(q.id, opt.id, caption)}
          </label>`;
          })
          .join("")}
        </div>
      </fieldset>
      ${story}
    </div>
  `;

  setFlowFooter({ visible: false });
  assflowMain.querySelectorAll('input[name="answer"]').forEach((input) => {
    input.addEventListener("change", () => {
      quizState.answers[q.id] = {
        id: input.value,
        points: Number(input.dataset.points),
        label: input.dataset.label,
        tipKey: input.dataset.tipKey || null,
        gap: input.dataset.gap === "true",
      };
      track("screening_step_completed", {
        step: q.id,
        step_index: qIndex + 2,
        answer: input.value,
        points: Number(input.dataset.points),
      });
      quizState.step += 1;
      window.setTimeout(renderFlowStep, 240);
    });
  });
}

function renderResultStep() {
  setFlowProgress(getFlowStepCount(), getTotalFlowSteps());
  setFlowFooter({ visible: false });
  setFlowProgramLabel();
  flowCompleted = true;

  const score = scoreQuiz();
  const tier = resolveTier(score, quizState.age);
  track("screening_score_computed", {
    score,
    risk_level: tier.id,
    focus: tier.focus || null,
    recommended_action: tier.action,
    cat_age: quizState.age,
    human_age: quizState.age != null ? catToHumanAge(quizState.age) : null,
    age_band: ageBandLabel(quizState.age),
    answers: SCREENING_QUESTIONS.reduce((acc, q) => {
      acc[q.id] = quizState.answers[q.id]?.id || null;
      return acc;
    }, {}),
  });

  assflowMain.innerHTML = `
    <div class="flow-step flow-step-result">
      ${renderWhatsAppGate(tier)}
    </div>
  `;
  bindWhatsAppGateHandlers();
}

function renderGateResultPreview(tier) {
  const activeClass = (id) => (tier.id === id ? " is-active" : "");
  return `
    <div class="gate-result-preview" aria-hidden="true">
      <p class="gate-result-preview-label">Your result is ready</p>
      <div class="gate-result-preview-meter">
        <span class="gate-result-preview-seg seg-low${activeClass("low")}">${RISK_TIERS.low.label}</span>
        <span class="gate-result-preview-seg seg-medium${activeClass("medium")}">${RISK_TIERS.medium.label}</span>
        <span class="gate-result-preview-seg seg-high${activeClass("high")}">${RISK_TIERS.high.label}</span>
      </div>
      <p class="gate-result-preview-tier">${tier.label}</p>
      <p class="gate-result-preview-blur">Enter your number below</p>
    </div>`;
}

function renderWhatsAppGate(tier) {
  const preview = tier ? renderGateResultPreview(tier) : "";
  const leadLine =
    tier && tier.id !== "low"
      ? "A feline specialist will call within 24 hours."
      : "See your full result on the next screen.";

  return `
    <div class="whatsapp-gate">
      ${preview}
      <p class="whatsapp-gate-lead">${leadLine}</p>
      <form class="whatsapp-gate-form" id="whatsapp-gate-form" novalidate>
        <label class="whatsapp-gate-label" for="whatsapp-number-input">Mobile number</label>
        <div class="whatsapp-gate-input-wrap">
          <span class="whatsapp-gate-prefix" aria-hidden="true">🇮🇳 +91</span>
          <input
            class="whatsapp-gate-input"
            type="tel"
            id="whatsapp-number-input"
            name="whatsapp"
            placeholder="9876543210"
            inputmode="numeric"
            maxlength="10"
            autocomplete="tel"
            required
          />
        </div>
        <p class="whatsapp-gate-hint">Free · private · no spam</p>
        <button type="submit" class="btn btn-block btn-get-started">Show my result</button>
      </form>
    </div>
  `;
}

function bindWhatsAppGateHandlers() {
  const form = assflowMain.querySelector("#whatsapp-gate-form");
  if (!form) return;

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    const input = form.querySelector("#whatsapp-number-input");
    const submitBtn = form.querySelector('button[type="submit"]');
    const number = input?.value?.trim();

    if (!number || number.length !== 10 || !/^\d+$/.test(number)) {
      input?.classList.add("error");
      input?.focus();
      setTimeout(() => input?.classList.remove("error"), 2000);
      return;
    }

    quizState.whatsappNumber = number;

    track("whatsapp_number_collected", {
      cat_age: quizState.age,
    });

    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.textContent = "Loading your result…";
    }

    try {
      const result = await fetchScreeningResult(number);
      quizState.screeningResult = result;

      track("screening_score_computed", {
        screening_id: result.screening_id || null,
        score: result.total_score,
        risk_level: result.risk_level,
        recommended_action: result.recommendation,
        next_action: result.next_action || null,
        cat_age: result.cat_age ?? quizState.age,
        age_band: result.age_band || ageBandLabel(quizState.age),
        answers: SCREENING_QUESTIONS.reduce((acc, q) => {
          acc[q.id] = quizState.answers[q.id]?.id || null;
          return acc;
        }, {}),
        source: "api",
      });

      assflowMain.innerHTML = `
        <div class="flow-step flow-step-result">
          ${renderScoreResult(result)}
        </div>
      `;

      bindAgingResultHandlers();
    } catch (err) {
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.textContent = "Show my result";
      }

      let errorEl = form.querySelector(".whatsapp-gate-error");
      if (!errorEl) {
        errorEl = document.createElement("p");
        errorEl.className = "whatsapp-gate-error flow-error";
        form.appendChild(errorEl);
      }
      errorEl.hidden = false;
      errorEl.textContent = "We couldn't load your result. Please try again.";
    }
  });
}

function bindAgingResultHandlers() {
  assflowMain.querySelectorAll("[data-flow-done]").forEach((btn) => {
    btn.addEventListener("click", closeFlow);
  });

  const resultCta = assflowMain.querySelector(".score-result a.btn");
  resultCta?.addEventListener("click", () => {
    track("cta_clicked", {
      location: "score_result",
      whatsapp_collected: !!quizState.whatsappNumber,
    });
  });
}

function renderFlowStep() {
  updateFlowChrome();

  if (quizState.step === 1) {
    renderAgeStep();
    return;
  }

  if (quizState.step >= 2 && quizState.step <= getFlowStepCount()) {
    renderQuestionStep(quizState.step - 2);
    return;
  }

  if (quizState.step === getResultStep()) {
    renderResultStep();
  }
}

function initAssessment() {
  document.querySelectorAll(".btn-get-started").forEach((btn) => {
    btn.addEventListener("click", (event) => {
      if (btn.tagName === "A") event.preventDefault();
      const source = ctaLocation(btn);
      track("cta_clicked", { location: source, intent: "start_screening" });
      openFlow(source);
    });
  });

  assflowBack?.addEventListener("click", flowBack);
  assflowExit?.addEventListener("click", closeFlow);

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && assflow && !assflow.hidden) {
      closeFlow();
    }
  });
}

const stickyCta = document.getElementById("sticky-cta");

const onScroll = () => {
  if (header) {
    header.classList.toggle("is-scrolled", window.scrollY > 8);
  }
  if (stickyCta) {
    const flowOpen = assflow && !assflow.hidden;
    const show = window.scrollY > 320 && !flowOpen;
    stickyCta.classList.toggle("is-visible", show);
    stickyCta.setAttribute("aria-hidden", String(!show));
  }
};

window.addEventListener("scroll", onScroll, { passive: true });

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.1, rootMargin: "0px 0px -40px 0px" }
);

document.querySelectorAll(".reveal").forEach((el) => observer.observe(el));

window.felicaOpenFlow = openFlow;
window.feliCareOpenFlow = openFlow;
window.peticineOpenFlow = openFlow;

track("page_viewed", {
  path: window.location.pathname,
  has_saved_age: localStorage.getItem(CAT_AGE_KEY) != null,
  traffic_source: new URLSearchParams(window.location.search).get("utm_source") || "direct",
});

if ("scrollRestoration" in history) {
  history.scrollRestoration = "manual";
}
if (!window.location.hash) {
  window.scrollTo(0, 0);
}

initAgeGate();
initAssessment();
initLifeJourney();

const menuToggle = document.querySelector(".menu-toggle");
const siteNav = document.querySelector(".site-nav");

if (menuToggle && siteNav) {
  menuToggle.addEventListener("click", () => {
    const isOpen = siteNav.classList.toggle("is-open");
    menuToggle.classList.toggle("is-open", isOpen);
    menuToggle.setAttribute("aria-expanded", String(isOpen));
    document.body.style.overflow = isOpen ? "hidden" : "";
  });

  siteNav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      siteNav.classList.remove("is-open");
      menuToggle.classList.remove("is-open");
      menuToggle.setAttribute("aria-expanded", "false");
      document.body.style.overflow = "";
    });
  });
}
