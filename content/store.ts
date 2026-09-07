import { env } from "cloudflare:workers";
import { site } from "./site";
import type { SiteContent } from "./validation";

export type ContentState = { draft: SiteContent; published: SiteContent; revision: number; updatedAt: string | null; publishedAt: string | null };

export async function readContent(): Promise<ContentState> {
  const row = await env.DB.prepare("SELECT draft, published, revision, updated_at, published_at FROM portfolio_content WHERE id = 1")
    .first<{ draft: string; published: string; revision: number; updated_at: string; published_at: string | null }>();
  if (!row) return { draft: JSON.parse(JSON.stringify(site)), published: JSON.parse(JSON.stringify(site)), revision: 0, updatedAt: null, publishedAt: null };
  return { draft: JSON.parse(row.draft), published: JSON.parse(row.published), revision: row.revision, updatedAt: row.updated_at, publishedAt: row.published_at };
}

export async function saveContent(content: SiteContent, revision: number, publish: boolean): Promise<boolean> {
  const now = new Date().toISOString();
  const json = JSON.stringify(content);
  // Seed only on the first save. Concurrent first saves still use the revision check.
  await env.DB.prepare("INSERT OR IGNORE INTO portfolio_content (id, draft, published, revision, updated_at) VALUES (1, ?, ?, 0, ?)")
    .bind(JSON.stringify(site), JSON.stringify(site), now).run();
  const result = publish
    ? await env.DB.prepare("UPDATE portfolio_content SET draft = ?, published = ?, revision = revision + 1, updated_at = ?, published_at = ? WHERE id = 1 AND revision = ?").bind(json, json, now, now, revision).run()
    : await env.DB.prepare("UPDATE portfolio_content SET draft = ?, revision = revision + 1, updated_at = ? WHERE id = 1 AND revision = ?").bind(json, now, revision).run();
  return result.meta.changes === 1;
}
