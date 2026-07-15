import { copyFile, mkdir, readFile, readdir, rename, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const projectRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const source = resolve(projectRoot, ".openai", "hosting.json");
const destinationDirectory = resolve(projectRoot, "dist", ".openai");
const destination = resolve(destinationDirectory, "hosting.json");
const serverDirectory = resolve(projectRoot, "dist", "server");
const workerEntry = resolve(serverDirectory, "index.js");
const vinextHandler = resolve(serverDirectory, "vinext-handler.js");

async function rewriteGeneratedImports(directory) {
  const entries = await readdir(directory, { withFileTypes: true });

  await Promise.all(
    entries.map(async (entry) => {
      const path = resolve(directory, entry.name);
      if (entry.isDirectory()) {
        await rewriteGeneratedImports(path);
        return;
      }
      if (!entry.isFile() || !entry.name.endsWith(".js") || path === vinextHandler) {
        return;
      }

      const original = await readFile(path, "utf8");
      const rewritten = original.replace(
        /(["'])((?:\.\.\/)+index\.js)\1/g,
        (match, _quote, specifier) =>
          resolve(dirname(path), specifier) === workerEntry
            ? match.replace("index.js", "vinext-handler.js")
            : match,
      );
      if (rewritten !== original) {
        await writeFile(path, rewritten);
      }
    }),
  );
}

await mkdir(destinationDirectory, { recursive: true });
await copyFile(source, destination);
await rename(workerEntry, vinextHandler);
await rewriteGeneratedImports(serverDirectory);
await writeFile(
  workerEntry,
  [
    'import handler from "./vinext-handler.js";',
    "",
    "export default {",
    "  fetch(request) {",
    "    return handler(request);",
    "  },",
    "};",
    "",
  ].join("\n"),
);

console.log("Copied .openai/hosting.json into the deployable dist artifact.");
console.log("Wrapped the Vinext request function as a Cloudflare module Worker.");
