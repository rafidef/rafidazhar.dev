import type { MetadataRoute } from "next";
import { absolute } from "@/lib/site";

/** Regenerated, not dropped. Origin comes from NEXT_PUBLIC_SITE_URL. */
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: absolute("/"),
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 1,
    },
  ];
}
