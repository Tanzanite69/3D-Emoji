import express from "express";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// Resolve absolute path to /public
const publicDir = path.join(__dirname, "public");
app.use(express.json({ limit: "2mb" }));
app.use(express.static(publicDir));

// Explicit route for root (helps when directory index is disabled)
app.get("/", (_req, res) => {
  res.sendFile(path.join(publicDir, "index.html"));
});

// Healthcheck
app.get("/health", (_req, res) => res.json({ ok: true }));

// Return API key for the client (your current frontend expects this)
app.get("/api/key", (_req, res) => {
  const key = process.env.GOOGLE_API_KEY || "";
  res.json({ apiKey: key });
});

// Optional safer proxy that keeps the key on the server
app.post("/api/generate", async (req, res) => {
  try {
    const { prompt } = req.body || {};
    if (!prompt) return res.status(400).json({ error: "Missing prompt" });

    const apiKey = process.env.GOOGLE_API_KEY;
    if (!apiKey) return res.status(500).json({ error: "Missing GOOGLE_API_KEY" });

    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/imagen-3.0-generate-002:predict?key=${apiKey}`;
    const payload = {
      instances: [{ prompt }],
      parameters: { sampleCount: 1 },
    };

    const r = await fetch(apiUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const data = await r.json();
    return res.status(r.status).json(data);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Server error" });
  }
});

// Friendly 404
app.use((req, res) => {
  res.status(404).send("Not found");
});

app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
});
