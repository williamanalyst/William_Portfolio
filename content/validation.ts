import { site } from "./site.ts";

type Editable<T> = T extends string ? string : T extends readonly (infer U)[] ? Editable<U>[] : { -readonly [K in keyof T]: Editable<T[K]> };
export type SiteContent = Editable<typeof site>;

// Existing saved drafts and open editor sessions may still contain résumé fields.
// Remove only those retired fields, preserving every other saved value.
export function normalizeContent(value: unknown): SiteContent {
  const content = structuredClone(value);
  if (content && typeof content === "object" && !Array.isArray(content)) {
    const fields = content as Record<string, unknown>;
    delete fields.resume;
    if (fields.hero && typeof fields.hero === "object" && !Array.isArray(fields.hero)) {
      delete (fields.hero as Record<string, unknown>).resumeLabel;
    }
  }
  validateContent(content);
  return content;
}

// One schema for the editor and API: preserve the content shape, not literal copy.
export function validateContent(value: unknown): asserts value is SiteContent {
  function check(input: unknown, example: unknown, path: string) {
    if (typeof example === "string") {
      if (typeof input !== "string" || !input.trim() || input.length > 6000) throw new Error(`${path}: enter between 1 and 6,000 characters.`);
      const key = path.split(".").at(-1);
      if (["siteUrl", "linkedin"].includes(key!)) {
        let url: URL;
        try { url = new URL(input); } catch { throw new Error(`${path}: enter a full HTTPS address.`); }
        if (url.protocol !== "https:" || url.username || url.password) throw new Error(`${path}: enter a full HTTPS address.`);
      }
      if (key === "image" && !/^\/(?!\/)[a-zA-Z0-9_./% -]+$/.test(input) && !/^https:\/\/[^\s]+$/.test(input)) {
        throw new Error(`${path}: use an HTTPS address or a path starting with /.`);
      }
      return;
    }
    if (Array.isArray(example)) {
      if (!Array.isArray(input) || input.length < 1 || input.length > 50) throw new Error(`${path}: keep between 1 and 50 entries.`);
      input.forEach((item, index) => check(item, example[0], `${path}.${index + 1}`));
      return;
    }
    if (!input || typeof input !== "object" || Array.isArray(input)) throw new Error(`${path}: invalid content.`);
    const keys = Object.keys(example as object);
    if (Object.keys(input).length !== keys.length) throw new Error(`${path}: unexpected content fields.`);
    for (const key of keys) check((input as Record<string, unknown>)[key], (example as Record<string, unknown>)[key], path ? `${path}.${key}` : key);
  }
  check(value, site, "");
}
