import test from "node:test";
import assert from "node:assert/strict";
import { runInNewContext } from "node:vm";
import { themeBootstrap, themeStorageKey } from "../app/theme.ts";

function initialize(saved, systemDark, blocked = false) {
  const document = { documentElement: { dataset: {} } };
  runInNewContext(themeBootstrap, {
    document,
    localStorage: { getItem(key) {
      assert.equal(key, themeStorageKey);
      if (blocked) throw new Error("Storage unavailable");
      return saved;
    } },
    window: { matchMedia: () => ({ matches: systemDark }) }
  });
  return document.documentElement.dataset.theme;
}

test("first visit follows the system theme", () => {
  assert.equal(initialize(null, true), "dark");
  assert.equal(initialize(null, false), "light");
});

test("saved preference overrides the system on reload", () => {
  assert.equal(initialize("light", true), "light");
  assert.equal(initialize("dark", false), "dark");
});

test("invalid or blocked storage safely falls back to the system", () => {
  assert.equal(initialize("invalid", true), "dark");
  assert.equal(initialize(null, false, true), "light");
  assert.equal(initialize(null, true, true), "dark");
});
