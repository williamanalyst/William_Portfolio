import { cpSync, mkdirSync, writeFileSync } from "node:fs";

cpSync("out", "dist", { recursive: true });
mkdirSync("dist/server", { recursive: true });
mkdirSync("dist/.openai", { recursive: true });
cpSync(".openai/hosting.json", "dist/.openai/hosting.json");
writeFileSync("dist/server/index.js", `export default {
  async fetch(request, env) {
    return env.ASSETS.fetch(request);
  }
};\n`);
