import { editorAccess } from "../../chatgpt-auth";
import { readContent, saveContent } from "../../../content/store";
import { normalizeContent } from "../../../content/validation";

export const dynamic = "force-dynamic";
const json = (body: unknown, status = 200) => Response.json(body, { status, headers: { "Cache-Control": "no-store" } });

export async function GET() {
  const access = await editorAccess();
  if (access !== "editor") return json({ error: "Sign in with the portfolio owner's account." }, access === "anonymous" ? 401 : 403);
  try { return json(await readContent()); }
  catch { return json({ error: "Content could not be loaded. Please try again." }, 503); }
}

export async function PUT(request: Request) {
  const access = await editorAccess();
  if (access !== "editor") return json({ error: "Sign in with the portfolio owner's account." }, access === "anonymous" ? 401 : 403);
  if (request.headers.get("origin") !== new URL(request.url).origin) return json({ error: "Save requests must come from this website." }, 403);
  if (!request.headers.get("content-type")?.startsWith("application/json")) return json({ error: "Expected JSON content." }, 415);
  let payload;
  try {
    const reader = request.body?.getReader();
    if (!reader) throw new Error("No content received.");
    const chunks: Uint8Array[] = [];
    let size = 0;
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      size += value.byteLength;
      if (size > 200_000) { await reader.cancel(); return json({ error: "Content is too large (maximum 200 KB)." }, 413); }
      chunks.push(value);
    }
    const bytes = new Uint8Array(size);
    let offset = 0;
    for (const chunk of chunks) { bytes.set(chunk, offset); offset += chunk.length; }
    payload = JSON.parse(new TextDecoder().decode(bytes));
    if (!payload || !Number.isSafeInteger(payload.revision) || payload.revision < 0 || !["draft", "publish"].includes(payload.action)) throw new Error("Invalid save request.");
    payload.content = normalizeContent(payload.content);
  } catch (error) { return json({ error: error instanceof Error ? error.message : "Invalid content." }, 400); }
  try {
    if (!await saveContent(payload.content, payload.revision, payload.action === "publish")) return json({ error: "Content changed in another session. Copy your edits before reloading to avoid overwriting newer work." }, 409);
    return json({ revision: payload.revision + 1 });
  } catch { return json({ error: "Your changes could not be saved. Keep this page open and try again." }, 503); }
}
