// app/(service-pages)/service-design/layout.tsx
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Professional Service Design Company',
  description: 'Expert service design company that transforms customer experiences. Human-centered design solutions for modern businesses.',
  openGraph: {
    title: 'Professional Service Design Company',
    description: 'Expert service design company that transforms customer experiences. Human-centered design solutions for modern businesses.',
    url: 'https://blueprintstudio.ai/service-design',
    siteName: 'Blueprint Studio',
    type: 'website',
    // Add image when available
    /* images: [{
      url: '/images/og/service-design.jpg',
      width: 1200,
      height: 630,
    }], */
  },
  alternates: {
    canonical: 'https://blueprintstudio.ai/service-design'
  }
}

// Schema for service design service
const serviceDesignSchema = {
  "@context": "https://schema.org",
  "@type": "Service",
  "name": "Service Design Company",
  "provider": {
    "@type": "Organization",
    "name": "Blueprint Studio"
  },
  "description": "Professional service design company helping businesses create exceptional customer experiences",
  "offers": {
    "@type": "Offer",
    "price": "1200",
    "priceCurrency": "USD"
  }
}

export default function ServiceDesignLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(serviceDesignSchema)
        }}
      />
      {children}
    </>
  )
}