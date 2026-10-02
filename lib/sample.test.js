import test from "node:test";
import assert from "node:assert/strict";
import { getNews } from "./news.js";

test("without keys the app returns labelled sample data", async () => {
  const d = await getNews("cabs", {});
  assert.equal(d.demo, true);
  assert.ok(d.articles.every((a) => a.title.startsWith("Sample:") && a.url === null));
});
