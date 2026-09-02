/**
 * Single source of truth for the site origin.
 *
 * NEXT_PUBLIC_SITE_URL is the ONLY place an origin is written. metadataBase,
 * canonical, og:url, og:image, twitter card URLs, JSON-LD, sitemap.xml and
 * robots.txt all derive from it. Cutting over to rafidazhar.dev is a one-line
 * env change plus a rebuild, nothing else.
 *
 * The fallback is the currently-live GitHub Pages origin, deliberately: until
 * the new domain is purchased and resolving, a build with no env set must not
 * advertise a dead canonical to crawlers.
 */
const RAW = process.env.NEXT_PUBLIC_SITE_URL ?? "https://rafidef.github.io";

/** Origin with any trailing slash stripped. */
export const SITE_URL = RAW.replace(/\/+$/, "");

/** Build an absolute URL against the configured origin. */
export const absolute = (p = "/") => new URL(p, `${SITE_URL}/`).toString();

export const site = {
  url: SITE_URL,
  name: "Rafid Azhar",
  /* Locked by the SEO constraint. Do not edit. */
  title: "Rafid Azhar | DevOps & Cloud Engineer",
  legalName: "Rafid Azhar Adi Saputra",
  role: "DevOps & Cloud Engineer",
  /* Kubernetes removed: nothing on the page, in the experience section or in
     the certifications supports the claim. Flagged in the Step 4 audit. */
  description:
    "Rafid Azhar Adi Saputra, DevOps and Cloud Engineer. AWS Lightsail migrations, GitHub Actions pipelines, Docker, Cloudflare R2 and network infrastructure.",
  ogDescription:
    "Information Technology graduate from Telkom University Surabaya. Hands-on experience in AWS, Cloudflare, Docker, CI/CD pipelines, and network infrastructure engineering.",
  locale: "en_US",
  /* Carried over verbatim from the legacy site. Do not regenerate. */
  googleSiteVerification: "0MudRj_z9f_mtfs4zYi1URaJO2dgxhcdUNlYPEmAedg",
  ogImage: { path: "/og.png", width: 1200, height: 630 },
  social: {
    linkedin: "https://www.linkedin.com/in/rafidazhar79",
    github: "https://github.com/rafidef",
  },
} as const;
