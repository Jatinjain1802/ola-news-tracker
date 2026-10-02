// Optional AI digest through any OpenAI-compatible API (Groq, Gemini, OpenRouter, ...).
// Without AI_API_KEY it falls back to a plain headline list so the app never breaks.
export async function summarize(label, articles, env = process.env) {
  const items = articles.slice(0, 15);
  if (!items.length) return { mode: "none", text: "No recent articles found." };
  if (!env.AI_API_KEY) {
    return { mode: "plain", text: items.slice(0, 5).map((a) => `- ${a.title} (${a.domain})`).join("\n") };
  }
  const prompt =
    `You write a short news brief about ${label}. Use only the headlines below. ` +
    `Give 3 to 5 bullets, simple English, no speculation, no invented facts.\n\n` +
    items.map((a, i) => `${i + 1}. ${a.title} (${a.domain})`).join("\n");
  const res = await fetch(`${(env.AI_BASE_URL || "https://api.groq.com/openai/v1").replace(/\/$/, "")}/chat/completions`, {
    method: "POST",
    headers: { "content-type": "application/json", authorization: `Bearer ${env.AI_API_KEY}` },
    body: JSON.stringify({
      model: env.AI_MODEL || "llama-3.1-8b-instant",
      temperature: 0.2,
      messages: [{ role: "user", content: prompt }],
    }),
  });
  if (!res.ok) return { mode: "plain", text: items.slice(0, 5).map((a) => `- ${a.title} (${a.domain})`).join("\n") };
  const j = await res.json();
  return { mode: "ai", text: j.choices?.[0]?.message?.content?.trim() || "" };
}
