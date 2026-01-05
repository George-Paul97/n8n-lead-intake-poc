const express = require("express");

const app = express();
app.use(express.json());

app.get("/health", (req, res) => res.json({ ok: true }));

app.post("/enrich", (req, res) => {
  const { email, source, fullName } = req.body || {};

  const isHighValue =
    typeof email === "string" &&
    (email.endsWith("@company.com") || email.endsWith("@enterprise.com"));

  const score = isHighValue ? 90 : 40;

  res.json({
    enrichedAt: new Date().toISOString(),
    score,
    segment: score >= 80 ? "high_value" : "standard",
    hints: { source: source || null, name: fullName || null }
  });
});

const port = Number(process.env.PORT || 3001);
app.listen(port, () => console.log(`[mock-provider] listening on :${port}`));
