// app/sitemap.ts
import type { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  const base = 'https://blueprintstudio.ai'
  const now = new Date()

  return [
    { url: `${base}/`,              lastModified: now, changeFrequency: 'weekly', priority: 1 },
    { url: `${base}/terms`, lastModified: now, changeFrequency: 'yearly', priority: 0.2 },
    { url: `${base}/privacy-policy`, lastModified: now, changeFrequency: 'yearly', priority: 0.2 },
  ]
}
