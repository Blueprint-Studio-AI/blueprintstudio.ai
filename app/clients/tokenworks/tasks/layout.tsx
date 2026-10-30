// app/privacy-policy/layout.tsx
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Tokenworks', // the root layout's template adds " | Blueprint Studio"
  description: 'Tokenworks Task Page for Blueprint Studio',
  // A client's task form, not a page for search results.
  robots: { index: false, follow: false },
  alternates: { canonical: '/clients/tokenworks/tasks' }, // not the root layout's '/'
  openGraph: {
    title: 'Tokenworks | Blueprint Studio',
    description: 'Tokenworks Task Page for Blueprint Studio',
    url: 'https://blueprintstudio.ai/clients/tokenworks/tasks',
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