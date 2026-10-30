/**
 * Free vet consult landing. Posts to the same young-cat lead endpoint as felica.in.
 *
 * Flip SHOW_SCHEDULE to false to hide "Schedule Free Consultation".
 */
const SHOW_SCHEDULE = true;

const YOUNG_CAT_API_BASE = "https://clinic.tailhealthcare.com";
const META_PIXEL_ID = "1068626952161985";
const GOOGLE_ADS_LEAD_SEND_TO = "AW-18298322041/boF_COGojMscEPn4qJVE";
const LEAD_CONVERSION_LOCK_KEY = "felica-lead-conversion-fired";
const LANDING_ATTR_KEY = "felica-landing-attr";
const FBCLID_STORAGE_KEY = "felica-fbclid";
const SESSION_KEY = "felica-free-consult-session";
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
];
const META_UTM_SOURCES = new Set([
  "ig",
  "fb",
  "an",
  "msg",
  "facebook",
  "instagram",
  "meta",
  "audience_network",
  "audience-network",
]);
const GOOGLE_UTM_SOURCES = new Set([
  "google",
  "googleads",
  "google_ads",
  "google-ads",
  "adwords",
  "youtube",
]);
const CARE_CHECKIN_IDS = new Set(["bathing", "grooming", "dental_care", "second_opinion"]);

/** Live felica.in picker: YOUNG_SYMPTOMS where online and picker is not false. */
const CONCERNS = [
  { id: "skin", short: "Itching", full: "Itching or fleas — cat is otherwise well" },
  { id: "shedding", short: "Hairfall", full: "Shedding more than usual — otherwise well" },
  { id: "coat", short: "Dry coat", full: "Coat looks dull or dry" },
  { id: "vomiting", short: "Hairball", full: "Hairballs — still keeping food down" },
  { id: "dental", short: "Bad breath", full: "Smelly breath — still eating normally" },
  { id: "eating_less", short: "Eating less", full: "Eating less — still eating some food" },
  { id: "general_care", short: "General care", full: "Bathing, grooming, or dental care" },
  { id: "nutrition", short: "Nutrition", full: "Food and nutrition help" },
  { id: "chubby", short: "Getting chubby", full: "A bit overweight — still active" },
  { id: "second_opinion", short: "Second opinion", full: "Want a vet to look at this with you" },
];

const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MONTHS_SHORT = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const MONTHS_LONG = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const STAGES = [
  {
    title: "Kitten",
    range: "under 1 year",
    seen: "Loose stools after a food change, itchy ears or fleas, eating less, scratching.",
    advise: "Safe feeding, deworming and flea questions, and whether a small tummy upset is likely mild.",
    clinic: "Kittens get unwell fast. If a kitten is weak, not feeding or vomiting again and again, go to a clinic now.",
  },
  {
    title: "Young adult",
    range: "1 to 3 years",
    seen: "Itching, hairballs, fussy eating, over-grooming, and a few litter box accidents.",
    advise: "Skin and coat care, grooming routines, diet changes, and settling an anxious cat.",
    clinic: "Straining in the litter box, repeated vomiting, or not eating for a day.",
  },
  {
    title: "Prime adult",
    range: "4 to 6 years",
    seen: "Weight creeping up, a duller coat, bad breath, and less play.",
    advise: "A weight and feeding plan, mouth care, hydration, and what a duller coat can mean.",
    clinic: "Sudden weight change, drinking or peeing a lot more, or a swollen belly.",
  },
  {
    title: "Mature",
    range: "7 to 10 years",
    seen: "Drinking and peeing more, slower jumping, a thinner coat, and sleeping more.",
    advise: "What these changes can point to, which checks to ask your clinic about, and comfort at home.",
    clinic: "Fast weight loss, yellow eyes or gums, or very low energy.",
  },
  {
    title: "Senior",
    range: "11 years and above",
    seen: "Stiff joints, hiding, night yowling, eating less, and breathing faster at rest.",
    advise: "Joint comfort, appetite, hydration, and calmer routines for an older cat.",
    clinic: "Open-mouth breathing, collapse, or not eating or drinking.",
  },
];

const ageState = { years: null, months: null, kitten: false };
const calState = { offset: 0, dateKey: 0, slotKey: "" };
let pendingLead = null;
let submitting = false;

function pad(n) {
  return String(Math.trunc(Math.abs(n))).padStart(2, "0");
}

function readCookie(name) {
  try {
    const prefix = `${name}=`;
    const match = document.cookie.split("; ").find((row) => row.startsWith(prefix));
    return match ? decodeURIComponent(match.slice(prefix.length)) : "";
  } catch {
    return "";
  }
}

function readStore(key) {
  try {
    const raw = sessionStorage.getItem(key);
    const parsed = raw ? JSON.parse(raw) : {};
    return parsed && typeof parsed === "object" ? parsed : {};
  } catch {
    return {};
  }
}

function captureAttribution() {
  try {
    const params = new URLSearchParams(window.location.search);
    const stored = readStore(LANDING_ATTR_KEY);
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

function storedFbclid() {
  try {
    return readStore(LANDING_ATTR_KEY).fbclid || sessionStorage.getItem(FBCLID_STORAGE_KEY) || "";
  } catch {
    return "";
  }
}

function trafficSource(landing) {
  const utm = String(landing.utm_source || "").trim().toLowerCase();
  if (META_UTM_SOURCES.has(utm)) return "meta";
  if (GOOGLE_UTM_SOURCES.has(utm)) return "google";
  if (utm) return landing.utm_source.trim();
  if (landing.gclid || landing.gbraid || landing.wbraid) return "google";
  if (landing.fbclid || storedFbclid()) return "meta";
  return "direct";
}

function metaFbc(landing) {
  const cookie = readCookie("_fbc");
  if (cookie) return cookie;
  const fbclid = landing.fbclid || storedFbclid() || "";
  return fbclid ? `fb.1.${Date.now()}.${fbclid}` : null;
}

function ensureSessionId() {
  try {
    const saved = sessionStorage.getItem(SESSION_KEY);
    if (saved && saved.length >= 8) return saved;
  } catch {
    /* private mode */
  }
  const id = `fel_${Date.now().toString(36)}${Math.random().toString(36).slice(2, 12)}`;
  try {
    sessionStorage.setItem(SESSION_KEY, id);
  } catch {
    /* private mode */
  }
  return id;
}

function buildAttribution() {
  captureAttribution();
  const landing = readStore(LANDING_ATTR_KEY);
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
    fbclid: landing.fbclid || storedFbclid() || null,
    gclid: landing.gclid || null,
    gbraid: landing.gbraid || null,
    wbraid: landing.wbraid || null,
    landing_page: "free-consult",
  };
  return Object.fromEntries(
    Object.entries(attribution).filter(([, value]) => value != null && String(value).trim() !== "")
  );
}

function formatSubmittedAt(date = new Date()) {
  const offsetMin = -date.getTimezoneOffset();
  const sign = offsetMin >= 0 ? "+" : "-";
  const abs = Math.abs(offsetMin);
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(
    date.getHours()
  )}:${pad(date.getMinutes())}:${pad(date.getSeconds())}${sign}${pad(Math.floor(abs / 60))}:${pad(abs % 60)}`;
}

/** Preview hosts and ?test=1 still save the lead. They do not fire ads events. */
function isQuietTraffic() {
  try {
    const host = window.location.hostname;
    const preview = host === "localhost" || host === "127.0.0.1" || /\.vercel\.app$/i.test(host);
    const test = new URLSearchParams(window.location.search).get("test") === "1";
    return preview || test;
  } catch {
    return false;
  }
}

function hasLeadConversionLock() {
  try {
    return localStorage.getItem(LEAD_CONVERSION_LOCK_KEY) === "1";
  } catch {
    return false;
  }
}

function lockLeadConversion() {
  try {
    localStorage.setItem(LEAD_CONVERSION_LOCK_KEY, "1");
  } catch {
    /* private mode */
  }
}

function trackGoogle(event, props) {
  if (isQuietTraffic()) return;
  if (typeof window.gtag !== "function") return;
  try {
    window.gtag("event", event, props || {});
    if (event === "young_cat_lead_submitted" && props && props.ok) {
      window.gtag("event", "sign_up", { method: "young_cat_screening" });
    }
  } catch {
    /* ads tag must not break the form */
  }
}

function trackMeta(event, props) {
  if (isQuietTraffic()) return;
  if (typeof window.fbq !== "function") return;
  try {
    if (event === "young_cat_lead_submitted" && props && props.ok) {
      window.fbq("track", "CompleteRegistration", {
        content_name: "young_cat_screening",
        status: props.urgency || "submitted",
        landing: "free-consult",
      });
      window.fbq("trackCustom", "ScreeningCompleted", {
        flow: "young",
        urgency: props.urgency,
        issue_id: props.issue_id,
        landing: "free-consult",
      });
    }
  } catch {
    /* pixel must not break the form */
  }
}

function flushLeadConversion() {
  if (isQuietTraffic()) return;
  if (hasLeadConversionLock()) return;
  lockLeadConversion();
  try {
    if (typeof window.fbq === "function") {
      window.fbq(
        "track",
        "Lead",
        {
          content_name: "young_cat_supplement_call",
          content_category: "supplement_call",
          flow: "young",
          lane: "green",
          landing: "free-consult",
        },
        { eventID: ensureSessionId() }
      );
    }
  } catch {
    /* pixel must not break the form */
  }
  try {
    if (typeof window.gtag === "function") {
      window.gtag("event", "conversion", {
        send_to: GOOGLE_ADS_LEAD_SEND_TO,
        transport_type: "beacon",
      });
    } else if (typeof window.gtag_report_conversion === "function") {
      window.gtag_report_conversion();
    }
  } catch {
    /* ads tag must not break the form */
  }
}

/** Strip a leading 91 (12 digits) or 0 (11 digits), then require /^[6-9][0-9]{9}$/. */
function normalizePhone(raw) {
  let digits = String(raw || "").replace(/\D/g, "");
  if (digits.length === 12 && digits.startsWith("91")) digits = digits.slice(2);
  else if (digits.length === 11 && digits.startsWith("0")) digits = digits.slice(1);
  return digits;
}

function isValidPhone(raw) {
  return /^[6-9][0-9]{9}$/.test(normalizePhone(raw));
}

function ageLabel() {
  if (ageState.kitten && ageState.months) {
    return ageState.months === 1 ? "1 month" : `${ageState.months} months`;
  }
  if (ageState.years === 16) return "16+ years";
  if (ageState.years === 1) return "1 year";
  if (ageState.years) return `${ageState.years} years`;
  return "";
}

function ageYears() {
  if (ageState.kitten && ageState.months) return ageState.months / 12;
  if (ageState.years) return ageState.years;
  return null;
}

function istNow(date = new Date()) {
  const fmt = new Intl.DateTimeFormat("en-GB", {
    timeZone: "Asia/Kolkata",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  });
  const bag = { year: 0, month: 0, day: 0, hour: 0, minute: 0 };
  fmt.formatToParts(date).forEach((part) => {
    if (part.type in bag) bag[part.type] = Number(part.value);
  });
  return bag;
}

function dateKey(year, month, day) {
  return year * 10000 + month * 100 + day;
}

function keyParts(key) {
  return {
    year: Math.floor(key / 10000),
    month: Math.floor((key % 10000) / 100),
    day: key % 100,
  };
}

function shiftDays(year, month, day, days) {
  const utc = new Date(Date.UTC(year, month - 1, day + days));
  return { year: utc.getUTCFullYear(), month: utc.getUTCMonth() + 1, day: utc.getUTCDate() };
}

function weekdayIndex(year, month, day) {
  return new Date(Date.UTC(year, month - 1, day)).getUTCDay();
}

function daysInMonth(year, month) {
  return new Date(Date.UTC(year, month, 0)).getUTCDate();
}

function slotLabel(hour, minute) {
  const suffix = hour >= 12 ? "PM" : "AM";
  const hour12 = hour % 12 === 0 ? 12 : hour % 12;
  return `${hour12}:${minute === 0 ? "00" : "30"} ${suffix}`;
}

function slotPhrase(key, label) {
  const parts = keyParts(key);
  const weekday = WEEKDAYS[weekdayIndex(parts.year, parts.month, parts.day)];
  return `${weekday}, ${parts.day} ${MONTHS_SHORT[parts.month - 1]} at ${label} IST`;
}

function istIso(key, hour, minute) {
  const parts = keyParts(key);
  return `${parts.year}-${pad(parts.month)}-${pad(parts.day)}T${pad(hour)}:${pad(minute)}:00+05:30`;
}

function timeSlots() {
  const slots = [];
  for (let hour = 10; hour <= 18; hour += 1) {
    slots.push({ hour, minute: 0 });
    slots.push({ hour, minute: 30 });
  }
  slots.push({ hour: 19, minute: 0 });
  return slots;
}

function concernById(id) {
  return CONCERNS.find((item) => item.id === id) || null;
}

function readForm() {
  const name = document.getElementById("fc-name").value.trim().replace(/\s+/g, " ");
  const concern = concernById(document.getElementById("fc-concern").value);
  const phone = normalizePhone(document.getElementById("fc-phone").value);
  let error = "";
  if (!name) error = "Please enter your cat's name.";
  else if (name.length > 40) error = "Please enter your cat's name.";
  else if (!ageState.kitten && !ageState.years) error = "Please select your cat's age.";
  else if (ageState.kitten && !ageState.months) error = "Please select your kitten's age in months.";
  else if (!concern) error = "Please pick what's wrong.";
  else if (!isValidPhone(phone)) error = "Please enter a valid 10 digit mobile number.";
  return error
    ? { error }
    : {
        error: "",
        name,
        phone,
        concern,
        ageYears: ageYears(),
        ageMonths: ageState.kitten ? ageState.months : null,
        ageLabel: ageLabel(),
      };
}

function showError(message) {
  const node = document.getElementById("fc-error");
  node.hidden = !message;
  node.textContent = message || "";
}

function showSchedError(message) {
  const node = document.getElementById("fc-sched-error");
  node.hidden = !message;
  node.textContent = message || "";
}

function buildPayload(lead, schedule) {
  const scheduleLine = schedule ? `Scheduled: ${schedule.label}` : "";
  const concernText = scheduleLine ? `${lead.concern.short}. ${scheduleLine}` : lead.concern.short;
  const summaryParts = [
    "Source: free-consult",
    `${lead.name}, ${lead.ageLabel}`,
    lead.concern.short,
    scheduleLine || `Free vet call within 15–30 min at +91 ${lead.phone}`,
  ];
  const pet = {
    name: lead.name,
    species: "cat",
    age_years: lead.ageYears,
    age_band: "young",
  };
  if (lead.ageMonths) pet.age_months = lead.ageMonths;

  const payload = {
    schema_version: "1.0",
    source: {
      product: "felica",
      channel: "web_screening",
      flow: "free-consult",
      intent: "new",
      session_id: ensureSessionId(),
      submitted_at: formatSubmittedAt(),
      landing: "free-consult",
    },
    contact: {
      phone_e164: `+91${lead.phone}`,
      phone_national: lead.phone,
      country_code: "91",
      preferred_method: "call",
      callback_window: schedule ? undefined : "15_30_min",
      scheduled_at: schedule ? schedule.iso : null,
    },
    pet,
    triage: { lane: "green", urgency: "consult", urgency_reasons: [] },
    chief_complaint: {
      issue_id: lead.concern.id,
      issue_label: lead.concern.short,
      issue_label_full: concernText,
    },
    answers: [],
    summary_text: summaryParts.filter(Boolean).join(". ") + ".",
    flags: {
      urgent: false,
      supplement_call: true,
      call_scope: "just_this",
      prevention_only: CARE_CHECKIN_IDS.has(lead.concern.id),
      follow_up: false,
      free_consult: true,
    },
    attribution: buildAttribution(),
  };
  if (schedule) payload.scheduled_at = schedule.iso;
  if (!schedule) delete payload.contact.scheduled_at;
  return payload;
}

async function postLead(payload) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 20000);
  let response;
  try {
    response = await fetch(`${YOUNG_CAT_API_BASE}/young-cat`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      mode: "cors",
      signal: controller.signal,
    });
  } finally {
    clearTimeout(timer);
  }
  if (!response.ok) {
    const error = new Error("Young cat lead submit failed");
    error.status = response.status;
    throw error;
  }
  return response.json().catch(() => ({ ok: true }));
}

function paintAge() {
  document.querySelectorAll("[data-years]").forEach((button) => {
    const years = Number(button.dataset.years);
    const on = !ageState.kitten && ageState.years === years;
    button.classList.toggle("on", on);
    button.setAttribute("aria-pressed", on ? "true" : "false");
  });
  const kitten = document.getElementById("fc-kitten");
  kitten.classList.toggle("on", ageState.kitten);
  kitten.setAttribute("aria-pressed", ageState.kitten ? "true" : "false");
  const months = document.getElementById("fc-months");
  months.hidden = !ageState.kitten;
  document.querySelectorAll("[data-months]").forEach((button) => {
    const value = Number(button.dataset.months);
    const on = ageState.kitten && ageState.months === value;
    button.classList.toggle("on", on);
    button.setAttribute("aria-pressed", on ? "true" : "false");
  });
}

function viewMonth() {
  const today = istNow();
  const utc = new Date(Date.UTC(today.year, today.month - 1 + calState.offset, 1));
  return { year: utc.getUTCFullYear(), month: utc.getUTCMonth() + 1 };
}

function shiftMonth(delta) {
  const today = istNow();
  const max = shiftDays(today.year, today.month, today.day, 13);
  const view = viewMonth();
  const nextStart = Date.UTC(view.year, view.month, 1);
  const nextBlocked = nextStart > Date.UTC(max.year, max.month - 1, max.day);
  if (delta > 0 && nextBlocked) return;
  calState.offset = Math.max(0, calState.offset + delta);
  renderCalendar();
}

function pickDate(key) {
  calState.dateKey = key;
  calState.slotKey = "";
  showSchedError("");
  renderCalendar();
}

function renderCalendar() {
  const today = istNow();
  const todayKey = dateKey(today.year, today.month, today.day);
  const max = shiftDays(today.year, today.month, today.day, 13);
  const maxKey = dateKey(max.year, max.month, max.day);
  const view = viewMonth();
  document.getElementById("fc-month").textContent = `${MONTHS_LONG[view.month - 1]} ${view.year}`;
  document.getElementById("fc-prev").disabled = calState.offset <= 0;
  const nextStart = new Date(Date.UTC(view.year, view.month, 1));
  document.getElementById("fc-next").disabled = nextStart.getTime() > Date.UTC(max.year, max.month - 1, max.day);

  const grid = document.getElementById("fc-days");
  grid.replaceChildren();
  const lead = weekdayIndex(view.year, view.month, 1);
  for (let i = 0; i < lead; i += 1) {
    const blank = document.createElement("span");
    blank.className = "cal-d cal-e";
    blank.setAttribute("aria-hidden", "true");
    grid.append(blank);
  }
  const count = daysInMonth(view.year, view.month);
  for (let day = 1; day <= count; day += 1) {
    const key = dateKey(view.year, view.month, day);
    const sunday = weekdayIndex(view.year, view.month, day) === 0;
    const disabled = key < todayKey || key > maxKey || sunday;
    const button = document.createElement("button");
    button.type = "button";
    button.className = `cal-d${key === todayKey ? " today" : ""}${key === calState.dateKey ? " on" : ""}`;
    button.textContent = String(day);
    button.disabled = disabled;
    button.setAttribute("aria-pressed", key === calState.dateKey ? "true" : "false");
    button.addEventListener("click", () => pickDate(key));
    grid.append(button);
  }

  const slots = document.getElementById("fc-slots");
  const slotWrap = document.getElementById("fc-slot-wrap");
  slotWrap.hidden = !calState.dateKey;
  slots.replaceChildren();
  if (!calState.dateKey) return;
  const picked = keyParts(calState.dateKey);
  document.getElementById("fc-date-label").textContent = `${WEEKDAYS[weekdayIndex(picked.year, picked.month, picked.day)]}, ${picked.day} ${MONTHS_SHORT[picked.month - 1]}`;
  const nowMinutes = today.hour * 60 + today.minute;
  timeSlots().forEach((slot) => {
    const label = slotLabel(slot.hour, slot.minute);
    const key = `${slot.hour}:${slot.minute}`;
    let disabled = false;
    if (calState.dateKey === todayKey) {
      disabled = slot.hour * 60 + slot.minute <= nowMinutes + 30;
    }
    const button = document.createElement("button");
    button.type = "button";
    button.textContent = label;
    button.disabled = disabled;
    button.className = calState.slotKey === key ? "on" : "";
    button.setAttribute("aria-pressed", calState.slotKey === key ? "true" : "false");
    button.addEventListener("click", () => {
      calState.slotKey = key;
      showSchedError("");
      renderCalendar();
    });
    slots.append(button);
  });
}

function showPanel(name) {
  document.getElementById("fc-form").hidden = name !== "form";
  document.getElementById("fc-sched").hidden = name !== "sched";
  document.getElementById("fc-done").hidden = name !== "done";
  const title = name === "sched" ? "fc-sched-title" : "fc-title";
  document.getElementById("fc-dialog").setAttribute("aria-labelledby", name === "done" ? "fc-done-title" : title);
}

function openForm() {
  showError("");
  showPanel("form");
  const modal = document.getElementById("fc-modal");
  modal.hidden = false;
  document.body.classList.add("fc-modal-open");
  document.getElementById("fc-name").focus();
}

function closeForm() {
  document.getElementById("fc-modal").hidden = true;
  document.body.classList.remove("fc-modal-open");
}

function showDone(lead, schedule) {
  document.getElementById("fc-done-title").textContent = `You're all set, ${lead.name}'s parent.`;
  const phone = lead.phone;
  document.getElementById("fc-done-copy").textContent = schedule
    ? `Your free consultation is booked for ${schedule.label}. A feline vet will call ${phone}.`
    : `A feline vet will call ${phone} in about 15 to 30 minutes. Please keep your phone nearby.`;
  showPanel("done");
}

async function submitLead(lead, schedule) {
  if (submitting) return;
  submitting = true;
  const asap = document.getElementById("fc-asap");
  const confirm = document.getElementById("fc-confirm");
  asap.disabled = true;
  confirm.disabled = true;
  const props = {
    cat_age: lead.ageYears,
    flow_track: "young",
    symptoms: [lead.concern.id],
    contact_method: "call",
    session_id: ensureSessionId(),
    has_cat_name: true,
    care_lane: "green",
    landing: "free-consult",
  };
  trackGoogle("whatsapp_number_collected", props);
  try {
    await postLead(buildPayload(lead, schedule));
    flushLeadConversion();
    trackGoogle("young_cat_lead_submitted", {
      session_id: ensureSessionId(),
      issue_id: lead.concern.id,
      urgency: "consult",
      care_lane: "green",
      ok: true,
      landing: "free-consult",
    });
    trackMeta("young_cat_lead_submitted", {
      urgency: "consult",
      issue_id: lead.concern.id,
      ok: true,
    });
    showDone(lead, schedule);
  } catch {
    const message = "We couldn't save that. Please try again.";
    if (schedule) showSchedError(message);
    else showError(message);
    trackGoogle("young_cat_lead_submitted", {
      session_id: ensureSessionId(),
      issue_id: lead.concern.id,
      ok: false,
      landing: "free-consult",
    });
  } finally {
    submitting = false;
    asap.disabled = false;
    confirm.disabled = false;
  }
}

function bindJourney() {
  const tabs = [...document.querySelectorAll("[data-stage]")];
  const panel = document.getElementById("fc-stage");
  const paint = (index) => {
    const stage = STAGES[index];
    tabs.forEach((tab, i) => {
      const on = i === index;
      tab.classList.toggle("on", on);
      tab.setAttribute("aria-selected", on ? "true" : "false");
    });
    panel.innerHTML = `<h3>${stage.title} <span style="font-weight:400;font-size:15px;opacity:.85">(${stage.range})</span></h3>
      <div class="jr-cols">
        <div><h4>What parents often see</h4><p></p></div>
        <div><h4>What a vet can advise on</h4><p></p></div>
        <div><h4>When to go to a clinic</h4><p></p></div>
      </div>
      <button type="button" class="fl-btn fl-btn-light" data-open-form style="align-self:center">Get FREE Vet Consultation</button>`;
    const paragraphs = panel.querySelectorAll("p");
    paragraphs[0].textContent = stage.seen;
    paragraphs[1].textContent = stage.advise;
    paragraphs[2].textContent = stage.clinic;
    panel.querySelector("[data-open-form]").addEventListener("click", openForm);
  };
  tabs.forEach((tab) => {
    tab.addEventListener("click", () => paint(Number(tab.dataset.stage)));
  });
  paint(2);
}

function bindFaq() {
  const items = [...document.querySelectorAll(".fl-faq-q")];
  const setOpen = (index) => {
    items.forEach((button, i) => {
      const open = i === index;
      button.setAttribute("aria-expanded", open ? "true" : "false");
      button.querySelector("[data-faq-icon]").textContent = open ? "−" : "+";
      button.nextElementSibling.hidden = !open;
    });
  };
  items.forEach((button, index) => {
    button.addEventListener("click", () => {
      const open = button.getAttribute("aria-expanded") === "true";
      setOpen(open ? -1 : index);
    });
  });
  setOpen(0);
}

function renderChoices() {
  const years = document.getElementById("fc-years");
  for (let n = 1; n <= 16; n += 1) {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "uf-pill";
    button.dataset.years = String(n);
    button.textContent = n === 16 ? "16+" : String(n);
    button.setAttribute("aria-pressed", "false");
    years.append(button);
  }
  const months = document.getElementById("fc-month-grid");
  for (let n = 1; n <= 11; n += 1) {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "uf-pill";
    button.dataset.months = String(n);
    button.textContent = String(n);
    button.setAttribute("aria-pressed", "false");
    months.append(button);
  }
  const select = document.getElementById("fc-concern");
  CONCERNS.forEach((item) => {
    const option = document.createElement("option");
    option.value = item.id;
    option.textContent = item.short;
    select.append(option);
  });
}

function renderReviews() {
  const reviews = [
    {
      quote: "My cat had an upset stomach, and I wasn't sure what to do. Being able to speak to a vet from home made the whole process feel less overwhelming.",
      who: "Ananya, Pune",
      cat: "Cat parent to Mochi",
      initial: "A",
    },
    {
      quote: "As a first-time cat parent, I have a hundred questions! It's nice to have somewhere to turn for quick guidance.",
      who: "Nisha, Chennai",
      cat: "Cat parent to Lulu",
      initial: "N",
    },
    {
      quote: "Being able to start with an online vet consultation from home is a really convenient option when I have concerns about Luna.",
      who: "Ronak, Bengaluru",
      cat: "Cat parent to Luna",
      initial: "R",
    },
  ];
  const loop = [{ photo: true }].concat(reviews.map((review) => ({ photo: false, review })));
  const track = document.getElementById("fc-reviews");
  loop.concat(loop).forEach((item, index) => {
    const wrap = document.createElement("div");
    wrap.style.display = "flex";
    wrap.style.flexDirection = "column";
    wrap.style.marginTop = index % 2 === 1 ? "24px" : "0px";
    if (index >= loop.length) wrap.setAttribute("aria-hidden", "true");
    if (item.photo) {
      wrap.innerHTML = `<div class="fl-rphoto"><img src="./images/free-consult/tabby-hold.webp" width="886" height="881" alt="A man gently holding his tabby cat" /><span aria-label="5 out of 5 stars">★★★★★</span></div>`;
    } else {
      const figure = document.createElement("figure");
      figure.className = "fl-rcard";
      figure.style.margin = "0";
      figure.style.background = index % 2 === 1 ? "#E6DAD5" : "#6B2E1E";
      figure.style.color = index % 2 === 1 ? "#2A1A15" : "#F7EFEC";
      const stars = document.createElement("div");
      stars.style.letterSpacing = "2px";
      stars.style.fontSize = "15px";
      stars.style.color = "#E0A21B";
      stars.setAttribute("aria-label", "5 out of 5 stars");
      stars.textContent = "★★★★★";
      const quote = document.createElement("blockquote");
      quote.style.margin = "0";
      quote.style.fontSize = "14.5px";
      quote.style.lineHeight = "1.6";
      quote.textContent = item.review.quote;
      const caption = document.createElement("figcaption");
      caption.style.display = "flex";
      caption.style.alignItems = "center";
      caption.style.gap = "12px";
      caption.style.marginTop = "auto";
      const initial = document.createElement("span");
      initial.style.cssText = "width:40px;height:40px;border-radius:50%;background:#F7EFEC;color:#6B2E1E;font-weight:700;display:flex;align-items:center;justify-content:center";
      initial.textContent = item.review.initial;
      const who = document.createElement("span");
      who.style.cssText = "font-size:13.5px;font-weight:600;line-height:1.4";
      who.append(document.createTextNode(item.review.who), document.createElement("br"));
      const cat = document.createElement("span");
      cat.style.fontWeight = "400";
      cat.style.opacity = ".85";
      cat.textContent = item.review.cat;
      who.append(cat);
      caption.append(initial, who);
      figure.append(stars, quote, caption);
      wrap.append(figure);
    }
    track.append(wrap);
  });
}

function init() {
  captureAttribution();
  renderChoices();
  renderReviews();
  const scheduleButton = document.getElementById("fc-schedule");
  scheduleButton.hidden = !SHOW_SCHEDULE;

  document.querySelectorAll("[data-open-form]").forEach((node) => {
    node.addEventListener("click", (event) => {
      event.preventDefault();
      openForm();
    });
  });
  document.querySelectorAll("[data-years]").forEach((button) => {
    button.addEventListener("click", () => {
      ageState.years = Number(button.dataset.years);
      ageState.kitten = false;
      ageState.months = null;
      showError("");
      paintAge();
    });
  });
  document.getElementById("fc-kitten").addEventListener("click", () => {
    ageState.kitten = true;
    ageState.years = null;
    ageState.months = null;
    showError("");
    paintAge();
  });
  document.querySelectorAll("[data-months]").forEach((button) => {
    button.addEventListener("click", () => {
      ageState.kitten = true;
      ageState.months = Number(button.dataset.months);
      showError("");
      paintAge();
    });
  });

  document.getElementById("fc-form").addEventListener("submit", (event) => {
    event.preventDefault();
    const lead = readForm();
    if (lead.error) {
      showError(lead.error);
      return;
    }
    showError("");
    pendingLead = lead;
    submitLead(lead, null);
  });
  scheduleButton.addEventListener("click", () => {
    const lead = readForm();
    if (lead.error) {
      showError(lead.error);
      return;
    }
    showError("");
    pendingLead = lead;
    calState.dateKey = 0;
    calState.slotKey = "";
    calState.offset = 0;
    showSchedError("");
    showPanel("sched");
    renderCalendar();
  });
  document.getElementById("fc-back").addEventListener("click", () => {
    showPanel("form");
  });
  document.getElementById("fc-prev").addEventListener("click", () => shiftMonth(-1));
  document.getElementById("fc-next").addEventListener("click", () => shiftMonth(1));
  document.getElementById("fc-confirm").addEventListener("click", () => {
    if (!pendingLead) return;
    if (!calState.dateKey) {
      showSchedError("Please pick a date.");
      return;
    }
    if (!calState.slotKey) {
      showSchedError("Please pick a time.");
      return;
    }
    const [hour, minute] = calState.slotKey.split(":").map(Number);
    const label = slotPhrase(calState.dateKey, slotLabel(hour, minute));
    submitLead(pendingLead, {
      label,
      iso: istIso(calState.dateKey, hour, minute),
    });
  });

  document.getElementById("fc-modal").addEventListener("click", (event) => {
    if (event.target.id === "fc-modal") closeForm();
  });
  document.querySelectorAll("[data-close]").forEach((button) => {
    button.addEventListener("click", closeForm);
  });
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && !document.getElementById("fc-modal").hidden) closeForm();
  });

  bindJourney();
  bindFaq();
  paintAge();
}

init();
