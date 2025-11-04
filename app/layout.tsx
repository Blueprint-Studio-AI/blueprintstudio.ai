import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { FloatingNavNew } from "@/components/FloatingNavNew";
import { GoogleAnalytics } from '@next/third-parties/google';
import { Toaster } from "@/components/ui/toaster"
import Background from "@/components/ui/Background";
import { SpeedInsights } from "@vercel/speed-insights/next"
import { Analytics } from "@vercel/analytics/next"

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

export const metadata: Metadata = {
  metadataBase: new URL('https://blueprintstudio.ai'),
  robots: { index: true, follow: true },
  alternates: { canonical: '/' },
  title: {
    default: "Blueprint Studio · World-Class Design & Development Solutions",
    template: "%s | Blueprint Studio"
  },
  description:
    "Blueprint Studio is a premier creative studio known for its world-class product design, branding, web design, and AI engineering.",
  keywords: [
    "web design company",
    "build ai product",
    "creative studio",
    "product design",
    "service design"
  ],

  icons: {
    icon: [
      { url: '/favicon.ico', type: 'image/x-icon' },
      { url: '/icon.png', sizes: '512x512', type: 'image/png' },     
      { url: '/icon.svg', type: 'image/svg+xml' },
    ],
    apple: [{ url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' }],
  },
  
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://blueprintstudio.ai',
    siteName: 'Blueprint Studio',
    title: 'Blueprint Studio · World-Class Design & Development Solutions',
    description:
      "Blueprint Studio is a premier creative studio known for its world-class product design, branding, web design, and AI engineering.",
    images: [
      {
        url: 'https://blueprintstudio.ai/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Blueprint Studio',
      },
    ],
  },
  
  twitter: {
    card: 'summary_large_image',
    site: '@bpstu',    
    creator: '@bpstu',  
    title:
      'Blueprint Studio · World-Class Design & Development Solutions',
    description:
      "Blueprint Studio is a premier creative studio known for its world-class product design, branding, web design, and AI engineering.",
    images: [
      'https://blueprintstudio.ai/og-image.jpg'
    ],
  },

  /* TODO: Add when verification tokens are ready
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_VERIFICATION,
    yandex: process.env.NEXT_PUBLIC_YANDEX_VERIFICATION,
    bing: process.env.NEXT_PUBLIC_BING_VERIFICATION,
  },
  */
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#F0F0F0',
} satisfies Viewport;

const orgId = "https://blueprintstudio.ai/#organization";

const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "@id": "https://blueprintstudio.ai/#website",
  "name": "Blueprint Studio",
  "url": "https://blueprintstudio.ai",
  "inLanguage": "en",
  "publisher": { "@id": orgId }
};

const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "@id": orgId,
  "name": "Blueprint Studio",
  "url": "https://blueprintstudio.ai",
  "logo": {
    "@type": "ImageObject",
    "url": "https://blueprintstudio.ai/icon.png",
    "width": 512,
    "height": 512
  },
  "sameAs": [
    "https://x.com/bpstu",
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
      </head>
      <body className={`relative min-h-screen overflow-x-hidden antialiased ${inter.className}`}>
        <Background />
        <FloatingNavNew />
        <main>
          {children}
          <Toaster />
        </main>
        <Analytics />
        <SpeedInsights />
        <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA_ID!} />
      </body>
    </html>
  );
}