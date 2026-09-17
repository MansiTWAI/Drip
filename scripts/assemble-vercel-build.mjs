import { cp, mkdir, rm } from "node:fs/promises";
import { resolve } from "node:path";

const root = resolve(import.meta.dirname, "..");
const output = resolve(root, "dist");

await rm(output, { recursive: true, force: true });
await mkdir(output, { recursive: true });
await cp(resolve(root, "frontend", "dist"), output, { recursive: true });
await cp(resolve(root, "admin", "dist"), resolve(output, "admin"), {
  recursive: true,
});

console.log("Assembled storefront and admin builds in dist/.");
