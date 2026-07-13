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

function createYoungSessionId() {
  try {
    if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
      return `fel_${crypto.randomUUID().replace(/-/g, "")}`;
    }
  } catch (err) {
    /* fall through */
  }
  return `fel_${Date.now().toString(36)}${Math.random().toString(36).slice(2, 12)}`;
}

function ensureYoungSessionId() {
  if (!quizState.sessionId || quizState.sessionId.length < 8) {
    quizState.sessionId = createYoungSessionId();
  }
  return quizState.sessionId;
}

function formatYoungSubmittedAt(date = new Date()) {
  const pad = (n) => String(Math.trunc(Math.abs(n))).padStart(2, "0");
  const offsetMin = -date.getTimezoneOffset();
  const sign = offsetMin >= 0 ? "+" : "-";
  const abs = Math.abs(offsetMin);
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(
    date.getHours()
  )}:${pad(date.getMinutes())}:${pad(date.getSeconds())}${sign}${pad(Math.floor(abs / 60))}:${pad(
    abs % 60
  )}`;
}

function trackYoungCatStep(step, issueId) {
  if (!step) return;
  try {
    const sessionId = ensureYoungSessionId();
    const url = new URL(`${SCREENING_API_BASE}/young-cat/analytics`);
    url.searchParams.set("sessionId", sessionId);
    url.searchParams.set("step", step);
    if (issueId) url.searchParams.set("issueId", issueId);
    fetch(url.toString(), { method: "GET", keepalive: true, mode: "cors" }).catch(() => {});
  } catch (err) {
    /* ignore beacon failures */
  }
}

function buildYoungPmsAnswers(issueId) {
  const followups = getYoungIssueFollowups(issueId);
  const map = getIssueDetailAnswersMap(issueId);
  return followups
    .map((question) => {
      const answer = map[question.id];
      if (!answer?.id) return null;
      return {
        question_id: question.id,
        question: question.title,
        option_id: answer.id,
        answer: answer.label,
      };
    })
    .filter(Boolean);
}

function buildYoungPmsPayload(phoneNational) {
  syncYoungDurationFromAnswers();
  const sessionId = ensureYoungSessionId();
  const issue = getPrimaryYoungSymptom() || YOUNG_SYMPTOMS.find((s) => s.id === "prevention");
  const issueId = issue?.id || "prevention";
  const shortLabel =
    issue?.shortLabel || YOUNG_SYMPTOMS.find((s) => s.id === issueId)?.shortLabel || issueId;
  const fullLabel = issue?.label || shortLabel;
  const urgency = resolveYoungUrgency();
  const urgencyReasons = urgency === "urgent" ? getYoungUrgentReasons() : [];
  const name = quizState.catName?.trim() || null;
  const displayName = name || "your cat";
  const answers = buildYoungPmsAnswers(issueId);
  const answerSummary = answers.map((a) => a.answer).join(" · ");
  const phone = String(phoneNational || quizState.whatsappNumber || "").replace(/\D/g, "");
  const summaryParts = [
    `${displayName === "your cat" ? "Cat" : displayName}, ${quizState.age}y cat`,
    answerSummary ? `${shortLabel} — ${answerSummary}` : shortLabel,
    phone ? `Prefer call within 15–30 min at +91 ${phone}` : "Prefer call within 15–30 min",
  ];

  return {
    schema_version: "1.0",
    source: {
      product: "felica",
      channel: "web_screening",
      flow: "young_cat",
      session_id: sessionId,
      submitted_at: formatYoungSubmittedAt(),
    },
    contact: {
      phone_e164: `+91${phone}`,
      phone_national: phone,
      country_code: "91",
      preferred_method: "call",
      callback_window: "15_30_min",
    },
    pet: {
      name,
      species: "cat",
      age_years: quizState.age,
      age_band: "young",
    },
    triage: {
      urgency: urgency === "prevention" ? "prevention" : urgency === "urgent" ? "urgent" : "consult",
      urgency_reasons: urgencyReasons,
    },
    chief_complaint: {
      issue_id: issueId,
      issue_label: shortLabel,
      issue_label_full: fullLabel,
    },
    answers,
    summary_text: summaryParts.join(". ") + ".",
    flags: {
      urgent: urgency === "urgent",
      prevention_only: issueId === "prevention",
    },
  };
}

async function submitYoungCatLead(phoneNational) {
  const payload = buildYoungPmsPayload(phoneNational);
  const response = await fetch(`${SCREENING_API_BASE}/young-cat`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
    mode: "cors",
  });

  if (!response.ok) {
    const error = new Error("Young cat lead submit failed");
    error.status = response.status;
    throw error;
  }

  const result = await response.json().catch(() => ({ ok: true }));
  quizState.youngLeadResult = result;
  return result;
}

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
  skin: { bg: "#f1eef9", icon: "#7c5cbf", ring: "rgba(124, 92, 191, 0.22)" },
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
    shortLabel: "Eating less",
    icon: "Utensils",
    theme: "appetite",
  },
  {
    id: "hydration",
    label: "My cat is drinking more water or peeing more than usual",
    shortLabel: "Drinking more",
    icon: "Droplets",
    theme: "hydration",
  },
  {
    id: "vomiting",
    label: "My cat is vomiting — food, hairball, or yellow liquid",
    shortLabel: "Vomiting",
    icon: "Wind",
    theme: "gut",
  },
  {
    id: "litter",
    label: "My cat has loose motion (diarrhoea) or is straining in the litter box",
    shortLabel: "Litter box changes",
    icon: "Toilet",
    theme: "litter",
  },
  {
    id: "energy",
    label: "My cat is sleeping more or has low energy",
    shortLabel: "Less active",
    icon: "Moon",
    theme: "behaviour",
  },
  {
    id: "mobility",
    label: "My cat is not jumping or walking properly — limping or stiff",
    shortLabel: "Limping",
    icon: "Activity",
    theme: "mobility",
  },
  {
    id: "behaviour",
    label: "My cat seems off — restless, hiding, irritable, or aggressive",
    shortLabel: "Behaviour change",
    icon: "Cat",
    theme: "mood",
  },
  {
    id: "eyes",
    label: "My cat has teary eyes or eye stains",
    shortLabel: "Teary eyes",
    icon: "Eye",
    theme: "eyes",
  },
  {
    id: "skin",
    label: "My cat is scratching a lot, or has fleas/ticks/lice",
    shortLabel: "Scratching",
    icon: "Bug",
    theme: "skin",
  },
  {
    id: "coat",
    label: "My cat's fur looks dull, dry, or is falling out",
    shortLabel: "Dull coat",
    icon: "Sparkles",
    theme: "coat",
  },
  {
    id: "dental",
    label: "My cat has bad breath or difficulty chewing food",
    shortLabel: "Bad breath",
    icon: "Stethoscope",
    theme: "dental",
  },
  {
    id: "prevention",
    label: "Nothing wrong — I just want a routine health check",
    shortLabel: "Routine check-up",
    icon: "ListChecks",
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
    detailTitle: "How is eating right now?",
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
    detailTitle: "What changed?",
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
    detailTitle: "What's going on?",
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
    detailTitle: "How do the eyes look?",
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
    detailTitle: "Main change?",
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
    detailTitle: "What changed in the fur?",
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
    detailTitle: "What did you notice?",
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
    detailTitle: "What stands out?",
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
    detailTitle: "What else?",
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
    detailTitle: "How is movement?",
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
    detailTitle: "What should we cover on the call?",
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

const YOUNG_ISSUE_FOLLOWUPS = {
  hydration: [
    {
      id: "since_when",
      title: "Since when?",
      options: [
        { id: "today", label: "Just today" },
        { id: "few_days", label: "3–7 days" },
        { id: "one_two_weeks", label: "1–2 weeks" },
        { id: "longer", label: "Longer" },
      ],
    },
    {
      id: "urinating",
      title: "Is your cat also urinating more?",
      options: [
        { id: "yes", label: "Yes" },
        { id: "no", label: "No" },
        { id: "unsure", label: "Not sure" },
      ],
    },
    {
      id: "amount",
      title: "Is your cat drinking a little more or much more?",
      options: [
        { id: "little", label: "A little more" },
        { id: "much", label: "Much more" },
        { id: "unsure", label: "Not sure" },
      ],
    },
  ],
  appetite: [
    {
      id: "how_much",
      title: "How much less?",
      options: [
        { id: "slightly", label: "Slightly less than usual" },
        { id: "half", label: "About half of usual" },
        { id: "very_little", label: "Only a few bites" },
      ],
    },
    {
      id: "since_when",
      title: "Since when?",
      options: [
        { id: "today", label: "Just today" },
        { id: "few_days", label: "3–7 days" },
        { id: "one_two_weeks", label: "1–2 weeks" },
        { id: "longer", label: "Longer" },
      ],
    },
    {
      id: "stopped",
      title: "Has your cat stopped eating completely?",
      options: [
        { id: "no", label: "No — still eating some" },
        { id: "almost", label: "Almost nothing" },
        { id: "refusing", label: "Yes — refusing all food" },
      ],
    },
  ],
  vomiting: [
    {
      id: "times_24h",
      title: "How many times in the last 24 hours?",
      options: [
        { id: "once", label: "Once" },
        { id: "two_three", label: "2–3 times" },
        { id: "four_plus", label: "4 or more times" },
      ],
    },
    {
      id: "what",
      title: "What did they vomit?",
      options: [
        { id: "food", label: "Food" },
        { id: "hairball", label: "Hairball" },
        { id: "yellow", label: "Yellow foam / liquid" },
        { id: "blood", label: "Blood" },
        { id: "unsure", label: "Not sure" },
      ],
    },
    {
      id: "keep_down",
      title: "Can they keep food or water down?",
      options: [
        { id: "yes", label: "Yes" },
        { id: "water_only", label: "Water only" },
        { id: "no", label: "No — keeps coming back up" },
      ],
    },
  ],
  litter: [
    {
      id: "what_changed",
      title: "What changed?",
      options: [
        { id: "diarrhoea", label: "Loose stool / diarrhoea" },
        { id: "constipation", label: "Constipation / hard stool" },
        { id: "peeing_outside", label: "Peeing outside the box" },
        { id: "pooping_outside", label: "Pooping outside the box" },
        { id: "going_more", label: "Going more often" },
      ],
    },
    {
      id: "since_when",
      title: "Since when?",
      options: [
        { id: "today", label: "Just today" },
        { id: "few_days", label: "3–7 days" },
        { id: "one_two_weeks", label: "1–2 weeks" },
        { id: "longer", label: "Longer" },
      ],
    },
    {
      id: "blood_straining",
      title: "Any blood or straining?",
      options: [
        { id: "neither", label: "Neither" },
        { id: "blood", label: "Blood seen" },
        { id: "straining", label: "Straining or crying" },
        { id: "both", label: "Both blood and straining" },
      ],
    },
  ],
  energy: [
    {
      id: "onset",
      title: "Is this sudden or gradual?",
      options: [
        { id: "sudden", label: "Sudden" },
        { id: "gradual", label: "Gradual" },
        { id: "unsure", label: "Not sure" },
      ],
    },
    {
      id: "still_eating",
      title: "Still eating normally?",
      options: [
        { id: "yes", label: "Yes" },
        { id: "less", label: "Eating less" },
        { id: "no", label: "Not eating" },
      ],
    },
    {
      id: "hiding",
      title: "Hiding more than usual?",
      options: [
        { id: "yes", label: "Yes" },
        { id: "no", label: "No" },
        { id: "unsure", label: "Not sure" },
      ],
    },
  ],
  mobility: [
    {
      id: "which_leg",
      title: "Which leg?",
      options: [
        { id: "front_left", label: "Front left" },
        { id: "front_right", label: "Front right" },
        { id: "back_left", label: "Back left" },
        { id: "back_right", label: "Back right" },
        { id: "unsure", label: "Not sure / more than one" },
      ],
    },
    {
      id: "weight_bearing",
      title: "Can they bear weight?",
      options: [
        { id: "yes", label: "Yes — walking on it" },
        { id: "partial", label: "Partially — favouring it" },
        { id: "no", label: "No — not using it" },
      ],
    },
    {
      id: "injury",
      title: "Any recent fall or injury?",
      options: [
        { id: "yes", label: "Yes" },
        { id: "no", label: "No" },
        { id: "unsure", label: "Not sure" },
      ],
    },
  ],
  behaviour: [
    {
      id: "what_changed",
      title: "What's changed?",
      options: [
        { id: "meowing", label: "More meowing" },
        { id: "hiding", label: "Hiding / withdrawn" },
        { id: "aggression", label: "Irritable / aggressive" },
        { id: "trying_out", label: "Trying to go outside" },
        { id: "other", label: "Something else" },
      ],
    },
    {
      id: "since_when",
      title: "Since when?",
      options: [
        { id: "today", label: "Just today" },
        { id: "few_days", label: "3–7 days" },
        { id: "one_two_weeks", label: "1–2 weeks" },
        { id: "longer", label: "Longer" },
      ],
    },
    {
      id: "eating_drinking",
      title: "Eating and drinking normally?",
      options: [
        { id: "yes", label: "Yes" },
        { id: "eating_less", label: "Eating less" },
        { id: "drinking_more", label: "Drinking more" },
        { id: "both_off", label: "Both off" },
      ],
    },
  ],
  dental: [
    {
      id: "difficulty_eating",
      title: "Difficulty eating?",
      options: [
        { id: "no", label: "No" },
        { id: "some", label: "Some difficulty" },
        { id: "yes", label: "Yes — dropping food or chewing oddly" },
      ],
    },
    {
      id: "drooling",
      title: "Drooling?",
      options: [
        { id: "no", label: "No" },
        { id: "yes", label: "Yes" },
        { id: "unsure", label: "Not sure" },
      ],
    },
    {
      id: "gums",
      title: "Swollen or bleeding gums?",
      options: [
        { id: "no", label: "No / haven't checked" },
        { id: "swollen", label: "Swollen" },
        { id: "bleeding", label: "Bleeding" },
        { id: "both", label: "Swollen and bleeding" },
      ],
    },
  ],
  eyes: [
    {
      id: "which_eye",
      title: "One eye or both?",
      options: [
        { id: "one", label: "One eye" },
        { id: "both", label: "Both eyes" },
        { id: "unsure", label: "Not sure" },
      ],
    },
    {
      id: "discharge",
      title: "What colour is the discharge?",
      options: [
        { id: "clear", label: "Clear / watery" },
        { id: "white", label: "White / cloudy" },
        { id: "yellow_green", label: "Yellow / green" },
        { id: "bloody", label: "Bloody" },
        { id: "none", label: "No discharge — just tearing" },
      ],
    },
    {
      id: "squinting",
      title: "Is the eye closed or squinting?",
      options: [
        { id: "no", label: "No — open normally" },
        { id: "squinting", label: "Squinting" },
        { id: "closed", label: "Kept closed" },
      ],
    },
  ],
  skin: [
    {
      id: "where",
      title: "Where are they scratching?",
      options: [
        { id: "head_neck", label: "Head / neck" },
        { id: "back_tail", label: "Back / base of tail" },
        { id: "belly_legs", label: "Belly / legs" },
        { id: "all_over", label: "All over" },
      ],
    },
    {
      id: "hair_redness",
      title: "Any hair loss or redness?",
      options: [
        { id: "neither", label: "Neither" },
        { id: "hair_loss", label: "Hair loss" },
        { id: "redness", label: "Redness" },
        { id: "both", label: "Both" },
      ],
    },
    {
      id: "fleas",
      title: "Fleas seen?",
      options: [
        { id: "yes", label: "Yes" },
        { id: "no", label: "No" },
        { id: "unsure", label: "Not sure" },
      ],
    },
  ],
  coat: [
    {
      id: "hair_loss",
      title: "Hair loss?",
      options: [
        { id: "no", label: "No" },
        { id: "shedding", label: "Shedding more" },
        { id: "patches", label: "Bald patches" },
      ],
    },
    {
      id: "grooming",
      title: "Grooming less?",
      options: [
        { id: "no", label: "No — grooming as usual" },
        { id: "yes", label: "Yes — grooming less" },
        { id: "unsure", label: "Not sure" },
      ],
    },
    {
      id: "weight_loss",
      title: "Weight loss recently?",
      options: [
        { id: "no", label: "No" },
        { id: "yes", label: "Yes" },
        { id: "unsure", label: "Not sure" },
      ],
    },
  ],
  prevention: [
    {
      id: "help_with",
      title: "What would you like help with?",
      options: [
        { id: "preventive", label: "Preventive health" },
        { id: "nutrition", label: "Nutrition" },
        { id: "vaccinations", label: "Vaccinations" },
        { id: "dental", label: "Dental" },
        { id: "behaviour", label: "Behaviour" },
        { id: "general", label: "General advice" },
      ],
    },
  ],
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

/** Young-cat call page always shows Dr. Ankita — partner assigns the real vet. */
function getYoungCallSpecialist() {
  return {
    ...WELLNESS_SPECIALISTS.skin,
    shortName: "Dr. Ankita",
    fullName: "Dr. Ankita Kawale",
    title: "Feline Specialist",
    image: "./images/dr-ankita-kawale.png?v=hc128",
  };
}

function getWellnessRecommendationLead(name, specialist) {
  const possessive = name === "your cat" ? "your cat's" : `${name}'s`;
  return `Based on ${possessive} symptoms, this plan was created by a ${specialist.specialtyNoun}.`;
}

function buildWellnessRecommendationReasons() {
  const reasons = [];
  const issues = getSelectedIssueSymptoms();

  issues.forEach((issue) => {
    if (issue.id === "skin") {
      const fleas = getIssueDetailAnswer("skin", "fleas")?.id;
      const hair = getIssueDetailAnswer("skin", "hair_redness")?.id;
      if (fleas === "yes") reasons.push("Parasites noticed");
      else if (hair === "both" || hair === "hair_loss") reasons.push("Hair loss or redness from scratching");
      else reasons.push("Excess scratching");
    }
    if (issue.id === "coat") {
      const hair = getIssueDetailAnswer("coat", "hair_loss")?.id;
      if (hair === "patches" || hair === "shedding") reasons.push("Mild hair loss");
      else reasons.push("Dull or dry coat");
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

function formatYoungDetailSummary(issueId) {
  const map = getIssueDetailAnswersMap(issueId);
  const parts = Object.values(map)
    .filter((a) => a?.label)
    .map((a) => a.label);
  return parts.join(" · ");
}

function resolveWellnessDiagnosis(config) {
  if (config.id === "skin") {
    const fleas = getIssueDetailAnswer("skin", "fleas")?.id;
    if (fleas === "yes") return config.fleaCondition || config.likelyCondition;
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
  const issue = getPrimaryYoungSymptom();
  const followups = getYoungIssueFollowups(issue?.id);
  return 3 + followups.length; // age=1, issue=2, then N followups, then connect
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

function getYoungIssueFollowups(issueId) {
  if (!issueId) return [];
  return YOUNG_ISSUE_FOLLOWUPS[issueId] || [];
}

function getIssueDetailAnswersMap(symptomId) {
  const raw = getYoungDetailAnswers()[symptomId];
  if (!raw) return {};
  // Support legacy flat { id, label } shape briefly
  if (raw.id && raw.label && !Object.values(raw).some((v) => v && typeof v === "object" && v.id)) {
    return { detail: raw };
  }
  return raw;
}

function getIssueDetailAnswer(symptomId, questionId) {
  const map = getIssueDetailAnswersMap(symptomId);
  if (questionId) return map[questionId] || null;
  const values = Object.values(map).filter(Boolean);
  return values[values.length - 1] || null;
}

function getAllYoungDetailOptionIds() {
  const ids = [];
  Object.values(getYoungDetailAnswers()).forEach((entry) => {
    if (!entry) return;
    if (entry.id) {
      ids.push(entry.id);
      return;
    }
    Object.values(entry).forEach((answer) => {
      if (answer?.id) ids.push(answer.id);
    });
  });
  return ids;
}

function syncYoungDurationFromAnswers() {
  const issue = getPrimaryYoungSymptom();
  if (!issue) return;
  const sinceWhen = getIssueDetailAnswer(issue.id, "since_when");
  if (sinceWhen) {
    quizState.youngDuration = { id: sinceWhen.id, label: sinceWhen.label };
  }
}

const YOUNG_URGENT_CHECKS = [
  { issue: "litter", question: "blood_straining", values: ["straining", "blood", "both"] },
  { issue: "vomiting", question: "times_24h", values: ["four_plus"] },
  { issue: "vomiting", question: "what", values: ["blood"] },
  { issue: "vomiting", question: "keep_down", values: ["no"] },
  { issue: "appetite", question: "stopped", values: ["refusing"] },
  { issue: "mobility", question: "weight_bearing", values: ["no"] },
  { issue: "eyes", question: "squinting", values: ["squinting", "closed"] },
  { issue: "eyes", question: "discharge", values: ["bloody"] },
  { issue: "dental", question: "gums", values: ["bleeding", "both"] },
  { issue: "energy", question: "still_eating", values: ["no"] },
];

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
  const durationId = quizState.youngDuration?.id;
  const symptomIds = getSelectedIssueSymptoms().map((s) => s.id);

  if (getIssueDetailAnswer("litter", "blood_straining")?.id === "straining" ||
      getIssueDetailAnswer("litter", "blood_straining")?.id === "both") {
    reasons.push("Straining in the litter box can block urine — this is an emergency in cats.");
  }
  if (getIssueDetailAnswer("litter", "blood_straining")?.id === "blood") {
    reasons.push("Blood in the litter box needs same-day assessment.");
  }
  if (getIssueDetailAnswer("vomiting", "times_24h")?.id === "four_plus") {
    reasons.push("Frequent vomiting needs same-day assessment.");
  }
  if (getIssueDetailAnswer("vomiting", "what")?.id === "blood") {
    reasons.push("Blood in vomit needs an in-person exam.");
  }
  if (getIssueDetailAnswer("vomiting", "keep_down")?.id === "no") {
    reasons.push("Not keeping food or water down is urgent.");
  }
  if (getIssueDetailAnswer("mobility", "weight_bearing")?.id === "no") {
    reasons.push("Not bearing weight on a leg needs an in-person exam.");
  }
  if (
    getIssueDetailAnswer("eyes", "squinting")?.id === "squinting" ||
    getIssueDetailAnswer("eyes", "squinting")?.id === "closed"
  ) {
    reasons.push("A squinted or closed eye needs an in-person look today.");
  }
  if (getIssueDetailAnswer("eyes", "discharge")?.id === "bloody") {
    reasons.push("Bloody eye discharge needs urgent care.");
  }
  if (
    getIssueDetailAnswer("dental", "gums")?.id === "bleeding" ||
    getIssueDetailAnswer("dental", "gums")?.id === "both"
  ) {
    reasons.push("Bleeding gums need a prompt dental look.");
  }
  if (getIssueDetailAnswer("appetite", "stopped")?.id === "refusing") {
    const since = getIssueDetailAnswer("appetite", "since_when")?.id || durationId;
    if (since && since !== "today") {
      reasons.push("Food refusal that has continued needs an in-person exam.");
    } else if (since === "today") {
      reasons.push("Complete food refusal should be checked the same day if it continues.");
    }
  }
  if (getIssueDetailAnswer("energy", "still_eating")?.id === "no") {
    reasons.push("Low energy with no eating needs prompt assessment.");
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

  syncYoungDurationFromAnswers();
  const symptomIds = getSelectedIssueSymptoms().map((s) => s.id);
  const durationId = quizState.youngDuration?.id;

  for (const check of YOUNG_URGENT_CHECKS) {
    const answer = getIssueDetailAnswer(check.issue, check.question);
    if (answer && check.values.includes(answer.id)) {
      if (check.issue === "appetite" && check.question === "stopped") {
        const since = getIssueDetailAnswer("appetite", "since_when")?.id || durationId;
        if (since === "today") continue;
      }
      return "urgent";
    }
  }

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
  syncYoungDurationFromAnswers();
  const durationId = quizState.youngDuration?.id;
  const planKeyQuestions = {
    vomiting: "times_24h",
    appetite: "stopped",
    litter: "blood_straining",
    hydration: "amount",
    energy: "onset",
    mobility: "weight_bearing",
    behaviour: "what_changed",
    dental: "difficulty_eating",
    eyes: "squinting",
    skin: "fleas",
    coat: "hair_loss",
    prevention: "help_with",
  };
  const detailId =
    getIssueDetailAnswer(symptomId, planKeyQuestions[symptomId])?.id ||
    getIssueDetailAnswer(symptomId)?.id;
  const meta = getYoungSymptomMeta();
  const isPrevention = isPreventionPath();
  const issues = getSelectedIssueSymptoms();

  const heard = isPrevention
    ? [
        `${name} is ${age} ${age === 1 ? "year" : "years"} old`,
        formatYoungDetailSummary("prevention") || "Routine prevention check-in",
      ]
    : [
        `${name} is ${age} ${age === 1 ? "year" : "years"} old`,
        ...issues.map((issue) => {
          const summary = formatYoungDetailSummary(issue.id);
          const short =
            issue.shortLabel ||
            YOUNG_SYMPTOMS.find((s) => s.id === issue.id)?.shortLabel ||
            issue.label;
          return summary ? `${short} — ${summary}` : short;
        }),
        quizState.youngDuration?.label ? `Duration: ${quizState.youngDuration.label}` : null,
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
      favourites: {
        summary: `${name} is only eating favourite foods — still worth watching closely.`,
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
      constipation: {
        summary: `Hard stool or constipation in ${name} needs watching — cats can become uncomfortable fast.`,
        watch: [
          "Offer wet food and fresh water.",
          "Note whether any stool is passed in the next 24 hours.",
        ],
        escalate: "See your vet if no stool is passed for 48 hours or your cat seems painful.",
      },
      peeing_outside: {
        summary: `Litter box accidents in ${name} can be stress — or pain while toileting.`,
        watch: [
          "Add a second litter box in a quiet spot.",
          "Note if straining happens or urine looks abnormal.",
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
      scratching: {
        summary: `${name} is scratching a lot with no fleas seen — allergy or hidden parasites are common.`,
        watch: [
          "Check the base of the tail and neck for flea dirt anyway.",
          "Avoid new treats, detergents, or floor cleaners this week.",
        ],
        escalate: "See your vet if scratching breaks the skin or keeps worsening.",
      },
      fleas: {
        summary: `You spotted fleas or ticks on ${name} — act quickly before they spread in the home.`,
        watch: [
          "Wash bedding on a hot cycle and vacuum sofas and corners.",
          "Treat all pets in the home — not just the one you noticed.",
        ],
        escalate: "See your vet within 48 hours to choose the right flea or tick treatment.",
      },
      both: {
        summary: `${name} is scratching and has parasites — treat both the cat and home together.`,
        watch: [
          "Start flea treatment on all pets — scratching often means fleas are active.",
          "Wash bedding and vacuum corners where your cat rests.",
        ],
        escalate: "See your vet within 48 hours for the right flea or tick treatment.",
      },
      sores: {
        summary: `${name} has bald patches or sores from scratching — the skin needs attention.`,
        watch: [
          "Prevent further licking if you can — a soft collar can help short-term.",
          "Check for fleas even if sores are the main thing you see.",
        ],
        escalate: "Book a vet visit this week — open sores can get infected.",
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
      watery: {
        summary: `${name}'s eyes have clear tears or stains — often mild, but track if it's increasing.`,
        watch: [
          "Gently wipe under the eyes with clean water once a day.",
          "Check if face rubbing or scratching has increased.",
        ],
        escalate: "See your vet if tearing is constant, or the eye looks red or swollen.",
      },
      sticky: {
        summary: `Sticky or coloured discharge from ${name}'s eyes needs a closer look.`,
        watch: [
          "Wipe gently with clean water — don't use human eye drops.",
          "Note whether one eye or both are affected.",
        ],
        escalate: "See your vet within a day or two — sticky discharge can mean infection.",
      },
      red_swollen: {
        summary: `Red or swollen eyes in ${name} need an in-person check.`,
        watch: [
          "Keep ${name} from rubbing the face if you can.",
          "Avoid bright light if they seem uncomfortable.",
        ],
        escalate: "See your vet today — red or swollen eyes shouldn't wait.",
      },
      squinting: {
        summary: `${name} is squinting or keeping an eye shut — that often means pain.`,
        watch: [
          "Don't force the eye open.",
          "Note whether tearing or discharge is present too.",
        ],
        escalate: "See your vet today — a squinted eye needs urgent care.",
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
        summary: `${name} seems more irritable or aggressive — pain and fear are common causes.`,
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
        summary: `${name} has been hiding or withdrawn — cats often withdraw when they don't feel right.`,
        watch: [
          "Leave food and water near their hiding spot.",
          "Avoid forcing interaction — watch from a distance.",
        ],
        escalate: "Book a vet visit this week — hiding that persists usually has a physical cause.",
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
      sleeping: {
        summary: `${name} is sleeping more than usual — often the first sign something feels off.`,
        watch: [
          "Note whether they rouse for food and favourite sounds.",
          "Check litter and water while they're resting more.",
        ],
        escalate: "See your vet if low energy lasts more than a few days or meals are skipped.",
      },
      less_playful: {
        summary: `${name} seems less playful — worth watching alongside appetite and litter.`,
        watch: [
          "Try a short play session and note how quickly they tire.",
          "Check if eating or litter habits shifted too.",
        ],
        escalate: "See your vet if playfulness doesn't return within a few days.",
      },
      tires_quickly: {
        summary: `${name} tires quickly after small activity — energy shouldn't drop this suddenly.`,
        watch: [
          "Keep food, water, and litter easy to reach.",
          "Note breathing and whether they still come for meals.",
        ],
        escalate: "See your vet if this continues or they seem breathless.",
      },
      hiding: {
        summary: `${name} is hiding or not coming out — cats often withdraw when unwell.`,
        watch: [
          "Leave food and water near their spot.",
          "Avoid forcing them out — watch from a distance.",
        ],
        escalate: "Book a vet visit this week if hiding continues.",
      },
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
      breath: {
        summary: `Strong breath in ${name} can mean dental disease starting before obvious pain.`,
        watch: [
          "Smell breath when your cat yawns or comes close.",
          "Note whether eating is still normal.",
        ],
        escalate: "See your vet within a week for a dental check.",
      },
      chewing: {
        summary: `${name} is chewing oddly or dropping food — mouth pain is likely.`,
        watch: [
          "Offer soft food for a day or two.",
          "Watch for drooling or avoiding hard kibble.",
        ],
        escalate: "See your vet soon — chewing changes usually mean discomfort.",
      },
      pawing: {
        summary: `${name} is pawing at the mouth — that often means pain.`,
        watch: [
          "Offer soft food and watch for drooling.",
          "Don't force the mouth open to look.",
        ],
        escalate: "See your vet today or tomorrow — mouth pain can stop eating quickly.",
      },
      gums: {
        summary: `Red or swollen gums in ${name} need a dental look.`,
        watch: [
          "Offer soft food.",
          "Note whether breath is also strong.",
        ],
        escalate: "Book a vet visit this week — gum disease worsens quickly.",
      },
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
      jumping: {
        summary: `${name} isn't jumping like before — joints or pain can show up even in young cats.`,
        watch: [
          "Keep food, water, and litter easy to reach.",
          "Note whether favourite high spots are avoided.",
        ],
        escalate: "See your vet if jumping doesn't return within a few days.",
      },
      stiff: {
        summary: `${name} seems stiff getting up — worth checking before it worsens.`,
        watch: [
          "Watch the first steps after resting.",
          "Keep litter and food on one level if possible.",
        ],
        escalate: "See your vet if stiffness continues or worsens.",
      },
      limping: {
        summary: `${name} is limping or favouring one leg — this needs an in-person exam.`,
        watch: [
          "Limit jumping and stairs for now.",
          "Note which leg and whether swelling is visible.",
        ],
        escalate: "See your vet today — limping shouldn't wait.",
      },
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
      preventive: {
        summary: `No urgent flags for ${name} — we'll cover preventive health on the call.`,
        watch: [
          "Note the last deworming and flea treatment dates if you have them.",
          "Check for flea dirt at the base of the tail before the call.",
        ],
        escalate: "We'll remind you when it's time for a full chronic screen at age 7.",
      },
      nutrition: {
        summary: `No urgent flags for ${name} — we'll cover nutrition on the call.`,
        watch: [
          "Note current food brand and how much is eaten daily.",
          "Feel for ribs — they should be easy to feel under a light fat cover.",
        ],
        escalate: "We'll remind you when it's time for a full chronic screen at age 7.",
      },
      vaccinations: {
        summary: `No urgent flags for ${name} — we'll review vaccinations on the call.`,
        watch: [
          "Have the last vaccine dates ready if you know them.",
          "Note whether ${name} goes outdoors or meets other cats.",
        ],
        escalate: "We'll remind you when it's time for a full chronic screen at age 7.",
      },
      dental: {
        summary: `No urgent flags for ${name} — we'll cover dental care on the call.`,
        watch: [
          "Note any bad breath or chewing changes.",
          "Have recent dental history ready if you know it.",
        ],
        escalate: "We'll remind you when it's time for a full chronic screen at age 7.",
      },
      behaviour: {
        summary: `No urgent flags for ${name} — we'll cover behaviour on the call.`,
        watch: [
          "Note when the behaviour is worst — day or night.",
          "Think about recent home changes that might matter.",
        ],
        escalate: "We'll remind you when it's time for a full chronic screen at age 7.",
      },
      general: {
        summary: `No urgent flags for ${name} — a general advice check-in is the right next step.`,
        watch: [
          "Keep wet food in the weekly routine for hydration.",
          "Note appetite, litter, and energy once a month.",
        ],
        escalate: "We'll remind you when it's time for a full chronic screen at age 7.",
      },
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
  sessionId: null,
  youngLeadResult: null,
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
    sessionId: null,
    youngLeadResult: null,
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

function setFlowFooter({ label = "Next", visible = true, disabled = true, hint = "" } = {}) {
  if (assflowFooter) assflowFooter.hidden = !visible;
  if (assflowContinue) {
    assflowContinue.textContent = label;
    assflowContinue.disabled = disabled;
  }
  const hintEl = document.getElementById("assflow-footer-hint");
  if (hintEl) {
    hintEl.textContent = hint;
    hintEl.hidden = !hint;
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
    quizState.youngLeadResult = null;
    quizState.sessionId = isYoungCatAge(years) ? createYoungSessionId() : null;
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

  assflowMain.innerHTML = `
    <div class="flow-step young-issue-screen">
      <h1 class="flow-title" id="assflow-title">What's changed with your cat?</h1>
      <p class="flow-lead">Choose the main thing you've noticed</p>
      <div class="young-issue-list" role="radiogroup" aria-label="Changes you've noticed">
        ${YOUNG_SYMPTOMS.map((symptom) => {
          const theme = YOUNG_SYMPTOM_THEMES[symptom.theme];
          const selected = isYoungSymptomSelected(symptom.id) ? " is-selected" : "";
          const tileLabel = symptom.shortLabel || symptom.label;
          return `
          <label
            class="young-issue-card young-issue-card--single${selected}"
            data-symptom-id="${symptom.id}"
            style="--issue-bg:${theme.bg};--issue-icon:${theme.icon};--issue-ring:${theme.ring}"
          >
            <input
              type="radio"
              name="young-symptoms"
              value="${symptom.id}"
              data-label="${escapeHtml(symptom.label)}"
              ${selected ? "checked" : ""}
            />
            <span class="young-issue-icon-wrap" aria-hidden="true">
              <i data-lucide="${symptom.icon}"></i>
            </span>
            <span class="young-issue-copy">
              <span class="young-issue-label">${escapeHtml(tileLabel)}</span>
            </span>
          </label>`;
        }).join("")}
      </div>
    </div>
  `;

  setFlowFooter({ visible: false });
  refreshFlowIcons();
  trackYoungCatStep("issue");

  assflowMain.querySelectorAll('.young-issue-card input[name="young-symptoms"]').forEach((input) => {
    input.addEventListener("change", () => {
      const symptom = YOUNG_SYMPTOMS.find((s) => s.id === input.value);
      if (!symptom || !input.checked) return;

      quizState.youngSymptoms = [{ id: symptom.id, label: symptom.label }];
      quizState.youngDuration = null;
      quizState.youngDetailAnswers = {};

      assflowMain.querySelectorAll(".young-issue-card").forEach((card) => {
        card.classList.toggle("is-selected", card.dataset.symptomId === symptom.id);
      });

      track("young_symptoms_selected", {
        symptoms: [symptom.id],
        cat_age: quizState.age,
      });
      quizState.step = 3;
      window.setTimeout(renderFlowStep, 220);
    });
  });
}

function renderYoungIssueDetailStep() {
  const issue = getPrimaryYoungSymptom();
  const followups = getYoungIssueFollowups(issue?.id);
  const questionIndex = quizState.step - 3;
  const question = followups[questionIndex];

  if (!issue || !question) {
    quizState.step = getYoungConnectStep();
    renderFlowStep();
    return;
  }

  const name = getCatDisplayName();
  const savedId = getIssueDetailAnswer(issue.id, question.id)?.id || "";
  const shortLabel =
    issue.shortLabel || YOUNG_SYMPTOMS.find((s) => s.id === issue.id)?.shortLabel || "";
  const lead = (question.lead || "").replace(
    /your cat/gi,
    name === "your cat" ? "your cat" : name
  );

  setFlowProgress(quizState.step - 1, getYoungStepCount());

  assflowMain.innerHTML = `
    <div class="flow-step young-detail-screen">
      <p class="flow-step-label">${formatYoungStepLabel(quizState.step)}</p>
      ${shortLabel ? `<p class="young-detail-issue">${escapeHtml(shortLabel)}</p>` : ""}
      <h1 class="flow-title" id="assflow-title">${escapeHtml(question.title)}</h1>
      ${lead ? `<p class="flow-lead">${escapeHtml(lead)}</p>` : ""}
      ${renderYoungOptionCards(`young-detail-${issue.id}-${question.id}`, question.options, savedId)}
    </div>
  `;

  setFlowFooter({ visible: false });
  trackYoungCatStep(question.id, issue.id);
  assflowMain
    .querySelectorAll(`input[name="young-detail-${issue.id}-${question.id}"]`)
    .forEach((input) => {
      input.addEventListener("change", () => {
        if (!quizState.youngDetailAnswers) quizState.youngDetailAnswers = {};
        if (!quizState.youngDetailAnswers[issue.id] || quizState.youngDetailAnswers[issue.id].id) {
          quizState.youngDetailAnswers[issue.id] = {};
        }
        quizState.youngDetailAnswers[issue.id][question.id] = {
          id: input.value,
          label: input.dataset.label,
        };
        if (question.id === "since_when") {
          quizState.youngDuration = { id: input.value, label: input.dataset.label };
        }
        track("young_step_completed", {
          step: "detail",
          symptom: issue.id,
          question: question.id,
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
  quizState.contactMethod = "call";
  const isPrevention = isPreventionPath();
  const name = getCatDisplayName();
  const possessive = name === "your cat" ? "your cat's" : `${name}'s`;
  const connectLeads = {
    vomiting: `We'll review ${possessive} vomiting pattern, then call with next steps.`,
    appetite: `We'll review what you shared about ${possessive} eating, then call with next steps.`,
    litter: `We'll review the litter changes you noted for ${name}, then call you.`,
    skin: `We'll review ${possessive} scratching or flea issue, then call with a plan.`,
    coat: `We'll review what you noticed about ${possessive} fur, then call with a plan.`,
    eyes: `We'll review ${possessive} teary eyes, then call with guidance.`,
    behaviour: `We'll review the behaviour changes you described, then call with next steps.`,
    hydration: `We'll review ${possessive} drinking and peeing changes, then call with guidance.`,
    energy: `We'll review ${possessive} energy changes, then call you.`,
    dental: `We'll review the mouth trouble you described, then call you.`,
    mobility: `We'll review how ${possessive} movement has changed, then call you.`,
    prevention: `Leave your number — a feline specialist will call with ${possessive} prevention plan.`,
  };
  const issueId = getPrimaryYoungSymptom()?.id || "prevention";
  const connectLead = isPrevention
    ? connectLeads.prevention
    : connectLeads[issueId] || "Someone will review what you shared, then call you.";
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
      <h1 class="flow-title" id="assflow-title">${isPrevention ? "Where should we call you?" : "Where should we call you?"}</h1>
      <p class="flow-lead">${escapeHtml(connectLead)}</p>

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

        <p class="young-connect-next">Usually within 15–30 minutes.</p>
        <p class="flow-error" id="young-connect-error" hidden>Enter a valid 10-digit mobile number.</p>
        <button type="submit" class="btn btn-block btn-get-started">Continue</button>
      </form>
    </div>
  `;

  setFlowFooter({ visible: false });
  trackYoungCatStep("contact", issueId);

  const form = assflowMain.querySelector("#young-connect-form");
  form?.addEventListener("submit", (event) => {
    event.preventDefault();
    const phoneInput = form.querySelector("#young-phone-input");
    const nameInput = form.querySelector("#young-cat-name");
    const error = form.querySelector("#young-connect-error");
    const submitBtn = form.querySelector('button[type="submit"]');
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
    quizState.contactMethod = "call";
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
      contact_method: "call",
      session_id: ensureYoungSessionId(),
    });

    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.textContent = "Submitting…";
    }

    // Show preparing screen immediately; submit lead in the background.
    quizState.step = getYoungReviewStep();
    renderFlowStep();

    submitYoungCatLead(number)
      .then(() => {
        track("young_cat_lead_submitted", {
          session_id: quizState.sessionId,
          issue_id: getPrimaryYoungSymptom()?.id,
          urgency: resolveYoungUrgency(),
          ok: true,
        });
      })
      .catch((err) => {
        track("young_cat_lead_submitted", {
          session_id: quizState.sessionId,
          issue_id: getPrimaryYoungSymptom()?.id,
          urgency: resolveYoungUrgency(),
          ok: false,
          status: err?.status || null,
        });
      });
  });
}

function renderYoungReviewStep() {
  const reviewStep = getYoungReviewStep();
  setFlowProgress(reviewStep - 1, getYoungStepCount());
  flowCompleted = false;

  const name = getCatDisplayName();
  const issues = getSelectedIssueSymptoms();
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
          ${
            isPreventionPath()
              ? `<li class="young-review-item is-done">${escapeHtml(
                  formatYoungDetailSummary("prevention") || "Routine check-up"
                )}</li>`
              : issues
                  .map((issue) => {
                    const summary = formatYoungDetailSummary(issue.id);
                    const short =
                      issue.shortLabel ||
                      YOUNG_SYMPTOMS.find((s) => s.id === issue.id)?.shortLabel ||
                      issue.label;
                    const label = summary ? `${short} — ${summary}` : short;
                    return `<li class="young-review-item is-done">${escapeHtml(label)}</li>`;
                  })
                  .join("")
          }
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

function renderYoungCallPlanStep() {
  setFlowProgress(getYoungStepCount() - 1, getYoungStepCount());
  setFlowFooter({ visible: false });
  setFlowProgramLabel();
  flowCompleted = true;

  const name = getCatDisplayName();
  const possessive = name === "your cat" ? "your cat's" : `${name}'s`;
  const specialist = getYoungCallSpecialist();
  const phone = quizState.whatsappNumber || "";
  const issue = getPrimaryYoungSymptom();
  const issueLabel =
    issue?.shortLabel ||
    YOUNG_SYMPTOMS.find((s) => s.id === issue?.id)?.shortLabel ||
    "your answers";

  track("young_plan_viewed", {
    cat_age: quizState.age,
    symptoms: getSelectedYoungSymptoms().map((s) => s.id),
    specialist: specialist.fullName,
    phone_collected: !!phone,
  });

  assflowMain.innerHTML = `
    <div class="flow-step flow-step-result young-plan-step young-call-plan">
      <div class="young-care-plan young-call-plan-card">
        <h1 class="young-call-plan-title" id="assflow-title">You're all set</h1>
        <p class="young-call-plan-lead">
          A feline specialist will call about ${escapeHtml(possessive)} ${escapeHtml(
            String(issueLabel).toLowerCase()
          )} soon.
        </p>

        <section class="young-call-vet" aria-label="Your specialist">
          <img
            class="young-call-vet-photo"
            src="${specialist.image}"
            alt="${escapeHtml(specialist.fullName)}"
            width="72"
            height="72"
            loading="lazy"
            decoding="async"
          />
          <div class="young-call-vet-meta">
            <p class="young-call-vet-name">${escapeHtml(specialist.fullName)}</p>
            <p class="young-call-vet-title">${escapeHtml(specialist.title)}</p>
            <p class="young-call-vet-when">Usually calls within 15–30 minutes</p>
          </div>
        </section>

        ${
          phone
            ? `<p class="young-call-phone">We'll call <strong>+91 ${escapeHtml(
                phone
              )}</strong> from <strong>${escapeHtml(FELICA_CALLBACK_NUMBER)}</strong></p>`
            : ""
        }

        <section class="young-call-section" aria-labelledby="young-call-on-title">
          <h2 class="young-call-section-title" id="young-call-on-title">On the call</h2>
          <ul class="young-call-list">
            <li>${escapeHtml(specialist.shortName)} reviews what you shared about ${escapeHtml(name)}</li>
            <li>Explains what may be going on in plain language</li>
            <li>Tells you what to do next — at home, or with your local vet</li>
          </ul>
        </section>

        <section class="young-call-section" aria-labelledby="young-call-after-title">
          <h2 class="young-call-section-title" id="young-call-after-title">After the call</h2>
          <ul class="young-call-list">
            <li>You'll get a clear next step for ${escapeHtml(name)}</li>
            <li>If treatment is needed, ${escapeHtml(specialist.shortName)} will walk you through it</li>
            <li>You can ask follow-up questions on the same call</li>
          </ul>
        </section>

        <button type="button" class="btn btn-block young-plan-done" data-flow-done>Done for now</button>
        <p class="score-reassure">Not a diagnosis. Your vet makes every treatment decision.</p>
      </div>
    </div>
  `;

  bindYoungPlanHandlers();
}

function renderYoungPlanStep() {
  const plan = buildYoungCarePlan();
  const isUrgent = plan.urgency === "urgent";

  if (!isUrgent) {
    renderYoungCallPlanStep();
    return;
  }

  setFlowProgress(getYoungStepCount() - 1, getYoungStepCount());
  setFlowFooter({ visible: false });
  setFlowProgramLabel();
  flowCompleted = true;

  track("young_plan_viewed", {
    cat_age: quizState.age,
    symptoms: getSelectedYoungSymptoms().map((s) => s.id),
    prevention: false,
    urgency: "urgent",
  });

  assflowMain.innerHTML = `
    <div class="flow-step flow-step-result young-plan-step young-plan-step--urgent">
      <div class="young-care-plan">
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
        </div>

        <div class="young-plan-section">
          <p class="young-plan-section-title">What to do right now</p>
          <ul class="young-plan-list">
            ${plan.watch.map((line) => `<li>${escapeHtml(line)}</li>`).join("")}
          </ul>
        </div>

        <button type="button" class="btn btn-block btn-get-started" data-flow-done>Got it</button>
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

  if (step >= 3 && step < getYoungConnectStep()) {
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
