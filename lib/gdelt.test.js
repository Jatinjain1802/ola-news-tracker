import test from "node:test";
import assert from "node:assert/strict";
import { normalize } from "./gdelt.js";

test("normalize dedupes titles and parses dates", () => {
  const out = normalize({ articles: [
    { title: "Ola Electric sales rise", url: "https://a.com/1", domain: "a.com", seendate: "20261002T051500Z" },
    { title: "Ola  Electric sales rise!", url: "https://b.com/2", domain: "b.com", seendate: "20261002T061500Z" },
    { title: "Ola Cabs expands", url: "https://c.com/3", domain: "c.com" },
  ]});
  assert.equal(out.length, 2);
  assert.equal(out[0].publishedAt, "2026-10-02T05:15:00Z");
});
