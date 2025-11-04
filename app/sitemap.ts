// app/sitemap.ts
import type { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  const base = 'https://blueprintstudio.ai'
  const now = new Date()

  return [
    { url: `${base}/`,              lastModified: now, changeFrequency: 'weekly', priority: 1 },
    { url: `${base}/services-index`, lastModified: now, changeFrequency: 'weekly', priority: 0.9 },
    { url: `${base}/web-design`,     lastModified: now, changeFrequency: 'weekly', priority: 0.9 },
  ]
}
