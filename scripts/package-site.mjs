import { cpSync, existsSync, mkdirSync, mkdtempSync, readFileSync } from "node:fs";
import { resolve, basename, join } from "node:path";
import { execFileSync } from "node:child_process";

const root = process.cwd();
const hosting = JSON.parse(readFileSync(resolve(root, ".openai/hosting.json"), "utf8"));
if (!hosting.project_id || hosting.d1 !== "DB" || !existsSync(resolve(root, "dist/server/index.js"))) throw new Error("Build the Sites Worker before packaging.");
mkdirSync(resolve(root, ".wrangler"), { recursive: true });
// Use a fresh staging directory; never clean up or overwrite another build tree.
const stage = mkdtempSync(resolve(root, ".wrangler/site-package-"));
const output = join(stage, "dist");
mkdirSync(join(output, ".openai"), { recursive: true });
const filter = path => !basename(path).startsWith(".env") && ![".dev.vars", "wrangler.json"].includes(basename(path));
cpSync(resolve(root, "dist/server"), join(output, "server"), { recursive: true, filter });
cpSync(resolve(root, "dist/client"), join(output, "client"), { recursive: true, filter });
cpSync(resolve(root, ".openai/hosting.json"), join(output, ".openai/hosting.json"));
cpSync(resolve(root, "drizzle"), join(output, ".openai/drizzle"), { recursive: true });
const archive = join(stage, "portfolio.tar.gz");
execFileSync("tar", ["-czf", archive, "-C", stage, "dist"]);
const entries = execFileSync("tar", ["-tzf", archive], { encoding: "utf8" });
if (!entries.includes("dist/server/index.js") || !entries.includes("dist/.openai/drizzle/meta/_journal.json") || /(?:^|\/)\.dev.vars|(?:^|\/)\.env/m.test(entries)) throw new Error("Invalid or unsafe deployment archive.");
console.log(archive);
