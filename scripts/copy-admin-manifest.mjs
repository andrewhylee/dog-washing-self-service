import { cpSync, mkdirSync, existsSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const manifestSrc = join(root, "admin", ".herenow", "proxy.json");
const manifestDest = join(root, "admin", "out", ".herenow");

// The dashboard is served from a path mount (https://studiomuni.com/admin/) via
// Next `basePath: "/admin"`, so assets resolve consistently on both hosts.
if (existsSync(manifestSrc)) {
  mkdirSync(manifestDest, { recursive: true });
  cpSync(manifestSrc, join(manifestDest, "proxy.json"));
  console.log("Copied .herenow/proxy.json into admin/out");
} else {
  console.warn("admin/.herenow/proxy.json not found — publishing will lack the proxy manifest.");
}