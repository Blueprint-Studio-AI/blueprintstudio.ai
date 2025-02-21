// app/roast-my-site/layout.tsx
import type { Metadata } from 'next'
import { ReactNode } from 'react'

export const metadata: Metadata = {
  title: 'Website Roast & Technical Analysis | Blueprint Studio',
  description: 'Get a free website roast or technical analysis. Fun, honest feedback or detailed optimization insights to improve your site.',
  openGraph: {
    title: 'Website Roast & Technical Analysis | Blueprint Studio',
    description: 'Get a free website roast or technical analysis. Fun, honest feedback or detailed optimization insights to improve your site.',
    url: 'https://blueprintstudio.ai/roast-my-site',
    siteName: 'Blueprint Studio',
    type: 'website',
    // Uncomment and add image when available
    /*
    images: [{
      url: '/images/og/roast-my-site.jpg',
      width: 1200,
      height: 630,
    }],
    */
  },
  alternates: {
    canonical: 'https://blueprintstudio.ai/roast-my-site'
  }
}

const roastServiceSchema = {
  "@context": "https://schema.org",
  "@type": "Service",
  "name": "Website Roast & Analysis",
  "provider": {
    "@type": "Organization",
    "name": "Blueprint Studio"
  },
  "description": "Free website roast and technical analysis service providing entertainment and optimization insights",
  "offers": {
    "@type": "Offer",
    "price": "0",
    "priceCurrency": "USD"
  }
}

export default function RoastMySiteLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(roastServiceSchema)
        }}
      />
      {children}
    </>
  )
}