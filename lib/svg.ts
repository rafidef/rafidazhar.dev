import { readFileSync } from "node:fs";
import path from "node:path";
import { cache } from "react";

const DIR = path.join(process.cwd(), "public", "logos");

/**
 * Inlines a vetted logo from public/logos at render time so the mark inherits
 * `currentColor` and therefore works in both themes from one file. An <img>
 * cannot inherit colour, and duplicating light/dark variants would double the
 * asset count for no gain.
 *
 * Only reads from the fixed logo directory, and only files this repo wrote
 * during `npm run prepare:assets`.
 */
export const inlineLogo = cache((file: string): string => {
  if (!/^[a-z0-9-]+\.svg$/.test(file)) throw new Error(`Refusing to inline: ${file}`);
  return readFileSync(path.join(DIR, file), "utf8");
});
