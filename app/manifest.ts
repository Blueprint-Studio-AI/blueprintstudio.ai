import type { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Blueprint Studio',
    short_name: 'Blueprint',
    description: 'Web & AI Solutions',
    id: '/',
    start_url: '/',
    scope: '/',
    display: 'standalone',
    orientation: 'portrait-primary',
    background_color: '#F0F0F0',
    theme_color: '#F0F0F0',
    lang: 'en',
    icons: [
      { src: '/android-chrome-192x192.png', sizes: '192x192', type: 'image/png', purpose: 'any' },
      { src: '/icon.png', sizes: '512x512', type: 'image/png', purpose: 'any' },
    ],
  }
}
