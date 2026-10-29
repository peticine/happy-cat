/**
 * Free cat treat request for /picky-eaters.
 * Posts to /api/sample-request. Does not create a young-cat lead.
 *
 * Pixel: PageView stays in the page. A successful save fires trackCustom "SampleRequest"
 * with the same eventID as this session. UTM / fbclid capture is unchanged.
 */

const SAMPLE_DONE_KEY = "felica-sample-request-done";
const SAMPLE_PIXEL_LOCK_KEY = "felica-sample-request-pixel";
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

const THANKS_TEXT =
  "Your cat's treat is on its way. We'll be in touch for the delivery and feedback after your cat has tried it.";
const HOUSEHOLD_TEXT = "Looks like a treat is already on its way to this number. One per household.";
const ADDRESS_WARNING =
  "We couldn't find a house or flat number. Please add it so your treat reaches you.";
const SAVE_FAILED = "Something went wrong. Please try again.";

let sessionId = "";
let samplePixelFired = false;

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

function isValidPincode(raw) {
  return /^\d{6}$/.test(String(raw || "").trim());
}

function catAgeText(amount, unit) {
  const digits = String(amount || "").trim();
  if (!/^\d{1,3}$/.test(digits)) return "";
  const n = Number(digits);
  if (!Number.isInteger(n) || n < 1) return "";
  if (unit === "years") return n === 1 ? "1 year" : `${n} years`;
  if (unit === "months") return n === 1 ? "1 month" : `${n} months`;
  return "";
}

function hasSampleFlag() {
  try {
    return localStorage.getItem(SAMPLE_DONE_KEY) === "1";
  } catch {
    return false;
  }
}

function rememberSampleRequest() {
  try {
    localStorage.setItem(SAMPLE_DONE_KEY, "1");
  } catch {
    /* private mode */
  }
}

function markError(node, on) {
  const target =
    node && node.classList && node.classList.contains("whatsapp-gate-input")
      ? node.closest(".whatsapp-gate-input-wrap") || node
      : node;
  if (!target || !target.classList) return;
  target.classList.toggle("error", Boolean(on));
}

function clearErrors(form) {
  form.querySelectorAll(".error").forEach((node) => node.classList.remove("error"));
}

function showText(node, text) {
  if (!node) return;
  if (!text) {
    node.hidden = true;
    node.textContent = "";
    return;
  }
  node.hidden = false;
  node.textContent = text;
}

function readForm(form) {
  const picky = form.querySelector('input[name="picky_eater"]:checked');
  return {
    catName: form.querySelector("#pe-cat-name")?.value.trim() || "",
    ageAmount: form.querySelector("#pe-age")?.value.trim() || "",
    ageUnit: form.querySelector("#pe-age-unit")?.value || "",
    parentName: form.querySelector("#pe-parent-name")?.value.trim() || "",
    phone: normalizeIndianMobile(form.querySelector("#pe-phone")?.value),
    picky: picky ? picky.value === "yes" : null,
    line1: form.querySelector("#pe-line1")?.value.trim() || "",
    line2: form.querySelector("#pe-line2")?.value.trim() || "",
    city: form.querySelector("#pe-city")?.value.trim() || "",
    pincode: form.querySelector("#pe-pincode")?.value.trim() || "",
    noNumber: Boolean(form.querySelector("#pe-no-number")?.checked),
    honeypot: form.querySelector("#pe-company")?.value || "",
  };
}

function firstProblem(values) {
  if (!values.catName) return { id: "pe-cat-name", message: "Enter your cat's name." };
  if (!catAgeText(values.ageAmount, values.ageUnit)) {
    return { id: "pe-age", message: "Enter your cat's age." };
  }
  if (!values.parentName) return { id: "pe-parent-name", message: "Enter your name." };
  if (!isValidIndianMobile(values.phone)) {
    return { id: "pe-phone", message: "Enter a valid 10-digit mobile number." };
  }
  if (values.picky == null) {
    return { id: "pe-picky-yes", message: "Tell us if your cat is a picky eater." };
  }
  if (!values.line1) {
    return { id: "pe-line1", message: "Enter your flat or house number and building name." };
  }
  if (!/\d/.test(values.line1) && !values.noNumber) {
    return { id: "pe-line1", address: true };
  }
  if (!values.city) return { id: "pe-city", message: "Enter your city." };
  if (!isValidPincode(values.pincode)) {
    return { id: "pe-pincode", message: "Enter a 6-digit pincode." };
  }
  return null;
}

function fireSampleRequestPixel() {
  if (samplePixelFired) return;
  try {
    if (sessionStorage.getItem(SAMPLE_PIXEL_LOCK_KEY) === "1") return;
  } catch {
    /* private mode */
  }
  samplePixelFired = true;
  try {
    sessionStorage.setItem(SAMPLE_PIXEL_LOCK_KEY, "1");
  } catch {
    /* private mode */
  }
  try {
    if (typeof window.fbq === "function") {
      window.fbq(
        "trackCustom",
        "SampleRequest",
        {
          content_name: "picky_eaters",
          content_category: "free_sample",
        },
        { eventID: ensureSessionId() }
      );
    }
  } catch {
    /* pixel must never break the page */
  }
}

function showThanks() {
  const form = document.getElementById("pe-form");
  const title = document.getElementById("pe-hero-title");
  const thanks = document.getElementById("pe-thanks");
  const thanksBody = document.getElementById("pe-thanks-body");
  if (form) form.hidden = true;
  if (title) title.hidden = true;
  if (thanksBody) thanksBody.textContent = THANKS_TEXT;
  if (thanks) thanks.hidden = false;
}

async function postSampleRequest(body) {
  let response;
  try {
    response = await fetch("/api/sample-request", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
  } catch {
    const error = new Error(SAVE_FAILED);
    error.status = 0;
    throw error;
  }
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    const error = new Error(
      typeof data.error === "string" && data.error ? data.error : SAVE_FAILED
    );
    error.status = response.status;
    throw error;
  }
  return data;
}

function refreshAddressWarning(form) {
  const warning = document.getElementById("pe-address-warning");
  const line1 = form.querySelector("#pe-line1")?.value.trim() || "";
  const show = Boolean(line1) && !/\d/.test(line1);
  showText(warning, show ? ADDRESS_WARNING : "");
}

function bindPage() {
  captureLandingAttribution();
  ensureSessionId();

  if (hasSampleFlag()) {
    showThanks();
    return;
  }

  const form = document.getElementById("pe-form");
  if (!form) return;

  const error = document.getElementById("pe-error");
  const submitBtn = form.querySelector('button[type="submit"]');
  const submitLabel = submitBtn ? submitBtn.textContent : "Send my cat's free treat";

  form.querySelector("#pe-line1")?.addEventListener("input", () => refreshAddressWarning(form));

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    if (!submitBtn || submitBtn.disabled) return;
    submitBtn.disabled = true;

    clearErrors(form);
    const values = readForm(form);
    refreshAddressWarning(form);
    const problem = firstProblem(values);
    if (problem) {
      if (problem.address) {
        showText(error, "");
      } else {
        showText(error, problem.message);
      }
      const field = document.getElementById(problem.id);
      markError(field, true);
      field?.focus();
      submitBtn.disabled = false;
      return;
    }

    showText(error, "");
    const phoneInput = form.querySelector("#pe-phone");
    if (phoneInput) phoneInput.value = values.phone;
    submitBtn.textContent = "Sending…";

    try {
      await postSampleRequest({
        parent_name: values.parentName,
        phone: values.phone,
        cat_name: values.catName,
        cat_age_text: catAgeText(values.ageAmount, values.ageUnit),
        picky_eater: values.picky,
        address_line1: values.line1,
        address_line2: values.line2,
        city: values.city,
        pincode: values.pincode,
        honeypot: values.honeypot,
      });
      fireSampleRequestPixel();
      rememberSampleRequest();
      showThanks();
    } catch (err) {
      const status = err && err.status;
      showText(error, status === 409 ? HOUSEHOLD_TEXT : err && err.message ? err.message : SAVE_FAILED);
      submitBtn.disabled = false;
      submitBtn.textContent = submitLabel;
    }
  });
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", bindPage);
} else {
  bindPage();
}
