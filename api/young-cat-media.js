import { put } from "@vercel/blob";

export const config = {
  api: {
    bodyParser: false,
  },
};

const ALLOWED_CONTENT_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "video/mp4",
  "video/quicktime",
]);

export default async function handler(request, response) {
  if (request.method !== "POST") {
    response.setHeader("Allow", "POST");
    return response.status(405).json({ error: "Method not allowed" });
  }

  const filename = String(request.query.filename || "").trim();
  if (
    !filename.startsWith("young-cat/") &&
    !filename.startsWith("young-cat-media/")
  ) {
    return response.status(400).json({ error: "Invalid upload path" });
  }

  const contentType = String(request.headers["content-type"] || "")
    .split(";")[0]
    .trim()
    .toLowerCase();
  if (!ALLOWED_CONTENT_TYPES.has(contentType)) {
    return response.status(400).json({ error: "That file type is not allowed." });
  }

  try {
    const { url } = await put(filename, request, {
      access: "public",
      addRandomSuffix: true,
      contentType,
    });
    return response.status(200).json({ url });
  } catch (error) {
    const message = error?.message || "Upload failed";
    const status = /BLOB_READ_WRITE_TOKEN|credentials|not configured/i.test(message)
      ? 503
      : 400;
    return response.status(status).json({ error: message });
  }
}
