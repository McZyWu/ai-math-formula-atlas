import assert from "node:assert/strict";
import test from "node:test";
import { fileURLToPath } from "node:url";
import { build } from "esbuild";

async function render() {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}`);
  const { default: worker } = await import(workerUrl.href);
  return worker.fetch(
    new Request("http://localhost/", { headers: { accept: "text/html" } }),
    { ASSETS: { fetch: async () => new Response("Not found", { status: 404 }) } },
    { waitUntil() {}, passThroughOnException() {} },
  );
}

async function loadCatalog() {
  const result = await build({
    entryPoints: [fileURLToPath(new URL("../lib/formulas.ts", import.meta.url))],
    bundle: true,
    format: "esm",
    platform: "node",
    write: false,
  });
  const code = result.outputFiles[0].text;
  return import(`data:text/javascript;base64,${Buffer.from(code).toString("base64")}`);
}

test("server renders the finished formula atlas", async () => {
  const response = await render();
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i);
  const html = await response.text();
  assert.match(html, /<html lang="zh-CN">/i);
  assert.match(html, /AI 数学公式图谱/);
  assert.match(html, /每一条公式/);
  assert.match(html, /ESL-CN/);
  assert.doesNotMatch(html, /codex-preview|react-loading-skeleton|Your site is taking shape/i);
});

test("catalog has complete, unique, derivable entries", async () => {
  const { formulas, categories } = await loadCatalog();
  assert.equal(formulas.length, 148);
  assert.equal(categories.length, 7);
  assert.equal(new Set(formulas.map((formula) => formula.id)).size, formulas.length);
  for (const formula of formulas) {
    assert.ok(formula.latex, `${formula.id}: formula missing`);
    assert.ok(formula.explanation, `${formula.id}: explanation missing`);
    assert.ok(formula.variables.length > 0, `${formula.id}: variables missing`);
    assert.ok(formula.derivation.length >= 2, `${formula.id}: derivation too short`);
    assert.ok(formula.example.work.length > 0, `${formula.id}: example missing`);
    assert.ok(formula.sources.length > 0, `${formula.id}: source missing`);
  }
  assert.ok(formulas.filter((formula) => formula.tags.includes("PPT必含")).length >= 27);
  assert.ok(formulas.filter((formula) => formula.tags.includes("ESL")).length >= 39);
});
