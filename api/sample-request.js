/**
 * Same-origin proxy for the free cat treat form.
 * Forwards to digi-clinic POST /sample-request. Does not call /young-cat.
 */

const WINDOW_MS = 10 * 60 * 1000;
const LIMIT = 10;
const SAVE_FAILED = "We couldn't save your request. Please try again.";
const hits = new Map();

function sendJson(res, status, body) {
  res.statusCode = status;
  res.setHeader("Content-Type", "application/json");
  res.setHeader("Cache-Control", "no-store");
  res.end(JSON.stringify(body));
}

function readJsonBody(req) {
  return new Promise((resolve, reject) => {
    if (req.body && typeof req.body === "object") {
      resolve(req.body);
      return;
    }
    let raw = "";
    req.on("data", (chunk) => {
      raw += chunk;
      if (raw.length > 16000) {
        reject(new Error("Body too large"));
        req.destroy();
      }
    });
    req.on("end", () => {
      if (!raw) {
        resolve({});
        return;
      }
      try {
        resolve(JSON.parse(raw));
      } catch (err) {
        reject(err);
      }
    });
    req.on("error", reject);
  });
}

function clientIp(req) {
  const forwarded = req.headers["x-forwarded-for"];
  const value = Array.isArray(forwarded) ? forwarded[0] : forwarded;
  if (typeof value === "string" && value.trim()) {
    return value.split(",")[0].trim();
  }
  return req.socket?.remoteAddress || "unknown";
}

function allowIp(ip) {
  const now = Date.now();
  const recent = (hits.get(ip) || []).filter((at) => now - at < WINDOW_MS);
  if (recent.length >= LIMIT) {
    hits.set(ip, recent);
    return false;
  }
  recent.push(now);
  hits.set(ip, recent);
  return true;
}

function clinicBase() {
  const configured = String(process.env.DIGI_CLINIC_API_BASE || "").trim().replace(/\/$/, "");
  if (configured) return configured;
  return "https://clinic.tailhealthcare.com";
}

function asText(value) {
  return typeof value === "string" ? value.trim() : "";
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    sendJson(res, 405, { error: "Method not allowed" });
    return;
  }

  if (!allowIp(clientIp(req))) {
    sendJson(res, 429, { error: "Too many attempts. Please wait a minute and try again." });
    return;
  }

  let body;
  try {
    body = await readJsonBody(req);
  } catch (error) {
    console.error("POST /api/sample-request: invalid JSON", error);
    sendJson(res, 400, { error: "Invalid JSON body" });
    return;
  }

  const payload = {
    parent_name: asText(body.parent_name),
    phone: asText(body.phone),
    cat_name: asText(body.cat_name),
    cat_age_text: asText(body.cat_age_text),
    picky_eater: body.picky_eater,
    address_line1: asText(body.address_line1),
    address_line2: asText(body.address_line2),
    city: asText(body.city),
    pincode: asText(body.pincode),
    honeypot: body.honeypot == null ? "" : body.honeypot,
  };

  let response;
  try {
    response = await fetch(`${clinicBase()}/sample-request`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
      redirect: "manual",
    });
  } catch (error) {
    console.error("POST /api/sample-request: clinic request failed", error);
    sendJson(res, 502, { error: SAVE_FAILED });
    return;
  }

  const text = await response.text();
  let upstream = {};
  try {
    upstream = text ? JSON.parse(text) : {};
  } catch (error) {
    console.error("POST /api/sample-request: clinic returned non-JSON", response.status, error);
  }

  if (!response.ok) {
    console.error("POST /api/sample-request: clinic status", response.status);
    const message =
      typeof upstream.error === "string" && upstream.error ? upstream.error : SAVE_FAILED;
    sendJson(res, response.status || 502, { error: message });
    return;
  }

  sendJson(res, 200, { ok: true });
}
