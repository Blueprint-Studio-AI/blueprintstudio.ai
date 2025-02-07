// app/web-design/layout.tsx
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Professional Web Design Services | Blueprint Studio',
  description: 'Custom web design services that drive growth and engage users. Modern, responsive websites built for results.',
  openGraph: {
    title: 'Professional Web Design Services | Blueprint Studio',
    description: 'Custom web design services that drive growth and engage users. Modern, responsive websites built for results.',
    url: 'https://blueprintstudio.ai/web-design',
    siteName: 'Blueprint Studio',
    type: 'website',
    // Add image when available
    /* images: [{
      url: '/images/og/web-design.jpg',
      width: 1200,
      height: 630,
    }], */
  },
  alternates: {
    canonical: 'https://blueprintstudio.ai/web-design'
  }
}

// Schema for web design service
const webDesignSchema = {
  "@context": "https://schema.org",
  "@type": "Service",
  "name": "Web Design Services",
  "provider": {
    "@type": "Organization",
    "name": "Blueprint Studio"
  },
  "description": "Professional web design services for modern businesses",
  "offers": {
    "@type": "Offer",
    "price": "800",
    "priceCurrency": "USD"
  }
}

export default function WebDesignLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(webDesignSchema)
        }}
      />
      {children}
    </>
  )
}