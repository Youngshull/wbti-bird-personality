import assert from "node:assert/strict";
import test from "node:test";

async function render() {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}`);
  const { default: worker } = await import(workerUrl.href);

  return worker.fetch(
    new Request("http://localhost/", {
      headers: { accept: "text/html" },
    }),
    {
      ASSETS: {
        fetch: async () => new Response("Not found", { status: 404 }),
      },
    },
    {
      waitUntil() {},
      passThroughOnException() {},
    },
  );
}

test("server-renders the WBTI intro screen", async () => {
  const response = await render();
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i);

  const html = await response.text();
  assert.match(html, /<title>WBTI 鸟格测试/);
  assert.match(html, /今天的你/);
  assert.match(html, /开始测试/);
  assert.match(html, /个日常小现场/);
  assert.match(html, /16 种鸟格，16 种真实的鸟/);
  assert.match(html, /\/birds-v3\/web\/[a-z-]+-480\.webp/);
  assert.match(html, /og-cover\.jpg/);
  assert.doesNotMatch(html, /32 个/);
  assert.doesNotMatch(html, /codex-preview|site-creator|taking shape/i);
});
