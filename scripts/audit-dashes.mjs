#!/usr/bin/env node
/**
 * Section 9.G enforcement, run mechanically rather than by eye.
 *
 * Scans every source file for characters banned from user-visible text:
 *   U+2014 em-dash, U+2013 en-dash, U+2012 figure dash, U+2011 non-breaking
 *   hyphen, U+2010 hyphen, U+2212 minus sign, and their HTML entities.
 *
 * Also flags emoji in source (Section 3.D) and any scroll listener
 * (Section 5.D hard ban).
 *
 * Exits non-zero on any hit so it can gate a build.
 */

import { readdirSync, readFileSync, statSync } from "node:fs";
import path from "node:path";

const ROOT = path.resolve(import.meta.dirname, "..");
/* .claude and .agents hold the design rules themselves, which necessarily
   quote every character the rules ban. They are input, not shipped output. */
const SKIP = new Set([
  "node_modules",
  ".next",
  ".git",
  "legacy-site",
  "public",
  ".asset-tmp",
  ".claude",
  ".agents",
]);
const EXT = new Set([".ts", ".tsx", ".js", ".jsx", ".mjs", ".css", ".md", ".json", ".html"]);

const DASHES = [
  ["U+2010 hyphen", /‐/g],
  ["U+2011 non-breaking hyphen", /‑/g],
  ["U+2012 figure dash", /‒/g],
  ["U+2013 en-dash", /–/g],
  ["U+2014 em-dash", /—/g],
  ["U+2212 minus sign", /−/g],
  ["&mdash; entity", /&mdash;/gi],
  ["&ndash; entity", /&ndash;/gi],
  ["&#8212; entity", /&#8212;/g],
  ["&#8211; entity", /&#8211;/g],
  ["&#8209; entity", /&#8209;/g],
];

/* Emoji_Presentation rather than Extended_Pictographic: the latter also
   matches typographic marks that are not emoji and are perfectly fine in body
   copy, notably the copyright sign in the footer. */
const EMOJI = /\p{Emoji_Presentation}|\p{Extended_Pictographic}️/gu;
const SCROLL_LISTENER = /addEventListener\(\s*["'`]scroll["'`]/g;

function walk(dir, out = []) {
  for (const name of readdirSync(dir)) {
    if (SKIP.has(name)) continue;
    const full = path.join(dir, name);
    if (statSync(full).isDirectory()) walk(full, out);
    else if (EXT.has(path.extname(full))) out.push(full);
  }
  return out;
}

let failures = 0;
const report = (file, line, label, text) => {
  failures++;
  console.log(`  ${path.relative(ROOT, file)}:${line}  ${label}`);
  console.log(`      ${text.trim().slice(0, 110)}`);
};

for (const file of walk(ROOT)) {
  // The auditor necessarily contains the characters it searches for.
  if (path.basename(file) === "audit-dashes.mjs") continue;

  const lines = readFileSync(file, "utf8").split("\n");
  lines.forEach((line, i) => {
    for (const [label, re] of DASHES) {
      re.lastIndex = 0;
      if (re.test(line)) report(file, i + 1, label, line);
    }
    EMOJI.lastIndex = 0;
    if (EMOJI.test(line)) report(file, i + 1, "emoji (Section 3.D)", line);
    SCROLL_LISTENER.lastIndex = 0;
    if (SCROLL_LISTENER.test(line)) report(file, i + 1, "scroll listener (Section 5.D)", line);
  });
}

if (failures === 0) {
  console.log("Dash audit: 0 violations. Emoji: 0. Scroll listeners: 0.");
  process.exit(0);
}
console.log(`\nDash audit: ${failures} violation(s).`);
process.exit(1);
