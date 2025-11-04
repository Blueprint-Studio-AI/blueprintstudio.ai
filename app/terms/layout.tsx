// app/terms/layout.tsx
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Terms & Conditions | Blueprint Studio',
  description: 'Terms and Conditions for Blueprint Studio',
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