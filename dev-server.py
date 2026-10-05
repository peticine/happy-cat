#!/usr/bin/env python3
"""Local Felica server: static files plus optional photo/video uploads."""

import json
import os
import re
import uuid
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer

ROOT = os.path.dirname(os.path.abspath(__file__))
UPLOAD_DIR = os.path.join(ROOT, "uploads")
HOST = os.environ.get("FELICA_HOST", "127.0.0.1")
PORT = int(os.environ.get("FELICA_PORT", "8765"))


def safe_name(name):
    base = os.path.basename(name or "upload")
    cleaned = re.sub(r"[^a-zA-Z0-9._-]+", "-", base).strip(".-") or "upload"
    return cleaned[:80]


def parse_multipart(body, content_type):
    match = re.search(r"boundary=([^;]+)", content_type or "")
    if not match:
        return None, None
    boundary = match.group(1).strip().strip('"').encode()
    for part in body.split(b"--" + boundary):
        if b"Content-Disposition" not in part:
            continue
        header, _, data = part.partition(b"\r\n\r\n")
        if not data:
            continue
        data = data.rstrip(b"\r\n")
        if data.endswith(b"--"):
            data = data[:-2]
        name_m = re.search(br'name="([^"]+)"', header)
        if not name_m or name_m.group(1) != b"file":
            continue
        filename_m = re.search(br'filename="([^"]*)"', header)
        filename = (
            filename_m.group(1).decode("utf-8", "replace") if filename_m else "upload"
        )
        return filename, data
    return None, None


class Handler(SimpleHTTPRequestHandler):
    def do_POST(self):
        path = self.path.split("?", 1)[0]
        if path != "/api/young-cat-media":
            self.send_error(404, "Not found")
            return

        length = int(self.headers.get("Content-Length") or 0)
        body = self.rfile.read(length) if length else b""
        content_type = self.headers.get("Content-Type", "")

        if "multipart/form-data" not in content_type:
            self._json(
                501,
                {
                    "error": "Local photo upload needs a file. Use Add photo or video, or skip."
                },
            )
            return

        filename, data = parse_multipart(body, content_type)
        if not data:
            self._json(400, {"error": "No file received."})
            return

        os.makedirs(UPLOAD_DIR, exist_ok=True)
        stored = f"{uuid.uuid4().hex[:12]}-{safe_name(filename)}"
        with open(os.path.join(UPLOAD_DIR, stored), "wb") as out:
            out.write(data)

        url = f"http://{HOST}:{PORT}/uploads/{stored}"
        self._json(
            200,
            {
                "url": url,
                "downloadUrl": url,
                "pathname": f"uploads/{stored}",
                "contentType": self.headers.get("X-File-Type") or "",
            },
        )

    def _json(self, status, payload):
        raw = json.dumps(payload).encode()
        self.send_response(status)
        self.send_header("Content-Type", "application/json")
        self.send_header("Content-Length", str(len(raw)))
        self.end_headers()
        self.wfile.write(raw)

    def log_message(self, format, *args):
        print("[%s] %s" % (self.log_date_time_string(), format % args))


if __name__ == "__main__":
    os.chdir(ROOT)
    os.makedirs(UPLOAD_DIR, exist_ok=True)
    server = ThreadingHTTPServer((HOST, PORT), Handler)
    print(f"Serving Felica at http://{HOST}:{PORT}")
    server.serve_forever()
