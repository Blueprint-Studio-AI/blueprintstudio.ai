// app/terms/layout.tsx
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Terms & Conditions | Blueprint Studio',
  description: 'Terms and Conditions for Blueprint Studio',
  robots: {
    index: false,
    follow: false,
  },
  openGraph: {
    title: 'Terms & Conditions | Blueprint Studio',
    description: 'Terms and Conditions for Blueprint Studio',
    url: 'https://blueprintstudio.ai/terms',
    siteName: 'Blueprint Studio',
    type: 'website',
  },
  alternates: {
    canonical: 'https://blueprintstudio.ai/terms'
  }
}

export default function TermsLayout({
    children,
  }: {
    children: React.ReactNode
  }) {
    return children;
  }