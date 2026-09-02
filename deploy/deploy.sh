#!/usr/bin/env bash
#
# Build locally, ship the standalone bundle to the VPS, swap the symlink,
# restart. Atomic: the symlink flip is the only moment anything changes, and
# the previous release stays on disk for an instant rollback.
#
#   ./deploy/deploy.sh deploy@vps.example.com
#
# Requires: rsync and ssh on this machine, node on the server.

set -euo pipefail

TARGET="${1:-}"
if [[ -z "$TARGET" ]]; then
  echo "usage: $0 user@host" >&2
  exit 1
fi

APP_ROOT="/srv/rafidazhar"
RELEASE="$(date -u +%Y%m%d%H%M%S)"
REMOTE_RELEASE="${APP_ROOT}/releases/${RELEASE}"

echo "==> Building locally"
npm ci
npm run prepare:assets
npm run audit:dashes
npm run build

# `output: standalone` emits a self-contained server bundle, but Next leaves
# static assets and public/ for the deployer to place alongside it.
echo "==> Staging bundle"
STAGE="$(mktemp -d)"
trap 'rm -rf "$STAGE"' EXIT

cp -R .next/standalone/. "$STAGE/"

# Trailing /. on the source and an existing destination, so these MERGE.
#
# `cp -R public "$STAGE/public"` looks equivalent but is not: Next's standalone
# output already contains a public/ holding just the files the tracer pulled in
# (the logo SVGs read at build time), so the destination exists and cp nests the
# real tree at public/public/. Everything except those traced logos then 404s
# while the pages themselves still render, which is a quiet way to lose every
# image, certificate and CV on the site.
mkdir -p "$STAGE/.next/static" "$STAGE/public"
cp -R .next/static/. "$STAGE/.next/static/"
cp -R public/. "$STAGE/public/"

# The unit runs under ProtectSystem=strict and names this directory in
# ReadWritePaths, and systemd refuses to build the mount namespace if it does
# not exist (status=226/NAMESPACE). Next also needs it writable at runtime for
# the image optimiser. It ships empty rather than being created server side, so
# every release owns its own cache and a rollback cannot inherit a stale one.
mkdir -p "$STAGE/.next/cache"

echo "==> Shipping release ${RELEASE}"
ssh "$TARGET" "mkdir -p ${REMOTE_RELEASE} ${APP_ROOT}/shared"
rsync -az --delete "$STAGE/" "${TARGET}:${REMOTE_RELEASE}/"

echo "==> Activating"
ssh "$TARGET" bash -seuo pipefail <<REMOTE
  ln -sfn "${REMOTE_RELEASE}" "${APP_ROOT}/current.tmp"
  mv -Tf "${APP_ROOT}/current.tmp" "${APP_ROOT}/current"
  sudo systemctl restart rafidazhar
  # Keep the five most recent releases for rollback, discard the rest.
  cd "${APP_ROOT}/releases"
  ls -1t | tail -n +6 | xargs -r rm -rf
REMOTE

echo "==> Verifying"
sleep 2
ssh "$TARGET" "curl -fsS -o /dev/null -w 'local health: %{http_code}\n' http://127.0.0.1:3000/"

echo "==> Done. Release ${RELEASE} is live."
echo "    Rollback: ssh ${TARGET} 'ln -sfn ${APP_ROOT}/releases/<older> ${APP_ROOT}/current && sudo systemctl restart rafidazhar'"
