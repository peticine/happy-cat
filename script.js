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
const PRIMARY_CTA_LABEL = "Start My Cat's Health Check";

// Meta ad headlines per concern (use ?concern= in landing URL):
// water/drinking: "Cat drinking more water? Free 2-min check" | "Extra water bowls? See if it's worth a vet call"
//   | "Is your cat thirsty lately? Free health screening" | "More drinking can signal kidneys — check free in 2 min"
//   | "Worried how much your cat drinks? Start here"
// weight: "Cat losing weight? Free 2-minute screening" | "Thinner lately? Normal or a warning sign"
//   | "Weight loss in cats is easy to miss — check free" | "Cat getting skinnier? Vet-designed screening, ₹0"
//   | "Notice your cat feels lighter? Clear read in 2 min"
// eating/appetite: "Cat not eating much? Free screening in 2 minutes" | "Pickier appetite lately? Know if you should worry"
//   | "Skipping meals? Free vet-designed cat health check" | "Appetite changes hide illness — screen free"
//   | "Is your cat eating less? Get a plain-language answer"
// litter/peeing-outside: "Is your cat peeing outside the litter box?" | "Find out if it's stress — or kidneys, bladder, or pain that needs a vet."
const HERO_VARIANTS = {
  water: {
    headlineHook: "Drinking more water than usual?",
    headline: "Find out if it's normal — or a sign kidneys or thyroid need a vet look.",
    lead: "Early insights. Expert guidance. Better health for a longer life.",
    cta: "Check for Early Kidney Disease",
    image: "./images/hero-water.png?v=9",
  },
  drinking: {
    headlineHook: "Drinking more water than usual?",
    headline: "Find out if it's normal — or a sign kidneys or thyroid need a vet look.",
    lead: "Early insights. Expert guidance. Better health for a longer life.",
    cta: "Check for Early Kidney Disease",
    image: "./images/hero-water.png?v=9",
  },
  weight: {
    headlineHook: "Has your cat lost weight?",
    headline: "Find out if it's age and appetite — or something a vet should check soon.",
    consequence: "Weight loss is often the first change owners notice — and a sign something may already be progressing.",
    cta: "Find Out If Your Cat Is At Risk",
  },
  eating: {
    headlineHook: "Eating less than usual?",
    headline: "Find out if it's a passing phase — or a sign something's wrong.",
    consequence: "Appetite changes are easy to dismiss — but cats hide illness until habits shift.",
    cta: "Find Out If Your Cat Is At Risk",
  },
  appetite: {
    headlineHook: "Eating less than usual?",
    headline: "Find out if it's a passing phase — or a sign something's wrong.",
    consequence: "Appetite changes are easy to dismiss — but cats hide illness until habits shift.",
    cta: "Find Out If Your Cat Is At Risk",
  },
  sleeping: {
    headline: "Let's understand why your cat is sleeping more.",
    consequence: "More sleep can be age — or an early sign something inside is changing.",
    cta: "Start My Cat's Health Check",
  },
  litter: {
    headlineHook: "Is your cat peeing outside the litter box?",
    headline:
      "Find out if it's stress — or kidneys, bladder, or pain that needs a vet.",
    lead: "Early insights. Expert guidance. Better health for a longer life.",
    cta: "Find Out If Your Cat Is At Risk",
    image: "./images/hero-litter.png",
  },
  urination: {
    headlineHook: "Is your cat peeing outside the litter box?",
    headline:
      "Find out if it's stress — or kidneys, bladder, or pain that needs a vet.",
    lead: "Early insights. Expert guidance. Better health for a longer life.",
    cta: "Find Out If Your Cat Is At Risk",
    image: "./images/hero-litter.png",
  },
  quiet: {
    headline: "Let's understand what your cat's quieter behaviour could mean.",
    consequence: "When cats withdraw, it's often because they don't feel well — not because they're being difficult.",
    cta: "Start My Cat's Health Check",
  },
  default: {
    headlineHook: "Cats hide their illnesses.",
    headline: "Find out before it gets late.",
    lead: "Stress-free. At home.",
    cta: "Start My Cat's Health Check",
  },
};

const HERO_BG_IMAGES = {
  water: "./images/hero-water.png?v=9",
  drinking: "./images/hero-water.png?v=9",
  litter: "./images/hero-litter.png",
  urination: "./images/hero-litter.png",
};

const HERO_CONCERN_ALIASES = {
  drink: "water",
  "drinking-more": "water",
  "more-water": "water",
  "eating-less": "eating",
  "weight-loss": "weight",
  thinner: "weight",
  skinny: "weight",
  "losing-weight": "weight",
  appetite: "eating",
  "sleeping-more": "sleeping",
  sleep: "sleeping",
  "litter-box": "litter",
  litterbox: "litter",
  pee: "litter",
  "peeing-outside": "litter",
  "peeing-outside-litter-box": "litter",
  "outside-litter-box": "litter",
  "outside-the-litter-box": "litter",
  "inappropriate-urination": "litter",
  "litter-accident": "litter",
  "litter-box-accident": "litter",
  "urinating-outside": "litter",
  "less-playful": "quiet",
  behaviour: "quiet",
  behavior: "quiet",
};

function normalizeHeroConcern(raw) {
  if (!raw) return "default";
  const key = raw.toLowerCase().trim().replace(/\s+/g, "-");
  return HERO_CONCERN_ALIASES[key] || key;
}

function getHeroConcernFromUrl() {
  const params = new URLSearchParams(window.location.search);
  const raw =
    params.get("concern") ||
    params.get("utm_content") ||
    params.get("ad") ||
    params.get("symptom") ||
    "";
  const normalized = normalizeHeroConcern(raw);
  return HERO_VARIANTS[normalized] ? normalized : "default";
}

function applySiteCtaLabels(label) {
  document.querySelectorAll(".btn-get-started").forEach((btn) => {
    const heroLabel = btn.querySelector("#hero-cta-label");
    if (heroLabel) {
      heroLabel.textContent = label;
      return;
    }
    btn.textContent = label;
  });
}

function initHeroPersonalization() {
  const concern = getHeroConcernFromUrl();
  const variant = HERO_VARIANTS[concern] || HERO_VARIANTS.default;

  const headline = document.getElementById("hero-headline");
  const heroLead = document.getElementById("hero-lead");
  const ctaLabel = variant.cta || PRIMARY_CTA_LABEL;

  if (headline) {
    if (variant.headlineHook) {
      headline.innerHTML = `<span class="hero-landing-title-hook">${escapeHtml(variant.headlineHook)}</span><span class="hero-landing-title-main">${escapeHtml(variant.headline)}</span>`;
    } else {
      headline.innerHTML = `<span class="hero-landing-title-main">${escapeHtml(variant.headline)}</span>`;
    }
  }
  if (heroLead && variant.lead) {
    heroLead.textContent = variant.lead;
  }
  applySiteCtaLabels(ctaLabel);

  const heroImg = document.getElementById("hero-cat-image");
  const heroImage =
    variant.image || HERO_BG_IMAGES[concern] || "./images/hero-cat-portrait.png";
  if (heroImg) {
    heroImg.src = heroImage;
  }

  document.body.dataset.heroConcern = concern;
}

let catAge = null;
let catName = null;
let catAgeProfile = null;

// ---- Analytics --------------------------------------------------------------
// Vendor-agnostic event layer. Pushes to window.dataLayer (GA4 / GTM style),
// dispatches a DOM CustomEvent ("felica:track"), and forwards funnel events
// to Meta Pixel (fbq) and Google Ads (gtag) for conversion tracking.
const FUNNEL_EVENTS = [];

function trackGoogleAds(event, props = {}) {
  if (typeof window.gtag !== "function") return;
  try {
    window.gtag("event", event, props);

    switch (event) {
      case "cta_clicked":
        if (props.intent === "start_screening") {
          gtag("event", "select_promotion", {
            promotion_name: "start_screening",
            location: props.location,
          });
        }
        break;
      case "screening_started":
        gtag("event", "begin_checkout", {
          item_category: "cat_health_screening",
          source: props.source,
        });
        break;
      case "whatsapp_number_collected":
        if (typeof window.gtag_report_conversion === "function") {
          window.gtag_report_conversion();
        }
        break;
      case "screening_score_computed":
        if (props.source === "api") {
          gtag("event", "sign_up", {
            method: "cat_health_screening",
          });
        }
        break;
      default:
        break;
    }
  } catch (err) {
    /* ads tag must never break the app */
  }
}

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
    trackGoogleAds(event, props);
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

const STAGE_ICON = {
  young: "cat",
  prime: "sparkles",
  mature: "activity",
  senior: "heart-pulse",
  geriatric: "moon",
};

const AGE_CAROUSEL_STAGES = [
  {
    id: "young",
    label: "Kitten",
    ages: "0–2 yrs",
    title: "Building lifelong health",
    summary: "What happens now shapes organ health for life — early problems often catch up in senior years.",
    keyPoints: [
      "Early nutrition affects kidney health for life",
      "Congenital issues may show up now",
      "Growth problems can signal metabolic issues",
    ],
    image: "./images/stage-young.png?v=hc47",
    imageAlt: "Real kitten portrait",
  },
  {
    id: "prime",
    label: "Prime",
    ages: "3–6 yrs",
    title: "Healthy doesn't always mean healthy",
    summary: "Cats look completely healthy — blood work is often the only way to catch what's changing inside.",
    keyPoints: [
      "Weight creeps up slowly, often unnoticed",
      "Tartar and gum disease start building",
      "Ideal time to set baseline bloodwork",
    ],
    image: "./images/stage-prime.png?v=hc47",
    imageAlt: "Real adult cat portrait",
  },
  {
    id: "mature",
    label: "Mature",
    ages: "7–10 yrs",
    title: "When hidden decline starts",
    summary: "One in three cats shows organ decline now — early detection makes the difference between months and years.",
    keyPoints: [
      "Kidney disease becomes common",
      "Dental disease accelerates systemic problems",
      "Drinking or litter box changes are easy to miss",
    ],
    image: "./images/stage-mature.png?v=hc47",
    imageAlt: "Real mature cat portrait",
  },
  {
    id: "senior",
    label: "Senior",
    ages: "11–14 yrs",
    title: "Where chronic disease begins appearing",
    summary: "Cats stop hiding illness — knowing exactly what changed helps your vet intervene fast.",
    keyPoints: [
      "Kidney function often severely compromised",
      "Chronic conditions frequently diagnosed now",
      "Nausea, weight loss, and hiding increase",
    ],
    image: "./images/stage-senior.png?v=hc47",
    imageAlt: "Real senior cat portrait",
  },
  {
    id: "geriatric",
    label: "Geriatric",
    ages: "15+ yrs",
    title: "Every day of comfort counts",
    summary: "Even minor changes signal bigger problems — comfort-first decisions need clarity, fast.",
    keyPoints: [
      "Multiple organ systems may fail together",
      "Refusing food for 24+ hours needs attention",
      "Weakness or disorientation can appear suddenly",
    ],
    image: "./images/stage-geriatric.png?v=hc47",
    imageAlt: "Real geriatric cat portrait",
  },
];

function renderLifeStageCard(stage) {
  const bullets = stage.keyPoints.map((item) => `<li>${item}</li>`).join("");

  return `
    <article class="life-stage-card age-carousel-card" data-stage="${stage.id}" id="stage-${stage.id}" aria-labelledby="stage-title-${stage.id}">
      <div class="life-stage-visual age-carousel-visual">
        <img class="age-stage-photo" src="${stage.image}" alt="${stage.imageAlt}" loading="lazy" width="360" height="360" />
        <span class="age-carousel-badge" data-here-badge hidden>Current stage</span>
      </div>
      <div class="life-stage-content age-carousel-content">
        <p class="life-stage-ages">${stage.label} · ${stage.ages}</p>
        <h3 id="stage-title-${stage.id}">${stage.title}</h3>
        <p class="life-stage-summary">${stage.summary}</p>
        <ul class="age-carousel-list age-carousel-list--compact">${bullets}</ul>
      </div>
    </article>`;
}


function updateLifeJourneyForAge(years) {
  const stageId = years != null ? getStageForAge(years) : null;

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
  nav.innerHTML = AGE_CAROUSEL_STAGES.map((stage, index) => {
    const connector =
      index > 0 ? '<span class="life-journey-progress-line" aria-hidden="true"></span>' : "";
    return `${connector}<button type="button" class="life-journey-nav-btn life-journey-progress-btn" role="tab" data-stage="${stage.id}" aria-controls="stage-${stage.id}" aria-selected="false">
      <span class="life-journey-progress-icon-wrap" aria-hidden="true"><i data-lucide="${STAGE_ICON[stage.id] || STAGE_ICON.young}"></i></span>
      <span class="life-journey-progress-label">${stage.label}</span>
      <span class="life-journey-progress-ages">${stage.ages}</span>
    </button>`;
  }).join("");

  if (typeof window.initFelicaIcons === "function") {
    window.initFelicaIcons(nav);
  }

  nav.querySelectorAll(".life-journey-nav-btn").forEach((btn) => {
    btn.addEventListener("click", () => scrollToLifeStage(btn.dataset.stage));
  });

  scroller.addEventListener("scroll", syncLifeJourneyScroll, { passive: true });
  window.addEventListener("resize", syncLifeJourneyScroll, { passive: true });

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
const FELICA_CALLBACK_NUMBER = "+91 80 4728 5635";
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
    title: "Nausea",
    lead: "How often has your cat experienced nausea in the past week?",
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

const YOUNG_CAT_AGE_MAX = 6;

const YOUNG_SYMPTOM_THEMES = {
  appetite: { bg: "#fdf6ec", icon: "#b8721e", ring: "rgba(184, 114, 30, 0.18)" },
  gut: { bg: "#fff4eb", icon: "#d4622a", ring: "rgba(212, 98, 42, 0.18)" },
  litter: { bg: "#edf7f1", icon: "#2f8f5b", ring: "rgba(47, 143, 91, 0.18)" },
  hydration: { bg: "#eef6fc", icon: "#2b7fc7", ring: "rgba(43, 127, 199, 0.18)" },
  skin: { bg: "#fdf8ee", icon: "#a67c2e", ring: "rgba(166, 124, 46, 0.18)" },
  coat: { bg: "#faf3ee", icon: "#c47a45", ring: "rgba(196, 122, 69, 0.18)" },
  eyes: { bg: "#eef6fa", icon: "#3a7ca5", ring: "rgba(58, 124, 165, 0.18)" },
  behaviour: { bg: "#f1eef9", icon: "#5f51a6", ring: "rgba(95, 81, 166, 0.18)" },
  mood: { bg: "#f3eef8", icon: "#7a4fa8", ring: "rgba(122, 79, 168, 0.18)" },
  dental: { bg: "#f5f0ee", icon: "#8b5a45", ring: "rgba(139, 90, 69, 0.18)" },
  mobility: { bg: "#eef3f8", icon: "#4a6fa5", ring: "rgba(74, 111, 165, 0.18)" },
  prevention: { bg: "#eef5fc", icon: "#1559b7", ring: "rgba(21, 89, 183, 0.18)" },
};

const YOUNG_SYMPTOMS = [
  {
    id: "appetite",
    label: "My cat is not eating properly",
    icon: "Utensils",
    theme: "appetite",
  },
  {
    id: "vomiting",
    label: "My cat is vomiting — food, hairball, or yellow liquid",
    icon: "Wind",
    theme: "gut",
  },
  {
    id: "skin",
    label: "My cat is scratching a lot, or has fleas/ticks/lice",
    icon: "Bug",
    theme: "skin",
  },
  {
    id: "litter",
    label: "My cat has loose motion (diarrhoea) or is straining in the litter box",
    icon: "Toilet",
    theme: "litter",
  },
  {
    id: "behaviour",
    label: "My cat seems off — restless, hiding, irritable, or aggressive",
    icon: "Cat",
    theme: "behaviour",
  },
  {
    id: "hydration",
    label: "My cat is drinking more water or peeing more than usual",
    icon: "Droplets",
    theme: "hydration",
  },
  {
    id: "energy",
    label: "My cat is sleeping more or has low energy",
    icon: "Moon",
    theme: "behaviour",
  },
  {
    id: "eyes",
    label: "My cat has teary eyes or eye stains",
    icon: "Eye",
    theme: "eyes",
  },
  {
    id: "coat",
    label: "My cat's fur looks dull, dry, or is falling out",
    icon: "Sparkles",
    theme: "coat",
  },
  {
    id: "dental",
    label: "My cat has bad breath or difficulty chewing food",
    icon: "Stethoscope",
    theme: "dental",
  },
  {
    id: "mobility",
    label: "My cat is not jumping or walking properly — limping or stiff",
    icon: "Activity",
    theme: "mobility",
  },
  {
    id: "prevention",
    label: "Nothing wrong — I just want a routine health check",
    icon: "Shield",
    theme: "prevention",
  },
];

const YOUNG_SYMPTOM_META = {
  vomiting: {
    durationTitle: (name) => `How long has ${name} been vomiting?`,
    durationLead: "A hairball now and then is common in cats — the pattern is what matters.",
    detailTitle: "How often this week?",
    planTitle: "Stomach & gut plan",
    products: [
      { name: "Gut comfort supplement", note: "Gentle daily support after upset stomachs" },
      { name: "Hairball paste", note: "Helps hair pass before it causes blockages" },
      { name: "Probiotic sachets", note: "Rebuilds gut flora after vomiting episodes" },
    ],
  },
  appetite: {
    durationTitle: (name) => `How long has ${name} been eating less?`,
    durationLead: "Cats hide illness — even a few skipped meals can be an early signal.",
    detailTitle: "What best describes it?",
    planTitle: "Appetite support plan",
    products: [
      { name: "Appetite support gel", note: "Palatable support when meals are being skipped" },
      { name: "Probiotic paste", note: "Often helps when the gut is off and food is refused" },
      { name: "Omega supplement", note: "Keeps coat and energy steady while appetite recovers" },
    ],
  },
  litter: {
    durationTitle: (name) => `How long has ${name}'s litter habit changed?`,
    durationLead: "Stool and litter changes are one of the clearest signs something's off.",
    detailTitle: "What's been happening?",
    planTitle: "Digestion & litter plan",
    products: [
      { name: "Digestive probiotic", note: "Supports gut balance after diarrhoea or diet changes" },
      { name: "Electrolyte support", note: "Helps after loose stool or dehydration risk" },
      { name: "Monthly deworming", note: "Parasites are a common hidden cause in young cats" },
    ],
  },
  skin: {
    durationTitle: (name) => `How long has ${name} been scratching or showing fleas?`,
    durationLead: "Scratching and fleas often go together — treating the cat and home matters.",
    detailTitle: "What fits best?",
    planTitle: "Itching & parasite plan",
    products: [
      { name: "Flea prevention", note: "Monthly treatment for cats and home" },
      { name: "Skin soothe supplement", note: "Daily support when itching won't settle" },
      { name: "Omega & coat oil", note: "Helps dry skin and coat recovery" },
    ],
  },
  eyes: {
    durationTitle: (name) => `How long have ${name}'s eyes been teary or stained?`,
    durationLead: "Some tear staining is normal — sudden changes or red eyes need a closer look.",
    detailTitle: "How often do you see this?",
    planTitle: "Eye care plan",
    products: [
      { name: "Eye wipe routine", note: "Gentle daily cleaning for tear stains" },
      { name: "Flea & allergy check", note: "Face rubbing can stain eyes and irritate skin" },
      { name: "Vet eye check reminder", note: "Red or sticky eyes should be seen in clinic" },
    ],
  },
  behaviour: {
    durationTitle: (name) => `How long has ${name} seemed off?`,
    durationLead: "Restlessness, hiding, or irritability usually means they don't feel right.",
    detailTitle: "What stands out most?",
    planTitle: "Behaviour plan",
    products: [
      { name: "Calm support supplement", note: "Gentle daily support when stress or discomfort shows" },
      { name: "Neuter/spay reminder", note: "Trying to go out is common in unneutered cats" },
      { name: "Multivitamin drops", note: "Useful when behaviour shifts come with eating less" },
    ],
  },
  coat: {
    durationTitle: (name) => `How long has ${name}'s coat seemed off?`,
    durationLead: "A dull coat or extra shedding is often the first visible change.",
    detailTitle: "What have you noticed?",
    planTitle: "Coat & skin plan",
    products: [
      { name: "Omega & coat oil", note: "Supports shine and skin recovery from the inside" },
      { name: "Flea prevention", note: "Coat changes often start with parasites" },
      { name: "Skin soothe supplement", note: "Daily support when the coat looks thin or dry" },
    ],
  },
  hydration: {
    durationTitle: (name) => `How long have you noticed more drinking or peeing?`,
    durationLead: "More water or bigger litter clumps are easy to miss at first.",
    detailTitle: "What changed first?",
    planTitle: "Drinking & litter plan",
    products: [
      { name: "Urinary support supplement", note: "Gentle daily support for bladder health" },
      { name: "Wet food variety pack", note: "Extra moisture helps cats that drink more" },
      { name: "Kidney baseline screen at 7", note: "We'll remind you when it's time for a full check" },
    ],
  },
  energy: {
    durationTitle: (name) => `How long has ${name} had less energy?`,
    durationLead: "Sleeping more is often the first sign something feels off.",
    detailTitle: "What's changed most?",
    planTitle: "Energy support plan",
    products: [
      { name: "Multivitamin drops", note: "Covers gaps when energy or appetite dips" },
      { name: "Calm support supplement", note: "Gentle daily support when rest increases" },
      { name: "Monthly wellness check", note: "We'll nudge you if patterns shift again" },
    ],
  },
  dental: {
    durationTitle: (name) => `How long has ${name} had mouth trouble?`,
    durationLead: "Bad breath or chewing oddly often starts before obvious pain.",
    detailTitle: "What have you noticed?",
    planTitle: "Dental comfort plan",
    products: [
      { name: "Dental care gel", note: "Daily support between professional cleanings" },
      { name: "Soft food variety", note: "Easier to eat while mouth discomfort settles" },
      { name: "Dental check reminder", note: "Most cats need a dental look by age 3–4" },
    ],
  },
  mobility: {
    durationTitle: (name) => `How long has ${name} been moving differently?`,
    durationLead: "Jumping less or stiffness is easy to blame on age — even in young cats.",
    detailTitle: "What have you seen?",
    planTitle: "Mobility support plan",
    products: [
      { name: "Joint comfort supplement", note: "Daily support for easier movement" },
      { name: "Omega & coat oil", note: "Supports joints and inflammation naturally" },
      { name: "Weight check guide", note: "Extra weight is a common hidden cause" },
    ],
  },
  prevention: {
    durationTitle: () => "Prevention rhythm",
    durationLead: "",
    detailTitle: "",
    planTitle: "Prevention program",
    products: [
      { name: "Monthly deworming", note: "Due for most cats — indoor included" },
      { name: "Flea prevention", note: "Year-round in most Indian homes" },
      { name: "Daily omega & gut support", note: "Baseline wellness for cats under 7" },
    ],
  },
};

const YOUNG_SYMPTOM_ALIASES = {
  vomiting: "vomiting",
  nausea: "vomiting",
  gut: "vomiting",
  eating: "appetite",
  appetite: "appetite",
  litter: "litter",
  urination: "hydration",
  pee: "hydration",
  water: "hydration",
  drinking: "hydration",
  diarrhoea: "litter",
  skin: "skin",
  scratching: "skin",
  itching: "skin",
  fleas: "skin",
  ticks: "skin",
  lice: "skin",
  parasites: "skin",
  coat: "coat",
  eyes: "eyes",
  tear: "eyes",
  stains: "eyes",
  restless: "behaviour",
  mood: "behaviour",
  behaviour: "behaviour",
  quiet: "behaviour",
  sleeping: "energy",
  behavior: "behaviour",
  dental: "dental",
  mobility: "mobility",
  prevention: "prevention",
  wellness: "prevention",
};

const YOUNG_DURATION_OPTIONS = [
  { id: "today", label: "Just today" },
  { id: "few_days", label: "3–7 days" },
  { id: "one_two_weeks", label: "1–2 weeks" },
  { id: "longer", label: "Longer" },
];

const YOUNG_DETAIL_QUESTIONS = {
  vomiting: {
    lead: "How many times did your cat vomit this week?",
    options: [
      { id: "once", label: "Once — a single vomit" },
      { id: "two_three", label: "2–3 times" },
      { id: "four_plus", label: "4 or more times" },
    ],
  },
  appetite: {
    lead: "What is happening with food?",
    options: [
      { id: "less", label: "Eating less than before" },
      { id: "refusing", label: "Not eating at all / refusing food" },
      { id: "picky", label: "Picky — eats only a little" },
    ],
  },
  litter: {
    lead: "What did you notice in the litter box?",
    options: [
      { id: "diarrhoea", label: "Loose motion / watery stool (diarrhoea)" },
      { id: "outside_box", label: "Pooping outside the litter box" },
      { id: "straining", label: "Straining or crying while passing urine or stool" },
    ],
  },
  skin: {
    lead: "What fits best?",
    options: [
      { id: "seven_days", label: "Scratching — since about 7 days" },
      { id: "one_month", label: "Scratching — since about 1 month" },
      { id: "sometimes", label: "Scratching — comes and goes" },
      { id: "fleas_one_day", label: "Fleas/ticks/lice — noticed 1 day ago" },
      { id: "fleas_seven_days", label: "Fleas/ticks/lice — noticed ~7 days ago" },
      { id: "fleas_while_ago", label: "Fleas/ticks/lice — noticed a while ago" },
      { id: "scratch_and_fleas", label: "Both scratching and fleas/ticks/lice" },
    ],
  },
  coat: {
    lead: "What changed in the fur?",
    options: [
      { id: "dull", label: "Fur looks dull or dry" },
      { id: "shedding", label: "Hair fall / shedding more than usual" },
      { id: "thin", label: "Fur thinning or patchy in places" },
    ],
  },
  eyes: {
    lead: "How often do you see teary eyes or stains?",
    options: [
      { id: "more_than_usual", label: "More than usual" },
      { id: "once_week", label: "About once a week" },
      { id: "once_in_a_while", label: "Once in a while" },
    ],
  },
  behaviour: {
    lead: "What kind of change have you seen?",
    options: [
      { id: "meowing", label: "Meowing a lot" },
      { id: "aggression", label: "Showing aggression" },
      { id: "trying_out", label: "Trying to go outside" },
      { id: "hiding", label: "Hiding or avoiding people" },
      { id: "withdrawn", label: "Quiet — not like their usual self" },
    ],
  },
  hydration: {
    lead: "What did you notice first?",
    options: [
      { id: "drinking", label: "Water bowl finishes faster / drinks more" },
      { id: "peeing", label: "More pee or bigger clumps in litter" },
      { id: "both", label: "Both — drinking more and peeing more" },
    ],
  },
  energy: {
    lead: "What is the main change?",
    options: [
      { id: "few_days", label: "Sleeping more than usual" },
      { id: "one_two_weeks", label: "Less playful or active" },
      { id: "gradual", label: "Gets tired quickly after small activity" },
    ],
  },
  dental: {
    lead: "What have you noticed in the mouth?",
    options: [
      { id: "breath", label: "Strong bad breath" },
      { id: "chewing", label: "Chewing on one side or dropping food" },
      { id: "pawing", label: "Pawing at the mouth or face" },
    ],
  },
  mobility: {
    lead: "How is movement affected?",
    options: [
      { id: "jumping", label: "Not jumping on bed / sofa like before" },
      { id: "stiff", label: "Stiff or slow while getting up" },
      { id: "limping", label: "Limping or favouring one leg" },
    ],
  },
};

const FELICA_PREVENTION_PROGRAM = {
  name: "Felica Prevention Program",
  price: "₹799",
  period: "month",
  note: "Includes specialist support.",
};

const FELICA_WHATSAPP_CONTACT_URL = "https://wa.me/918047285635";

const WELLNESS_ISSUE_IDS = new Set(["skin", "coat", "eyes", "prevention"]);

const WELLNESS_SPECIALISTS = {
  skin: {
    shortName: "Dr. Ankita",
    fullName: "Dr. Ankita Kawale",
    title: "Veterinary Dermatologist",
    icon: "👩‍⚕️",
    specialtyNoun: "veterinary skin specialist",
    reviewTitle: "Felica veterinary dermatologist",
    image: "./images/dr-ankita-kawale.png?v=hc28",
    experience: "8 years treating feline skin disease",
    catsTreated: "3,000+ cats treated",
    reviewFrequency: (name) => `Reviews ${name}'s progress every 2 weeks`,
    replyTime: "Usually replies within 4 hours on WhatsApp.",
    reassurance: (name, duration) =>
      `Most cats with these symptoms improve with a structured ${duration} plan. We'll monitor ${name}'s progress together.`,
  },
  coat: {
    shortName: "Dr. Shantanu",
    fullName: "Dr. Shantanu Kalambi",
    title: "Feline Coat & Dermatology Specialist",
    icon: "👨‍⚕️",
    specialtyNoun: "feline coat specialist",
    reviewTitle: "Felica coat & skin specialist",
    image: "./images/dr-shantanu-kalambi.png",
    experience: "20 years treating feline skin and coat disease",
    catsTreated: "8,000+ cats treated",
    reviewFrequency: (name) => `Reviews ${name}'s coat progress every 3 weeks`,
    replyTime: "Usually replies within 4 hours on WhatsApp.",
    reassurance: (name, duration) =>
      `Most cats with dull or thinning fur respond well to a structured ${duration} plan. We'll track ${name}'s coat together.`,
  },
  eyes: {
    shortName: "Dr. Ankita",
    fullName: "Dr. Ankita Kawale",
    title: "Feline Eye Health Specialist",
    icon: "👩‍⚕️",
    specialtyNoun: "feline eye health specialist",
    reviewTitle: "Felica eye health specialist",
    image: "./images/dr-ankita-kawale.png?v=hc28",
    experience: "8 years treating feline eye and allergy conditions",
    catsTreated: "3,000+ cats treated",
    reviewFrequency: (name) => `Reviews ${name}'s eye comfort every 2 weeks`,
    replyTime: "Usually replies within 4 hours on WhatsApp.",
    reassurance: (name, duration) =>
      `Most cats with teary eyes improve with a structured ${duration} plan. We'll monitor ${name}'s comfort together.`,
  },
  prevention: {
    shortName: "Dr. Shantanu",
    fullName: "Dr. Shantanu Kalambi",
    title: "Feline Preventive Care Specialist",
    icon: "👨‍⚕️",
    specialtyNoun: "feline preventive care specialist",
    reviewTitle: "Felica preventive care specialist",
    image: "./images/dr-shantanu-kalambi.png",
    experience: "20 years in feline preventive medicine",
    catsTreated: "8,000+ cats treated",
    reviewFrequency: (name) => `Checks in on ${name}'s wellness every month`,
    replyTime: "Usually replies within 4 hours on WhatsApp.",
    reassurance: (name) =>
      `Most healthy cats stay that way with a steady prevention rhythm. We'll keep ${name} on track together.`,
  },
};

const WELLNESS_SPECIALIST_DUTIES = [
  "Review your answers",
  "Adjust the plan if needed",
  "Answer questions on WhatsApp",
  "Tell you if an in-person visit is necessary",
];

const WELLNESS_PLANS = {
  skin: {
    id: "skin",
    planName: "Skin Recovery Plan",
    duration: "8 weeks",
    beforeImage: "./images/hero-hiding-cat.png",
    afterImage: "./images/hero-healthy-cat.png",
    beforeLabel: "Week 0",
    afterLabel: "Week 8",
    beforeCaption: "Scratching, fleas, irritated skin",
    afterCaption: "Calmer skin · monthly prevention on track",
    likelyCondition: "Allergic dermatitis with flea irritation",
    fleaCondition: "Flea irritation with secondary scratching",
    treatmentGoal: "Stop itching within 2 weeks and restore skin over 8 weeks.",
    medications: ["Monthly flea prevention", "Daily Skin Support sachets", "Omega coat supplement"],
    tangibleIncludes: [
      "Monthly flea prevention medication",
      "Skin Support supplement (daily sachets)",
      "Specialist review every 2 weeks",
      "WhatsApp follow-up with your vet",
    ],
    timeline: [
      { week: "Week 1–2", expectation: "Itching should reduce" },
      { week: "Week 3–5", expectation: "Skin heals" },
      { week: "Week 6–8", expectation: "Prevent recurrence" },
    ],
  },
  coat: {
    id: "coat",
    planName: "Coat Recovery Plan",
    duration: "12 weeks",
    beforeImage: "./images/hero-hiding-cat.png",
    afterImage: "./images/hero-healthy-cat.png",
    beforeLabel: "Week 0",
    afterLabel: "Week 12",
    beforeCaption: "Dull, dry, or thinning fur",
    afterCaption: "Shinier coat · healthier skin underneath",
    likelyCondition: "Coat thinning with nutritional deficiency",
    treatmentGoal: "Reduce shedding within 3 weeks and restore coat shine over 12 weeks.",
    medications: ["Omega & coat oil (daily)", "Skin Support sachets", "Monthly flea check"],
    tangibleIncludes: [
      "Omega & coat supplement (daily)",
      "Skin Support sachets",
      "Specialist review every 3 weeks",
      "WhatsApp follow-up with your vet",
    ],
    timeline: [
      { week: "Week 1–3", expectation: "Shedding should slow" },
      { week: "Week 4–8", expectation: "Coat feels thicker" },
      { week: "Week 9–12", expectation: "Shine returns" },
    ],
  },
  eyes: {
    id: "eyes",
    planName: "Eye Comfort Plan",
    duration: "6 weeks",
    beforeImage: "./images/hero-cat-portrait.png",
    afterImage: "./images/hero-healthy-cat.png",
    beforeLabel: "Week 0",
    afterLabel: "Week 6",
    beforeCaption: "Teary eyes or visible stains",
    afterCaption: "Cleaner eyes · fewer stains",
    likelyCondition: "Tear staining with mild eye irritation",
    treatmentGoal: "Cleaner eyes within 2 weeks and fewer stains over 6 weeks.",
    medications: ["Daily eye wipe routine", "Allergy support supplement", "Diet review"],
    tangibleIncludes: [
      "Eye care wipes & routine guide",
      "Allergy support supplement",
      "Specialist review every 2 weeks",
      "WhatsApp follow-up with your vet",
    ],
    timeline: [
      { week: "Week 1–2", expectation: "Eyes look cleaner day to day" },
      { week: "Week 3–4", expectation: "Fewer new stains" },
      { week: "Week 5–6", expectation: "Steady weekly routine in place" },
    ],
  },
  prevention: {
    id: "prevention",
    planName: "Prevention Wellness Plan",
    duration: "Ongoing",
    beforeImage: "./images/hero-cat-bed.png",
    afterImage: "./images/hero-healthy-cat.png",
    beforeLabel: "Today",
    afterLabel: "Month 3+",
    beforeCaption: "No issues — staying ahead",
    afterCaption: "On track with deworming, fleas, and gut support",
    likelyCondition: "Healthy cat — preventive care recommended",
    treatmentGoal: "Stay ahead of fleas, worms, and common issues before they start.",
    medications: ["Monthly deworming", "Flea prevention", "Gut & omega support"],
    tangibleIncludes: [
      "Monthly deworming medication",
      "Flea prevention treatment",
      "Gut & omega supplement",
      "Monthly specialist check-in on WhatsApp",
    ],
    timeline: [
      { week: "Month 1", expectation: "Prevention rhythm started" },
      { week: "Month 2", expectation: "Habits feel automatic" },
      { week: "Month 3+", expectation: "On track long-term" },
    ],
  },
};

function getWellnessPlanTitle(name, config) {
  const displayName = name === "your cat" ? "Your cat" : name;
  if (name === "your cat") return `Personalised ${config.planName}`;
  return `${displayName}'s ${config.planName}`;
}

function getWellnessJourneyTitle(name, config) {
  const displayName = name === "your cat" ? "Your cat" : name;
  if (config.id === "prevention") return `${displayName}'s Wellness Journey`;
  return `${displayName}'s Recovery Journey`;
}

function getWellnessRecoveryCtaTitle(name, config) {
  const displayName = name === "your cat" ? "Your cat" : name;
  if (config.id === "prevention") return `Start ${displayName}'s Wellness Plan`;
  return `Start ${displayName}'s Recovery Plan`;
}

function getWellnessSpecialist(planId) {
  return WELLNESS_SPECIALISTS[planId] || WELLNESS_SPECIALISTS.skin;
}

function getWellnessRecommendationLead(name, specialist) {
  const possessive = name === "your cat" ? "your cat's" : `${name}'s`;
  return `Based on ${possessive} symptoms, this plan was created by a ${specialist.specialtyNoun}.`;
}

function buildWellnessRecommendationReasons() {
  const reasons = [];
  const issues = getSelectedIssueSymptoms();
  const answers = getYoungDetailAnswers();

  issues.forEach((issue) => {
    const detail = answers[issue.id];
    if (issue.id === "skin") {
      if (
        !detail ||
        detail.id === "seven_days" ||
        detail.id === "one_month" ||
        detail.id === "sometimes" ||
        detail.id === "scratch_and_fleas"
      ) {
        reasons.push("Excess scratching");
      }
    }
    if (issue.id === "coat") {
      if (detail?.id === "thin" || detail?.id === "shedding") {
        reasons.push("Mild hair loss");
      } else {
        reasons.push("Dull or dry coat");
      }
    }
    if (issue.id === "eyes") {
      reasons.push("Teary eyes or visible stains");
    }
    if (issue.id === "prevention") {
      reasons.push("Routine prevention check-in");
    }
  });

  if (resolveYoungUrgency() !== "urgent") {
    reasons.push("No urgent warning signs");
  }

  if (!reasons.length) {
    reasons.push("Pattern fits a structured recovery program");
  }

  return [...new Set(reasons)];
}

function getWellnessConfirmTitle(name, specialist) {
  const displayName = name === "your cat" ? "your cat" : name;
  return `${specialist.shortName}'s recommended plan for ${displayName}`;
}

function getWellnessReviewCtaLabel(specialist) {
  return `Get ${specialist.shortName}'s review — free`;
}

function getWellnessCtaLabel(name) {
  if (name === "your cat") return "Begin recovery";
  const displayName = name.charAt(0).toUpperCase() + name.slice(1);
  return `Start ${displayName}'s treatment`;
}

function buildWellnessReviewWhatsAppUrl({ name, config, specialist, diagnosis, reasons }) {
  const displayName = name === "your cat" ? "my cat" : name;
  const ageLine = quizState.age != null ? `${quizState.age} years old` : "age not shared";
  const symptomLines = reasons
    .filter((reason) => reason !== "No urgent warning signs")
    .join(", ");

  const text = [
    `Hi Felica — I'd like ${specialist.shortName} to review ${displayName}'s case.`,
    "",
    `Cat: ${displayName} (${ageLine})`,
    `Working assessment: ${diagnosis}`,
    `Recommended plan: ${config.duration}`,
    `Goal: ${config.treatmentGoal}`,
    symptomLines ? `Based on: ${symptomLines}` : "",
    "",
    "Can you confirm if this plan is right before we start treatment?",
  ]
    .filter(Boolean)
    .join("\n");

  return `${FELICA_WHATSAPP_CONTACT_URL}?text=${encodeURIComponent(text)}`;
}

function renderWellnessConfirmationJourney(specialist, name) {
  const possessive = name === "your cat" ? "your cat's" : `${name}'s`;
  return `
    <ol class="wellness-confirm-journey">
      <li class="wellness-confirm-journey-item is-done">
        <span class="wellness-confirm-journey-step">Today</span>
        <span class="wellness-confirm-journey-copy">You shared ${escapeHtml(possessive)} symptoms</span>
      </li>
      <li class="wellness-confirm-journey-item is-next">
        <span class="wellness-confirm-journey-step">Next</span>
        <span class="wellness-confirm-journey-copy">${escapeHtml(specialist.shortName)} confirms on WhatsApp (free)</span>
      </li>
      <li class="wellness-confirm-journey-item">
        <span class="wellness-confirm-journey-step">Then</span>
        <span class="wellness-confirm-journey-copy">Confirmed plan + treatment ships</span>
      </li>
    </ol>`;
}

function resolveWellnessDiagnosis(config) {
  const detail = getYoungDetailAnswers()[config.id];
  if (config.id === "skin") {
    const fleaIds = new Set([
      "fleas_one_day",
      "fleas_seven_days",
      "fleas_while_ago",
      "scratch_and_fleas",
    ]);
    if (detail && fleaIds.has(detail.id)) return config.fleaCondition || config.likelyCondition;
  }
  return config.likelyCondition;
}

function renderWellnessRxRow(label, value, isList = false, note = "") {
  const valueHtml = isList
    ? `<ul class="wellness-rx-list">${value.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul>`
    : `<p class="wellness-rx-value">${escapeHtml(value)}</p>`;
  const noteHtml = note ? `<p class="wellness-rx-note">${escapeHtml(note)}</p>` : "";
  return `
    <div class="wellness-rx-row">
      <p class="wellness-rx-label">${escapeHtml(label)}</p>
      ${valueHtml}
      ${noteHtml}
    </div>`;
}

function renderWellnessTimeline(timeline) {
  return `
    <ol class="wellness-timeline">
      ${timeline
        .map(
          (item) => `
        <li class="wellness-timeline-item">
          <span class="wellness-timeline-week">${escapeHtml(item.week)}</span>
          <span class="wellness-timeline-expectation">${escapeHtml(item.expectation)}</span>
        </li>`
        )
        .join("")}
    </ol>`;
}

function renderWellnessSpecialistRx(specialist, name) {
  const possessive = name === "your cat" ? "your cat's" : `${name}'s`;
  return `
    <section class="wellness-panel wellness-specialist-rx" aria-label="Specialist recommendation">
      <div class="wellness-specialist-rx-body">
        <img
          class="wellness-specialist-rx-photo"
          src="${specialist.image}"
          alt="${escapeHtml(specialist.fullName)}"
          width="72"
          height="72"
          loading="lazy"
          decoding="async"
        />
        <div class="wellness-specialist-rx-meta">
          <p class="wellness-specialist-rx-name">${escapeHtml(specialist.fullName)}</p>
          <p class="wellness-specialist-rx-title">${escapeHtml(specialist.title)}</p>
          <p class="wellness-specialist-rx-reply">${escapeHtml(specialist.replyTime)}</p>
        </div>
      </div>
      <p class="wellness-specialist-rx-note">
        ${escapeHtml(specialist.shortName)} recommends this plan based on ${escapeHtml(possessive)} symptoms.
        ${escapeHtml(specialist.shortName)} will confirm on WhatsApp before anything ships.
      </p>
    </section>`;
}

function renderWellnessBeforeAfter(config) {
  return `
    <div class="wellness-ba-hero" aria-label="Before and after recovery">
      <div class="wellness-ba-card wellness-ba-card--before">
        <div class="wellness-ba-image-wrap">
          <img class="wellness-ba-image" src="${config.beforeImage}" alt="" loading="lazy" decoding="async" />
          <span class="wellness-ba-tag">${escapeHtml(config.beforeLabel)}</span>
        </div>
        <p class="wellness-ba-caption">${escapeHtml(config.beforeCaption)}</p>
      </div>
      <div class="wellness-ba-divider" aria-hidden="true">
        <span class="wellness-ba-arrow"><i data-lucide="arrow-right"></i></span>
      </div>
      <div class="wellness-ba-card wellness-ba-card--after">
        <div class="wellness-ba-image-wrap">
          <img class="wellness-ba-image" src="${config.afterImage}" alt="" loading="lazy" decoding="async" />
          <span class="wellness-ba-tag wellness-ba-tag--after">${escapeHtml(config.afterLabel)}</span>
        </div>
        <p class="wellness-ba-caption">${escapeHtml(config.afterCaption)}</p>
      </div>
    </div>`;
}

function renderWellnessCheckList(items) {
  return `
    <ul class="wellness-checklist">
      ${items.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}
    </ul>`;
}

function isWellnessPlanEligible() {
  if (resolveYoungUrgency() === "urgent") return false;
  const issues = getSelectedIssueSymptoms();
  if (!issues.length) return isPreventionPath();
  return issues.every((issue) => WELLNESS_ISSUE_IDS.has(issue.id));
}

function getWellnessPlanConfig() {
  const priority = ["skin", "coat", "eyes", "prevention"];
  const issues = getSelectedIssueSymptoms();
  for (const id of priority) {
    if (issues.some((issue) => issue.id === id)) return WELLNESS_PLANS[id];
  }
  if (isPreventionPath()) return WELLNESS_PLANS.prevention;
  return WELLNESS_PLANS.skin;
}

function getYoungSymptomMeta() {
  const id = getPrimaryYoungSymptom()?.id || "prevention";
  return YOUNG_SYMPTOM_META[id] || YOUNG_SYMPTOM_META.prevention;
}

function getSelectedYoungSymptoms() {
  return quizState.youngSymptoms || [];
}

function getSelectedIssueSymptoms() {
  return getSelectedYoungSymptoms().filter((s) => s.id !== "prevention");
}

function getPrimaryYoungSymptom() {
  const issues = getSelectedIssueSymptoms();
  const answers = getYoungDetailAnswers();

  for (const issue of issues) {
    if (YOUNG_URGENT_DETAIL_IDS.has(answers[issue.id]?.id)) return issue;
  }
  for (const issue of issues) {
    if (answers[issue.id]?.id === "refusing") return issue;
  }
  if (issues.length) return issues[0];
  return getSelectedYoungSymptoms()[0] || null;
}

function isYoungSymptomSelected(id) {
  return getSelectedYoungSymptoms().some((s) => s.id === id);
}

function getYoungSymptomTheme(symptomId) {
  const symptom = YOUNG_SYMPTOMS.find((s) => s.id === symptomId);
  return YOUNG_SYMPTOM_THEMES[symptom?.theme || "prevention"];
}

function refreshFlowIcons() {
  if (typeof window.initFelicaIcons === "function") {
    window.initFelicaIcons(assflowMain);
  }
}

// Parent stories shown during the check — matched to question topic and result tier.
const FLOW_STORIES = {
  mochi: {
    before: "Extra water bowls, seemed like nothing",
    after: "Vet confirmed early CKD · stable 2 years on",
    quote: "I'd dismissed the extra water bowls as nothing. The screening gave me the words to ask for bloodwork. That changed everything.",
    who: "Rahul M.",
    cat: "Mochi, 13",
  },
  theo: {
    before: "Drinking more, losing weight. No one said kidneys yet",
    after: "Caught at stage 2 · two years of good days since",
    quote: "The screening flagged changes my vet confirmed weeks later. We started a plan before he ever got sick.",
    who: "Meera K.",
    cat: "Theo, 11",
  },
  pepper: {
    before: "Just wanted peace of mind for an 8-year-old",
    after: "Low score, recheck in 6 months, sleeping better",
    quote: "Simple, honest, and not scary. It told me exactly what to watch and when to act, without guilt-tripping me.",
    who: "Ananya S.",
    cat: "Pepper, 8",
  },
  luna: {
    before: "Didn't know wet food mattered for kidneys",
    after: "Small habit changes · thriving at 3",
    quote: "The prevention check wasn't scary, just practical. We added wet food and I finally feel like I'm ahead of it.",
    who: "Priya N.",
    cat: "Luna, 3",
  },
  milo: {
    before: "Signed up after a friend recommended it",
    after: "Monthly reminders kept us on track",
    quote: "The community nudges are gentle: vet visit reminders, hydration tips, no guilt. Exactly what I needed as a new cat parent.",
    who: "Vikram R.",
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
  assflowProgramLabel.textContent = isYoungFlow() ? "Cat care" : "Cat health screening";
}

function isYoungFlow() {
  return quizState.flowTrack === "young";
}

function isYoungCatAge(years) {
  return years != null && years <= YOUNG_CAT_AGE_MAX;
}

function isPreventionPath() {
  const selected = getSelectedYoungSymptoms();
  return selected.length === 1 && selected[0].id === "prevention";
}

function getYoungConnectStep() {
  if (isPreventionPath()) return 3;
  return 4 + getSelectedIssueSymptoms().length;
}

function getYoungReviewStep() {
  return getYoungConnectStep() + 1;
}

function getYoungPlanStep() {
  return getYoungConnectStep() + 2;
}

function getYoungStepCount() {
  return getYoungPlanStep();
}

function formatYoungStepLabel(step) {
  return `Step ${step} of ${getYoungStepCount()}`;
}

function getYoungDetailAnswers() {
  return quizState.youngDetailAnswers || {};
}

function getIssueDetailAnswer(symptomId) {
  return getYoungDetailAnswers()[symptomId] || null;
}

const YOUNG_URGENT_DETAIL_IDS = new Set(["straining", "four_plus", "limping", "pawing", "both"]);

function getYoungSymptomFromUrl() {
  const concern = getHeroConcernFromUrl();
  const mapped = YOUNG_SYMPTOM_ALIASES[concern];
  if (!mapped) return null;
  return YOUNG_SYMPTOMS.find((s) => s.id === mapped) || null;
}

function getCatDisplayName() {
  const name = quizState.catName?.trim();
  return name || "your cat";
}

function getYoungSymptomLabel() {
  const selected = getSelectedYoungSymptoms();
  if (!selected.length) return "Not specified";
  return selected.map((s) => s.label).join(" · ");
}

function getYoungUrgentReasons() {
  const reasons = [];
  const answers = getYoungDetailAnswers();
  const durationId = quizState.youngDuration?.id;
  const symptomIds = getSelectedIssueSymptoms().map((s) => s.id);

  if (answers.litter?.id === "straining") {
    reasons.push("Straining in the litter box can block urine — this is an emergency in cats.");
  }
  if (answers.vomiting?.id === "four_plus") {
    reasons.push("Frequent vomiting needs same-day assessment.");
  }
  if (answers.mobility?.id === "limping") {
    reasons.push("Limping should be examined in person.");
  }
  if (answers.dental?.id === "pawing") {
    reasons.push("Mouth pain can make cats stop eating quickly.");
  }
  if (answers.hydration?.id === "both") {
    reasons.push("Drinking and peeing more together needs prompt bloodwork.");
  }
  if (answers.appetite?.id === "refusing" && durationId && durationId !== "today") {
    reasons.push("Food refusal that has continued needs an in-person exam.");
  }
  if (symptomIds.length >= 3) {
    reasons.push("Several changes at once usually need a hands-on vet exam.");
  }
  if (
    symptomIds.length >= 2 &&
    (durationId === "one_two_weeks" || durationId === "longer")
  ) {
    reasons.push("Multiple issues lasting weeks should be seen in clinic.");
  }
  if (symptomIds.includes("litter") && symptomIds.includes("hydration")) {
    reasons.push("Litter and drinking changes together need an in-person workup.");
  }

  if (!reasons.length) {
    reasons.push("What you described needs a physical exam — not a phone consultation.");
  }
  return reasons;
}

function resolveYoungUrgency() {
  if (isPreventionPath()) return "prevention";

  const symptomIds = getSelectedIssueSymptoms().map((s) => s.id);
  const durationId = quizState.youngDuration?.id;
  const answers = getYoungDetailAnswers();
  const detailIds = Object.values(answers).map((a) => a?.id).filter(Boolean);

  for (const id of detailIds) {
    if (YOUNG_URGENT_DETAIL_IDS.has(id)) return "urgent";
  }
  if (detailIds.includes("refusing") && durationId && durationId !== "today") return "urgent";

  if (symptomIds.length >= 3) return "urgent";
  if (
    symptomIds.length >= 2 &&
    (durationId === "one_two_weeks" || durationId === "longer")
  ) {
    return "urgent";
  }
  if (durationId === "longer" && symptomIds.some((id) => ["vomiting", "appetite", "litter"].includes(id))) {
    return "urgent";
  }
  if (symptomIds.includes("litter") && symptomIds.includes("hydration")) return "urgent";

  return "consult";
}

function buildYoungCarePlan() {
  const name = getCatDisplayName();
  const age = quizState.age;
  const symptomId = getPrimaryYoungSymptom()?.id || "prevention";
  const durationId = quizState.youngDuration?.id;
  const detailId = getIssueDetailAnswer(symptomId)?.id;
  const meta = getYoungSymptomMeta();
  const isPrevention = isPreventionPath();
  const issues = getSelectedIssueSymptoms();
  const detailAnswers = getYoungDetailAnswers();

  const heard = isPrevention
    ? [`${name} is ${age} ${age === 1 ? "year" : "years"} old`, "Routine prevention check-in"]
    : [
        `${name} is ${age} ${age === 1 ? "year" : "years"} old`,
        ...issues.map((issue) => {
          const detail = detailAnswers[issue.id];
          return detail ? `${issue.label} — ${detail.label}` : issue.label;
        }),
        quizState.youngDuration?.label ? `Overall duration: ${quizState.youngDuration.label}` : null,
      ].filter(Boolean);

  const planBodies = {
    vomiting: {
      once: {
        summary: `${name} vomited once this week — often a hairball or quick stomach upset at this age.`,
        watch: [
          "Withhold food for 4–6 hours, then offer a small bland meal.",
          "Brush more often this week if hairballs are common.",
        ],
        escalate: "See your vet if it happens again within 48 hours or food is refused.",
      },
      two_three: {
        summary: `A few vomiting episodes in a week is worth taking seriously for ${name}.`,
        watch: [
          "Offer smaller meals and note whether water intake is normal.",
          "Check litter — diarrhoea together changes urgency.",
        ],
        escalate: "Book a vet visit within 24–48 hours if vomiting continues.",
      },
      four_plus: {
        summary: `Frequent vomiting in ${name} needs a closer look soon.`,
        watch: [
          "Make sure water is available — don't wait to see if it passes.",
          "Note energy level and whether any food stays down.",
        ],
        escalate: "See your vet today if vomiting is frequent or your cat is lethargic.",
      },
      default: {
        summary: "This pattern is often mild stomach upset in younger cats — but frequency matters.",
        watch: [
          "Skip one meal, then offer a small bland portion if appetite returns.",
          "Note any lethargy, blood in vomit, or refusal to drink.",
        ],
        escalate: "See your vet today if vomiting is frequent, or your cat won't drink or play.",
      },
    },
    appetite: {
      refusing: {
        summary: `${name} refusing food is a signal worth acting on — cats can decline quickly.`,
        watch: [
          "Warm wet food slightly and offer a favourite flavour in small amounts.",
          "Check if vomiting or litter changes started at the same time.",
        ],
        escalate: "See your vet within 24 hours if no food is eaten at all.",
      },
      less: {
        summary: `${name} is eating less than usual — early appetite shifts are easy to miss.`,
        watch: [
          "Track how much is left in the bowl for the next two days.",
          "Try smaller, more frequent meals instead of one large serving.",
        ],
        escalate: "See your vet if intake keeps dropping beyond 48 hours.",
      },
      picky: {
        summary: `${name} seems picky rather than unwell — still worth watching closely.`,
        watch: [
          "Stick to one food type for 3 days before switching again.",
          "Note weight by feel — ribs shouldn't get sharper.",
        ],
        escalate: "See your vet if picky eating lasts more than a week or weight drops.",
      },
      default: {
        summary: "Appetite shifts are easy to miss in cats. Catching them early is worthwhile.",
        watch: [
          "Warm food slightly and offer smaller portions more often.",
          "Check if litter and water habits have changed too.",
        ],
        escalate: "See your vet within 24–48 hours if food refusal continues beyond a day.",
      },
    },
    litter: {
      diarrhoea: {
        summary: `Loose stool in ${name} is often diet or parasites — sometimes both.`,
        watch: [
          "Note colour and frequency for the next 24 hours.",
          "Keep water fresh — dehydration happens fast with diarrhoea.",
        ],
        escalate: "See your vet if diarrhoea lasts more than 48 hours or blood is seen.",
      },
      outside_box: {
        summary: `Litter box accidents in ${name} can be stress — or pain while toileting.`,
        watch: [
          "Add a second litter box in a quiet spot.",
          "Note if straining happens or stool looks abnormal.",
        ],
        escalate: "See your vet promptly if accidents continue or straining is seen.",
      },
      straining: {
        summary: `Straining in the litter box needs attention — especially in male cats.`,
        watch: [
          "Check if any urine is produced at all.",
          "Keep the litter box clean and easy to reach.",
        ],
        escalate: "See your vet today — straining to urinate can be an emergency.",
      },
      default: {
        summary: "Litter and digestion changes can be stress — or something that needs a closer look.",
        watch: [
          "Keep litter clean and note stool consistency for two days.",
          "Make sure water is fresh and easy to reach.",
        ],
        escalate: "See your vet promptly if there's straining, pain, or no urination.",
      },
    },
    skin: {
      seven_days: {
        summary: `${name} has been scratching for about a week — fleas or allergy are the usual causes.`,
        watch: [
          "Check the base of the tail and neck for flea dirt or ticks.",
          "Avoid new treats, detergents, or floor cleaners this week.",
        ],
        escalate: "See your vet if scratching breaks the skin or keeps worsening.",
      },
      one_month: {
        summary: `${name} has been scratching for a month — this needs a proper look, not just home fixes.`,
        watch: [
          "Check all pets in the home for fleas or ticks.",
          "Note if fur is thinning or skin looks red in any spots.",
        ],
        escalate: "Book a vet visit this week — long-term itching rarely settles on its own.",
      },
      sometimes: {
        summary: `${name} scratches on and off — worth watching if it keeps coming back.`,
        watch: [
          "Note what time of day or season scratching is worst.",
          "Check for fleas even if you only see occasional scratching.",
        ],
        escalate: "See your vet if scratching becomes daily or skin looks sore.",
      },
      fleas_one_day: {
        summary: `You just spotted fleas or ticks on ${name} — act quickly before they spread in the home.`,
        watch: [
          "Wash bedding on a hot cycle and vacuum sofas and corners.",
          "Treat all pets in the home — not just the one you noticed.",
        ],
        escalate: "See your vet within 48 hours to choose the right flea or tick treatment.",
      },
      fleas_seven_days: {
        summary: `Fleas or ticks on ${name} for about a week — the home environment needs treating too.`,
        watch: [
          "Comb through the fur with a flea comb over white paper.",
          "Check if anyone else at home has itchy bites.",
        ],
        escalate: "See your vet this week — ticks in particular need proper removal and treatment.",
      },
      fleas_while_ago: {
        summary: `Fleas or ticks on ${name} have been around a while — a full treatment plan is needed.`,
        watch: [
          "Treat the cat, bedding, and floors together — not just one.",
          "Watch for hair loss, scratching, or pale gums from flea load.",
        ],
        escalate: "Book a vet visit soon — long-standing parasites affect health and comfort.",
      },
      scratch_and_fleas: {
        summary: `${name} is scratching and has fleas or ticks — treat both the cat and home together.`,
        watch: [
          "Start flea treatment on all pets — scratching often means fleas are active.",
          "Wash bedding and vacuum corners where your cat rests.",
        ],
        escalate: "See your vet within 48 hours for the right flea or tick treatment.",
      },
      default: {
        summary: `${name} is scratching more than usual — fleas or allergies are the usual causes.`,
        watch: [
          "Check the base of the tail and neck for flea dirt.",
          "Avoid new treats or detergents until you've spoken with a vet.",
        ],
        escalate: "See your vet if skin breaks open or scratching keeps worsening.",
      },
    },
    coat: {
      dull: {
        summary: `${name}'s coat looks dull — often diet, parasites, or early illness showing on the outside.`,
        watch: [
          "Check for fleas at the tail base even if there's no scratching.",
          "Note whether eating and energy are normal too.",
        ],
        escalate: "See your vet if the coat keeps dulling or shedding increases.",
      },
      default: {
        summary: `A change in ${name}'s coat is often the first thing you can see from the outside.`,
        watch: [
          "Photograph the coat in good light to track changes.",
          "Check eating, energy, and litter at the same time.",
        ],
        escalate: "See your vet if the coat keeps thinning or patchy areas spread.",
      },
    },
    eyes: {
      more_than_usual: {
        summary: `${name}'s eyes are tearing more than usual — worth checking if something is irritating them.`,
        watch: [
          "Gently wipe under the eyes with clean water once a day.",
          "Check if face rubbing or scratching has increased.",
        ],
        escalate: "See your vet if tearing is constant, or the eye looks red or swollen.",
      },
      once_week: {
        summary: `Teary eyes or stains about once a week in ${name} — often mild, but track if it's increasing.`,
        watch: [
          "Note if stains are getting darker or spreading below the eye.",
          "Check for dust, new cleaners, or incense at home.",
        ],
        escalate: "See your vet if frequency increases or the eye looks sore.",
      },
      once_in_a_while: {
        summary: `Occasional tear stains in ${name} are common — especially in light-coloured cats.`,
        watch: [
          "Wipe gently when you notice wetness under the eyes.",
          "Photograph once a month to spot any slow changes.",
        ],
        escalate: "See your vet if stains suddenly worsen or the eye looks red.",
      },
      default: {
        summary: `Teary eyes or stains in ${name} are common — sudden changes need a closer look.`,
        watch: [
          "Gently wipe under the eyes with clean water when needed.",
          "Note if ${name} is squinting, rubbing the face, or avoiding light.",
        ],
        escalate: "See your vet if redness, swelling, or sticky discharge appears.",
      },
    },
    behaviour: {
      meowing: {
        summary: `${name} is meowing more than usual — often hunger, pain, or stress.`,
        watch: [
          "Check food, water, and litter box are clean and easy to reach.",
          "Note if meowing is at night or around meal times.",
        ],
        escalate: "See your vet if meowing is constant, especially with not eating or hiding.",
      },
      aggression: {
        summary: `${name} seems more aggressive — pain and fear are common causes in cats.`,
        watch: [
          "Give quiet space — don't force petting or picking up.",
          "Note if aggression started after a diet, visitor, or new pet.",
        ],
        escalate: "See your vet within a few days — sudden aggression often has a physical cause.",
      },
      trying_out: {
        summary: `${name} keeps trying to go outside — common in unneutered cats or when stressed.`,
        watch: [
          "Secure windows and doors — indoor cats can escape quickly.",
          "Note if this started after a neighbour's cat or a heat cycle.",
        ],
        escalate: "Speak to your vet about neutering/spaying if not done — it often helps.",
      },
      hiding: {
        summary: `${name} has been hiding or avoiding people — cats often withdraw when they don't feel right.`,
        watch: [
          "Leave food and water near their hiding spot.",
          "Avoid forcing interaction — watch from a distance.",
        ],
        escalate: "Book a vet visit this week — hiding that persists usually has a physical cause.",
      },
      withdrawn: {
        summary: `${name} isn't acting like themselves — personality shifts often mean discomfort.`,
        watch: [
          "Offer a quiet resting spot and monitor eating and litter.",
          "Note whether withdrawal is constant or only around noise.",
        ],
        escalate: "See your vet if unusual behaviour lasts more than a few days.",
      },
      default: {
        summary: `${name} seems off — stress, pain, or hormones are common reasons.`,
        watch: [
          "Keep food, water, and a quiet resting spot easy to reach.",
          "Note when the behaviour is worst — day or night.",
        ],
        escalate: "See your vet if this lasts more than a few days or eating drops.",
      },
    },
    hydration: {
      drinking: {
        summary: `${name} is drinking more — worth noting even in a young cat.`,
        watch: [
          "Measure roughly how often you refill the water bowl.",
          "Check litter clumps for size and frequency too.",
        ],
        escalate: "See your vet if heavy drinking continues beyond a few days.",
      },
      peeing: {
        summary: `More pee or bigger clumps in the litter box is a change worth following up.`,
        watch: [
          "Note clump size and how often the box is used.",
          "Make sure fresh water is always available.",
        ],
        escalate: "See your vet if litter changes continue or your cat seems uncomfortable.",
      },
      both: {
        summary: `More drinking and peeing together is a pattern that deserves a closer look.`,
        watch: [
          "Track both water bowl refills and litter clumps for 48 hours.",
          "Note appetite and weight by feel.",
        ],
        escalate: "Book a vet visit this week to discuss the pattern.",
      },
      default: {
        summary: `Changes in drinking or peeing are easy to miss — but cats often show illness here first.`,
        watch: [
          "Note water bowl refills and litter clump size for two days.",
          "Watch appetite and energy alongside.",
        ],
        escalate: "See your vet if the pattern continues beyond a week.",
      },
    },
    energy: {
      default: {
        summary: `${name} has less energy than usual — often the first sign something feels off.`,
        watch: [
          "Note whether they rouse for food and favourite sounds.",
          "Check litter and water while they're resting more.",
        ],
        escalate: "See your vet if low energy lasts more than a few days or meals are skipped.",
      },
    },
    dental: {
      default: {
        summary: `Mouth trouble in ${name} can make eating painful before it's obvious.`,
        watch: [
          "Offer soft food and watch for drooling or pawing at the mouth.",
          "Smell breath when your cat yawns or comes close.",
        ],
        escalate: "See your vet within a week — dental pain worsens quickly in cats.",
      },
    },
    mobility: {
      default: {
        summary: `${name} is moving differently — stiffness isn't only an older-cat problem.`,
        watch: [
          "Note whether jumping to favourite spots has stopped.",
          "Keep food, water, and litter easy to reach.",
        ],
        escalate: "See your vet if limping, stiffness, or reluctance to move continues.",
      },
    },
    prevention: {
      default: {
        summary: `No urgent flags for ${name} — a steady prevention rhythm is the right next step.`,
        watch: [
          "Keep wet food in the weekly routine for hydration.",
          "Note appetite, litter, and energy once a month.",
        ],
        escalate: "We'll remind you when it's time for a full chronic screen at age 7.",
      },
    },
  };

  const symptomPlans = planBodies[symptomId] || planBodies.prevention;
  const body = symptomPlans[detailId] || symptomPlans.default;

  if (durationId === "today" && !isPrevention && symptomId !== "behaviour") {
    body.watch = [`Started recently — recheck ${name} closely over the next 24 hours.`, ...body.watch];
  }
  if (durationId === "longer" && !isPrevention) {
    body.escalate = `Because this has gone on longer, ${body.escalate.charAt(0).toLowerCase()}${body.escalate.slice(1)}`;
  }

  const productMap = new Map();
  const symptomSources = isPrevention
    ? [getPrimaryYoungSymptom()].filter(Boolean)
    : getSelectedIssueSymptoms().length
      ? getSelectedIssueSymptoms()
      : [getPrimaryYoungSymptom()].filter(Boolean);
  symptomSources.forEach((symptom) => {
    (YOUNG_SYMPTOM_META[symptom.id]?.products || []).forEach((product) => {
      if (!productMap.has(product.name)) productMap.set(product.name, product);
    });
  });
  const products = [...productMap.values()].slice(0, 4);

  let summary = body.summary;
  if (!isPrevention && issues.length > 1) {
    summary = `You noticed a few changes. Focusing first on what matters most: ${summary}`;
  }

  const urgency = resolveYoungUrgency();

  if (urgency === "urgent") {
    const urgentReasons = getYoungUrgentReasons();
    return {
      heard,
      urgency,
      urgentReasons,
      planTitle: "Go to a vet clinic now",
      summary: `${name} needs an in-person vet visit today. Felica cannot help with urgent cases — please go to a nearby veterinary clinic or emergency vet.`,
      watch: [
        "Leave now for the nearest open veterinary clinic or emergency vet.",
        "If your clinic is closed, go to an emergency vet — don't wait until morning.",
        "Bring notes on when each symptom started and what you've noticed.",
      ],
      escalate: null,
      products: [],
      isPrevention: false,
    };
  }

  return {
    heard,
    ...body,
    summary,
    urgency,
    planTitle: issues.length > 1 ? "Your cat's care plan" : meta.planTitle,
    products: products.length ? products : meta.products,
    isPrevention,
  };
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
  flowTrack: "chronic",
  age: null,
  answers: {},
  youngSymptoms: [],
  youngDuration: null,
  youngDetailAnswers: {},
  catName: null,
  contactMethod: "call",
  whatsappNumber: null,
  screeningResult: null,
};

function resetQuizState() {
  quizState = {
    step: 1,
    flowTrack: catAge != null && isYoungCatAge(catAge) ? "young" : "chronic",
    age: catAge != null ? catAge : null,
    answers: {},
    youngSymptoms: [],
    youngDuration: null,
    youngDetailAnswers: {},
    catName: null,
    contactMethod: "call",
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
      <span class="score-callback-number">You'll get the call from <strong>${FELICA_CALLBACK_NUMBER}</strong> — save the number so you don't miss us.</span>
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
  const terminalStep = isYoungFlow() ? getYoungPlanStep() : getResultStep();
  if (assflowBack) {
    assflowBack.hidden = quizState.step <= 1 || quizState.step === terminalStep;
  }
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
  if (quizState.step <= 1) return;
  quizState.step -= 1;
  renderFlowStep();
}

function renderAgeStep() {
  setFlowProgress(0, getTotalFlowSteps());
  const prefill = quizState.age != null ? quizState.age : "";
  assflowMain.innerHTML = `
    <div class="flow-step">
      <p class="flow-step-label">${formatFlowStepLabel(1, "About your cat")}</p>
      <h1 class="flow-title" id="assflow-title">How old is your cat?</h1>
      <p class="flow-lead">Age helps us choose the right next steps for your cat.</p>
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
    quizState.flowTrack = isYoungCatAge(years) ? "young" : "chronic";
    quizState.youngSymptoms = [];
    quizState.youngDuration = null;
    quizState.youngDetailAnswers = {};
    quizState.catName = null;
    setFlowProgramLabel();
    track("screening_step_completed", {
      step: "age",
      step_index: 1,
      cat_age: years,
      human_age: catToHumanAge(years),
      age_band: ageBandLabel(years),
      flow_track: quizState.flowTrack,
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

function bindYoungPlanHandlers() {
  assflowMain.querySelectorAll("[data-flow-done]").forEach((btn) => {
    btn.addEventListener("click", closeFlow);
  });

  assflowMain.querySelector("[data-wellness-review]")?.addEventListener("click", () => {
    track("cta_clicked", {
      location: "young_wellness_plan",
      intent: "specialist_review_whatsapp",
      cat_age: quizState.age,
      symptoms: getSelectedYoungSymptoms().map((s) => s.id),
      wellness_plan: getWellnessPlanConfig().id,
    });
  });

  assflowMain.querySelector("[data-young-program]")?.addEventListener("click", () => {
    track("cta_clicked", {
      location: "young_wellness_plan",
      intent: "start_treatment_reserve",
      cat_age: quizState.age,
      symptoms: getSelectedYoungSymptoms().map((s) => s.id),
      wellness_plan: getWellnessPlanConfig().id,
    });
  });
}

function renderYoungOptionCards(name, options, savedId, onSelect) {
  return `
    <fieldset class="flow-fieldset young-option-fieldset">
      <legend class="visually-hidden">${name}</legend>
      <div class="young-option-grid">
        ${options
          .map(
            (opt) => `
          <label class="young-option-card">
            <input
              type="radio"
              name="${name}"
              value="${opt.id}"
              data-label="${escapeHtml(opt.label)}"
              ${savedId === opt.id ? "checked" : ""}
            />
            <span class="young-option-card-label">${escapeHtml(opt.label)}</span>
          </label>`
          )
          .join("")}
      </div>
    </fieldset>`;
}

function renderYoungSymptomStep() {
  setFlowProgress(1, getYoungStepCount());
  setFlowProgramLabel();
  const preselected = getYoungSymptomFromUrl();
  if (preselected && !getSelectedYoungSymptoms().length) {
    quizState.youngSymptoms = [{ id: preselected.id, label: preselected.label }];
  }

  const selectedCount = getSelectedIssueSymptoms().length;
  const multiHint =
    selectedCount > 1
      ? `<p class="flow-lead young-issue-multi-hint">You selected ${selectedCount} changes — we'll ask a quick follow-up for each.</p>`
      : "";

  assflowMain.innerHTML = `
    <div class="flow-step young-issue-screen">
      <p class="flow-step-label">${formatYoungStepLabel(2)}</p>
      <h1 class="flow-title" id="assflow-title">What have you noticed?</h1>
      <p class="flow-lead">Tick everything that applies. We'll ask a short follow-up for each.</p>
      ${multiHint}
      <div class="young-issue-list" role="group" aria-label="Changes you've noticed">
        ${YOUNG_SYMPTOMS.map((symptom) => {
          const theme = YOUNG_SYMPTOM_THEMES[symptom.theme];
          const selected = isYoungSymptomSelected(symptom.id) ? " is-selected" : "";
          return `
          <label
            class="young-issue-card young-issue-card--multi${selected}"
            data-symptom-id="${symptom.id}"
            style="--issue-bg:${theme.bg};--issue-icon:${theme.icon};--issue-ring:${theme.ring}"
          >
            <input
              type="checkbox"
              name="young-symptoms"
              value="${symptom.id}"
              data-label="${escapeHtml(symptom.label)}"
              ${selected ? "checked" : ""}
            />
            <span class="young-issue-icon-wrap" aria-hidden="true">
              <i data-lucide="${symptom.icon}"></i>
            </span>
            <span class="young-issue-copy">
              <span class="young-issue-label">${escapeHtml(symptom.label)}</span>
            </span>
            <span class="young-issue-check" aria-hidden="true">
              <i data-lucide="check"></i>
            </span>
          </label>`;
        }).join("")}
      </div>
    </div>
  `;

  const updateContinue = () => {
    setFlowFooter({
      visible: true,
      disabled: getSelectedYoungSymptoms().length === 0,
      label: "Continue",
    });
  };

  refreshFlowIcons();
  updateContinue();

  assflowMain.querySelectorAll('.young-issue-card input[name="young-symptoms"]').forEach((input) => {
    input.addEventListener("change", () => {
      const symptom = YOUNG_SYMPTOMS.find((s) => s.id === input.value);
      if (!symptom) return;

      let next = getSelectedYoungSymptoms().filter((s) => s.id !== symptom.id);
      if (input.checked) {
        if (symptom.id === "prevention") {
          next = [{ id: symptom.id, label: symptom.label }];
        } else {
          next = next.filter((s) => s.id !== "prevention");
          next.push({ id: symptom.id, label: symptom.label });
        }
      }

      quizState.youngSymptoms = next;
      quizState.youngDuration = null;
      quizState.youngDetailAnswers = {};

      const card = input.closest(".young-issue-card");
      card?.classList.toggle("is-selected", input.checked);

      if (symptom.id === "prevention" && input.checked) {
        assflowMain.querySelectorAll('.young-issue-card input[name="young-symptoms"]').forEach((other) => {
          if (other.value !== "prevention") {
            other.checked = false;
            other.closest(".young-issue-card")?.classList.remove("is-selected");
          }
        });
      }

      updateContinue();
      const multiHintEl = assflowMain.querySelector(".young-issue-multi-hint");
      const issueCount = getSelectedIssueSymptoms().length;
      if (issueCount > 1) {
        if (!multiHintEl) {
          const hint = document.createElement("p");
          hint.className = "flow-lead young-issue-multi-hint";
          hint.textContent = `You selected ${issueCount} changes — we'll ask a quick follow-up for each.`;
          assflowMain.querySelector(".flow-lead")?.after(hint);
        } else {
          multiHintEl.textContent = `You selected ${issueCount} changes — we'll ask a quick follow-up for each.`;
        }
        setFlowProgress(1, getYoungStepCount());
        assflowMain.querySelector(".flow-step-label").textContent = formatYoungStepLabel(2);
      } else if (multiHintEl) {
        multiHintEl.remove();
        setFlowProgress(1, getYoungStepCount());
        assflowMain.querySelector(".flow-step-label").textContent = formatYoungStepLabel(2);
      }
    });
  });

  bindFlowContinue(() => {
    if (!getSelectedYoungSymptoms().length) return;
    track("young_symptoms_selected", {
      symptoms: getSelectedYoungSymptoms().map((s) => s.id),
      cat_age: quizState.age,
    });
    quizState.step = 3;
    renderFlowStep();
  });
}

function renderYoungDurationStep() {
  setFlowProgress(2, getYoungStepCount());
  const savedId = quizState.youngDuration?.id || "";
  const issues = getSelectedIssueSymptoms();
  const multiple = issues.length > 1;
  const title = multiple
    ? "How long have you noticed these changes?"
    : getYoungSymptomMeta().durationTitle(getCatDisplayName());
  const lead = multiple
    ? "Even small changes are worth noting when they stick around."
    : getYoungSymptomMeta().durationLead;

  assflowMain.innerHTML = `
    <div class="flow-step young-detail-screen">
      <p class="flow-step-label">${formatYoungStepLabel(3)}</p>
      <h1 class="flow-title" id="assflow-title">${escapeHtml(title)}</h1>
      <p class="flow-lead">${escapeHtml(lead)}</p>
      ${renderYoungOptionCards("young-duration", YOUNG_DURATION_OPTIONS, savedId)}
    </div>
  `;

  setFlowFooter({ visible: false });
  assflowMain.querySelectorAll('input[name="young-duration"]').forEach((input) => {
    input.addEventListener("change", () => {
      quizState.youngDuration = { id: input.value, label: input.dataset.label };
      track("young_step_completed", { step: "duration", value: input.value });
      quizState.step = 4;
      window.setTimeout(renderFlowStep, 220);
    });
  });
}

function renderYoungIssueDetailStep() {
  const issues = getSelectedIssueSymptoms();
  const index = quizState.step - 4;
  const issue = issues[index];

  if (!issue || index >= issues.length) {
    quizState.step = getYoungConnectStep();
    renderFlowStep();
    return;
  }

  const detailQ = YOUNG_DETAIL_QUESTIONS[issue.id];
  if (!detailQ) {
    quizState.step += 1;
    renderFlowStep();
    return;
  }

  const meta = YOUNG_SYMPTOM_META[issue.id] || YOUNG_SYMPTOM_META.prevention;
  const savedId = getIssueDetailAnswer(issue.id)?.id || "";
  const issueNumber = index + 1;
  const issueTotal = issues.length;

  setFlowProgress(quizState.step - 1, getYoungStepCount());

  assflowMain.innerHTML = `
    <div class="flow-step young-detail-screen">
      <p class="flow-step-label">${formatYoungStepLabel(quizState.step)}</p>
      <p class="young-detail-progress">Issue ${issueNumber} of ${issueTotal}</p>
      <p class="young-detail-issue">${escapeHtml(issue.label)}</p>
      <h1 class="flow-title" id="assflow-title">${escapeHtml(meta.detailTitle)}</h1>
      <p class="flow-lead">${escapeHtml(detailQ.lead)}</p>
      ${renderYoungOptionCards(`young-detail-${issue.id}`, detailQ.options, savedId)}
    </div>
  `;

  setFlowFooter({ visible: false });
  assflowMain.querySelectorAll(`input[name="young-detail-${issue.id}"]`).forEach((input) => {
    input.addEventListener("change", () => {
      if (!quizState.youngDetailAnswers) quizState.youngDetailAnswers = {};
      quizState.youngDetailAnswers[issue.id] = {
        id: input.value,
        label: input.dataset.label,
      };
      track("young_step_completed", {
        step: "detail",
        symptom: issue.id,
        value: input.value,
      });
      quizState.step += 1;
      if (
        quizState.step === getYoungConnectStep() &&
        resolveYoungUrgency() === "urgent"
      ) {
        quizState.step = getYoungReviewStep();
      }
      window.setTimeout(renderFlowStep, 220);
    });
  });
}

function renderYoungConnectStep() {
  const connectStep = getYoungConnectStep();
  setFlowProgress(connectStep - 1, getYoungStepCount());
  const catPrefill = quizState.catName || catName || "";
  const method = quizState.contactMethod || "call";
  const isPrevention = isPreventionPath();
  const connectLeads = {
    vomiting: "We'll review the vomiting pattern you described, then call with next steps.",
    appetite: "We'll review what you shared about eating, then reach out with next steps.",
    litter: "We'll review the litter and stool changes you noted, then reach out.",
    skin: "We'll review the scratching or flea issue you described, then reach out with a plan.",
    coat: "We'll review what you noticed about the fur, then reach out with a plan.",
    eyes: "We'll review the teary eyes you described, then reach out with guidance.",
    behaviour: "We'll review the behaviour changes you described, then reach out with next steps.",
    hydration: "We'll review the drinking and peeing changes, then reach out with guidance.",
    energy: "We'll review the energy changes you described, then reach out.",
    dental: "We'll review the mouth trouble you described, then reach out.",
    mobility: "We'll review how movement has changed, then reach out.",
    prevention: "Leave your number — we'll send your prevention plan on WhatsApp.",
  };
  const connectLead = isPrevention
    ? connectLeads.prevention
    : getSelectedIssueSymptoms().length > 1
      ? "We'll review everything you noticed, then reach out with next steps."
      : connectLeads[getPrimaryYoungSymptom()?.id] ||
        "Someone will review what you shared, then reach out.";
  const isLikelyUrgent = !isPrevention && resolveYoungUrgency() === "urgent";

  assflowMain.innerHTML = `
    <div class="flow-step young-connect-step">
      <p class="flow-step-label">${formatYoungStepLabel(connectStep)}</p>
      ${
        isLikelyUrgent
          ? `<div class="young-urgent-inline" role="status">
          <p class="young-urgent-inline-title">This may need an in-person vet today</p>
          <p class="young-urgent-inline-copy">Based on your answers, we'll direct you to a nearby clinic — Felica cannot help with urgent cases.</p>
        </div>`
          : ""
      }
      <h1 class="flow-title" id="assflow-title">${isPrevention ? "Start your prevention plan" : "How should we reach you?"}</h1>
      <p class="flow-lead">${
        isPrevention ? connectLeads.prevention : connectLead
      }</p>

      <form class="young-connect-form" id="young-connect-form" novalidate>
        <label class="flow-age-label" for="young-cat-name">Cat's name</label>
        <input
          class="flow-age-input young-cat-name-input"
          id="young-cat-name"
          type="text"
          value="${escapeHtml(catPrefill)}"
          placeholder="e.g. Mochi"
          autocomplete="off"
        />

        ${
          isPrevention
            ? ""
            : `
        <p class="young-connect-method-label">Preferred contact</p>
        <div class="young-connect-methods">
          <label class="young-connect-method ${method === "call" ? "is-selected" : ""}">
            <input type="radio" name="contact-method" value="call" ${method === "call" ? "checked" : ""} />
            <span class="young-connect-method-title">Call me</span>
            <span class="young-connect-method-note">Usually within 15–30 minutes</span>
          </label>
          <label class="young-connect-method ${method === "whatsapp" ? "is-selected" : ""}">
            <input type="radio" name="contact-method" value="whatsapp" ${method === "whatsapp" ? "checked" : ""} />
            <span class="young-connect-method-title">WhatsApp me</span>
            <span class="young-connect-method-note">Reply on WhatsApp when reviewed</span>
          </label>
        </div>`
        }

        <label class="whatsapp-gate-label" for="young-phone-input">Mobile number</label>
        <div class="whatsapp-gate-input-wrap">
          <span class="whatsapp-gate-prefix" aria-hidden="true">🇮🇳 +91</span>
          <input
            class="whatsapp-gate-input"
            type="tel"
            id="young-phone-input"
            placeholder="9876543210"
            inputmode="numeric"
            maxlength="10"
            autocomplete="tel"
            required
          />
        </div>

        <p class="young-connect-next">
          ${isPrevention ? "We'll follow up on WhatsApp with your plan." : "Next: we prepare a summary from your answers."}
        </p>
        <p class="flow-error" id="young-connect-error" hidden>Enter a valid 10-digit mobile number.</p>
        <button type="submit" class="btn btn-block btn-get-started">${isPrevention ? "Continue" : "Continue"}</button>
      </form>
    </div>
  `;

  setFlowFooter({ visible: false });

  assflowMain.querySelectorAll('input[name="contact-method"]').forEach((input) => {
    input.addEventListener("change", () => {
      quizState.contactMethod = input.value;
      assflowMain.querySelectorAll(".young-connect-method").forEach((el) => {
        el.classList.toggle("is-selected", el.querySelector("input")?.value === input.value);
      });
    });
  });

  const form = assflowMain.querySelector("#young-connect-form");
  form?.addEventListener("submit", (event) => {
    event.preventDefault();
    const phoneInput = form.querySelector("#young-phone-input");
    const nameInput = form.querySelector("#young-cat-name");
    const error = form.querySelector("#young-connect-error");
    const number = phoneInput?.value?.trim();
    const petName = nameInput?.value?.trim();

    if (!number || number.length !== 10 || !/^\d+$/.test(number)) {
      phoneInput?.classList.add("error");
      if (error) error.hidden = false;
      phoneInput?.focus();
      setTimeout(() => phoneInput?.classList.remove("error"), 2000);
      return;
    }

    if (error) error.hidden = true;
    quizState.whatsappNumber = number;
    if (petName) {
      quizState.catName = petName;
      catName = petName;
      try {
        localStorage.setItem(CAT_NAME_KEY, petName);
      } catch (err) {
        /* ignore */
      }
    }

    track("whatsapp_number_collected", {
      cat_age: quizState.age,
      flow_track: "young",
      symptoms: getSelectedYoungSymptoms().map((s) => s.id),
      contact_method: quizState.contactMethod,
    });

    quizState.step = getYoungReviewStep();
    renderFlowStep();
  });
}

function renderYoungReviewStep() {
  const reviewStep = getYoungReviewStep();
  setFlowProgress(reviewStep - 1, getYoungStepCount());
  flowCompleted = false;

  const name = getCatDisplayName();
  const issues = getSelectedIssueSymptoms();
  const detailAnswers = getYoungDetailAnswers();
  const isUrgent = resolveYoungUrgency() === "urgent";

  assflowMain.innerHTML = `
    <div class="flow-step young-review-step${isUrgent ? " young-review-step--urgent" : ""}">
      <p class="flow-step-label">${formatYoungStepLabel(reviewStep)}</p>
      <div class="young-review-card" aria-live="polite">
        <div class="young-review-spinner" aria-hidden="true"></div>
        <h1 class="flow-title" id="assflow-title">${
          isUrgent
            ? "Checking urgency…"
            : `Preparing ${escapeHtml(name)}'s summary`
        }</h1>
        <p class="flow-lead young-review-status">${
          isUrgent
            ? "Your answers suggest an in-person vet visit may be needed."
            : "Reviewing what you shared…"
        }</p>
        <ul class="young-review-checklist">
          ${issues
            .map((issue) => {
              const detail = detailAnswers[issue.id];
              const label = detail ? `${issue.label} — ${detail.label}` : issue.label;
              return `<li class="young-review-item is-done">${escapeHtml(label)}</li>`;
            })
            .join("")}
          ${
            quizState.youngDuration
              ? `<li class="young-review-item is-done">Duration: ${escapeHtml(quizState.youngDuration.label)}</li>`
              : ""
          }
          <li class="young-review-item is-pending">Building next steps</li>
        </ul>
      </div>
    </div>
  `;

  setFlowFooter({ visible: false });

  window.setTimeout(() => {
    const status = assflowMain.querySelector(".young-review-status");
    const pending = assflowMain.querySelector(".young-review-item.is-pending");
    if (status) status.textContent = "Almost ready…";
    if (pending) pending.classList.replace("is-pending", "is-done");
  }, 1200);

  window.setTimeout(() => {
    track("young_review_complete", {
      cat_age: quizState.age,
      symptoms: getSelectedYoungSymptoms().map((s) => s.id),
    });
    quizState.step = getYoungPlanStep();
    renderFlowStep();
  }, 2600);
}

function renderYoungWellnessPlanStep() {
  setFlowProgress(getYoungStepCount() - 1, getYoungStepCount());
  setFlowFooter({ visible: false });
  setFlowProgramLabel();
  flowCompleted = true;

  const name = getCatDisplayName();
  const config = getWellnessPlanConfig();
  const specialist = getWellnessSpecialist(config.id);
  const confirmTitle = getWellnessConfirmTitle(name, specialist);
  const reviewCtaLabel = getWellnessReviewCtaLabel(specialist);
  const payCtaLabel = getWellnessCtaLabel(name);
  const diagnosis = resolveWellnessDiagnosis(config);
  const reasons = buildWellnessRecommendationReasons();
  const phone = quizState.whatsappNumber || "";
  const reviewWhatsAppUrl = buildWellnessReviewWhatsAppUrl({
    name,
    config,
    specialist,
    diagnosis,
    reasons,
  });

  track("young_wellness_plan_viewed", {
    cat_age: quizState.age,
    symptoms: getSelectedYoungSymptoms().map((s) => s.id),
    wellness_plan: config.id,
    specialist: specialist.fullName,
    diagnosis,
    phone_collected: !!phone,
  });

  assflowMain.innerHTML = `
    <div class="flow-step flow-step-result young-plan-step young-wellness-plan">
      <div class="young-care-plan wellness-checkout">
        <h1 class="wellness-checkout-title" id="assflow-title">${escapeHtml(confirmTitle)}</h1>
        <p class="wellness-checkout-lead">
          Based on ${escapeHtml(name === "your cat" ? "your cat's" : `${name}'s`)} symptoms,
          ${escapeHtml(specialist.shortName)} recommends this plan. A specialist confirms it on WhatsApp before treatment starts.
        </p>

        <div class="wellness-trust-banner" role="status">
          <i data-lucide="shield"></i>
          <span>Nothing ships until ${escapeHtml(specialist.shortName)} confirms the plan.</span>
        </div>

        ${renderWellnessSpecialistRx(specialist, name)}

        <section class="wellness-panel wellness-prescription" aria-labelledby="wellness-prescription-title">
          <h2 class="wellness-section-title" id="wellness-prescription-title">Provisional care plan</h2>
          <div class="wellness-rx-rows">
            ${renderWellnessRxRow(
              "Working assessment",
              diagnosis,
              false,
              "Not a diagnosis — confirmed on WhatsApp before treatment starts."
            )}
            ${renderWellnessRxRow("Treatment goal", config.treatmentGoal)}
            ${renderWellnessRxRow("Medication & supplements", config.medications, true)}
            ${renderWellnessRxRow("Duration", config.duration)}
          </div>
        </section>

        <section class="wellness-panel wellness-confirm-journey-section" aria-labelledby="wellness-confirm-journey-title">
          <h2 class="wellness-section-title" id="wellness-confirm-journey-title">What happens next</h2>
          ${renderWellnessConfirmationJourney(specialist, name)}
        </section>

        ${renderWellnessBeforeAfter(config)}

        <section class="wellness-panel wellness-timeline-section" aria-labelledby="wellness-timeline-title">
          <h2 class="wellness-section-title" id="wellness-timeline-title">After confirmation — ${escapeHtml(config.duration)} recovery</h2>
          <p class="wellness-section-sub">What to expect along the way</p>
          ${renderWellnessTimeline(config.timeline)}
        </section>

        <section class="wellness-panel wellness-includes-section" aria-labelledby="wellness-includes-title">
          <h2 class="wellness-section-title" id="wellness-includes-title">What's included each month</h2>
          ${renderWellnessCheckList(config.tangibleIncludes)}
        </section>

        <div class="wellness-price-block">
          <p class="wellness-price-amount">${FELICA_PREVENTION_PROGRAM.price}<span>/${FELICA_PREVENTION_PROGRAM.period}</span></p>
          <p class="wellness-price-note">Charged only after ${escapeHtml(specialist.shortName)} confirms. Nothing ships before that.</p>
        </div>

        <div class="wellness-cta-stack">
          <a
            class="wellness-cta-primary"
            href="${reviewWhatsAppUrl}"
            target="_blank"
            rel="noopener noreferrer"
            data-wellness-review
          >${escapeHtml(reviewCtaLabel)}</a>
          <button type="button" class="wellness-cta-secondary" data-young-program>
            ${escapeHtml(payCtaLabel)} — ${FELICA_PREVENTION_PROGRAM.price}
          </button>
        </div>

        <p class="wellness-checkout-guarantee">
          If ${escapeHtml(specialist.shortName)} finds this isn't the right plan after review, we'll refund you in full.
        </p>

        ${
          phone
            ? `<p class="wellness-contact-phone">We'll reach you at <strong>+91 ${escapeHtml(phone)}</strong> when your case is reviewed.</p>`
            : ""
        }

        <section class="wellness-panel wellness-why-section" aria-labelledby="wellness-why-title">
          <h2 class="wellness-section-title" id="wellness-why-title">Why we recommended this</h2>
          <p class="wellness-why-lead">Based on your answers:</p>
          ${renderWellnessCheckList(reasons)}
          <p class="wellness-reviewed-footnote">
            Prepared by a ${escapeHtml(specialist.reviewTitle)} · confirmed before treatment starts.
          </p>
        </section>

        <button type="button" class="wellness-done-link" data-flow-done>Done for now</button>
        <p class="score-reassure">Not a diagnosis. Your vet makes every treatment decision.</p>
      </div>
    </div>
  `;

  refreshFlowIcons();
  bindYoungPlanHandlers();
}

function renderYoungPlanStep() {
  if (isWellnessPlanEligible()) {
    renderYoungWellnessPlanStep();
    return;
  }

  setFlowProgress(getYoungStepCount() - 1, getYoungStepCount());
  setFlowFooter({ visible: false });
  setFlowProgramLabel();
  flowCompleted = true;

  const plan = buildYoungCarePlan();
  const name = getCatDisplayName();
  const isPrevention = plan.isPrevention;

  track("young_plan_viewed", {
    cat_age: quizState.age,
    symptoms: getSelectedYoungSymptoms().map((s) => s.id),
    prevention: isPrevention,
    urgency: plan.urgency,
  });

  const isUrgent = plan.urgency === "urgent";
  const showFelicaFollowUp = !isPrevention && !isUrgent;

  assflowMain.innerHTML = `
    <div class="flow-step flow-step-result young-plan-step${isUrgent ? " young-plan-step--urgent" : ""}">
      <div class="young-care-plan">
        ${
          isUrgent
            ? `
        <div class="young-urgent-panel" role="alert">
          <p class="young-urgent-eyebrow">Urgent — in-person vet needed</p>
          <h2 class="young-urgent-title" id="assflow-title">${escapeHtml(plan.planTitle)}</h2>
          <p class="young-urgent-lead">${escapeHtml(plan.summary)}</p>
          <ul class="young-urgent-reasons">
            ${(plan.urgentReasons || [])
              .map((reason) => `<li>${escapeHtml(reason)}</li>`)
              .join("")}
          </ul>
          <p class="young-urgent-note">Felica does not provide emergency care or teleconsult for urgent cases.</p>
        </div>`
            : `
        <p class="young-plan-eyebrow">${escapeHtml(name)}'s care plan</p>
        <h2 class="young-plan-title" id="assflow-title">${escapeHtml(plan.planTitle)}</h2>
        <p class="young-plan-summary">${escapeHtml(plan.summary)}</p>`
        }

        <div class="young-plan-section">
          <p class="young-plan-section-title">What we heard</p>
          <ul class="young-plan-heard">
            ${plan.heard.map((line) => `<li>${escapeHtml(line)}</li>`).join("")}
          </ul>
        </div>

        <div class="young-plan-section">
          <p class="young-plan-section-title">${isUrgent ? "What to do right now" : "This week"}</p>
          <ul class="young-plan-list">
            ${plan.watch.map((line) => `<li>${escapeHtml(line)}</li>`).join("")}
          </ul>
        </div>

        ${
          plan.escalate
            ? `<p class="young-plan-escalate">${escapeHtml(plan.escalate)}</p>`
            : ""
        }

        ${
          showFelicaFollowUp
            ? `<p class="young-plan-callback">A feline vet from Felica will ${
                quizState.contactMethod === "whatsapp" ? "message you on WhatsApp" : "call you"
              } at <strong>+91 ${quizState.whatsappNumber}</strong> to walk through your answers. Save <strong>${FELICA_CALLBACK_NUMBER}</strong> so you don't miss us.</p>`
            : ""
        }

        ${
          !isUrgent
            ? `
        <div class="young-plan-products">
          <p class="young-plan-section-title">Ongoing care</p>
          ${plan.products
            .map(
              (product) => `
            <div class="young-plan-product">
              <div class="young-plan-product-copy">
                <p class="young-plan-product-name">${escapeHtml(product.name)}</p>
                <p class="young-plan-product-note">${escapeHtml(product.note)}</p>
              </div>
            </div>`
            )
            .join("")}

          <div class="young-plan-program">
            <p class="young-plan-program-name">${escapeHtml(FELICA_PREVENTION_PROGRAM.name)}</p>
            <p class="young-plan-program-price">${FELICA_PREVENTION_PROGRAM.price}<span>/${FELICA_PREVENTION_PROGRAM.period}</span></p>
            <p class="young-plan-program-note">${escapeHtml(FELICA_PREVENTION_PROGRAM.note)}</p>
            <button type="button" class="btn btn-block btn-get-started" data-young-program>Start prevention program</button>
          </div>
        </div>`
            : ""
        }

        <button type="button" class="btn btn-block ${isUrgent ? "btn-get-started" : "young-plan-done"}" data-flow-done>${
          isUrgent ? "Got it" : "Done for now"
        }</button>
        <p class="score-reassure">Not a diagnosis. Your vet makes every treatment decision.</p>
      </div>
    </div>
  `;

  bindYoungPlanHandlers();
}

function renderYoungFlowStep() {
  const step = quizState.step;

  if (step === 2) {
    renderYoungSymptomStep();
    return;
  }

  if (step === 3) {
    if (isPreventionPath()) renderYoungConnectStep();
    else renderYoungDurationStep();
    return;
  }

  if (isPreventionPath()) {
    if (step === 4) renderYoungReviewStep();
    else if (step === 5) renderYoungPlanStep();
    return;
  }

  if (step >= 4 && step < getYoungConnectStep()) {
    renderYoungIssueDetailStep();
    return;
  }

  if (step === getYoungConnectStep()) {
    if (resolveYoungUrgency() === "urgent") {
      quizState.step = getYoungReviewStep();
      renderYoungFlowStep();
      return;
    }
    renderYoungConnectStep();
    return;
  }

  if (step === getYoungReviewStep()) {
    renderYoungReviewStep();
    return;
  }

  if (step === getYoungPlanStep()) {
    renderYoungPlanStep();
  }
}

function renderFlowStep() {
  updateFlowChrome();

  if (quizState.step === 1) {
    renderAgeStep();
    return;
  }

  if (isYoungFlow()) {
    renderYoungFlowStep();
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
  hero_concern: getHeroConcernFromUrl(),
});

if ("scrollRestoration" in history) {
  history.scrollRestoration = "manual";
}

function resetLandingScroll() {
  const hash = window.location.hash;
  if (!hash || hash === "#top" || hash === "#hero") {
    window.scrollTo(0, 0);
  }
}

resetLandingScroll();
window.addEventListener("load", resetLandingScroll);
window.addEventListener("pageshow", (event) => {
  if (event.persisted) resetLandingScroll();
});

initHeroPersonalization();
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
