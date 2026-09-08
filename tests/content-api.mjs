// Run only against the local preview. These headers simulate Sites dispatch;
// they are never an authentication bypass exposed by the application.
import assert from "node:assert/strict";

const origin = "http://localhost:3000";
const nativeFetch = globalThis.fetch;
const fetch = async (url, options = {}) => {
  const response = await nativeFetch(url, { ...options, headers: { ...options.headers, Connection: "close" }, signal: AbortSignal.timeout(20000) });
  return new Response(await response.arrayBuffer(), { status: response.status, headers: response.headers });
};
const owner = { "oai-authenticated-user-id": "local-owner-test", "oai-authenticated-user-email": "william.cheers@gmail.com" };
const headers = { ...owner, Origin: origin, "Content-Type": "application/json" };
const read = async () => {
  const response = await fetch(`${origin}/api/content`, { headers: owner });
  assert.equal(response.status, 200);
  return response.json();
};
const save = (content, revision, action = "draft", extra = {}) => fetch(`${origin}/api/content`, { method: "PUT", headers: { ...headers, ...extra }, body: JSON.stringify({ content, revision, action }) });

assert.equal((await fetch(`${origin}/api/content`)).status, 401);
assert.equal((await fetch(`${origin}/api/content`, { method: "PUT", headers: { Origin: origin, "Content-Type": "application/json" }, body: "{}" })).status, 401);
assert.equal((await fetch(`${origin}/api/content`, { headers: { ...owner, "oai-authenticated-user-email": "visitor@example.com" } })).status, 403);
const original = await read();
assert.equal((await save(original.draft, original.revision, "draft", { Origin: "https://other.example" })).status, 403);
assert.equal((await save({ ...original.draft, linkedin: "javascript:alert(1)" }, original.revision)).status, 400);
assert.equal((await save({ ...original.draft, name: "x".repeat(210000) }, original.revision)).status, 413);
assert.equal((await read()).revision, original.revision);

let changed = false;
try {
  const draft = structuredClone(original.draft);
  draft.hero.description = "CMS integration draft marker";
  let response = await save(draft, original.revision);
  assert.equal(response.status, 200); changed = true;
  let state = await read();
  assert.equal(state.draft.hero.description, draft.hero.description);
  assert.deepEqual(state.published, original.published);
  assert.equal((await save(original.draft, original.revision)).status, 409);
  assert.equal((await read()).draft.hero.description, draft.hero.description);
  draft.hero.description = "CMS published verification marker";
  draft.name = "CMS </script><script>alert(1)</script>";
  draft.seo.title = "CMS metadata verification marker";
  response = await save(draft, state.revision, "publish");
  assert.equal(response.status, 200);
  state = await read(); assert.deepEqual(state.published, draft);
  const publicResponse = await fetch(origin);
  assert.equal(publicResponse.status, 200);
  const html = await publicResponse.text();
  assert.ok(html.includes(draft.hero.description));
  assert.ok(html.includes(`<title>${draft.seo.title}</title>`));
  assert.ok(!html.includes("CMS </script><script>alert(1)</script>"));
} finally {
  if (changed) {
    let state = await read();
    assert.equal((await save(original.published, state.revision, "publish")).status, 200);
    state = await read();
    assert.equal((await save(original.draft, state.revision)).status, 200);
    const restored = await read();
    assert.deepEqual(restored.draft, original.draft);
    assert.deepEqual(restored.published, original.published);
  }
}
console.log("Passed: access controls, origin checks, validation, body limit, draft isolation, stale-save rejection, publishing, metadata, escaping, and local content restoration.");
