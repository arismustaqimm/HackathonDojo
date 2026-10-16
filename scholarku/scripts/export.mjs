// Produce a clean static upload folder. Includes the user's public config.js as-is.
import { mkdir, copyFile, cp } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { join } from "node:path";
const root = fileURLToPath(new URL("../", import.meta.url));
const target = join(root, "dist");
const files = [
  "index.html",
  "auth-callback.html",
  "auth-callback.js",
  "config.js",
  "supabase.js",
  "localization.js",
  "navigation.js",
  "auth-ui.js",
  "site-utils.js",
  "career-data.js",
  "career-guidance.js",
  "funding-data.js",
  "mentor-data.js",
  "opportunities.js",
  "community.js",
  "mentorship.js",
  "real-pages.js",
  "app.js",
  "styles.css",
  "real-theme.css",
  "appearance.css",
  "account.css",
  "live-features.css",
];
await mkdir(target, { recursive: true });
await Promise.all(
  files.map((name) => copyFile(join(root, name), join(target, name))),
);
await cp(join(root, "assets"), join(target, "assets"), { recursive: true });
console.log("Static site exported to " + target);
console.log(
  "Upload the dist folder to Netlify. Authentication uses your existing public config.js.",
);
