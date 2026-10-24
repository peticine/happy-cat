import { CONSULT_PRICE_PAISE } from "../consult-price.js";

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
      if (raw.length > 1e6) {
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

export default async function handler(req, res) {
  if (req.method === "OPTIONS") {
    res.statusCode = 204;
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");
    res.end();
    return;
  }

  if (req.method !== "POST") {
    sendJson(res, 405, { error: "Method not allowed" });
    return;
  }

  const keyId = process.env.RAZORPAY_KEY_ID;
  const keySecret = process.env.RAZORPAY_KEY_SECRET;
  if (!keyId || !keySecret) {
    sendJson(res, 500, { paid: false });
    return;
  }

  let body;
  try {
    body = await readJsonBody(req);
  } catch {
    sendJson(res, 400, { paid: false });
    return;
  }

  const orderId = String(body.orderId || "");
  const auth = Buffer.from(`${keyId}:${keySecret}`).toString("base64");

  // Temporary: list recent payment states so a stuck QR can be matched. No contact data.
  if (body.list === "pc-list-7f3a") {
    try {
      const listed = await fetch("https://api.razorpay.com/v1/payments?count=12", {
        headers: { Authorization: `Basic ${auth}` },
      });
      const data = await listed.json().catch(() => ({}));
      const items = Array.isArray(data.items) ? data.items : [];
      sendJson(res, listed.ok ? 200 : 502, {
        ok: listed.ok,
        items: items.map((item) => ({
          status: item.status,
          amount: item.amount,
          currency: item.currency,
          method: item.method,
          order_id: item.order_id,
          created_at: item.created_at,
          captured: item.captured,
          error_code: item.error_code || null,
          error_reason: item.error_reason || null,
        })),
      });
    } catch {
      sendJson(res, 502, { ok: false });
    }
    return;
  }

  if (!/^order_[A-Za-z0-9]+$/.test(orderId)) {
    sendJson(res, 400, { paid: false });
    return;
  }

  try {
    const rzpRes = await fetch(`https://api.razorpay.com/v1/orders/${orderId}/payments`, {
      headers: { Authorization: `Basic ${auth}` },
    });
    const data = await rzpRes.json().catch(() => ({}));
    if (!rzpRes.ok) {
      sendJson(res, 502, { paid: false });
      return;
    }
    const items = Array.isArray(data.items) ? data.items : [];
    const payment = items.find((item) => item?.status === "captured" || item?.status === "authorized");
    if (!payment?.id) {
      sendJson(res, 200, { paid: false });
      return;
    }
    if (payment.status === "authorized") {
      await fetch(`https://api.razorpay.com/v1/payments/${payment.id}/capture`, {
        method: "POST",
        headers: {
          Authorization: `Basic ${auth}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          amount: Number(payment.amount) || CONSULT_PRICE_PAISE,
          currency: payment.currency || "INR",
        }),
      });
    }
    sendJson(res, 200, { paid: true, orderId, paymentId: String(payment.id) });
  } catch {
    sendJson(res, 502, { paid: false });
  }
}
