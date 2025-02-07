import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { FloatingNav } from "@/components/FloatingNav";
import { GoogleAnalytics } from '@next/third-parties/google';

// Configure font
const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

export const metadata: Metadata = {
  metadataBase: new URL('https://blueprintstudio.ai'),
  title: {
    default: "Blueprint Studio · Web & AI Solutions",
    template: "%s | Blueprint Studio"
  },
  description: "Blueprint Studio is a premier web design company & digital agency specializing in modern web solutions and AI integration.",
  keywords: ["web design", "AI solutions", "digital agency", "web development", "UI/UX design"],
  
  // Basic icons we have
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: '32x32' },
      { url: '/icon.svg', type: 'image/svg+xml' },
    ],
    /* TODO: Add when assets are ready
    apple: [
      { url: '/apple-touch-icon.png' },
    ],
    other: [
      {
        rel: 'mask-icon',
        url: '/safari-pinned-tab.svg',
      },
    ],
    */
  },
  
  manifest: '/site.webmanifest',
  
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://blueprintstudio.ai',
    siteName: 'Blueprint Studio',
    title: 'Blueprint Studio · Web & AI Solutions',
    description: 'Professional web design and AI solutions for modern businesses.',
    /* TODO: Add when OG image is ready
    images: [{
      url: '/og-image.jpg',
      width: 1200,
      height: 630,
      alt: 'Blueprint Studio',
    }],
    */
  },
  
  /* TODO: Add when Twitter when we have the images
  twitter: {
    card: 'summary_large_image',
    site: '@blueprint_dao',
    creator: '@blueprint_dao',
    images: '/twitter-image.jpg',
  },
  */

  /* TODO: Add when verification tokens are ready
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_VERIFICATION,
    yandex: process.env.NEXT_PUBLIC_YANDEX_VERIFICATION,
    bing: process.env.NEXT_PUBLIC_BING_VERIFICATION,
  },
  */
};

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: 'white' },
    { media: '(prefers-color-scheme: dark)', color: 'black' },
  ],
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
};

const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "name": "Blueprint Studio",
  "url": "https://blueprintstudio.ai",
};

const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "Blueprint Studio",
  "url": "https://blueprintstudio.ai",
  "logo": "https://blueprintstudio.ai/blueprint-logo.png",
  "sameAs": [
    "https://x.com/blueprint_dao",
    "https://www.linkedin.com/company/blueprint-studio-ai",
    "https://github.com/Blueprint-Studio-AI"
  ]
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html 
      lang="en" 
      className={`${inter.variable}`}
      suppressHydrationWarning
    >
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(websiteSchema)
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(organizationSchema)
          }}
        />
        <link rel="canonical" href="https://blueprintstudio.ai" />
        <meta name="robots" content="index, follow" />
      </head>
      <body className={inter.className}>
        <FloatingNav />
        <main>
          {children}
        </main>
        <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA_ID!} />
      </body>
    </html>
  );
}