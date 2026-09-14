import { cpSync, mkdirSync, existsSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const manifestSrc = join(root, "admin", ".herenow", "proxy.json");
const manifestDest = join(root, "admin", "out", ".herenow");

if (existsSync(manifestSrc)) {
  mkdirSync(manifestDest, { recursive: true });
  cpSync(manifestSrc, join(manifestDest, "proxy.json"));
  console.log("Copied .herenow/proxy.json into admin/out");
} else {
  console.warn("admin/.herenow/proxy.json not found — publishing will lack the proxy manifest.");
}