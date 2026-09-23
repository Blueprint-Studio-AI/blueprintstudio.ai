import type { MetadataRoute } from "next";
import { SITE } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: `${SITE.url}/`,
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${SITE.url}/chain`,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${SITE.url}/ecosystem`,
      changeFrequency: "weekly",
      priority: 0.8,
    },
  ];
}
