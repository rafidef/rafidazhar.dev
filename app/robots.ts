import type { MetadataRoute } from "next";
import { absolute } from "@/lib/site";

/** Regenerated, not dropped. Origin comes from NEXT_PUBLIC_SITE_URL. */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [{ userAgent: "*", allow: "/" }],
    sitemap: absolute("/sitemap.xml"),
  };
}
