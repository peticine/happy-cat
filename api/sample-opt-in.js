/**
 * Same-origin proxy for the thank-you sample address.
 * Forwards to digi-clinic POST /young-cat/sample.
 */

const ADDRESS_MAX = 1000;
const SAVE_FAILED = "We couldn't save your address. Please try again.";
const WINDOW_MS = 10 * 60 * 1000;
const LIMIT = 10;
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
    console.error("POST /api/sample-opt-in: invalid JSON", error);
    sendJson(res, 400, { error: "Invalid JSON body" });
    return;
  }

  const leadId = typeof body.lead_id === "string" ? body.lead_id.trim() : "";
  const caseId = typeof body.case_id === "string" ? body.case_id.trim() : "";
  const address = typeof body.address === "string" ? body.address.trim() : "";
  const pickyEater = body.picky_eater === true;
  const pageSource = typeof body.page_source === "string" ? body.page_source.trim() : "";

  if (!leadId || !caseId || leadId.length > 128 || caseId.length > 128) {
    sendJson(res, 400, { error: "We couldn't find that request." });
    return;
  }
  if (!address) {
    sendJson(res, 400, { error: "Enter an address so we can send the sample." });
    return;
  }
  if (address.length > ADDRESS_MAX) {
    sendJson(res, 400, { error: "That address is too long." });
    return;
  }

  let response;
  try {
    response = await fetch(`${clinicBase()}/young-cat/sample`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        lead_id: leadId,
        case_id: caseId,
        address,
        ...(pickyEater ? { picky_eater: true } : {}),
        ...( /^[a-z0-9_-]{1,64}$/i.test(pageSource) ? { page_source: pageSource } : {}),
      }),
      redirect: "manual",
    });
  } catch (error) {
    console.error("POST /api/sample-opt-in: clinic request failed", error);
    sendJson(res, 502, { error: SAVE_FAILED });
    return;
  }

  const text = await response.text();
  let upstream = {};
  try {
    upstream = text ? JSON.parse(text) : {};
  } catch (error) {
    console.error("POST /api/sample-opt-in: clinic returned non-JSON", response.status, error);
  }

  if (!response.ok) {
    console.error("POST /api/sample-opt-in: clinic status", response.status);
    const message =
      typeof upstream.error === "string" && upstream.error ? upstream.error : SAVE_FAILED;
    sendJson(res, response.status || 502, { error: message });
    return;
  }

  sendJson(res, 200, { ok: true, address_saved_at: upstream.address_saved_at || null });
}
