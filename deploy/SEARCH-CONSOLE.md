# Getting rafidazhar.dev indexed

Written for this specific migration: a one page site, DNS at Cloudflare, moving
off `rafidef.github.io` which already has index history worth keeping.

Phases 1 to 3 can be done now. Phase 4 only works after the old origin actually
redirects, so run `deploy/cutover-old-origin.sh` first.

---

## Preflight

All of these were verified passing on 2 September 2026. Recheck if anything
about the setup changes.

| Check | Expected | Command |
|---|---|---|
| Site answers | 200 | `curl -sI https://rafidazhar.dev/` |
| HTTP redirects | 301 to https | `curl -sI http://rafidazhar.dev/` |
| Googlebot not blocked | 200 | `curl -A "Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)" -sI https://rafidazhar.dev/` |
| robots.txt allows | `Allow: /` | `curl -s https://rafidazhar.dev/robots.txt` |
| Sitemap resolves | the new origin | `curl -s https://rafidazhar.dev/sitemap.xml` |
| No stray noindex | `index, follow` | `curl -s https://rafidazhar.dev/ \| grep 'name="robots"'` |

The Googlebot check matters because Cloudflare's Bot Fight Mode can challenge
crawlers. If that row ever returns 403 or 503, turn Bot Fight Mode off under
Security before blaming Search Console.

---

## Phase 1. Verify the property

Use a **Domain** property, not URL prefix. One property then covers
`http`, `https`, `www` and non `www` together, which is exactly what you want
during a migration where several of those variants exist.

1. Go to [search.google.com/search-console](https://search.google.com/search-console),
   open the property picker, choose **Add property**.
2. Pick the **Domain** box on the left. Enter `rafidazhar.dev`, no scheme, no
   `www`, no trailing slash.
3. Google shows a TXT record that looks like
   `google-site-verification=<random string>`.
4. In Cloudflare, go to **DNS > Records > Add record**:
   - Type: `TXT`
   - Name: `@`
   - Content: paste the full `google-site-verification=...` string
   - TTL: Auto
5. Confirm it published before clicking Verify:

   ```bash
   dig +short TXT rafidazhar.dev
   ```

6. Click **Verify**. Cloudflare publishes fast, so this usually works
   immediately. If it fails, wait a few minutes and retry rather than adding a
   second record.

> The `google-site-verification` meta tag already in the site's `<head>` does
> NOT verify this domain. That token belongs to the old `rafidef.github.io`
> property. Leave it alone regardless, see Phase 4.

Keep the TXT record forever. Deleting it unverifies the property.

---

## Phase 2. Submit the sitemap

In the new property: **Sitemaps** in the left nav, then enter the FULL URL:

```
https://rafidazhar.dev/sitemap.xml
```

Not the bare path. A URL prefix property renders its own origin as a grey label
to the left of the box and wants only the path appended, but a Domain property
spans several schemes and subdomains at once, so it cannot infer which origin
you mean and the box takes a complete URL. Phase 1 sets up a Domain property,
so the full URL is the correct form here.

Status should become **Success** with 1 discovered URL. The site is genuinely
one page, so 1 is correct and not a sign of a truncated sitemap.

If it says "Couldn't fetch", the usual causes in order:

1. You entered the bare path in a Domain property. Use the full URL.
2. Cloudflare is challenging the fetch. Recheck the Googlebot row in Preflight.
3. The sitemap itself is not reachable. Confirm with
   `curl -s https://rafidazhar.dev/sitemap.xml`.

---

## Phase 3. Force a first crawl

The sitemap alone gets picked up eventually. To get on the board in hours
rather than days:

1. Paste `https://rafidazhar.dev/` into the **URL Inspection** bar at the top.
2. It will report "URL is not on Google", which is expected for a fresh domain.
3. Click **Test Live URL**. Confirm it says the page is available to Google and
   that the rendered screenshot looks like the real site, not an error page.
   This is the step that catches a Cloudflare challenge or a broken asset.
4. Click **Request Indexing**.

That queues one URL. There is a daily quota, so do not resubmit the same URL
repeatedly. Once is enough.

While the live test is open, use **View Tested Page > Screenshot** to sanity
check that Googlebot sees the images. The site's portrait and certificates go
through the Next image optimiser, and a broken optimiser would show here.

### Structured data

The page ships a `Person` JSON-LD block. Check it renders as Google expects at
[search.google.com/test/rich-results](https://search.google.com/test/rich-results).
`Person` does not produce a rich result on its own, so a clean parse with no
errors is the whole goal. It feeds the knowledge panel, not the SERP layout.

---

## Phase 4. Change of Address

**Prerequisite: `deploy/cutover-old-origin.sh` has run, and the old property is
still verified.** The cutover deliberately carries the old verification token
into the redirect shell for exactly this reason.

1. Open the OLD property, `rafidef.github.io`.
2. **Settings > Change of address**.
3. Select `rafidazhar.dev` as the destination.
4. Run the validation and submit.

### If validation fails

This is a real possibility, not a remote one. The tool wants to see the old
site issuing a 301, and GitHub Pages cannot issue one for a user site. What the
cutover produces instead is an instant meta refresh plus `rel=canonical`, which
is the platform ceiling.

If the tool rejects it, nothing is broken and there is nothing further to fix
on the old origin. The canonical still does the consolidation work directly,
just more slowly and with less certainty than an accepted Change of Address
would give. Move on to Phase 5 and let it settle.

Change of Address is an accelerator, not a prerequisite. It declares a move
that the redirect already performs; it does not perform one itself. That is why
the order matters: cutover first, declaration second.

Do not delete the old repository to "force" the move. That turns a redirect
into a dead 404 and throws away the link equity this whole phase exists to
preserve.

---

## Phase 5. What to expect, and when

A brand new domain is not indexed quickly no matter what you do. Rough shape:

| When | What you should see |
|---|---|
| Hours | URL Inspection stops saying "not on Google" |
| 2 to 7 days | Homepage appears for a `site:rafidazhar.dev` search |
| 1 to 4 weeks | Ranking for your own name stabilises |
| 1 to 6 months | Old URLs drop out as the new ones take over |

Check progress with:

```
site:rafidazhar.dev
```

and compare against:

```
site:rafidef.github.io
```

The second should shrink over time while the first holds steady. Both moving
together is the healthy pattern during a migration.

In Search Console, the report to watch is **Indexing > Pages**. One page
indexed and zero errors is a complete success for this site. Do not read
"Crawled - currently not indexed" on day three as a problem; it is the normal
waiting state for a new domain.

### Keep for at least six months

- The old repository, serving the redirect
- The old property in Search Console
- `pp/`, `cv/` and `certificate/` on the old origin, because indexed PDF links
  point straight at those paths and the root redirect does not cover them
- The TXT verification record on the new domain, permanently

---

## Optional hardening

**`www` currently serves 200 rather than redirecting.** It returns the same
page with `rel=canonical` pointing at the apex, so Google will consolidate
correctly and this is not urgent. A 301 is tidier. The cheapest way is a
Cloudflare Redirect Rule, since it runs at the edge and needs no origin change:

- Rules > Redirect Rules > Create rule
- If hostname equals `www.rafidazhar.dev`
- Then static redirect to `https://rafidazhar.dev` with status 301, preserving
  path and query

**Bing.** Bing Webmaster Tools can import the Search Console property wholesale
once Phase 1 is done, which is a two minute job for a second search engine.
