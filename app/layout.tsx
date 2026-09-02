import type { Metadata, Viewport } from "next";
import { Bricolage_Grotesque, Plus_Jakarta_Sans, IBM_Plex_Mono } from "next/font/google";
import { site, absolute } from "@/lib/site";
import "./globals.css";

/* Display. Variable across weight, width and optical size, which is what lets
   hierarchy come from weight and width instead of raw font size. */
const bricolage = Bricolage_Grotesque({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-bricolage",
  axes: ["opsz", "wdth"],
});

/* Body. Drawn by Tokotype in Jakarta for the city's identity. */
const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-jakarta",
});

/* Mono. Carries the <rafidazhar.dev/> wordmark. */
const plexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600"],
  variable: "--font-plex-mono",
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: site.title,
  description: site.description,
  alternates: { canonical: "/" },
  verification: { google: site.googleSiteVerification },
  openGraph: {
    type: "website",
    url: "/",
    siteName: site.name,
    title: site.title,
    description: site.ogDescription,
    locale: site.locale,
    images: [
      {
        url: site.ogImage.path,
        width: site.ogImage.width,
        height: site.ogImage.height,
        alt: "Rafid Azhar Adi Saputra, DevOps and Cloud Engineer",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: site.title,
    description:
      "Information Technology graduate from Telkom University Surabaya. Hands-on experience in AWS, Cloudflare, Docker, CI/CD, and networking.",
    images: [site.ogImage.path],
  },
  icons: {
    icon: [
      { url: "/favicon.ico", type: "image/x-icon" },
      { url: "/favicon-192.png", type: "image/png", sizes: "192x192" },
    ],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180" }],
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ebeeec" },
    { media: "(prefers-color-scheme: dark)", color: "#101416" },
  ],
};

const personSchema = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: site.legalName,
  alternateName: site.name,
  url: absolute("/"),
  image: absolute(site.ogImage.path),
  jobTitle: site.role,
  description:
    "Information Technology graduate of Telkom University Surabaya specializing in DevOps, Cloud Engineering, and Network Infrastructure.",
  alumniOf: { "@type": "CollegeOrUniversity", name: "Telkom University Surabaya" },
  knowsAbout: [
    "AWS",
    "Cloudflare",
    "Docker",
    "CI/CD",
    "GitHub Actions",
    "MikroTik",
    "Linux",
  ],
  sameAs: [site.social.linkedin, site.social.github],
};

/* Applies the stored theme before first paint so the page never flashes the
   wrong mode. Falls through to prefers-color-scheme when nothing is stored. */
const themeInit = `(function(){try{var t=localStorage.getItem("theme");if(t==="light"||t==="dark")document.documentElement.setAttribute("data-theme",t)}catch(e){}})()`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${bricolage.variable} ${jakarta.variable} ${plexMono.variable}`}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInit }} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }}
        />
      </head>
      <body>
        <a
          href="#about"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[70] focus:bg-accent focus:text-accent-ink focus:px-4 focus:py-2 focus:rounded-full focus:font-semibold"
        >
          Skip to content
        </a>
        {children}
        <div className="grain" aria-hidden="true" />
      </body>
    </html>
  );
}
