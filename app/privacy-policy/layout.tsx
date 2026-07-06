// app/privacy-policy/layout.tsx
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Privacy Policy | Blueprint Studio',
  description: 'Privacy Policy for Blueprint Studio',
  // Legal boilerplate: keep it out of search results but let link equity flow.
  robots: { index: false, follow: true },
  // Override the root layout's canonical ('/') so this page doesn't point at the homepage.
  alternates: { canonical: '/privacy-policy' },
  openGraph: {
    title: 'Privacy Policy | Blueprint Studio',
    description: 'Privacy Policy for Blueprint Studio',
    url: 'https://blueprintstudio.ai/privacy-policy',
    siteName: 'Blueprint Studio',
    type: 'website',
  },
}

export default function PrivacyPolicyLayout({
    children,
  }: {
    children: React.ReactNode
  }) {
    return children;
  }