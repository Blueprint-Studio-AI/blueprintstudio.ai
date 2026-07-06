// app/sitemap.ts
import type { MetadataRoute } from 'next'
import { getAllPosts } from '@/lib/blog'

export default function sitemap(): MetadataRoute.Sitemap {
  const base = 'https://blueprintstudio.ai'
  const now = new Date()

  const posts = getAllPosts()
  const blogEntries: MetadataRoute.Sitemap = [
    { url: `${base}/insights`, lastModified: now, changeFrequency: 'weekly', priority: 0.8 },
    ...posts.map((post) => ({
      url: `${base}/insights/${post.slug}`,
      lastModified: new Date(post.date),
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    })),
  ]

  return [
    { url: `${base}/`,              lastModified: now, changeFrequency: 'weekly', priority: 1 },
    // Service / offering pages
    { url: `${base}/brand`,         lastModified: now, changeFrequency: 'weekly',  priority: 0.8 },
    { url: `${base}/launch`,        lastModified: now, changeFrequency: 'weekly',  priority: 0.8 },
    { url: `${base}/launch-videos`, lastModified: now, changeFrequency: 'monthly', priority: 0.7 },
    // Case study
    { url: `${base}/brands/jinba`,  lastModified: now, changeFrequency: 'monthly', priority: 0.6 },
    ...blogEntries,
    // /terms and /privacy-policy are intentionally excluded — they're noindex (see their layout.tsx)
  ]
}
