import test from "node:test";
import assert from "node:assert/strict";
import { normalizeNewsdata } from "./newsdata.js";

test("normalizeNewsdata maps fields and dedupes", () => {
  const out = normalizeNewsdata({ results: [
    { title: "Ola Electric launches bike", link: "https://a.com/1", source_name: "A", pubDate: "2026-09-11 05:54:20", language: "english" },
    { title: "Ola Electric launches bike!", link: "https://b.com/2", source_name: "B" },
  ]});
  assert.equal(out.length, 1);
  assert.equal(out[0].publishedAt, "2026-09-11T05:54:20Z");
  assert.equal(out[0].domain, "A");
});
