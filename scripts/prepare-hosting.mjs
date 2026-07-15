import { copyFile, mkdir } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const projectRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const source = resolve(projectRoot, ".openai", "hosting.json");
const destinationDirectory = resolve(projectRoot, "dist", ".openai");
const destination = resolve(destinationDirectory, "hosting.json");

await mkdir(destinationDirectory, { recursive: true });
await copyFile(source, destination);

console.log("Copied .openai/hosting.json into the deployable dist artifact.");
