// News source: GDELT DOC 2.0 API. Free, no key, terms allow commercial use with citation.
// It asks for at most one request per 5 seconds, so results are cached and shared.
const ENDPOINT = "https://api.gdeltproject.org/api/v2/doc/doc";

export const TOPICS = {
  cabs: { label: "Ola Cabs", query: '("Ola Cabs" OR "Ola cab" OR "ANI Technologies" OR "Ola ride")' },
  electric: { label: "Ola Electric", query: '("Ola Electric" OR "Ola S1" OR "Bhavish Aggarwal" OR "Ola Roadster")' },
};

const cache = new Map(); // topic -> { at, data }
const TTL_MS = 15 * 60 * 1000;
let lastCall = 0;

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

export function normalize(raw) {
  const seen = new Set();
  const out = [];
  for (const a of raw?.articles ?? []) {
    const key = (a.title || "").toLowerCase().replace(/\W+/g, " ").trim();
    if (!a.url || !key || seen.has(key)) continue;
    seen.add(key);
    out.push({
      title: a.title,
      url: a.url,
      domain: a.domain,
      language: a.language,
      publishedAt: parseSeen(a.seendate),
    });
  }
  return out;
}

function parseSeen(s) {
  // GDELT format: 20261002T051500Z
  const m = /^(\d{4})(\d{2})(\d{2})T(\d{2})(\d{2})(\d{2})Z$/.exec(s || "");
  return m ? `${m[1]}-${m[2]}-${m[3]}T${m[4]}:${m[5]}:${m[6]}Z` : null;
}

export async function getNews(topic, { timespan = "3d", max = 40 } = {}) {
  const t = TOPICS[topic];
  if (!t) throw new Error("unknown topic");
  const hit = cache.get(topic);
  if (hit && Date.now() - hit.at < TTL_MS) return hit.data;

  const url = `${ENDPOINT}?${new URLSearchParams({
    query: `${t.query} sourcelang:english`,
    mode: "artlist",
    format: "json",
    sort: "datedesc",
    maxrecords: String(max),
    timespan,
  })}`;

  let lastErr;
  for (let i = 0; i < 3; i++) {
    const wait = lastCall + 5500 - Date.now();
    if (wait > 0) await sleep(wait);
    lastCall = Date.now();
    try {
      const res = await fetch(url, { headers: { "user-agent": "ola-news-tracker" } });
      const text = await res.text();
      if (text.trim().startsWith("{")) {
        const data = { topic, label: t.label, fetchedAt: new Date().toISOString(), articles: normalize(JSON.parse(text)) };
        cache.set(topic, { at: Date.now(), data });
        return data;
      }
      lastErr = new Error(text.slice(0, 120) || `HTTP ${res.status}`);
    } catch (e) {
      lastErr = e;
    }
  }
  if (hit) return { ...hit.data, stale: true };
  throw lastErr;
}
