// app/tools/layout.tsx
import type { Metadata } from 'next'
import { ReactNode } from 'react'

export const metadata: Metadata = {
  title: 'Free Website Tools | Blueprint Studio',
  description: 'Explore our collection of free tools for website analysis, content creation, and development optimization.',
  openGraph: {
    title: 'Free Website Tools | Blueprint Studio',
    description: 'Explore our collection of free tools for website analysis, content creation, and development optimization.',
    url: 'https://blueprintstudio.ai/tools',
    siteName: 'Blueprint Studio',
    type: 'website',
    // Uncomment and add image when available
    /*
    images: [{
      url: '/images/og/tools.jpg',
      width: 1200,
      height: 630,
    }],
    */
  },
  alternates: {
    canonical: 'https://blueprintstudio.ai/tools'
  }
}

const toolsSchema = {
  "@context": "https://schema.org",
  "@type": "CollectionPage",
  "name": "Website Tools Collection",
  "description": "A collection of free tools for website analysis, content creation, and development optimization",
  "publisher": {
    "@type": "Organization",
    "name": "Blueprint Studio"
  },
  "hasPart": [
    {
      "@type": "Service",
      "name": "Roast My Site",
      "description": "AI-powered website analysis and roast tool",
      "offers": {
        "@type": "Offer",
        "price": "0",
        "priceCurrency": "USD"
      }
    },
    {
      "@type": "Service",
      "name": "AI Blog Wizard",
      "description": "AI-powered blog writing assistant",
      "offers": {
        "@type": "Offer",
        "price": "0",
        "priceCurrency": "USD"
      }
    },
    {
      "@type": "Service",
      "name": "AIREADME",
      "description": "Codebase documentation generator",
      "offers": {
        "@type": "Offer",
        "price": "0",
        "priceCurrency": "USD"
      }
    }
  ]
}

export default function ToolsLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(toolsSchema)
        }}
      />
      {children}
    </>
  )
}