/**
 * Picky-eaters campaign landing.
 *
 * Attribution mapping (URL / cookies -> payload.attribution):
 *   utm_source     -> attribution.utm_source
 *   utm_medium     -> attribution.utm_medium
 *   utm_campaign   -> attribution.utm_campaign
 *   utm_content    -> attribution.utm_content
 *   utm_term       -> attribution.utm_term
 *   fbclid         -> attribution.fbclid
 *   _fbp cookie    -> attribution.fbp
 *   _fbc cookie    -> attribution.fbc (or built from fbclid if cookie is missing)
 *   ad_id          -> attribution.ad_id
 *   adset_id       -> attribution.adset_id
 *   campaign_id    -> attribution.campaign_id
 *   traffic_source -> "meta" when utm_source is "meta" or fbclid is present
 *   event_id       -> same value as Pixel Lead eventID
 */

const SUBMIT_ENABLED = true;

const YOUNG_CAT_API_BASE = "https://clinic.tailhealthcare.com";
const META_PIXEL_ID = "1068626952161985";
const LEAD_CONSENT_TEXT =
  "By submitting, you agree that a Felica vet may call you on this number, and that we may send WhatsApp messages about this request.";

/**
 * Fields this page does not collect. Confirm with clinic/ops before SUBMIT_ENABLED = true.
 */
const PICKY_EATERS_CASE_DEFAULTS = {
  triage: {
    // TODO: confirm green is correct for this consult campaign
    lane: "green",
    // TODO: confirm urgency
    urgency: "consult",
    urgency_reasons: [],
  },
  chief_complaint: {
    // TODO: confirm the issue_id the clinic PMS expects
    issue_id: "picky_eating",
    issue_label: "Picky eating",
    issue_label_full: "Picky eating",
  },
  flags: {
    urgent: false,
    // TODO: this campaign is a nutritional / behavioural consult, not a supplement courier call
    supplement_call: false,
    call_scope: "just_this",
    prevention_only: false,
    follow_up: false,
  },
};

const FBCLID_STORAGE_KEY = "felica-fbclid";
const LANDING_ATTR_KEY = "felica-landing-attr";
const LANDING_ATTR_KEYS = [
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_content",
  "utm_term",
  "fbclid",
  "gclid",
  "gbraid",
  "wbraid",
  "ad_id",
  "adset_id",
  "campaign_id",
];
const LEAD_CONVERSION_LOCK_KEY = "felica-lead-conversion-fired";
const LEAD_RATE_KEY = "felica-lead-rate-v1";
const LEAD_RATE_WINDOW_MS = 24 * 60 * 60 * 1000;
const LEAD_MIN_ELAPSED_MS = 2000;
const LEAD_SPAM_ALLOWLIST = new Set(["9884180000"]);
const JUNK_PHONE_NUMBERS = new Set([
  "9999999999",
  "8888888888",
  "7777777777",
  "6666666666",
  "9876543210",
  "9123456789",
  "9000000000",
  "9898989898",
  "9090909090",
]);
const JUNK_CAT_NAMES = new Set([
  "test",
  "testing",
  "asdf",
  "asdfg",
  "qwerty",
  "abc",
  "abcd",
  "name",
  "cat",
  "xxx",
  "aaaa",
  "bbbb",
  "none",
  "na",
  "n/a",
  "null",
  "undefined",
]);

let sessionId = "";
let openedAt = Date.now();
let leadConversionFired = false;
let submitted = false;

function createSessionId() {
  try {
    if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
      return `fel_${crypto.randomUUID().replace(/-/g, "")}`;
    }
  } catch {
    /* fall through */
  }
  return `fel_${Date.now().toString(36)}${Math.random().toString(36).slice(2, 12)}`;
}

function ensureSessionId() {
  if (!sessionId || sessionId.length < 8) sessionId = createSessionId();
  return sessionId;
}

function formatSubmittedAt(date = new Date()) {
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

function readCookieValue(name) {
  try {
    const prefix = `${name}=`;
    const match = document.cookie.split("; ").find((row) => row.startsWith(prefix));
    if (!match) return "";
    return decodeURIComponent(match.slice(prefix.length));
  } catch {
    return "";
  }
}

function readStoredLandingAttribution() {
  try {
    const raw = sessionStorage.getItem(LANDING_ATTR_KEY);
    const parsed = raw ? JSON.parse(raw) : {};
    return parsed && typeof parsed === "object" ? parsed : {};
  } catch {
    return {};
  }
}

function captureLandingAttribution() {
  try {
    const params = new URLSearchParams(window.location.search);
    const stored = readStoredLandingAttribution();
    let changed = false;
    LANDING_ATTR_KEYS.forEach((key) => {
      const value = params.get(key)?.trim();
      if (value && !stored[key]) {
        stored[key] = value;
        changed = true;
      }
    });
    if (stored.fbclid) sessionStorage.setItem(FBCLID_STORAGE_KEY, stored.fbclid);
    if (changed) sessionStorage.setItem(LANDING_ATTR_KEY, JSON.stringify(stored));
  } catch {
    /* private mode */
  }
}

function getStoredFbclid() {
  try {
    return (
      readStoredLandingAttribution().fbclid ||
      sessionStorage.getItem(FBCLID_STORAGE_KEY) ||
      ""
    );
  } catch {
    return "";
  }
}

function getMetaFbp() {
  return readCookieValue("_fbp") || null;
}

function getMetaFbc() {
  const fbc = readCookieValue("_fbc");
  if (fbc) return fbc;
  const fbclid =
    getStoredFbclid() ||
    new URLSearchParams(window.location.search).get("fbclid")?.trim() ||
    "";
  if (!fbclid) return null;
  return `fb.1.${Date.now()}.${fbclid}`;
}

function resolveTrafficSource(landing = readStoredLandingAttribution()) {
  const utm = String(landing.utm_source || "").trim().toLowerCase();
  if (utm === "meta" || landing.fbclid || getStoredFbclid()) return "meta";
  if (landing.gclid || landing.gbraid || landing.wbraid) return "google";
  if (utm) return landing.utm_source.trim();
  return "direct";
}

function buildMetaAttribution() {
  captureLandingAttribution();
  const landing = readStoredLandingAttribution();
  const attribution = {
    meta_pixel_id: META_PIXEL_ID,
    event_id: ensureSessionId(),
    fbp: getMetaFbp(),
    fbc: getMetaFbc(),
    event_source_url: String(window.location.href || "").split("#")[0] || null,
    client_user_agent: navigator.userAgent || null,
    traffic_source: resolveTrafficSource(landing),
    utm_source: landing.utm_source || null,
    utm_medium: landing.utm_medium || null,
    utm_campaign: landing.utm_campaign || null,
    utm_content: landing.utm_content || null,
    utm_term: landing.utm_term || null,
    fbclid: landing.fbclid || getStoredFbclid() || null,
    gclid: landing.gclid || null,
    gbraid: landing.gbraid || null,
    wbraid: landing.wbraid || null,
    ad_id: landing.ad_id || null,
    adset_id: landing.adset_id || null,
    campaign_id: landing.campaign_id || null,
  };
  return Object.fromEntries(
    Object.entries(attribution).filter(([, value]) => value != null && String(value).trim() !== "")
  );
}

function normalizeIndianMobile(raw) {
  let digits = String(raw || "").replace(/\D/g, "");
  if (digits.length >= 12 && digits.startsWith("91")) {
    digits = digits.slice(-10);
  } else if (digits.length === 11 && digits.startsWith("0")) {
    digits = digits.slice(1);
  } else if (digits.length > 10) {
    digits = digits.slice(-10);
  }
  return digits;
}

function isValidIndianMobile(raw) {
  const digits = normalizeIndianMobile(raw);
  return digits.length === 10 && /^[6-9]\d{9}$/.test(digits);
}

function isLeadSpamAllowlisted(phone) {
  return LEAD_SPAM_ALLOWLIST.has(normalizeIndianMobile(phone));
}

function isPlausibleIndianMobile(raw) {
  const digits = normalizeIndianMobile(raw);
  if (!isValidIndianMobile(digits)) return false;
  if (JUNK_PHONE_NUMBERS.has(digits)) return false;
  if (/^(\d)\1{9}$/.test(digits)) return false;
  const ascending = "01234567890123456789";
  const descending = "98765432109876543210";
  if (ascending.includes(digits) || descending.includes(digits)) return false;
  return true;
}

function normalizeCatNameInput(raw) {
  return String(raw || "").trim().replace(/\s+/g, " ");
}

function isPlausibleCatName(raw) {
  const name = normalizeCatNameInput(raw);
  if (!name || name.length < 2 || name.length > 24) return false;
  if (/\s/.test(name)) return false;
  if (!/^[A-Za-z][A-Za-z.'-]*$/.test(name)) return false;
  if (JUNK_CAT_NAMES.has(name.toLowerCase())) return false;
  if (/^(.)\1+$/i.test(name.replace(/[.'-]/g, ""))) return false;
  return true;
}

function getCatNameBlockReason(raw) {
  const name = normalizeCatNameInput(raw);
  if (!name) return "cat_name";
  if (/\s/.test(name)) return "cat_name_multi";
  if (!isPlausibleCatName(name)) return "cat_name";
  return null;
}

function readLeadRateStore() {
  try {
    const raw = localStorage.getItem(LEAD_RATE_KEY);
    const data = raw ? JSON.parse(raw) : { phones: {}, deviceAt: 0 };
    const phones = data?.phones && typeof data.phones === "object" ? data.phones : {};
    const now = Date.now();
    const pruned = {};
    Object.keys(phones).forEach((phone) => {
      const at = Number(phones[phone]) || 0;
      if (at && now - at < LEAD_RATE_WINDOW_MS) pruned[phone] = at;
    });
    const deviceAt = Number(data?.deviceAt) || 0;
    return {
      phones: pruned,
      deviceAt: deviceAt && now - deviceAt < LEAD_RATE_WINDOW_MS ? deviceAt : 0,
    };
  } catch {
    return { phones: {}, deviceAt: 0 };
  }
}

function writeLeadRateStore(store) {
  try {
    localStorage.setItem(LEAD_RATE_KEY, JSON.stringify(store));
  } catch {
    /* ignore quota / private mode */
  }
}

function getLeadRateLimitReason(phone) {
  const digits = normalizeIndianMobile(phone);
  const store = readLeadRateStore();
  if (store.deviceAt) return "rate_device";
  if (digits && store.phones[digits]) return "rate_phone";
  return null;
}

function rememberLeadSubmission(phone) {
  if (isLeadSpamAllowlisted(phone)) return;
  const digits = normalizeIndianMobile(phone);
  const store = readLeadRateStore();
  const now = Date.now();
  store.deviceAt = now;
  if (digits) store.phones[digits] = now;
  writeLeadRateStore(store);
}

function getLeadSpamBlockReason({ honeypot = "", phone = "", catNameValue = "", ageValue = "" } = {}) {
  if (isLeadSpamAllowlisted(phone)) {
    if (!normalizeCatNameInput(catNameValue)) return "cat_name";
    if (parseCatAgeValue(ageValue) == null) return "age";
    if (!isValidIndianMobile(phone)) return "phone";
    return null;
  }
  if (String(honeypot || "").trim()) return "bot_honeypot";
  if (openedAt && Date.now() - openedAt < LEAD_MIN_ELAPSED_MS) return "too_fast";
  const nameReason = getCatNameBlockReason(catNameValue);
  if (nameReason) return nameReason;
  if (parseCatAgeValue(ageValue) == null) return "age";
  if (!isPlausibleIndianMobile(phone)) return "phone";
  const rateReason = getLeadRateLimitReason(phone);
  if (rateReason) return rateReason;
  return null;
}

function leadSpamErrorMessage(reason) {
  switch (reason) {
    case "cat_name_multi":
    case "cat_name":
      return "Enter your cat's name.";
    case "age":
      return "Enter your cat's age.";
    case "too_fast":
      return "Take a moment, then try again.";
    case "rate_phone":
      return "We already have a request from this number. A vet will call you soon.";
    case "rate_device":
      return "You've already submitted recently. A vet will call you soon.";
    case "bot_honeypot":
      return "Something went wrong. Please try again.";
    default:
      return "Enter a valid 10-digit mobile number.";
  }
}

function isCatNameBlockReason(reason) {
  return reason === "cat_name" || reason === "cat_name_multi";
}

/** "m1"–"m11" for months, "y1"–"y16" for years. 16 means 16 or older. */
function parseCatAgeValue(raw) {
  const value = String(raw || "").trim();
  const months = value.match(/^m(\d{1,2})$/);
  if (months) {
    const n = Number(months[1]);
    if (n >= 1 && n <= 11) return n / 12;
    return null;
  }
  const years = value.match(/^y(\d{1,2})$/);
  if (years) {
    const n = Number(years[1]);
    if (n >= 1 && n <= 16) return n;
    return null;
  }
  return null;
}

function ageBandForYears(years) {
  if (years < 1) return "Kitten";
  if (years < 7) return "Adult";
  if (years <= 10) return "Mature";
  if (years <= 14) return "Senior";
  return "Geriatric";
}

function formatCatAgeLabel(years) {
  if (years < 1) {
    const months = Math.max(1, Math.round(years * 12));
    return `${months} ${months === 1 ? "month" : "months"}`;
  }
  const whole = Math.round(years);
  if (whole >= 16) return "16+ years";
  return `${whole} ${whole === 1 ? "year" : "years"}`;
}

function buildPet(name, ageYears) {
  return {
    name,
    species: "cat",
    age_years: ageYears,
    age_band: ageBandForYears(ageYears),
  };
}

function buildPayload(catName, phoneNational, ageYears) {
  const phone = String(phoneNational || "").replace(/\D/g, "");
  const name = catName || null;
  const displayName = name || "your cat";
  const complaint = PICKY_EATERS_CASE_DEFAULTS.chief_complaint;
  const ageLabel = formatCatAgeLabel(ageYears);
  const summaryParts = [
    ageLabel ? `${displayName}, ${ageLabel}` : displayName,
    complaint.issue_label,
    phone ? `Vet call requested at +91 ${phone}` : "Vet call requested",
  ];

  return {
    schema_version: "1.0",
    source: {
      product: "felica",
      channel: "web_screening",
      flow: "young_cat",
      intent: "new",
      session_id: ensureSessionId(),
      submitted_at: formatSubmittedAt(),
    },
    contact: {
      phone_e164: `+91${phone}`,
      phone_national: phone,
      country_code: "91",
      preferred_method: "call",
      callback_window: "15_30_min",
    },
    pet: buildPet(name, ageYears),
    triage: { ...PICKY_EATERS_CASE_DEFAULTS.triage },
    chief_complaint: { ...PICKY_EATERS_CASE_DEFAULTS.chief_complaint },
    answers: [],
    summary_text: summaryParts.join(". ") + ".",
    flags: { ...PICKY_EATERS_CASE_DEFAULTS.flags },
    attribution: buildMetaAttribution(),
  };
}

function hasLeadConversionLock() {
  if (leadConversionFired) return true;
  try {
    return sessionStorage.getItem(LEAD_CONVERSION_LOCK_KEY) === "1";
  } catch {
    return false;
  }
}

function lockLeadConversion() {
  leadConversionFired = true;
  try {
    sessionStorage.setItem(LEAD_CONVERSION_LOCK_KEY, "1");
  } catch {
    /* private mode */
  }
}

function fireLeadPixel() {
  if (hasLeadConversionLock()) return;
  lockLeadConversion();
  try {
    if (typeof window.fbq === "function") {
      window.fbq(
        "track",
        "Lead",
        {
          content_name: "picky_eaters",
          content_category: "picky_eaters_consult",
        },
        { eventID: ensureSessionId() }
      );
    }
  } catch {
    /* pixel must never break the page */
  }
}

async function submitLead(payload) {
  const response = await fetch(`${YOUNG_CAT_API_BASE}/young-cat`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
    mode: "cors",
  });
  if (!response.ok) {
    const error = new Error("Lead submit failed");
    error.status = response.status;
    throw error;
  }
  return response.json().catch(() => ({ ok: true }));
}

function showRequestPanel() {
  const panel = document.getElementById("request");
  const thanks = document.getElementById("pe-thanks");
  if (!panel) return;
  panel.hidden = false;
  panel.classList.add("is-open");
  if (!thanks || thanks.hidden) {
    const nameInput = document.getElementById("pe-cat-name");
    nameInput?.focus();
  }
  panel.scrollIntoView({ behavior: "smooth", block: "start" });
}

function showThanks(catName) {
  submitted = true;
  const form = document.getElementById("pe-form");
  const thanks = document.getElementById("pe-thanks");
  const thanksBody = document.getElementById("pe-thanks-body");
  if (form) form.hidden = true;
  if (thanksBody) {
    const safe = catName ? catName : "your cat";
    thanksBody.textContent = `A Felica vet will call you about ${safe}. Please keep your phone close.`;
  }
  if (thanks) thanks.hidden = false;
  document.querySelectorAll("[data-pe-cta]").forEach((btn) => {
    btn.hidden = true;
  });
}

function bindPage() {
  captureLandingAttribution();
  ensureSessionId();
  openedAt = Date.now();

  const consent = document.getElementById("pe-consent");
  if (consent) consent.textContent = LEAD_CONSENT_TEXT;

  document.querySelectorAll("[data-pe-cta]").forEach((btn) => {
    btn.addEventListener("click", () => {
      if (submitted) {
        document.getElementById("request")?.scrollIntoView({ behavior: "smooth", block: "start" });
        return;
      }
      showRequestPanel();
    });
  });

  const form = document.getElementById("pe-form");
  if (!form) return;

  const ageInput = form.querySelector("#pe-age");
  const error = form.querySelector("#pe-error");
  ageInput?.addEventListener("change", () => {
    if (parseCatAgeValue(ageInput.value) == null) return;
    ageInput.classList.remove("error");
    if (error && !error.hidden && error.textContent === leadSpamErrorMessage("age")) {
      error.hidden = true;
    }
  });

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const nameInput = form.querySelector("#pe-cat-name");
    const phoneInput = form.querySelector("#pe-phone");
    const honeypot = form.querySelector("#pe-company");
    const submitBtn = form.querySelector('button[type="submit"]');
    const number = normalizeIndianMobile(phoneInput?.value);
    const petName = normalizeCatNameInput(nameInput?.value);
    const ageYears = parseCatAgeValue(ageInput?.value);

    const blockReason = getLeadSpamBlockReason({
      honeypot: honeypot?.value,
      phone: number,
      catNameValue: petName,
      ageValue: ageInput?.value,
    });
    if (blockReason) {
      if (error) {
        error.hidden = false;
        error.textContent = leadSpamErrorMessage(blockReason);
      }
      const invalidField = isCatNameBlockReason(blockReason)
        ? nameInput
        : blockReason === "age"
          ? ageInput
          : blockReason === "phone"
            ? phoneInput
            : null;
      if (invalidField) {
        invalidField.classList.add("error");
        invalidField.focus();
        setTimeout(() => invalidField.classList.remove("error"), 2000);
      }
      return;
    }

    if (error) error.hidden = true;
    if (phoneInput) phoneInput.value = number;

    const payload = buildPayload(petName, number, ageYears);

    if (!SUBMIT_ENABLED) {
      console.log("[picky-eaters] SUBMIT_ENABLED is false. Payload (not sent):", payload);
      showThanks(petName);
      return;
    }

    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.textContent = "Submitting...";
    }

    submitLead(payload)
      .then(() => {
        rememberLeadSubmission(number);
        fireLeadPixel();
        showThanks(petName);
      })
      .catch(() => {
        if (error) {
          error.hidden = false;
          error.textContent = "Something went wrong. Please try again.";
        }
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.textContent = "Request a vet call";
        }
      });
  });
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", bindPage);
} else {
  bindPage();
}
