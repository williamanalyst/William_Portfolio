import test from "node:test";
import assert from "node:assert/strict";
import { site } from "../content/site.ts";
import { validateContent, normalizeContent } from "../content/validation.ts";

test("saved content retires résumé fields without resetting user edits", () => {
  const legacy = structuredClone(site);
  legacy.resume = "/old-resume.pdf";
  legacy.hero.resumeLabel = "Download résumé";
  legacy.hero.description = "My saved introduction";
  legacy.linkedin = "https://www.linkedin.com/in/custom-profile/";
  const updated = normalizeContent(legacy);
  assert.equal(updated.hero.description, legacy.hero.description);
  assert.equal(updated.linkedin, legacy.linkedin);
  assert.ok(!("resume" in updated));
  assert.ok(!("resumeLabel" in updated.hero));
  assert.equal(legacy.resume, "/old-resume.pdf");
  assert.deepEqual(normalizeContent(updated), updated);
  assert.throws(() => normalizeContent({ ...legacy, unexpected: true }));
});

test("existing portfolio and reordered/new case studies are valid", () => {
  const content = structuredClone(site);
  content.projects.reverse();
  content.projects.push({ ...content.projects[0], title: "Another case study" });
  assert.doesNotThrow(() => validateContent(content));
});

test("missing fields, empty lists and invalid field types cannot replace the site", () => {
  for (const mutate of [c => delete c.hero, c => c.projects = [], c => c.name = 42, c => c.projects[0].tags = [null], c => c.extra = "unexpected"]) {
    const content = structuredClone(site); mutate(content);
    assert.throws(() => validateContent(content));
  }
});

test("links reject executable schemes and protocol-relative URLs", () => {
  for (const url of ["javascript:alert(1)", "//attacker.example/image.png", "data:text/html,unsafe"]) {
    const content = structuredClone(site); content.projects[0].image = url;
    assert.throws(() => validateContent(content));
  }
  const content = structuredClone(site); content.linkedin = "http://example.com";
  assert.throws(() => validateContent(content));
});

test("empty and oversized text is rejected; plain text markup is preserved as text", () => {
  const content = structuredClone(site);
  content.hero.description = " "; assert.throws(() => validateContent(content));
  content.hero.description = "x".repeat(6001); assert.throws(() => validateContent(content));
  content.hero.description = "<script>plain text</script>"; assert.doesNotThrow(() => validateContent(content));
});
