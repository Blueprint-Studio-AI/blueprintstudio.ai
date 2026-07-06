// app/terms/layout.tsx
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Terms & Conditions | Blueprint Studio',
  description: 'Terms and Conditions for Blueprint Studio',
  // Legal boilerplate: keep it out of search results but let link equity flow.
  robots: { index: false, follow: true },
  // Override the root layout's canonical ('/') so this page doesn't point at the homepage.
  alternates: { canonical: '/terms' },
  openGraph: {
    title: 'Terms & Conditions | Blueprint Studio',
    description: 'Terms and Conditions for Blueprint Studio',
    url: 'https://blueprintstudio.ai/terms',
    siteName: 'Blueprint Studio',
    type: 'website',
  },
}

export default function TermsLayout({
    children,
  }: {
    children: React.ReactNode
  }) {
    return children;
  }