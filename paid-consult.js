/**
 * Paid gut consult landing.
 * Lead payload matches picky-eaters (cat, phone, age, Meta attribution).
 * The form CTA uses the existing Razorpay routes and charges Rs. 99.
 * Digi Clinic turns every saved lead into a call, even with no callback window.
 * The lead is posted only after payment is verified.
 */
import { CONSULT_PRICE_INR, CONSULT_PRICE_PAISE } from "./consult-price.js?v=pc17";

const YOUNG_CAT_API_BASE = "https://clinic.tailhealthcare.com";
const META_PIXEL_ID = "1068626952161985";
const WHATSAPP_URL = "https://wa.me/918047285635";

const TESTIMONIALS = [
  {
    text: "My cat had an upset stomach, and I wasn't sure what to do. Being able to speak to a vet from home made the whole process feel less overwhelming.",
    who: "Ananya, Pune. Cat parent to Mochi.",
  },
  {
    text: "As a first-time cat parent, I have a hundred questions! It's nice to have somewhere to turn for quick guidance.",
    who: "Nisha, Chennai. Cat parent to Lulu.",
  },
  {
    text: "Being able to start with an online vet consultation from home is a really convenient option when I have concerns about Luna.",
    who: "Ronak, Kochi. Cat parent to Luna.",
  },
];

/**
 * TODO: fill degree and regNo when Felica publishes them. Do not invent them.
 */
const VET_CREDENTIALS = {
  "dr-shantanu": { degree: "", regNo: "" },
  "dr-ankita": { degree: "", regNo: "" },
};

/** Same age values as picky-eaters: "m1"–"m11" months, "y1"–"y16" years. 16 means 16 or older. */
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

function resolveCatAge(raw) {
  const ageYears = parseCatAgeValue(raw);
  if (ageYears == null) return null;
  return {
    label: formatCatAgeLabel(ageYears),
    age_years: ageYears,
    age_band: ageBandForYears(ageYears),
  };
}

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

let sessionId = "";
const purchaseEventIds = new Set();
let checkoutOpen = false;
let checkoutSettled = false;

function createSessionId() {
  try {
    if (typeof crypto !== "undefined" && crypto.randomUUID) {
      return `fel_${crypto.randomUUID().replace(/-/g, "")}`;
    }
  } catch {
    /* fall through */
  }
  return `fel_${Date.now().toString(36)}${Math.random().toString(36).slice(2, 12)}`;
}

function ensureSessionId() {
  if (!sessionId) sessionId = createSessionId();
  return sessionId;
}

function readCookie(name) {
  const prefix = `${name}=`;
  const row = document.cookie.split("; ").find((part) => part.startsWith(prefix));
  return row ? decodeURIComponent(row.slice(prefix.length)) : "";
}

function clearStoredPriceTest() {
  try {
    localStorage.removeItem("felica-paid-consult-price");
  } catch {
    /* private mode */
  }
  document.cookie = "felica_paid_price=; Path=/; Max-Age=0";
}

function readStoredAttribution() {
  try {
    const parsed = JSON.parse(sessionStorage.getItem(LANDING_ATTR_KEY) || "{}");
    return parsed && typeof parsed === "object" ? parsed : {};
  } catch {
    return {};
  }
}

function captureAttribution() {
  try {
    const params = new URLSearchParams(window.location.search);
    const stored = readStoredAttribution();
    let changed = false;
    LANDING_ATTR_KEYS.forEach((key) => {
      const value = params.get(key)?.trim();
      if (value && !stored[key]) {
        stored[key] = value;
        changed = true;
      }
    });
    if (changed) sessionStorage.setItem(LANDING_ATTR_KEY, JSON.stringify(stored));
  } catch {
    /* private mode */
  }
}

function trafficSource(landing) {
  const utm = String(landing.utm_source || "").trim().toLowerCase();
  if (utm === "meta" || landing.fbclid) return "meta";
  if (landing.gclid || landing.gbraid || landing.wbraid) return "google";
  if (utm) return landing.utm_source.trim();
  return "direct";
}

function metaFbc(landing) {
  const cookie = readCookie("_fbc");
  if (cookie) return cookie;
  const fbclid = landing.fbclid || new URLSearchParams(window.location.search).get("fbclid") || "";
  return fbclid ? `fb.1.${Date.now()}.${fbclid}` : null;
}

function buildAttribution() {
  captureAttribution();
  const landing = readStoredAttribution();
  const attribution = {
    meta_pixel_id: META_PIXEL_ID,
    event_id: ensureSessionId(),
    fbp: readCookie("_fbp") || null,
    fbc: metaFbc(landing),
    event_source_url: String(window.location.href || "").split("#")[0] || null,
    client_user_agent: navigator.userAgent || null,
    traffic_source: trafficSource(landing),
    utm_source: landing.utm_source || null,
    utm_medium: landing.utm_medium || null,
    utm_campaign: landing.utm_campaign || null,
    utm_content: landing.utm_content || null,
    utm_term: landing.utm_term || null,
    fbclid: landing.fbclid || null,
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

function track(event, params, eventId) {
  try {
    if (typeof window.fbq !== "function") return;
    window.fbq("track", event, params, eventId ? { eventID: eventId } : undefined);
  } catch {
    /* pixel must not break booking */
  }
}

function normalizeIndianMobile(raw) {
  let digits = String(raw || "").replace(/\D/g, "");
  if (digits.length >= 12 && digits.startsWith("91")) digits = digits.slice(-10);
  else if (digits.length === 11 && digits.startsWith("0")) digits = digits.slice(1);
  else if (digits.length > 10) digits = digits.slice(-10);
  return digits;
}

function isValidIndianMobile(raw) {
  return /^[6-9]\d{9}$/.test(normalizeIndianMobile(raw));
}

function formatSubmittedAt(date = new Date()) {
  const pad = (n) => String(Math.trunc(Math.abs(n))).padStart(2, "0");
  const offsetMin = -date.getTimezoneOffset();
  const sign = offsetMin >= 0 ? "+" : "-";
  const abs = Math.abs(offsetMin);
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(
    date.getHours()
  )}:${pad(date.getMinutes())}:${pad(date.getSeconds())}${sign}${pad(Math.floor(abs / 60))}:${pad(abs % 60)}`;
}

function formatPhone(digits) {
  return `+91 ${digits.slice(0, 5)} ${digits.slice(5)}`;
}

function showError(message) {
  const error = document.getElementById("pc-error");
  if (!error) return;
  error.hidden = false;
  error.textContent = message;
}

function clearError() {
  const error = document.getElementById("pc-error");
  if (!error) return;
  error.hidden = true;
  error.textContent = "";
}

function buildLead(name, phone, age, price, { orderId = "", paymentId = "", paid = true } = {}) {
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
    pet: {
      name,
      species: "cat",
      age_years: age.age_years,
      age_band: age.age_band,
    },
    triage: { lane: "green", urgency: "consult", urgency_reasons: [] },
    chief_complaint: {
      issue_id: "gut",
      issue_label: "Gut issues",
      issue_label_full: "Gut issues",
    },
    answers: [],
    summary_text: paid
      ? `${name}, ${age.label}. Gut issues. Paid vet call ₹${price}.`
      : `${name}, ${age.label}. Gut issues. Payment not completed.`,
    flags: {
      urgent: false,
      supplement_call: false,
      call_scope: "just_this",
      prevention_only: false,
      follow_up: false,
      paid_consult: paid,
      ...(paid ? {} : { payment_attempted: true }),
    },
    attribution: buildAttribution(),
    payment: paid
      ? {
          status: "paid",
          variant: price,
          price_inr: Number(price),
          currency: "INR",
          order_id: orderId,
          payment_id: paymentId,
        }
      : {
          status: "unpaid",
          variant: price,
          price_inr: Number(price),
          currency: "INR",
          order_id: orderId,
        },
  };
}

function fetchWithTimeout(url, options, ms) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), ms);
  return fetch(url, { ...options, signal: controller.signal }).finally(() => clearTimeout(timer));
}

async function postLead(payload) {
  const response = await fetch(`${YOUNG_CAT_API_BASE}/young-cat`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
    keepalive: true,
  });
  if (!response.ok) {
    const error = new Error("Lead was not saved.");
    error.status = response.status;
    throw error;
  }
  return response.json().catch(() => ({ ok: true }));
}

function loadCheckout() {
  if (window.Razorpay) return Promise.resolve();
  return new Promise((resolve, reject) => {
    const script = document.createElement("script");
    const timer = setTimeout(() => {
      reject(new Error("Payment could not be opened. Please try again."));
    }, 15000);
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    script.onload = () => {
      clearTimeout(timer);
      resolve();
    };
    script.onerror = () => {
      clearTimeout(timer);
      reject(new Error("Payment could not be opened."));
    };
    document.head.appendChild(script);
  });
}

function showConfirmation(name, phone, queued = true) {
  const landing = document.getElementById("pc-landing");
  const confirm = document.getElementById("pc-confirm");
  const line = document.getElementById("pc-confirm-phone");
  const whatsapp = document.getElementById("pc-whatsapp");
  if (line) {
    line.textContent = queued
      ? `You will receive a call from a feline vet on ${formatPhone(phone)} within 15 to 30 minutes.`
      : `Payment was received. We could not book the call automatically. Message us on WhatsApp and a vet will call ${formatPhone(phone)}.`;
  }
  if (whatsapp) {
    const text = `Hi Felica, I booked a vet call for ${name}. What they eat: \nWhen it started: `;
    whatsapp.href = `${WHATSAPP_URL}?text=${encodeURIComponent(text)}`;
  }
  if (landing) landing.hidden = true;
  if (confirm) {
    confirm.hidden = false;
    confirm.style.position = "fixed";
    confirm.style.inset = "0";
    confirm.style.zIndex = "2147483647";
    confirm.style.background = "#fff";
    confirm.style.overflow = "auto";
  }
  document.body.classList.add("pc-is-booked");
  confirm?.scrollIntoView({ block: "start" });
}

function renderReviews() {
  const track = document.getElementById("pc-reviews");
  if (!track) return;
  const buildSet = (hidden) => {
    const set = document.createElement("div");
    set.className = "pc-marquee-set";
    if (hidden) set.setAttribute("aria-hidden", "true");
    TESTIMONIALS.forEach((item) => {
      const quote = document.createElement("blockquote");
      quote.className = "pc-review";
      const text = document.createElement("p");
      text.textContent = item.text;
      const who = document.createElement("footer");
      who.textContent = item.who;
      quote.append(text, who);
      set.append(quote);
    });
    return set;
  };
  track.append(buildSet(false), buildSet(true));
}

function renderVetCredentials() {
  document.querySelectorAll("[data-vet]").forEach((card) => {
    const creds = VET_CREDENTIALS[card.dataset.vet] || {};
    const degree = card.querySelector(".pc-vet-degree");
    const reg = card.querySelector(".pc-vet-reg");
    if (degree && creds.degree) degree.textContent = ` · ${creds.degree}`;
    if (reg && creds.regNo) reg.textContent = `Reg. no. ${creds.regNo}`;
    if (reg && !creds.regNo) reg.hidden = true;
  });
}

function setSubmitBusy(submitBtn, label, busy) {
  if (!submitBtn) return;
  submitBtn.disabled = busy;
  submitBtn.setAttribute("aria-busy", busy ? "true" : "false");
  if (busy) submitBtn.textContent = "Starting payment…";
  else submitBtn.innerHTML = label;
}

function dismissRazorpay() {
  document.querySelectorAll("iframe").forEach((frame) => {
    const src = frame.getAttribute("src") || "";
    const name = frame.getAttribute("name") || "";
    if (!src.includes("razorpay") && !name.includes("razorpay")) return;
    const shell = frame.closest(".razorpay-container") || frame.parentElement;
    shell?.remove();
    frame.remove();
  });
  document.querySelectorAll(".razorpay-container, .razorpay-backdrop").forEach((node) => node.remove());
  document.body.style.removeProperty("overflow");
}

function paymentFailureMessage(reason) {
  if (reason === "payment_risk_check_failed") {
    return "Razorpay blocked this payment, so the booking was not completed. If your bank shows a debit, it should reverse.";
  }
  return "Payment did not go through, so the booking was not completed.";
}

async function lookupOrder(orderId) {
  const response = await fetchWithTimeout(
    "/api/order-status",
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ orderId }),
    },
    8000
  );
  const data = await response.json().catch(() => ({}));
  if (!response.ok) return null;
  if (data.paid && data.paymentId) {
    return { paid: true, orderId: data.orderId || orderId, paymentId: String(data.paymentId) };
  }
  if (data.failed) return { failed: true, reason: String(data.reason || "") };
  return null;
}

async function openCheckout({
  orderId,
  amount,
  currency,
  keyId,
  phone,
  name,
  age,
  price,
  onClose,
  unpaidLeadPost = Promise.resolve(),
}) {
  await loadCheckout();
  const checkoutEventId = `fel_checkout_${ensureSessionId()}`;
  track(
    "InitiateCheckout",
    { value: CONSULT_PRICE_INR, currency: "INR", variant: price },
    checkoutEventId
  );
  checkoutOpen = true;
  checkoutSettled = false;
  let recorded = false;
  let pollTimer = 0;
  const finishFailedCheckout = (reason) => {
    if (recorded) return;
    recorded = true;
    checkoutSettled = true;
    checkoutOpen = false;
    clearInterval(pollTimer);
    dismissRazorpay();
    onClose();
    showError(paymentFailureMessage(reason));
  };
  const recordPaidCheckout = async (paymentId, paidOrderId) => {
    if (recorded) return;
    recorded = true;
    checkoutSettled = true;
    checkoutOpen = false;
    clearInterval(pollTimer);
    dismissRazorpay();
    if (paymentId && !purchaseEventIds.has(paymentId)) {
      purchaseEventIds.add(paymentId);
      track(
        "Purchase",
        {
          value: CONSULT_PRICE_INR,
          currency: "INR",
          content_name: "paid_consult",
          content_category: "paid_consult",
        },
        `fel_purchase_${paymentId}`
      );
    }
    showConfirmation(name, phone);
    onClose();
    await Promise.race([
      unpaidLeadPost,
      new Promise((resolve) => setTimeout(resolve, 30000)),
    ]);
    try {
      await postLead(
        buildLead(name, phone, age, price, {
          orderId: paidOrderId || orderId,
          paymentId,
        })
      );
    } catch (error) {
      console.error("Paid consult lead was not saved.", error);
    }
  };
  const options = {
    key: keyId,
    amount,
    currency: currency || "INR",
    name: "Felica",
    description: "Vet call",
    order_id: orderId,
    prefill: { contact: `+91${phone}` },
    notes: {
      product: "vet_call",
      session_id: ensureSessionId(),
      issue_id: "gut",
    },
    config: {
      display: {
        hide: [
          { method: "card" },
          { method: "netbanking" },
          { method: "wallet" },
          { method: "emi" },
          { method: "paylater" },
          { method: "cardless_emi" },
        ],
      },
    },
    theme: { color: "#6d6589" },
    handler(response) {
      void (async () => {
        try {
          const verified = await fetchWithTimeout(
            "/api/verify-payment",
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                ...response,
                sessionId: ensureSessionId(),
              }),
            },
            15000
          );
          const result = await verified.json().catch(() => ({}));
          if (!verified.ok || !result.ok) throw new Error(result.error || "Payment could not be verified.");
          await recordPaidCheckout(
            String(result.paymentId || response.razorpay_payment_id || ""),
            result.orderId || response.razorpay_order_id || orderId
          );
        } catch (error) {
          if (recorded) return;
          onClose();
          showError(error.message || "Payment could not be verified. Please try again.");
        }
      })();
    },
    modal: {
      ondismiss() {
        void (async () => {
          if (recorded) return;
          const outcome = await lookupOrder(orderId).catch(() => null);
          if (outcome?.paid) {
            await recordPaidCheckout(outcome.paymentId, outcome.orderId);
            return;
          }
          if (outcome?.failed) {
            finishFailedCheckout(outcome.reason);
            return;
          }
          checkoutOpen = false;
          clearInterval(pollTimer);
          onClose();
          showError("Payment was not completed. You can try again.");
        })();
      },
    },
  };
  const checkout = new window.Razorpay(options);
  checkout.on("payment.failed", (response) => {
    const reason = response?.error?.reason || "";
    if (reason === "payment_risk_check_failed") {
      finishFailedCheckout(reason);
      return;
    }
    // A declined attempt can leave the QR up while a later debit still settles.
    // Keep checking the payment record, and only close once that record is final.
  });
  checkout.open();
  const pollStarted = Date.now();
  pollTimer = setInterval(() => {
    if (recorded || Date.now() - pollStarted > 10 * 60 * 1000) {
      clearInterval(pollTimer);
      return;
    }
    void lookupOrder(orderId)
      .then((outcome) => {
        if (outcome?.paid) return recordPaidCheckout(outcome.paymentId, outcome.orderId);
        if (outcome?.failed) finishFailedCheckout(outcome.reason);
      })
      .catch(() => {});
  }, 3000);
}

function bindForm(price) {
  const form = document.getElementById("book");
  const submitBtn = form?.querySelector('button[type="submit"]');
  form?.addEventListener("submit", async (event) => {
    event.preventDefault();
    if (checkoutOpen) return;
    const name = document.getElementById("pc-cat-name")?.value.trim().replace(/\s+/g, " ") || "";
    const ageKey = document.getElementById("pc-age")?.value || "";
    const phoneInput = document.getElementById("pc-phone");
    const phone = normalizeIndianMobile(phoneInput?.value);
    const honeypot = document.getElementById("pc-company")?.value.trim();
    const age = resolveCatAge(ageKey);

    if (honeypot) return;
    if (!name) {
      showError("Enter your cat's name.");
      document.getElementById("pc-cat-name")?.focus();
      return;
    }
    if (!age) {
      showError("Choose your cat's age.");
      document.getElementById("pc-age")?.focus();
      return;
    }
    if (!isValidIndianMobile(phone)) {
      showError("Enter a valid 10-digit mobile number.");
      phoneInput?.focus();
      return;
    }
    if (phoneInput) phoneInput.value = phone;
    clearError();
    const submitLabel = submitBtn ? submitBtn.innerHTML : "";
    const release = () => setSubmitBusy(submitBtn, submitLabel, false);
    setSubmitBusy(submitBtn, submitLabel, true);

    try {
      const orderResponse = await fetchWithTimeout(
        "/api/create-order",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            sessionId: ensureSessionId(),
            phone,
            catName: name,
            issueId: "gut",
          }),
        },
        20000
      );
      const order = await orderResponse.json().catch(() => ({}));
      if (!orderResponse.ok || !order.orderId || !order.keyId) {
        throw new Error(order.error || "Payment could not be started.");
      }
      if (Number(order.amount) !== CONSULT_PRICE_PAISE) {
        throw new Error("Payment could not be started.");
      }
      track("Lead", { content_name: "paid_consult" }, ensureSessionId());
      const unpaidLeadPost = postLead(
        buildLead(name, phone, age, price, { orderId: order.orderId, paid: false })
      ).catch((error) => {
        console.error("Unpaid consult lead was not saved.", error);
      });
      await openCheckout({
        orderId: order.orderId,
        amount: order.amount,
        currency: order.currency,
        keyId: order.keyId,
        phone,
        name,
        age,
        price,
        onClose: release,
        unpaidLeadPost,
      });
    } catch (error) {
      release();
      const timedOut = error?.name === "AbortError";
      showError(
        timedOut
          ? "Payment could not be started. Please try again."
          : error.message || "Something went wrong. Please try again."
      );
    }
  });
}

const price = String(CONSULT_PRICE_INR);
clearStoredPriceTest();
document.documentElement.dataset.price = price;
document.documentElement.classList.remove("pc-price-pending");
renderReviews();
renderVetCredentials();
captureAttribution();
ensureSessionId();
track("PageView", { variant: price }, `fel_page_${ensureSessionId()}`);
bindForm(price);
