#!/usr/bin/env node
/**
 * One-shot asset pipeline. Reads from ./legacy-site (read-only reference clone)
 * and third-party icon CDNs, writes everything into ./public.
 *
 * Nothing in ./legacy-site is modified, and nothing in ./legacy-site is
 * referenced at runtime. After this script runs, ./public is self-contained.
 *
 *   node scripts/prepare-assets.mjs
 *
 * Steps
 *   1. copy portrait, certificates, CVs, favicons
 *   2. derive responsive portrait crops (square + wide) via sharp
 *   3. rasterize page 1 of each certificate PDF via macOS qlmanage
 *   4. fetch tech-stack logos, normalise to single-colour currentColor SVG
 *   5. compose the 1200x630 Open Graph card from the real portrait + wordmark
 */

import { execFile } from "node:child_process";
import { promisify } from "node:util";
import fs from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const run = promisify(execFile);
const ROOT = path.resolve(import.meta.dirname, "..");
const LEGACY = path.join(ROOT, "legacy-site");
const PUBLIC = path.join(ROOT, "public");

const log = (...a) => console.log("  ", ...a);
const step = (n, t) => console.log(`\n[${n}] ${t}`);

async function mkdirp(p) {
  await fs.mkdir(p, { recursive: true });
}

// ── 1. straight copies ──────────────────────────────────────────────────────
const COPIES = [
  ["pp/pp.jpg", "portrait/rafid.jpg"],
  ["cv/CV Ats.pdf", "cv/rafid-azhar-cv-ats.pdf"],
  ["cv/CV Linkedin.pdf", "cv/rafid-azhar-cv-linkedin.pdf"],
  ["favicon.ico", "favicon.ico"],
  ["favicon-192.png", "favicon-192.png"],
  ["apple-touch-icon.png", "apple-touch-icon.png"],
  ["certificate/mikrotik mtcna.pdf", "certificates/mtcna.pdf"],
  ["certificate/BNSP Network Technician.jpeg", "certificates/bnsp-network-technician.jpeg"],
  ["certificate/Juara 1 CTF.jpeg", "certificates/ctf-first-place.jpeg"],
  ["certificate/Ketua Pelaksana Makrab.jpeg", "certificates/makrab-chief-executive.jpeg"],
  ["certificate/koordinator web infra.jpeg", "certificates/code-challenge-coordinator.jpeg"],
  ["certificate/Aslab Jaringan Komputer.pdf", "certificates/lab-assistant-networks.pdf"],
  ["certificate/Asprak jaringan komputer.pdf", "certificates/practicum-assistant-networks.pdf"],
  ["certificate/Asprak sistem operasi.pdf", "certificates/practicum-assistant-os.pdf"],
];

async function copyAssets() {
  step(1, "Copying source assets from legacy-site");
  for (const [from, to] of COPIES) {
    const src = path.join(LEGACY, from);
    const dest = path.join(PUBLIC, to);
    await mkdirp(path.dirname(dest));
    await fs.copyFile(src, dest);
    log(`${from}  ->  public/${to}`);
  }
}

// ── 2. portrait derivatives ─────────────────────────────────────────────────
// Source is 1024x687 landscape. The hero wants a square; the OG card wants a
// wide crop. Both are derived from the one real photograph, never upscaled.
async function portraitCrops() {
  step(2, "Deriving portrait crops");
  const src = path.join(PUBLIC, "portrait/rafid.jpg");
  const meta = await sharp(src).metadata();
  log(`source ${meta.width}x${meta.height}`);

  // Square crop, gravity north so the face is not cut off. 687x687 native.
  await sharp(src)
    .extract({
      left: Math.round((meta.width - meta.height) / 2),
      top: 0,
      width: meta.height,
      height: meta.height,
    })
    .webp({ quality: 88 })
    .toFile(path.join(PUBLIC, "portrait/rafid-square.webp"));
  log("portrait/rafid-square.webp  687x687");

  await sharp(src).webp({ quality: 86 }).toFile(path.join(PUBLIC, "portrait/rafid.webp"));
  log(`portrait/rafid.webp  ${meta.width}x${meta.height}`);
}

// ── 3. certificate PDFs -> images ───────────────────────────────────────────
// macOS Quick Look is the only rasterizer present on this machine (no
// pdftoppm, no ImageMagick, no Ghostscript). It renders page 1 only, which is
// all these single-page certificates need.
// "eprt" is the one entry whose source PDF is not copied out of legacy-site in
// step 1: it postdates the legacy site and lives in public/certificates
// directly. Step 3 reads from public/ either way, so it rasterizes like the
// rest.
const PDF_CERTS = [
  "mtcna",
  "lab-assistant-networks",
  "practicum-assistant-networks",
  "practicum-assistant-os",
  "eprt",
];

async function rasterizePdfs() {
  step(3, "Rasterizing certificate PDFs (qlmanage)");
  const tmp = path.join(ROOT, ".asset-tmp");
  await mkdirp(tmp);

  for (const name of PDF_CERTS) {
    const pdf = path.join(PUBLIC, `certificates/${name}.pdf`);
    await run("qlmanage", ["-t", "-s", "1600", "-o", tmp, pdf]);
    const produced = path.join(tmp, `${name}.pdf.png`);
    await sharp(produced)
      .flatten({ background: "#ffffff" })
      .webp({ quality: 88 })
      .toFile(path.join(PUBLIC, `certificates/${name}.webp`));
    const m = await sharp(path.join(PUBLIC, `certificates/${name}.webp`)).metadata();
    log(`certificates/${name}.webp  ${m.width}x${m.height}`);
  }

  await fs.rm(tmp, { recursive: true, force: true });
}

// ── 4. tech-stack logos ─────────────────────────────────────────────────────
// Simple Icons is the primary source. AWS and Azure have both been removed
// from Simple Icons on trademark request (verified: both return 404), so those
// two fall back to devicon. Every mark is normalised to a single path set with
// fill="currentColor" so it renders correctly in light and dark mode from one
// file, per Section 4.8.
const SIMPLE_ICONS = [
  ["docker", "Docker"],
  ["githubactions", "GitHub Actions"],
  ["cloudflare", "Cloudflare"],
  ["linux", "Linux"],
  ["ubuntu", "Ubuntu"],
  ["debian", "Debian"],
  ["archlinux", "Arch Linux"],
  ["cisco", "Cisco"],
  ["mikrotik", "MikroTik"],
  ["vmware", "VMware"],
  ["virtualbox", "VirtualBox"],
  ["googlecloud", "Google Cloud"],
  ["git", "Git"],
  ["github", "GitHub"],
];

const DEVICON_FALLBACKS = [
  ["amazonwebservices/amazonwebservices-plain-wordmark", "aws", "Amazon Web Services"],
  ["azure/azure-original", "azure", "Microsoft Azure"],
];

function normaliseSvg(svg) {
  return svg
    // drop any hardcoded fill so currentColor drives it
    .replace(/\s(fill|stroke)="(?!none)[^"]*"/g, "")
    .replace(/<svg /, '<svg fill="currentColor" ')
    .replace(/<title>.*?<\/title>/s, "")
    .trim();
}

async function fetchLogos() {
  step(4, "Fetching tech-stack logos");
  const dir = path.join(PUBLIC, "logos");
  await mkdirp(dir);
  const manifest = [];

  for (const [slug, label] of SIMPLE_ICONS) {
    const res = await fetch(`https://cdn.simpleicons.org/${slug}`);
    if (!res.ok) throw new Error(`Simple Icons ${slug} returned ${res.status}`);
    await fs.writeFile(path.join(dir, `${slug}.svg`), normaliseSvg(await res.text()));
    manifest.push({ file: `${slug}.svg`, label, source: "simple-icons" });
    log(`${slug}.svg  (simple-icons)`);
  }

  for (const [devPath, slug, label] of DEVICON_FALLBACKS) {
    const url = `https://raw.githubusercontent.com/devicons/devicon/master/icons/${devPath}.svg`;
    const res = await fetch(url);
    if (!res.ok) throw new Error(`devicon ${devPath} returned ${res.status}`);
    await fs.writeFile(path.join(dir, `${slug}.svg`), normaliseSvg(await res.text()));
    manifest.push({ file: `${slug}.svg`, label, source: "devicon" });
    log(`${slug}.svg  (devicon fallback, not in Simple Icons)`);
  }

  await fs.writeFile(
    path.join(dir, "MANIFEST.json"),
    JSON.stringify(
      {
        note: "Marks are trademarks of their respective owners, used here to identify tools worked with. Simple Icons is CC0; devicon is MIT.",
        icons: manifest,
      },
      null,
      2,
    ) + "\n",
  );
}

// ── 5. Open Graph card ──────────────────────────────────────────────────────
// Composed from assets already owned: the real portrait, the <rafidazhar.dev/>
// wordmark, and the site's own type stack. No invented imagery.
async function ogCard() {
  step(5, "Composing 1200x630 Open Graph card");

  const PAPER = "#101416";
  const TEXT = "#e8ecea";
  const MUTED = "#93a19f";
  const LIME = "#c3ec3f";

  const portrait = await sharp(path.join(PUBLIC, "portrait/rafid-square.webp"))
    .resize(430, 430, { fit: "cover", position: "top" })
    .toBuffer();

  // The lime block is a marker the type sits *inside*, so its height must clear
  // the full em box of the 30px label, not sit under the baseline as a rule.
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630">
  <rect width="1200" height="630" fill="${PAPER}"/>
  <rect x="0" y="0" width="1200" height="8" fill="${LIME}"/>
  <text x="72" y="150" font-family="Menlo, monospace" font-size="25" fill="${MUTED}"
        letter-spacing="0.5">&lt;rafidazhar.dev/&gt;</text>
  <text x="72" y="286" font-family="Helvetica, Arial, sans-serif" font-size="76"
        font-weight="700" fill="${TEXT}">Rafid Azhar</text>
  <text x="72" y="372" font-family="Helvetica, Arial, sans-serif" font-size="76"
        font-weight="700" fill="${TEXT}">Adi Saputra</text>
  <rect x="62" y="410" width="428" height="48" fill="${LIME}"/>
  <text x="76" y="443" font-family="Helvetica, Arial, sans-serif" font-size="30"
        font-weight="600" fill="${PAPER}">DevOps &amp; Cloud Engineer</text>
  <text x="72" y="528" font-family="Helvetica, Arial, sans-serif" font-size="25"
        fill="${MUTED}" letter-spacing="0.4" xml:space="preserve">AWS     Docker     CI/CD     Cloudflare     MikroTik</text>
</svg>`;

  await sharp(Buffer.from(svg))
    .composite([{ input: portrait, left: 660, top: 100 }])
    .png()
    .toFile(path.join(PUBLIC, "og.png"));

  const m = await sharp(path.join(PUBLIC, "og.png")).metadata();
  log(`og.png  ${m.width}x${m.height}`);
}

// ── main ────────────────────────────────────────────────────────────────────
try {
  await fs.access(LEGACY);
} catch {
  console.error("legacy-site/ not found. This script needs the reference clone.");
  process.exit(1);
}

await copyAssets();
await portraitCrops();
await rasterizePdfs();
await fetchLogos();
await ogCard();

console.log("\nAssets ready in public/. legacy-site/ untouched.\n");
