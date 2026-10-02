import { getNews as getGdelt, TOPICS } from "./gdelt.js";
import { getNewsdata } from "./newsdata.js";

export { TOPICS };
const cache = new Map();
const TTL_MS = 15 * 60 * 1000;

// NewsData.io when a key is configured, else GDELT. Falls back to GDELT if NewsData fails.
export async function getNews(topic, env = process.env) {
  const hit = cache.get(topic);
  if (hit && Date.now() - hit.at < TTL_MS) return hit.data;
  if (env.NEWSDATA_API_KEY) {
    try {
      const articles = await getNewsdata(topic, env.NEWSDATA_API_KEY);
      const data = { topic, label: TOPICS[topic].label, source: "NewsData.io", fetchedAt: new Date().toISOString(), articles };
      cache.set(topic, { at: Date.now(), data });
      return data;
    } catch (e) {
      /* fall through to GDELT */
    }
  }
  const data = await getGdelt(topic);
  return { ...data, source: "GDELT" };
}
