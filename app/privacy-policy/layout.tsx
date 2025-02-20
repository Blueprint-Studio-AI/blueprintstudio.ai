// app/privacy-policy/layout.tsx
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Privacy Policy | Blueprint Studio',
  description: 'Privacy Policy for Blueprint Studio',
  robots: {
    index: false,
    follow: false,
  },
  openGraph: {
    title: 'Privacy Policy | Blueprint Studio',
    description: 'Privacy Policy for Blueprint Studio',
    url: 'https://blueprintstudio.ai/privacy-policy',
    siteName: 'Blueprint Studio',
    type: 'website',
  },
  alternates: {
    canonical: 'https://blueprintstudio.ai/privacy-policy'
  }
}

export default function PrivacyPolicyLayout({
    children,
  }: {
    children: React.ReactNode
  }) {
    return children;
  }