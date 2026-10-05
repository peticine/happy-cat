import { put } from "@vercel/blob";

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(request, response) {
  if (request.method !== "POST") {
    response.setHeader("Allow", "POST");
    return response.status(405).json({ error: "Method not allowed" });
  }

  const filename = Array.isArray(request.query.filename)
    ? request.query.filename[0]
    : request.query.filename;
  if (!filename) {
    return response.status(400).json({ error: "Missing filename" });
  }

  try {
    const blob = await put(filename, request.body || request, {
      access: "public",
    });
    return response.status(200).json(blob);
  } catch (error) {
    const message = error?.message || "Upload failed";
    const status = /BLOB_READ_WRITE_TOKEN|credentials|not configured/i.test(message)
      ? 503
      : 400;
    return response.status(status).json({ error: message });
  }
}
