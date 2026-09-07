import { headers } from "next/headers";
import { env } from "cloudflare:workers";

export async function editorAccess() {
  const incoming = await headers();
  // Only trusted Sites dispatch supplies these headers in production.
  // There is deliberately no client flag or development authentication bypass.
  const id = incoming.get("oai-authenticated-user-id");
  const email = incoming.get("oai-authenticated-user-email");
  if (!id || !email) return "anonymous";
  if (!env.CMS_ADMIN_EMAIL) return "unconfigured";
  return email.toLowerCase() === env.CMS_ADMIN_EMAIL.trim().toLowerCase() ? "editor" : "forbidden";
}
