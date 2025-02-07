// app/services-index/layout.tsx
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Professional Web Services | Blueprint Studio',
  description: 'Comprehensive web design, development, marketing, and complex AI automation services for modern businesses. Transform your digital presence with Blueprint Studio.',
  openGraph: {
    title: 'Professional Web Services | Blueprint Studio',
    description: 'Transform your digital presence with comprehensive web design, development, and AI solutions.',
    url: 'https://blueprintstudio.ai/services-index',
    siteName: 'Blueprint Studio',
    type: 'website',
    // Add image when available
    /* images: [{
      url: '/images/og/services.jpg',
      width: 1200,
      height: 630,
    }], */
  },
  alternates: {
    canonical: 'https://blueprintstudio.ai/services-index'
  }
}

export default function ServicesLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}