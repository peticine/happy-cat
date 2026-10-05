import { put } from "@vercel/blob";

export const config = {
  api: {
    bodyParser: false,
  },
};

const ALLOWED_CONTENT_TYPES = {
  "image/jpeg": 10 * 1024 * 1024,
  "image/png": 10 * 1024 * 1024,
  "image/webp": 10 * 1024 * 1024,
  "video/mp4": 50 * 1024 * 1024,
  "video/quicktime": 50 * 1024 * 1024,
};

async function readRequestBody(request) {
  const chunks = [];
  for await (const chunk of request) {
    chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
  }
  return Buffer.concat(chunks);
}

function json(response, status, payload) {
  response.status(status).json(payload);
}

export default async function handler(request, response) {
  if (request.method !== "POST") {
    response.setHeader("Allow", "POST");
    return json(response, 405, { error: "Method not allowed" });
  }

  const contentType = String(request.headers["x-content-type"] || "")
    .split(";")[0]
    .trim()
    .toLowerCase();
  const maxBytes = ALLOWED_CONTENT_TYPES[contentType];
  if (!maxBytes) {
    return json(response, 400, { error: "That file type is not allowed." });
  }

  const pathname = String(request.headers["x-pathname"] || "").trim();
  if (
    !pathname.startsWith("young-cat/") &&
    !pathname.startsWith("young-cat-media/")
  ) {
    return json(response, 400, { error: "Invalid upload path" });
  }

  try {
    const body = await readRequestBody(request);
    if (!body.length) {
      return json(response, 400, { error: "No file received." });
    }
    if (body.length > maxBytes) {
      return json(response, 400, {
        error:
          contentType.startsWith("video/")
            ? "Videos need to be 50 MB or smaller."
            : "Photos need to be 10 MB or smaller.",
      });
    }

    const { url } = await put(pathname, body, {
      access: "public",
      addRandomSuffix: true,
      contentType,
    });
    return json(response, 200, { url });
  } catch (error) {
    const message = error?.message || "Upload failed";
    const status = /BLOB_READ_WRITE_TOKEN|credentials|not configured/i.test(message)
      ? 503
      : 400;
    return json(response, status, { error: message });
  }
}
