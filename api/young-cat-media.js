import { handleUpload } from "@vercel/blob/client";

const ALLOWED_CONTENT_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "video/mp4",
  "video/quicktime",
];

export default async function handler(request, response) {
  if (request.method !== "POST") {
    response.setHeader("Allow", "POST");
    return response.status(405).json({ error: "Method not allowed" });
  }

  let body = request.body;
  if (typeof body === "string") {
    try {
      body = JSON.parse(body);
    } catch (err) {
      return response.status(400).json({ error: "Invalid JSON body" });
    }
  }

  try {
    const jsonResponse = await handleUpload({
      body,
      request,
      onBeforeGenerateToken: async (pathname) => {
        if (
          !String(pathname || "").startsWith("young-cat/") &&
          !String(pathname || "").startsWith("young-cat-media/")
        ) {
          throw new Error("Invalid upload path");
        }
        return {
          allowedContentTypes: ALLOWED_CONTENT_TYPES,
          addRandomSuffix: true,
          maximumSizeInBytes: 50 * 1024 * 1024,
        };
      },
    });
    return response.status(200).json(jsonResponse);
  } catch (error) {
    const message = error?.message || "Upload failed";
    const status = /BLOB_READ_WRITE_TOKEN|credentials|not configured/i.test(message)
      ? 503
      : 400;
    return response.status(status).json({ error: message });
  }
}
