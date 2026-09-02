# rafidazhar.dev

Portfolio for Rafid Azhar Adi Saputra, DevOps and Cloud Engineer.

Next.js App Router, Tailwind v4, Motion, GSAP ScrollTrigger. Self-hosted on a
VPS behind nginx.

## Setup

```bash
npm ci && cp .env.example .env.local && npm run prepare:assets && npm run dev
```

`prepare:assets` is a one-shot pipeline that reads `./legacy-site` (read-only
reference clone) plus the icon CDNs and writes everything into `./public`:
portrait crops, certificate PDFs rasterized to WebP, 16 tech logos, and the
1200x630 Open Graph card. After it runs, `public/` is self-contained and
nothing references `legacy-site` at runtime.

It needs macOS `qlmanage` for the PDF rasterization step. On Linux, swap that
call for `pdftoppm -r 150 -png -f 1 -l 1`.

## Scripts

| Command | What it does |
|---|---|
| `npm run dev` | Dev server on :3000 |
| `npm run build` | Production build (`output: standalone`) |
| `npm run prepare:assets` | Rebuild `public/` from `legacy-site` and the icon CDNs |
| `npm run audit:dashes` | Fails on any em-dash, en-dash, emoji or scroll listener |

## The origin

`NEXT_PUBLIC_SITE_URL` is the only place an origin is written. `metadataBase`,
canonical, `og:url`, `og:image`, Twitter card URLs, JSON-LD, `sitemap.xml` and
`robots.txt` all derive from it via `lib/site.ts`.

It stays on `https://rafidef.github.io` until `rafidazhar.dev` is purchased and
resolving, so no dead canonical is advertised to crawlers. Cutover is that one
line plus a rebuild. See `deploy/README.md`.

## Structure

```
app/          layout, page, sitemap.ts, robots.ts, globals.css (design tokens)
components/
  sections/   one file per band, each a distinct layout family
  motion/     Reveal (5.C), RevealItem, Magnetic
lib/          site.ts (origin), content.ts (all copy), svg.ts, obfuscate.ts
scripts/      prepare-assets.mjs, audit-dashes.mjs
deploy/       systemd unit, nginx conf, deploy.sh, GitHub Pages redirect
legacy-site/  read-only reference. Never modified, never shipped.
```

## Layout families

Nine bands, nine families. Deliberate: no two sections share a shape.

| Band | Family | Scroll technique |
|---|---|---|
| `#hero` | Asymmetric split, off-grid | Motion `useScroll` parallax |
| Stack strip | Full-bleed marquee | CSS transform loop |
| `#about` | Split-screen scroll | Motion parallax + 5.C reveal |
| `#experience` | Sticky aside | CSS `position: sticky` + 5.C |
| `#skills` | Bento, 6 items 6 cells | 5.C |
| `#organizations` | Pinned card stack | GSAP 5.A |
| `#certifications` | Horizontal pan | GSAP 5.B |
| `#education` | Editorial ledger | 5.C |
| `#contact` | Full-bleed type closer | 5.C |

Both GSAP sections are desktop-only via `gsap.matchMedia`, and both collapse
under `prefers-reduced-motion`. Certifications degrades to a native
scroll-snap rail on touch.

## Contact obfuscation

Email and phone are rot13 in source, decoded at build time and written into
the markup as numeric character references. The links are real, focusable and
work with JavaScript disabled; a regex harvester scanning raw HTML finds
nothing. `lib/obfuscate.ts`.
