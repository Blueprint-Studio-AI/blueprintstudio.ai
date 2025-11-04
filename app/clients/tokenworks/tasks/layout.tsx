// app/privacy-policy/layout.tsx
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Tokenworks | Blueprint Studio',
  description: 'Tokenworks Task Page for Blueprint Studio',
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