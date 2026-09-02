#!/usr/bin/env bash
#
# Turn the old GitHub Pages site into a redirect shell pointing at the new
# origin.
#
#   ./deploy/cutover-old-origin.sh            # stage and show the diff, no push
#   ./deploy/cutover-old-origin.sh --push     # stage, show the diff, then push
#
# Run this ONLY after the new domain is live. The script refuses otherwise,
# because a redirect to a dead origin takes the site off the internet rather
# than moving it.
#
# What it does to rafidef.github.io:
#   - replaces index.html with the meta-refresh + canonical redirect shell
#   - deletes style.css and script.js, which the shell does not use
#   - repoints robots.txt and sitemap.xml at the new origin
#   - LEAVES pp/, cv/, certificate/ and the favicons alone, because old shares
#     and indexed PDF links point straight at those paths and the redirect only
#     covers the root document
#
# Requires: git, curl, and push access to the old repo.

set -euo pipefail

NEW_ORIGIN="https://rafidazhar.dev"
OLD_REPO="https://github.com/rafidef/rafidef.github.io.git"
REDIRECT_SRC="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)/github-pages-redirect/index.html"

PUSH=0
[[ "${1:-}" == "--push" ]] && PUSH=1

# ── Guard ───────────────────────────────────────────────────────────────────
# The whole point of the redirect is that the target answers. Check that before
# touching anything.
echo "==> Checking ${NEW_ORIGIN} is live"
# curl already writes 000 when it never got a response, so the fallback only
# covers curl not running at all.
code="$(curl -sS -o /dev/null -w '%{http_code}' --max-time 15 "${NEW_ORIGIN}/" 2>/dev/null)" || true
code="${code:-000}"
if [[ "$code" != "200" ]]; then
  cat >&2 <<EOF

REFUSING TO CONTINUE.

  ${NEW_ORIGIN}/ returned ${code}, expected 200.

Redirecting the old origin now would point every existing link and every
indexed page at something that does not answer. Finish the VPS deploy and the
Cloudflare DNS record first, confirm the new site loads in a browser, then run
this again.

EOF
  exit 1
fi
echo "    200 OK"

[[ -f "$REDIRECT_SRC" ]] || { echo "missing ${REDIRECT_SRC}" >&2; exit 1; }

# ── Work in a scratch clone, never in legacy-site/ ──────────────────────────
WORK="$(mktemp -d)"
trap 'rm -rf "$WORK"' EXIT

echo "==> Cloning the old repo"
git clone --quiet --depth 1 "$OLD_REPO" "$WORK/old"
cd "$WORK/old"

echo "==> Rewriting"
rm -f style.css script.js
cp "$REDIRECT_SRC" index.html

cat > robots.txt <<EOF
User-agent: *
Allow: /

Sitemap: ${NEW_ORIGIN}/sitemap.xml
EOF

cat > sitemap.xml <<EOF
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${NEW_ORIGIN}/</loc>
    <changefreq>monthly</changefreq>
    <priority>1.0</priority>
  </url>
</urlset>
EOF

# Assets that stay. Loud, because deleting these is the easy mistake to make
# and it silently breaks links that are already out in the world.
echo "==> Preserved (do not delete for at least six months):"
for d in pp cv certificate; do
  [[ -d "$d" ]] && echo "    $d/  ($(find "$d" -type f | wc -l | tr -d ' ') files)"
done

git add -A
echo
echo "==> Staged changes"
git --no-pager diff --cached --stat
echo

if [[ "$PUSH" -eq 0 ]]; then
  cat <<EOF
Nothing pushed. Review the stat above, then run:

  $0 --push

EOF
  exit 0
fi

git -c user.name="Rafid Azhar Adi Saputra" \
    -c user.email="168160981+rafidef@users.noreply.github.com" \
    commit --quiet -m "chore: redirect to ${NEW_ORIGIN}

The site has moved to a Next.js app on a VPS. GitHub Pages cannot serve a
real 301 for a user site, so this is a same-page instant meta refresh paired
with rel=canonical and noindex,follow, which is the strongest permanent
redirect signal this host can produce.

pp/, cv/ and certificate/ stay in place: old shares and indexed PDF links
point straight at those paths and the root redirect does not cover them."

git push --quiet origin HEAD
echo "==> Pushed. GitHub Pages usually rebuilds within a minute."
echo
echo "Verify:"
echo "  curl -s https://rafidef.github.io/ | grep -i canonical"
echo
echo "Then in Google Search Console: add ${NEW_ORIGIN} as a property and run"
echo "Change of Address from the rafidef.github.io property. That signal"
echo "matters more than the meta refresh."
