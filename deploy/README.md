# VPS deployment

Next.js runs as a standalone Node server on `127.0.0.1:3000`, behind nginx.
Releases are timestamped directories with an atomic symlink swap, so a rollback
is one `ln -sfn` away.

Everything below marked **MANUAL** is for you to run. Per the brief I have not
registered a domain, written a DNS record, or added TLS configuration.

---

## One time server setup

### 1. Node 26

```bash
curl -fsSL https://deb.nodesource.com/setup_26.x | sudo -E bash - && sudo apt install -y nodejs
```

### 2. Deploy user and directories

```bash
sudo adduser --system --group --home /srv/rafidazhar deploy && sudo mkdir -p /srv/rafidazhar/{releases,shared} && sudo chown -R deploy:deploy /srv/rafidazhar
```

`--system` assigns `/usr/sbin/nologin` and no password, but `deploy.sh` needs to
`ssh`, `rsync` and `sudo systemctl restart` as this account. See "Gaps in the
base setup" in `deploy/CLOUDFLARE.md` for the shell, SSH key and sudoers rule
that make it usable.

### 3. The origin file

This is the server side of the single source of truth. Until `rafidazhar.dev`
is bought and resolving, it stays on the GitHub Pages origin so no dead
canonical is advertised to crawlers.

```bash
echo 'NEXT_PUBLIC_SITE_URL=https://rafidef.github.io' | sudo tee /srv/rafidazhar/shared/.env
```

### 4. systemd

```bash
sudo cp deploy/rafidazhar.service /etc/systemd/system/ && sudo systemctl daemon-reload && sudo systemctl enable rafidazhar
```

### 5. nginx

Set the hostname first. The file ships with a placeholder so no origin is baked
into the repo.

```bash
sudo cp deploy/nginx.conf /etc/nginx/sites-available/rafidazhar && sudo sed -i "s/REPLACE_WITH_HOSTNAME/rafidazhar.dev www.rafidazhar.dev/" /etc/nginx/sites-available/rafidazhar && sudo ln -sf /etc/nginx/sites-available/rafidazhar /etc/nginx/sites-enabled/ && sudo nginx -t && sudo systemctl reload nginx
```

### 6. **MANUAL** DNS

I have not touched DNS. At your registrar, once `rafidazhar.dev` is purchased,
create:

| Type | Name | Value |
|---|---|---|
| A | `@` | your VPS IPv4 |
| AAAA | `@` | your VPS IPv6, if you have one |
| CNAME | `www` | `rafidazhar.dev.` |

Confirm propagation before step 7, because certbot's HTTP-01 challenge will
fail until the record resolves to the VPS:

```bash
dig +short rafidazhar.dev A
```

### 7. **MANUAL** TLS

> **Behind Cloudflare? Skip this step and read `deploy/CLOUDFLARE.md` instead.**
> The site currently runs with Cloudflare SSL/TLS mode set to Flexible, because
> port 443 on the VPS is held by another service. Under Flexible, Cloudflare
> reaches the origin over plain HTTP, so `--redirect` below creates an infinite
> redirect loop (`ERR_TOO_MANY_REDIRECTS`) and there is no free port for
> certbot's challenge anyway. This step applies only once the origin owns 443.

`deploy/nginx.conf` is HTTP only by design. Certbot writes the TLS block, the
certificate paths and the port 80 redirect into that file itself. Run it only
after step 6 resolves.

```bash
sudo apt install -y certbot python3-certbot-nginx && sudo certbot --nginx -d rafidazhar.dev -d www.rafidazhar.dev --redirect
```

Renewal installs its own timer. Verify with:

```bash
sudo certbot renew --dry-run
```

---

## Deploying

From this repo on your machine:

```bash
./deploy/deploy.sh deploy@YOUR_VPS_HOST
```

It runs `npm ci`, regenerates assets, runs the dash audit, builds, ships the
standalone bundle, flips the symlink, restarts the unit and health checks it.
The dash audit is in the path deliberately: a build that reintroduces an
em-dash fails before it ships.

Rollback:

```bash
ssh deploy@YOUR_VPS_HOST 'ls -1t /srv/rafidazhar/releases'
```

then point `current` at an older release and restart.

---

## Domain cutover

When `rafidazhar.dev` is live, the entire migration is:

```bash
ssh deploy@YOUR_VPS_HOST "echo 'NEXT_PUBLIC_SITE_URL=https://rafidazhar.dev' | sudo tee /srv/rafidazhar/shared/.env" && ./deploy/deploy.sh deploy@YOUR_VPS_HOST
```

That one line moves `metadataBase`, the canonical, `og:url`, `og:image`,
the Twitter card URLs, the JSON-LD `url` and `image`, `sitemap.xml` and
`robots.txt`. Nothing else in the codebase mentions an origin.

Then do the redirect below.

---

## Redirecting the old GitHub Pages origin

**GitHub Pages cannot serve a real 301.** It is a static host with no control
over response headers or status codes for user sites, so `_redirects`,
`.htaccess` and a genuine 301 are all unavailable. The strongest signal that
origin can produce is a same page instant meta refresh paired with a canonical
link, which Google treats as equivalent to a permanent redirect for
consolidation purposes. It is weaker than a real 301, mainly because non Google
crawlers honour it less consistently, but it is the ceiling of what the
platform allows.

`deploy/github-pages-redirect/index.html` is that file, ready to use.

In the `rafidef.github.io` repository, once the new domain is live:

1. Delete `style.css`, `script.js`, `index.html` and replace `index.html` with
   `deploy/github-pages-redirect/index.html`.
2. **Keep `robots.txt` and `sitemap.xml`**, and point both at the new origin.
   Removing them makes recrawl slower, not faster.
3. Keep `/pp/`, `/cv/` and `/certificate/` in place for at least six months.
   Old shares and any indexed PDF links point straight at those paths, and the
   redirect only covers the root document.
4. In Google Search Console, add `rafidazhar.dev` as a property and use the
   Change of Address tool from the old property. See `deploy/SEARCH-CONSOLE.md`
   for the full sequence, including what to do when that tool refuses to
   validate a meta refresh.

Replacement `robots.txt` for the old origin:

```
User-agent: *
Allow: /

Sitemap: https://rafidazhar.dev/sitemap.xml
```

Replacement `sitemap.xml` for the old origin, pointing at the new home so the
old sitemap actively advertises the migration:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://rafidazhar.dev/</loc>
    <changefreq>monthly</changefreq>
    <priority>1.0</priority>
  </url>
</urlset>
```
