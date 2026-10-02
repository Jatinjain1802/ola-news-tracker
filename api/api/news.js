import { getNews, TOPICS } from "../lib/gdelt.js";
import { summarize } from "../lib/summarize.js";

// GET /api/news?topic=cabs|electric&summary=1
export default async function handler(req, res) {
  const url = new URL(req.url, "http://x");
  const topic = url.searchParams.get("topic") || "electric";
  if (!TOPICS[topic]) return send(res, 400, { error: "topic must be cabs or electric" });
  try {
    const data = await getNews(topic);
    const body = { ...data };
    if (url.searchParams.get("summary") === "1") body.digest = await summarize(data.label, data.articles);
    res.setHeader?.("cache-control", "s-maxage=900, stale-while-revalidate=3600");
    send(res, 200, body);
  } catch (e) {
    send(res, 502, { error: "News source unavailable, try again shortly.", detail: String(e.message || e) });
  }
}
function send(res, code, obj) {
  res.statusCode = code;
  res.setHeader("content-type", "application/json");
  res.end(JSON.stringify(obj));
}
