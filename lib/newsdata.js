// Primary source when NEWSDATA_API_KEY is set. NewsData.io free plan: 200 credits/day,
// 10 articles per credit, news delayed about 12 hours, 100-character query limit.
const QUERIES = { cabs: '"Ola Cabs" OR "Ola cab"', electric: '"Ola Electric" OR "Bhavish Aggarwal"' };

export function normalizeNewsdata(raw) {
  const seen = new Set();
  const out = [];
  for (const a of raw?.results ?? []) {
    const key = (a.title || "").toLowerCase().replace(/\W+/g, " ").trim();
    if (!a.link || !key || seen.has(key)) continue;
    seen.add(key);
    out.push({
      title: a.title,
      url: a.link,
      domain: a.source_name || a.source_id || "",
      language: a.language,
      publishedAt: a.pubDate ? a.pubDate.replace(" ", "T") + "Z" : null,
    });
  }
  return out;
}

export async function getNewsdata(topic, key) {
  const q = QUERIES[topic];
  if (!q) throw new Error("unknown topic");
  const url = `https://newsdata.io/api/1/latest?${new URLSearchParams({ apikey: key, q, language: "en" })}`;
  const res = await fetch(url, { signal: AbortSignal.timeout(10000) });
  const json = await res.json();
  if (json.status !== "success") throw new Error(json.results?.message || "NewsData error");
  return normalizeNewsdata(json);
}
