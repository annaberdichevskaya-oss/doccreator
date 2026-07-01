// Vercel Serverless Function — проксі до Anthropic API.
// Файл має лежати за шляхом:  api/anthropic.js
// Ключ береться зі змінної оточення Vercel (ANTHROPIC_API_KEY).

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  var key = process.env.ANTHROPIC_API_KEY;
  if (!key) {
    res.status(500).json({ error: "ANTHROPIC_API_KEY не задано у змінних оточення Vercel" });
    return;
  }

  try {
    var upstream = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": key,
        "anthropic-version": "2023-06-01"
      },
      body: JSON.stringify(req.body)
    });

    var data = await upstream.json();
    res.status(upstream.status).json(data);
  } catch (e) {
    res.status(500).json({ error: String(e && e.message || e) });
  }
}

export const config = {
  api: {
    bodyParser: { sizeLimit: "10mb" }
  }
};
