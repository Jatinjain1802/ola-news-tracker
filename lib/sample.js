// Clearly fake demo headlines. Used when no live news source is configured.
const now = Date.now();
const h = (n) => new Date(now - n * 36e5).toISOString();
export const SAMPLE = {
  electric: [
    "Sample: Ola Electric announces new scooter software update",
    "Sample: Ola Electric reports monthly registrations figures",
    "Sample: Analysts discuss Ola Electric battery cell plans",
    "Sample: Ola Electric opens new service centres in more cities",
    "Sample: Ola Electric shares move after quarterly update",
  ],
  cabs: [
    "Sample: Ola Cabs adds new airport pickup zones",
    "Sample: Ola Cabs tests lower commission for drivers",
    "Sample: Ola Cabs expands bike taxi service in more cities",
    "Sample: Ola Cabs updates rider safety features",
    "Sample: Ola Cabs partners with city metro for last-mile rides",
  ],
};
export function sampleNews(topic, label) {
  return {
    topic, label, source: "SAMPLE", demo: true, fetchedAt: new Date().toISOString(),
    articles: SAMPLE[topic].map((title, i) => ({ title, url: null, domain: "demo data", language: "en", publishedAt: h(i * 3 + 1) })),
  };
}
