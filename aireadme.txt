
<identity>
You are an autistic Silicon Valley Engineer on amphetamines who, by some miracle, is not only a savant software engineer but has great communication, design, and copyrighting skills too - truly a Leonardo da Vinci type savant of the digital age. You need to solve these problems so that the company doesn't go bankrupt - of which you are the largest shareholder (your entire net-worth from 10 years of blood, sweat, and tears).

Prioritize truth and engineering precision over being nice. Think from mathematical and scientific first principles - hard truths relevant to the context. Think from first principles and use <thinking> and <reflection> tags help. We will review pseudocode and formulate the engineering strategy in natural language from first principles and discuss before translating it into flawless code.

When you return code you write out the entire file. You do not leave parts commented out because assumptions create errors. 
</identity>

<project>
Website for Blueprint Studio
</project>

<task>
Your current task it to make the service design page. The page should be tasteful, have great seo, and compelling copy. Use the web-design page as an example (it's optimized for 'web design company') and is as the same level of hierarchy (service page).
</task>

<layout.tsx>
//app/(service-pages)/web-design/layout.tsx
// app/web-design/layout.tsx
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Professional Web Design Company | Blueprint Studio',
  description: 'Custom web design comapany that drives growth and engages users. Modern, responsive websites built for results.',
  openGraph: {
    title: 'Professional Web Design Company | Blueprint Studio',
    description: 'Custom web design company that drives growth and engages users. Modern, responsive websites built for results.',
    url: 'https://blueprintstudio.ai/web-design',
    siteName: 'Blueprint Studio',
    type: 'website',
    // Add image when available
    /* images: [{
      url: '/images/og/web-design.jpg',
      width: 1200,
      height: 630,
    }], */
  },
  alternates: {
    canonical: 'https://blueprintstudio.ai/web-design'
  }
}

// Schema for web design service
const webDesignSchema = {
  "@context": "https://schema.org",
  "@type": "Service",
  "name": "Web Design Company",
  "provider": {
    "@type": "Organization",
    "name": "Blueprint Studio"
  },
  "description": "Professional web design company serving industry-leading businesses",
  "offers": {
    "@type": "Offer",
    "price": "800",
    "priceCurrency": "USD"
  }
}

export default function WebDesignLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(webDesignSchema)
        }}
      />
      {children}
    </>
  )
}
</layout.tsx>

<page.tsx>
//app/(service-pages)/web-design/page.tsx
// app/web-design/page.tsx
"use client";
import { WebDesignHero } from "@/components/service-page/web-design/WebDesignHero";
import { Footer } from "@/components/Footer";
import { PrimarySolutions } from "@/components/service-page/web-design/PrimarySolutions";
import { SolutionFinder } from "@/components/service-page/web-design/SolutionFinder";
import { IndustryGrid } from "@/components/service-page/web-design/IndustryGrid";
import { Process } from "@/components/service-page/web-design/Process";
import { TechnologyGrid } from "@/components/service-page/web-design/TechnologyGrid";
import { FeaturedProjects } from "@/components/service-page/web-design/FeaturedProjects";
import { WebDesignFAQ } from "@/components/service-page/web-design/WebDesignFAQ";
import { WebDesignTestimonials } from "@/components/service-page/web-design/WebDesignTestimonials";
import { WebDesignPricing } from "@/components/service-page/web-design/WebDesignPricing"

// Notes:
// Pricing Section heading is bigger than others (headings on this page a bit smaller than others but kinda like it)
// Needs a copy read through and real content (case studies too)
// Service Finder Tool needs real results 
// Links need correct hrefs / adjusting (make list of pages to make so we can link them - fs )
// solutions section could use some pattern / icons / UI images in the bento boxes
// find your solution link should go to the finder section
// finder should start at 0% and end at 100% (also needs real results + question check)
// remove text cursor throughout and replace with pointer 
// real testimonials - commented out for now
// add link to services page
// overall struture feels good tho

export default function WebDesignPage() {
    return (
      <main className="min-h-screen bg-background text-foreground services-theme relative">
        {/* Background patterns */}
        <div className="fixed inset-0 bg-dot-pattern opacity-5 pointer-events-none" />
        
        {/* Content */}
        <div className="relative">
          <div className="max-w-4xl mx-auto overflow-visible">
            <WebDesignHero />
            <PrimarySolutions />
            <div id="solution-finder">
            <SolutionFinder/>
            </div>
            <IndustryGrid />
            <TechnologyGrid />
            <Process />
            <FeaturedProjects />
          </div>
          <WebDesignFAQ />
          {/* <WebDesignTestimonials /> */}
          <WebDesignPricing />
          <Footer />
        </div>
      </main>
    );
  }
</page.tsx>

<globals.css>
//app/globals.css
/* app/globals.css */
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {

  .rdp {
    --rdp-cell-size: 40px;
    --rdp-accent-color: hsl(var(--primary));
    --rdp-background-color: hsl(var(--primary) / 0.1);
    --rdp-accent-color-dark: hsl(var(--primary));
    --rdp-background-color-dark: hsl(var(--primary) / 0.2);
    --rdp-outline: 2px solid var(--rdp-accent-color);
    --rdp-outline-selected: 2px solid var(--rdp-accent-color);
    margin: 0;
  }
  
  .rdp-day_selected:not([disabled]),
  .rdp-day_selected:focus:not([disabled]),
  .rdp-day_selected:active:not([disabled]),
  .rdp-day_selected:hover:not([disabled]) {
    background-color: var(--rdp-accent-color);
    color: white;
  }
  
  .rdp-day_selected:focus:not([disabled]) {
    border-color: var(--rdp-accent-color-dark);
  }
  
  }

  /* Light theme for services pages */
  .services-theme {
    --background: 0 0% 100%;
    --foreground: 240 10% 3.9%;
    --card: 0 0% 100%;
    --card-foreground: 240 10% 3.9%;
    --popover: 0 0% 100%;
    --popover-foreground: 240 10% 3.9%;
    --primary: 240 5.9% 10%;
    --primary-foreground: 0 0% 98%;
    --secondary: 240 4.8% 95.9%;
    --secondary-foreground: 240 5.9% 10%;
    --muted: 240 4.8% 95.9%;
    --muted-foreground: 240 3.8% 46.1%;
    --accent: 240 4.8% 95.9%;
    --accent-foreground: 240 5.9% 10%;
    --destructive: 0 84.2% 60.2%;
    --destructive-foreground: 0 0% 98%;
    --border: 240 5.9% 90%;
    --input: 240 5.9% 90%;
    --ring: 240 5.9% 10%;
    --radius: 0.5rem;
  }


body {
  color: rgb(var(--foreground-rgb));
  background: rgb(var(--background-start-rgb));
}

@layer utilities {
  .text-balance {
    text-wrap: balance;
  }

  .tiktok-wrapper {
    @apply h-full w-full rounded-3xl overflow-hidden;
  }
  
  /* New text shadow utilities */
  .text-shadow-nav {
    text-shadow: 0px 0px 1px rgba(0, 0, 0, 0.13);
  }
  
  /* New backdrop blur utilities */
  .backdrop-blur-nav {
    backdrop-filter: blur(3.5px);
  }
  
  .backdrop-blur-nav-hover {
    backdrop-filter: blur(2px);
  }
  
  /* New background blend utilities */
  .bg-blend-nav {
    background-blend-mode: luminosity;
  }
}

/* Custom Font */
@font-face {
  font-family: 'PP Editorial New';
  src: url('/fonts/PPEditorialNew-Regular.woff2') format('woff2');
  font-weight: normal;
  font-style: normal;
  font-display: swap;
}

@font-face {
  font-family: 'PP Editorial New';
  src: url('/fonts/PPEditorialNew-Italic.woff2') format('woff2');
  font-weight: normal;
  font-style: italic;
  font-display: swap;
}

@font-face {
  font-family: 'PP Editorial New';
  src: url('/fonts/PPEditorialNew-UltralightItalic.woff2') format('woff2');
  font-weight: 200;
  font-style: italic;
  font-display: swap;
}

.font-serif {
  font-family: 'Editorial New', serif;
}

/* Custom Animations */
@keyframes spotlight {
  0% {
    opacity: 0;
    transform: translate(-50%, -50%) scale(0.9);
  }
  100% {
    opacity: 0.6;
    transform: translate(-50%, -50%) scale(1.1);
  }
}

@keyframes float {
  0%, 100% {
    transform: translateY(0) rotate(0);
  }
  50% {
    transform: translateY(-20px) rotate(2deg);
  }
}

.animate-float {
  animation: float 20s ease infinite;
}

.delay-200 {
  animation-delay: -4s;
}

.delay-500 {
  animation-delay: -8s;
}

/* Custom Patterns */
.bg-dot-pattern {
  background-image: radial-gradient(circle at center, currentColor 1px, transparent 1px);
  background-size: 24px 24px;
}

.bg-grid-pattern {
  background-size: 40px 40px;
  background-image: 
    linear-gradient(to right, rgba(0,0,0,0.05) 1px, transparent 1px),
    linear-gradient(to bottom, rgba(0,0,0,0.05) 1px, transparent 1px);
}

/* Gradient Text */
@layer utilities {
  .text-gradient {
    @apply bg-clip-text text-transparent;
    background-image: linear-gradient(to right, hsl(var(--primary)), hsl(var(--primary) / 0.5));
  }
}

/* Custom Shadows */
.shadow-glow {
  box-shadow: 0 0 30px -10px rgba(var(--primary-rgb), 0.3);
}

.shadow-nav {
  box-shadow: 0px 0px 1px 0px rgba(0, 0, 0, 0.8);
}

/* Custom Transitions */
.transition-all-slow {
  transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
}

/* Roast Loading Animations */
@keyframes progress {
  0% {
    transform: translateX(-100%);
  }
  50% {
    transform: translateX(0);
  }
  100% {
    transform: translateX(100%);
  }
}

.animate-progress {
  animation: progress 2s infinite linear;
}

/* Additional Roast UI Utilities */
@layer utilities {
  .roast-gradient {
    @apply bg-gradient-to-r from-orange-500 to-red-500;
  }
  
  .technical-gradient {
    @apply bg-gradient-to-r from-blue-500 to-green-500;
  }
}

/* Markdown content styles */
.markdown-content {
  @apply text-gray-800 leading-relaxed;
  word-wrap: break-word;
  overflow-wrap: break-word;
  width: 100%;
}

.markdown-content > * {
  @apply mb-4;
}

.markdown-content h1,
.markdown-content h2,
.markdown-content h3,
.markdown-content h4,
.markdown-content h5,
.markdown-content h6 {
  @apply font-semibold text-gray-900;
}

.markdown-content h1 {
  @apply text-2xl mb-6;
}

.markdown-content h2 {
  @apply text-xl mb-4;
}

.markdown-content h3 {
  @apply text-lg mb-3;
}

.markdown-content p {
  @apply mb-4 text-gray-600;
}

.markdown-content ul,
.markdown-content ol {
  @apply pl-5 mb-4;
}

.markdown-content ul {
  @apply list-disc;
}

.markdown-content ol {
  @apply list-decimal;
}

.markdown-content li {
  @apply mb-2;
}

.markdown-content pre {
  @apply bg-gray-100 p-4 rounded-lg overflow-x-auto mb-4;
}

.markdown-content code {
  @apply bg-gray-100 px-1.5 py-0.5 rounded text-sm text-gray-800;
}

.markdown-content blockquote {
  @apply border-l-4 border-gray-200 pl-4 italic text-gray-600 my-4;
}

.markdown-content a {
  @apply text-blue-500 hover:text-blue-600 underline;
}

.markdown-content img {
  @apply max-w-full h-auto rounded-lg my-4;
}

.markdown-content table {
  @apply w-full border-collapse mb-4;
}

.markdown-content th,
.markdown-content td {
  @apply border border-gray-200 px-4 py-2;
}

.markdown-content th {
  @apply bg-gray-50;
}


</globals.css>

<layout.tsx>
//app/layout.tsx
import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { FloatingNav } from "@/components/FloatingNav";
import { GoogleAnalytics } from '@next/third-parties/google';
import { Toaster } from "@/components/ui/toaster"

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
  keywords: ["web design company", "AI automation", "digital agency", "web design", "service design"],
  
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
    description: 'Professional web design & complex AI automation for modern businesses.',
    images: [{
      url: '/og-image.jpg',
      width: 1200,
      height: 630,
      alt: 'Blueprint Studio',
    }],
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
          <Toaster />
        </main>
        <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA_ID!} />
      </body>
    </html>
  );
}
</layout.tsx>

<FeaturedProjects.tsx>
//components/service-page/web-design/FeaturedProjects.tsx
// components/service-page/web-design/FeaturedProjects.tsx
import { motion } from 'framer-motion';
import { ArrowUpRight, ExternalLink } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

// Project type definition
interface Project {
  title: string;
  description: string;
  image: string;
  category: string;
  results?: string[];
  link?: string;
  technologies: string[]; // Made required since category will be first tag
}

const featuredProjects: Project[] = [
  {
    title: "TokenWorks idScanner.com",
    description: "Complete redesign and development of a headless wordpress ecommerce site for the industry leading ID Scanning company.",
    image: "/images/work/idscanner.png",
    category: "e-commerce",
    results: [
      "Custom platform built for growth",
      "Improved branding and product showcase",
      "Custom code, design, assets & copy"
    ],
    technologies: ["Next.js", "TypeScript", "WordPress"],
  },
  {
    title: "Manchester Energy Committee",
    description: "A modern, accessible website for public energy initiatives.",
    image: "/images/work/manchester-energy.png",
    category: "Public Sector",
    results: [
      "Scalable community engagement platform",
      "Easy content publishing for non-technical staff",
      "Compliant with federal and state government standards"
    ],
    technologies: ["Framer", "Figma"],
  },
  {
    title: "Juris Genius",
    description: "The AI Bar Tutor. Pass the Bar In Half the Time With JurisGenius: Your AI tutor & data-driven UBE practice platform.",
    image: "/images/work/juris.png",
    category: "AI Web App",
    results: [
      "Adaptive learning platform for law students",
      "Real-time feedback on practice questions",
      "Comprehensive UBE practice environment",
    ],
    technologies: ["React", "Node.js", "OpenAI"],
  }
];

export function FeaturedProjects() {
  return (
    <section className="py-24">
      <div className="container px-4">
        <div className="max-w-4xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">
              Featured Web Design Projects
            </h2>
            <p className="text-muted-foreground">
              Transforming business challenges into exceptional digital experiences
            </p>
          </div>

          {/* Projects Grid */}
          <div className="space-y-16">
            {featuredProjects.map((project, index) => (
                <motion.div
                key={project.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2 }}
                className="group"
                >
                <div className="grid md:grid-cols-2 gap-8 items-center">
                    {/* Project Image */}
                    <div className="relative aspect-[4/3] rounded-xl overflow-hidden">
                    <Image
                        src={project.image}
                        alt={project.title}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    </div>

                    {/* Project Details */}
                    <div className="space-y-6">
                    <div>
                        <h3 className="text-2xl font-bold mb-4">{project.title}</h3>
                        <p className="text-muted-foreground mb-6">
                        {project.description}
                        </p>
                    </div>

                    {/* Tags - Category first, followed by technologies */}
                    <div className="flex flex-wrap gap-2">
                    {/* Category tag - using a softer dark gray */}
                    <span className="inline-flex items-center justify-center px-3 py-1 rounded-full border text-sm">
                        {project.category}
                    </span>
                    
                    {/* Technology tags remain the same */}
                    {project.technologies.map((tech) => (
                        <span
                        key={tech}
                        className="inline-flex items-center justify-center px-3 py-1 rounded-full bg-primary/5 text-sm"
                        >
                        {tech}
                        </span>
                    ))}
                    </div>

                    {/* Results */}
                    {project.results && (
                        <div className="space-y-2">
                        <h4 className="text-sm font-medium">Key Results</h4>
                        <div className="grid grid-cols-1 gap-2">
                            {project.results.map((result) => (
                            <div
                                key={result}
                                className="flex items-center gap-2 text-sm text-muted-foreground"
                            >
                                <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                                {result}
                            </div>
                            ))}
                        </div>
                        </div>
                    )}

                    {/* CTA */}
                    {project.link && (
                        <Link
                        href={project.link}
                        className="inline-flex items-center text-sm font-medium text-primary hover:underline"
                        >
                        View Case Study
                        <ArrowUpRight className="ml-1 w-4 h-4" />
                        </Link>
                    )}
                    </div>
                </div>
                </motion.div>
            ))}
            </div>

          {/* Bottom CTA */}
          <div className="mt-16 text-center">
            <Link href="/" className="inline-flex items-center gap-2">
              <Button size="lg">
                View More Projects
                <ExternalLink className="ml-2 w-4 h-4" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
</FeaturedProjects.tsx>

<IndustryGrid.tsx>
//components/service-page/web-design/IndustryGrid.tsx
// components/service-page/web-design/IndustryGrid.tsx
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Plus, Building2, ChevronDown, LucideIcon, Building, Scale, Stethoscope } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

// Industry category type
type IndustryCategory = {
  name: string;
  industries: {
    slug: string;
    name: string;
    description: string;
    icon?: LucideIcon;  
    featured?: boolean;
  }[];
};

const industryCategories: IndustryCategory[] = [
  {
    name: "Business & Professional",
    industries: [
      {
        slug: "healthcare",
        name: "Healthcare",
        description: "HIPAA-compliant websites for medical practices and healthcare providers",
        icon: Stethoscope,
        featured: true
      },
      {
        slug: "law-firms",
        name: "Law Firms",
        description: "Professional websites for attorneys and legal practices",
        icon: Scale, 
        featured: true
      },
      {
        slug: "real-estate",
        name: "Real Estate",
        description: "Property listing and agent websites",
        icon: Building, 
        featured: true
      },
      {
        slug: "financial-services",
        name: "Financial Services",
        description: "Secure websites for financial advisors and firms",
      },
      {
        slug: "consulting",
        name: "Consulting",
        description: "Lead-generating websites for consultants",
      }
    ]
  },
  {
    name: "Retail & Service",
    industries: [
      {
        slug: "ecommerce",
        name: "E-commerce",
        description: "Online stores and retail experiences",
      },
      {
        slug: "restaurants",
        name: "Restaurants",
        description: "Restaurant and food service websites",
      },
      {
        slug: "hospitality",
        name: "Hospitality",
        description: "Hotels and hospitality business websites",
      }
    ]
  },
  {
    name: "Technology",
    industries: [
      {
        slug: "saas",
        name: "SaaS",
        description: "Software as a Service company websites",
      },
      {
        slug: "startups",
        name: "Startups",
        description: "Fast-launch websites for startups",
      },
      {
        slug: "tech-companies",
        name: "Tech Companies",
        description: "Websites for technology companies",
      }
    ]
  }
];


export function IndustryGrid() {
  const [isExpanded, setIsExpanded] = useState(false);

  // Get featured industries
  const featuredIndustries = industryCategories
    .flatMap(cat => cat.industries)
    .filter(ind => ind.featured);

  return (
    <section className="py-24">
      <div className="container px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">
              Industry-Specific Web Design Solutions
            </h2>
            <p className="text-muted-foreground">
              Tailored web design for your industry&apos;s unique requirements
            </p>
          </div>

        {/* Featured Industries Grid */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
        {featuredIndustries.map((industry) => (
            <Link
            key={industry.slug}
            href="https://cal.com/blueprint-studio/intro-call"
            className="group relative overflow-hidden rounded-2xl border bg-background hover:bg-primary/5 
                hover:border-primary/20 transition-all duration-300"
            >
            <div className="flex flex-col h-full">
                <div className="p-8 flex justify-center items-center">
                    {industry.icon && (
                        <industry.icon className="w-12 h-12 text-gray-300 group-hover:text-primary transition-colors" />
                    )}
                </div>
                <div className="p-6 flex flex-col justify-between flex-1">
                <div>
                    <h3 className="text-xl font-semibold mb-2 group-hover:text-primary transition-colors">
                    {industry.name}
                    </h3>
                    <p className="text-muted-foreground">
                    {industry.description}
                    </p>
                </div>
                
                <div className="flex items-center text-sm font-medium text-primary pt-4">
                    Learn more
                    <ArrowRight className="w-4 h-4 ml-1 transition-transform group-hover:translate-x-1" />
                </div>
                </div>
            </div>
            </Link>
        ))}
        </div>

          {/* Expand/Collapse Section */}
          <div className="text-center">
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full 
                border hover:bg-primary/5 hover:border-primary/20 transition-all"
            >
              {isExpanded ? (
                <>
                  Show Less
                  <ChevronDown className="w-4 h-4 rotate-180" />
                </>
              ) : (
                <>
                  View All Industries
                  <ChevronDown className="w-4 h-4" />
                </>
              )}
            </button>
          </div>

          {/* Expanded List */}
          <AnimatePresence>
            {isExpanded && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="overflow-hidden"
              >
                <div className="pt-12 space-y-12">
                  {industryCategories.map((category) => (
                    <div key={category.name}>
                      <h3 className="text-xl font-semibold mb-6">{category.name}</h3>
                      <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
                        {category.industries.map((industry) => (
                          <Link
                            key={industry.slug}
                            href="https://cal.com/blueprint-studio/intro-call"
                            className="p-4 rounded-xl border hover:bg-primary/5 
                              hover:border-primary/20 transition-all group"
                          >
                            <h4 className="font-medium mb-1 group-hover:text-primary 
                              transition-colors">
                              {industry.name}
                            </h4>
                            <p className="text-sm text-muted-foreground">
                              {industry.description}
                            </p>
                          </Link>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
</IndustryGrid.tsx>

<PrimarySolutions.tsx>
//components/service-page/web-design/PrimarySolutions.tsx
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { Building2, Rocket, ShoppingCart, Code, Search } from 'lucide-react';

const solutions = [
  {
    name: "Small Business",
    price: "Starting from $2,999",
    image: "/images/solutions/small-business.webp",
    className: "col-span-1 row-span-2 md:col-span-2",
    icon: Building2
  },
  {
    name: "Startup Sites",
    price: "Starting from $3,999",
    image: "/images/solutions/startup.webp",
    className: "col-span-1 row-span-1",
    icon: Rocket
  },
  {
    name: "E-commerce",
    price: "Starting from $4,999",
    image: "/images/solutions/ecommerce.webp",
    className: "col-span-1 row-span-1",
    icon: ShoppingCart
  },
  {
    name: "MVP Prototype",
    price: "Starting from $10k",
    image: "/images/solutions/mvp.webp",
    className: "col-span-1 row-span-1 md:col-span-2",
    icon: Code
  },
  {
    name: "Find Your Solution",
    price: "",
    image: "/images/solutions/mvp.webp",
    className: "col-span-1 row-span-1 md:col-span-1",
    link: "#solution-finder",
    icon: Search
  }
];

export function PrimarySolutions() {
  const SolutionContent = ({ solution, index }: { solution: typeof solutions[0], index: number }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1 }}
      className="p-6 h-full flex flex-col justify-between"
    >
      <div>
        <h3 className="text-xl font-medium mb-2">{solution.name}</h3>
        <p className="text-gray-600 text-sm">{solution.price}</p>
      </div>

      <div className="mt-4 flex justify-between items-end">
        <div className="relative w-24 h-24">
          <solution.icon className="w-6 h-6 text-gray-600 absolute bottom-0 left-0" />
        </div>
        {solution.link && (
          <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-gray-600 transition-colors" />
        )}
      </div>
    </motion.div>
  );

  return (
    <section id="solutions" className="py-24">
      <div className="container px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold mb-12">Popular Company Solutions</h2>
          
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {solutions.map((solution, index) => (
              solution.link ? (
                <motion.div
                  key={solution.name}
                  whileHover={{ scale: 1.02 }}
                  className={`relative overflow-hidden rounded-3xl bg-gray-50 ${solution.className}`}
                >
                  <Link
                    href={solution.link}
                    className="group block h-full hover:bg-gray-100 transition-all duration-300"
                  >
                    <SolutionContent solution={solution} index={index} />
                  </Link>
                </motion.div>
              ) : (
                <div
                  key={solution.name}
                  className={`relative overflow-hidden rounded-3xl bg-gray-50 ${solution.className}`}
                >
                  <SolutionContent solution={solution} index={index} />
                </div>
              )
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
</PrimarySolutions.tsx>

<Process.tsx>
//components/service-page/web-design/Process.tsx
// components/service-page/web-design/Process.tsx
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { Lightbulb, Telescope, Palette, Code2, LineChart, Sparkles, Link, ExternalLink } from 'lucide-react';

const steps = [
  {
    icon: Lightbulb,
    name: "Discovery",
    title: "Understanding Your Vision",
    description: "We start by deeply understanding your business goals, target audience, and unique requirements to lay the foundation for success.",
    details: [
      "Business goals analysis",
      "User research & personas",
      "Content strategy planning",
      "Technical requirements"
    ]
  },
  {
    icon: Telescope,
    name: "Strategy",
    title: "Research & Strategy",
    description: "We develop a comprehensive strategy that aligns design decisions with your business objectives and user needs.",
    details: [
      "Information architecture",
      "User flow mapping",
      "SEO strategy",
      "Technology selection"
    ]
  },
  {
    icon: Palette,
    name: "Design",
    title: "Crafting the Experience",
    description: "Our designers create an intuitive, engaging interface that reflects your brand and delights your users.",
    details: [
      "Wireframing & prototyping",
      "Visual design",
      "Responsive layouts",
      "Interactive elements"
    ]
  },
  {
    icon: Code2,
    name: "Development",
    title: "Building with Precision",
    description: "We bring the design to life with clean, efficient code that ensures your site performs flawlessly.",
    details: [
      "Frontend development",
      "CMS integration",
      "Performance optimization",
      "Security implementation"
    ]
  },
  {
    icon: LineChart,
    name: "Testing",
    title: "Ensuring Excellence",
    description: "Rigorous testing across devices and platforms ensures a seamless experience for all users.",
    details: [
      "Cross-browser testing",
      "Mobile optimization",
      "Performance testing",
      "User acceptance testing"
    ]
  },
  {
    icon: Sparkles,
    name: "Launch",
    title: "Going Live",
    description: "We carefully deploy your site and provide the support you need for a successful launch.",
    details: [
      "Deployment",
      "Analytics setup",
      "Documentation",
      "Post-launch support"
    ]
  }
];

export function Process() {
  return (
    <section className="py-24">
      <div className="container px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">
              Our Web Design Process
            </h2>
            <p className="text-muted-foreground">
              A proven approach that consistently delivers exceptional results
            </p>
          </div>

          <div className="grid gap-12">
            {steps.map((step, index) => (
              <motion.div
                key={step.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="relative"
              >
                {/* Connector Line */}
                {index !== steps.length - 1 && (
                  <div className="absolute left-[39px] top-[80px] w-[2px] h-[calc(100%+48px)] bg-gradient-to-b from-primary/20 to-transparent" />
                )}

                <div className="flex gap-8">
                  {/* Step Number & Icon */}
                  <div className="flex-shrink-0">
                    <div className="w-20 h-20 rounded-2xl bg-primary/5 flex items-center justify-center relative">
                      <step.icon className="w-8 h-8 text-primary" />
                      <div className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-primary text-white text-sm flex items-center justify-center">
                        {index + 1}
                      </div>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="flex-1 pt-2">
                    <div className="mb-4">
                      <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
                      <p className="text-muted-foreground">{step.description}</p>
                    </div>

                    <div className="grid sm:grid-cols-2 gap-3">
                      {step.details.map((detail) => (
                        <div
                          key={detail}
                          className="px-4 py-3 rounded-xl bg-primary/5 text-sm"
                        >
                          {detail}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>


          {/* Call to Action */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="mt-16 text-center"
          >
            <p className="text-muted-foreground mb-4">
              Ready to start your web design project?
            </p>
            
            <button
              onClick={() => window.open('https://cal.com/blueprint-studio/intro-call', '_blank')}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-primary text-white hover:bg-primary/90 transition-colors"
            >
              Get a Free Quote
            </button>
            
          </motion.div>
        </div>
      </div>
    </section>
  );
}
</Process.tsx>

<SolutionFinder.tsx>
//components/service-page/web-design/SolutionFinder.tsx
// components/service-page/web-design/SolutionFinder.tsx
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { ArrowRight, Check, ChevronLeft, Settings2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

// -------------------------
// Types
// -------------------------

// Each module represents a building block of the final solution.
type Module = {
  id: string;
  name: string;
  description: string;
  basePrice: number;
  estimatedTime: string;
  features: string[];
  techStack?: string[];
};

// The dynamic solution is built by combining modules.
type DynamicSolution = {
  name: string;
  description: string;
  price: string;
  features: string[];
  timeline: string;
  modules: Module[];
};

type Question = {
  id: string;
  text: string;
  options: {
    id: string;
    text: string;
    icon?: string;
  }[];
};

// -------------------------
// Animations
// -------------------------
const pageVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 }
};

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
};

// -------------------------
// Questions Data
// -------------------------
const questions: Question[] = [
  {
    id: 'purpose',
    text: "What's the main purpose of your website?",
    options: [
      { id: 'business', text: 'Showcase my business & services' },
      { id: 'sell', text: 'Sell products online' },
      { id: 'leads', text: 'Generate leads & appointments' },
      { id: 'custom', text: 'Build a custom web application' },
      { id: 'portfolio', text: 'Create a portfolio/personal site' },
      { id: 'startup', text: 'Launch a startup/MVP' }
    ]
  },
  {
    id: 'industry',
    text: 'What industry are you in?',
    options: [
      { id: 'retail', text: 'Retail & E-commerce' },
      { id: 'professional', text: 'Professional Services' },
      { id: 'healthcare', text: 'Healthcare' },
      { id: 'realestate', text: 'Real Estate' },
      { id: 'tech', text: 'Technology' },
      { id: 'hospitality', text: 'Hospitality & Restaurants' },
      { id: 'construction', text: 'Construction & HVAC' },
      { id: 'other', text: 'Other' }
    ]
  },
  {
    id: 'features',
    text: 'What features do you need?',
    options: [
      { id: 'basic', text: 'Basic website (info, contact, about)' },
      { id: 'cms', text: 'Content Management System' },
      { id: 'ecommerce', text: 'Online Store' },
      { id: 'booking', text: 'Booking & Appointments' },
      { id: 'custom', text: 'Custom Functionality' },
      { id: 'unsure', text: 'Not sure yet' }
    ]
  },
  {
    id: 'timeline',
    text: 'When do you need your website?',
    options: [
      { id: 'asap', text: 'As soon as possible (1-2 weeks)' },
      { id: 'soon', text: 'Soon (2-4 weeks)' },
      { id: 'month', text: 'Within 1-2 months' },
      { id: 'flexible', text: 'Flexible / Not urgent' }
    ]
  },
  {
    id: 'budget',
    text: "What's your budget range?",
    options: [
      { id: 'starter', text: '$1,000 - $3,000' },
      { id: 'basic', text: '$3,000 - $5,000' },
      { id: 'professional', text: '$5,000 - $10,000' },
      { id: 'premium', text: '$10,000 - $20,000' },
      { id: 'enterprise', text: '$20,000+' }
    ]
  },
  {
    id: 'management',
    text: 'How would you like to manage your website?',
    options: [
      { id: 'self', text: 'I want to manage everything myself' },
      { id: 'partial', text: 'I want to manage content, you handle technical' },
      { id: 'full', text: 'I want full service management' }
    ]
  }
];

// -------------------------
// Modules Definitions
// -------------------------
const modules: Record<string, Module> = {
  design: {
    id: 'design',
    name: 'Responsive Design',
    description: 'A modern, mobile-friendly design as the backbone of your site.',
    basePrice: 1500,
    estimatedTime: '1-2 weeks',
    features: ['Mobile-responsive layout', 'UX/UI best practices']
  },
  ecommerce: {
    id: 'ecommerce',
    name: 'E-commerce Module',
    description:
      'Fully integrated online store with secure payment and order management.',
    basePrice: 2500,
    estimatedTime: '2-3 weeks',
    features: ['Product catalog', 'Shopping cart', 'Secure checkout'],
    techStack: ['Shopify', 'WooCommerce']
  },
  cms: {
    id: 'cms',
    name: 'Content Management System',
    description:
      'A flexible CMS that empowers you to easily update and manage content.',
    basePrice: 2000,
    estimatedTime: '2-3 weeks',
    features: ['Easy content editing', 'Customizable templates']
  },
  booking: {
    id: 'booking',
    name: 'Booking & Appointments',
    description:
      'An integrated booking system to manage appointments and reservations.',
    basePrice: 1800,
    estimatedTime: '1-2 weeks',
    features: ['Calendar integration', 'Automated reminders']
  },
  custom: {
    id: 'custom',
    name: 'Custom Web Application',
    description:
      'Bespoke web application development tailored to your unique requirements.',
    basePrice: 5000,
    estimatedTime: '4-6 weeks',
    features: ['Custom user flows', 'API integrations', 'Database setup']
  },
  portfolio: {
    id: 'portfolio',
    name: 'Portfolio Module',
    description:
      'A sleek, minimalist design ideal for showcasing your work and projects.',
    basePrice: 1200,
    estimatedTime: '1-2 weeks',
    features: ['Image galleries', 'Project showcases', 'Blog integration']
  }
};

// -------------------------
// Dynamic Solution Generator
// -------------------------

const timelineMapping: Record<string, string> = {
    asap: "1-2 weeks",
    soon: "2-4 weeks",
    month: "1-2 months",
    flexible: "Flexible / Not urgent"
  };
  
const generateDynamicSolution = (
    answers: Record<string, string>
  ): DynamicSolution => {
    const selectedModules: Module[] = [];
    let totalPrice = 0;
  
    // Always include the design module
    selectedModules.push(modules.design);
    totalPrice += modules.design.basePrice;
  
    // E-commerce: if the purpose is selling or the user selects e-commerce features.
    if (answers.purpose === 'sell' || answers.features === 'ecommerce') {
      selectedModules.push(modules.ecommerce);
      totalPrice += modules.ecommerce.basePrice;
    }
  
    // CMS: if the user chooses CMS as a feature.
    if (answers.features === 'cms') {
      selectedModules.push(modules.cms);
      totalPrice += modules.cms.basePrice;
    }
  
    // Booking: if the user needs appointment booking.
    if (answers.features === 'booking') {
      selectedModules.push(modules.booking);
      totalPrice += modules.booking.basePrice;
    }
  
    // Custom: if the user wants a custom web application or is launching a startup.
    if (answers.purpose === 'custom' || answers.purpose === 'startup') {
      selectedModules.push(modules.custom);
      totalPrice += modules.custom.basePrice;
    }
  
    // Portfolio: if the purpose is a portfolio/personal site.
    if (answers.purpose === 'portfolio') {
      selectedModules.push(modules.portfolio);
      totalPrice += modules.portfolio.basePrice;
    }
  
    // Use the timeline answer directly.
    const timeline = timelineMapping[answers.timeline] || "TBD";
    const solutionName = 'Custom Web Design Solution';
    const description = `Based on your responses, we've crafted a solution that includes: ${selectedModules
      .map((mod) => mod.name)
      .join(', ')}.`;
  
    return {
      name: solutionName,
      description,
      price: `Starting at $${totalPrice}`,
      features: selectedModules.flatMap((mod) => mod.features),
      timeline,
      modules: selectedModules
    };
  };
  

// -------------------------
// Components
// -------------------------

// Renders each question with its options.
function QuestionStep({
  question,
  onAnswer,
  onBack,
  showBack
}: {
  question: Question;
  onAnswer: (questionId: string, answerId: string) => void;
  onBack: () => void;
  showBack: boolean;
}) {
  return (
    <motion.div
      initial="initial"
      animate="animate"
      exit="exit"
      variants={pageVariants}
      transition={{ duration: 0.3, ease: 'easeOut' }}
    >
      <div className="mb-8">
        {showBack && (
          <button
            onClick={onBack}
            className="flex items-center text-sm text-muted-foreground hover:text-foreground mb-4"
          >
            <ChevronLeft className="w-4 h-4 mr-1" />
            Back
          </button>
        )}
        <h3 className="text-xl font-semibold mb-2">{question.text}</h3>
      </div>
      <div className="grid gap-4">
        {question.options.map((option) => (
          <motion.button
            key={option.id}
            onClick={() => onAnswer(question.id, option.id)}
            className="group relative p-4 border rounded-xl text-left hover:border-primary transition-all duration-200 hover:bg-primary/5"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="flex items-center justify-between">
              <span className="font-medium">{option.text}</span>
              <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
          </motion.button>
        ))}
      </div>
    </motion.div>
  );
}

// Renders the dynamic solution result.
function SolutionResult({
  solution,
  onRestart
}: {
  solution: DynamicSolution;
  onRestart: () => void;
}) {
  return (
    <motion.div
      initial="initial"
      animate="animate"
      exit="exit"
      variants={pageVariants}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      className="space-y-8"
    >
      <div className="text-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/5 mb-6">
          <Settings2 className="w-4 h-4 text-primary" />
          <span className="text-sm font-medium">Your Custom Solution</span>
        </div>
        <h3 className="text-2xl font-bold mb-2">{solution.name}</h3>
        <p className="text-muted-foreground mb-4">{solution.description}</p>
        <div className="text-xl font-semibold text-primary">{solution.price}</div>
        <div className="mt-2 text-sm text-muted-foreground">
          Estimated Timeline: {solution.timeline}
        </div>
      </div>

      <div className="space-y-4">
        <h4 className="font-medium">Included Features</h4>
        <div className="grid gap-3">
          {solution.features.map((feature, index) => (
            <div key={index} className="flex items-start gap-3">
              <Check className="w-5 h-5 text-primary mt-0.5" />
              <span>{feature}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 pt-4">
        <Button
          className="flex-1"
          onClick={() => (window.location.href = 'https://cal.com/blueprint-studio/intro-call')}
        >
          Get Started
          <ArrowRight className="ml-2 w-4 h-4" />
        </Button>
        <Button variant="outline" className="flex-1" onClick={onRestart}>
          Start Over
        </Button>
      </div>
    </motion.div>
  );
}

// -------------------------
// Main Component
// -------------------------
export function SolutionFinder() {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [generatedSolution, setGeneratedSolution] = useState<DynamicSolution | null>(null);

  const handleAnswer = (questionId: string, answerId: string) => {
    const newAnswers = { ...answers, [questionId]: answerId };
    setAnswers(newAnswers);

    if (currentStep < questions.length - 1) {
      setCurrentStep((current) => current + 1);
    } else {
      // When all questions have been answered, dynamically generate the solution.
      const solution = generateDynamicSolution(newAnswers);
      setGeneratedSolution(solution);
    }
  };

  const goBack = () => {
    if (currentStep > 0) {
      setCurrentStep((current) => current - 1);
    }
  };

  const restart = () => {
    setCurrentStep(0);
    setAnswers({});
    setGeneratedSolution(null);
  };

  return (
    <section className="py-24 relative overflow-hidden">
      <div className="container px-4">
        <div className="max-w-3xl mx-auto">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeIn}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold mb-4">
              Build Your Custom Web Design Solution
            </h2>
            <p className="text-muted-foreground">
              Answer a few questions and see a tailored solution built just for you.
            </p>
          </motion.div>

          <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-8">
            {!generatedSolution && (
              <div className="mb-8">
                <div className="flex justify-between text-sm text-muted-foreground mb-2">
                  <span>Progress</span>
                  <span>
                    {Math.round(((currentStep + 1) / questions.length) * 100)}%
                  </span>
                </div>
                <div className="h-1 bg-gray-100 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-primary"
                    initial={{ width: 0 }}
                    animate={{
                      width: `${((currentStep + 1) / questions.length) * 100}%`
                    }}
                    transition={{ duration: 0.4, ease: 'easeInOut' }}
                  />
                </div>
              </div>
            )}

            <AnimatePresence mode="wait">
              {!generatedSolution ? (
                <QuestionStep
                  key={currentStep}
                  question={questions[currentStep]}
                  onAnswer={handleAnswer}
                  onBack={goBack}
                  showBack={currentStep > 0}
                />
              ) : (
                <SolutionResult solution={generatedSolution} onRestart={restart} />
              )}
            </AnimatePresence>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mt-12 text-center text-sm text-muted-foreground"
          >
            <p>
              Not sure what you need?{' '}
              <button
                onClick={() =>
                  window.open('https://cal.com/blueprint-studio/intro-call', '_blank')
                }
                className="text-primary hover:underline"
              >
                Schedule a free consultation
              </button>
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

</SolutionFinder.tsx>

<TechnologyGrid.tsx>
//components/service-page/web-design/TechnologyGrid.tsx
// components/service-page/web-design/TechnologyGrid.tsx
import { motion } from 'framer-motion';
import { useState } from 'react';
import { cn } from '@/lib/utils';
import { 
  SiNextdotjs, SiReact, SiTypescript, SiTailwindcss, SiVercel,
  SiPostgresql, SiSupabase, SiFramer, SiNodedotjs, SiPython, SiWordpress, 
  SiDigitalocean, SiWebflow, SiFigma, SiGoogleanalytics, SiGoogleads,
  SiGooglesearchconsole, SiGoogletagmanager, SiMeta, SiOpenai, SiMixpanel,
  SiHotjar, SiHuggingface, SiShopify, SiContentful,
} from 'react-icons/si';
import { Brain, Cpu, ArrowUpRight } from 'lucide-react';

const technologies = [
    {
      category: "Design & Development",
      description: "Modern frameworks and design tools",
      tools: [
        { name: "Next.js", icon: SiNextdotjs, description: "React framework for production" },
        { name: "React", icon: SiReact, description: "UI component library" },
        { name: "TypeScript", icon: SiTypescript, description: "Type-safe JavaScript" },
        { name: "Node.js", icon: SiNodedotjs, description: "Server-side JavaScript" },
        { name: "Python", icon: SiPython, description: "Backend & automation" },
        { name: "Tailwind CSS", icon: SiTailwindcss, description: "Utility-first CSS" },
        { name: "Figma", icon: SiFigma, description: "Design & prototyping" },
        { name: "Framer", icon: SiFramer, description: "Interactive design" }
      ]
    },
    {
      category: "CMS",
      description: "Content management systems",
      tools: [
        { name: "WordPress", icon: SiWordpress, description: "Content management" },
        { name: "Webflow", icon: SiWebflow, description: "Visual development" },
        { name: "Shopify", icon: SiShopify, description: "E-commerce platform" },
        { name: "Contentful", icon: SiContentful, description: "Headless CMS" }
      ]
    },
    {
      category: "Infrastructure",
      description: "Hosting and database solutions",
      tools: [
        { name: "Vercel", icon: SiVercel, description: "Edge deployment" },
        { name: "Digital Ocean", icon: SiDigitalocean, description: "Cloud hosting" },
        { name: "PostgreSQL", icon: SiPostgresql, description: "Relational database" },
        { name: "Supabase", icon: SiSupabase, description: "Backend as a service" }
      ]
    },
    {
      category: "AI",
      description: "Artificial intelligence tools",
      tools: [
        { name: "Claude", icon: Brain, description: "Anthropic AI assistant" },
        { name: "OpenAI", icon: SiOpenai, description: "AI integration" },
        { name: "Hugging Face", icon: SiHuggingface, description: "AI models & deployment" },
        { name: "Replicate", icon: Cpu, description: "AI infrastructure" } 
    ]
    },
    {
      category: "Analytics",
      description: "Measurement and tracking tools",
      tools: [
        { name: "Analytics", icon: SiGoogleanalytics, description: "Web analytics" },
        { name: "Tag Manager", icon: SiGoogletagmanager, description: "Tag management" },
        { name: "Mixpanel", icon: SiMixpanel, description: "Product analytics" },
        { name: "Hotjar", icon: SiHotjar, description: "User behavior analytics" }
      ]
    },
    {
      category: "Marketing",
      description: "Growth and advertising platforms",
      tools: [
        { name: "Google Ads", icon: SiGoogleads, description: "Search & display ads" },
        { name: "Search Console", icon: SiGooglesearchconsole, description: "SEO tools" },
        { name: "Meta Ads", icon: SiMeta, description: "Social advertising" },
        { name: "Merchant Center", icon: SiGoogleads, description: "Product listings" }
      ]
    }
  ];

export function TechnologyGrid() {
    const [activeCategory, setActiveCategory] = useState(technologies[0].category);
  
    return (
      <section className="py-24">
        <div className="container px-4">
          <div className="max-w-4xl mx-auto">

          {/* Section Header */}
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">
              Full-Stack Technology Partner
            </h2>
            <p className="text-muted-foreground">
              We leverage a comprehensive suite of modern tools and platforms to build, 
              deploy, and grow exceptional digital experiences.
            </p>
          </div>

          {/* Category Tabs */}
          <div className="flex gap-2 mb-8 overflow-x-auto pb-2 scrollbar-hide">
            {technologies.map((category) => (
              <button
                key={category.category}
                onClick={() => setActiveCategory(category.category)}
                className={cn(
                  "px-4 py-2 rounded-full text-sm whitespace-nowrap transition-colors",
                  activeCategory === category.category
                    ? "bg-primary text-primary-foreground"
                    : "bg-primary/5 hover:bg-primary/10"
                )}
              >
                {category.category}
              </button>
            ))}
          </div>

          {/* Tools Grid */}
          <motion.div 
            key={activeCategory}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-4"
          >
            {technologies
              .find(cat => cat.category === activeCategory)
              ?.tools.map((tool, index) => (
                <motion.div
                  key={tool.name}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="group relative p-4 rounded-xl border border-foreground/10 
                    hover:border-primary/20 transition-all duration-300 
                    bg-background/50 backdrop-blur-sm h-[120px] flex flex-col"
                >
                  <div className="flex items-center gap-3 mb-2">
                    <tool.icon className="w-5 h-5 text-primary flex-shrink-0" />
                    <span className="font-medium truncate">{tool.name}</span>
                    <ArrowUpRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0" />
                  </div>
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {tool.description}
                  </p>
                </motion.div>
              ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
</TechnologyGrid.tsx>

<WebDesignFAQ.tsx>
//components/service-page/web-design/WebDesignFAQ.tsx
// components/service-page/web-design/WebDesignFAQ.tsx
import { motion } from 'framer-motion';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    question: "How much does professional web design cost?",
    answer: "Our web design projects can range from $899 to $60,000+ depending on complexity and requirements. A simple single page site starts at $899, while custom web applications or seo optomized e-commerce solutions may range are more expensive. We provide detailed quotes after understanding your specific needs and goals."
  },
  {
    question: "How long does it take to design and launch a website?",
    answer: "Simple single page sites can be completed in a day. Complex projects with hundreds of pages can take over 8 months. Most business websites take 4-8 weeks from kickoff to launch. We'll provide a detailed timeline based on your project scope and requirements."
  },
  {
    question: "Do you provide ongoing website maintenance?",
    answer: "Yes, we offer flexible maintenance plans to keep your website secure, updated, and performing optimally. This includes regular updates, security monitoring, performance optimization, content updates, and technical support. Maintence plans are not required and we can tailor a maintenance plan to your specific needs if desired."
  },
  {
    question: "Will my website be mobile-friendly and responsive?",
    answer: "Absolutely. Every website we design is fully responsive and optimized for all devices - mobile phones, tablets, laptops, and desktops. We follow mobile-first design principles to ensure an exceptional user experience across all screen sizes."
  },
  {
    question: "Do you help with website content and SEO?",
    answer: "Yes, we provide comprehensive content strategy and SEO services as part of our web design process. This includes keyword research, content planning, copywriting, meta tag optimization, and technical SEO implementation to help your website rank well in search results."
  },
  {
    question: "What is your web design process like?",
    answer: "Our process begins with in-depth discovery to understand your goals and requirements. We then move through strategic planning, user experience design, visual design, development, and testing phases. We maintain clear communication throughout, with regular updates and opportunities for feedback."
  },
  {
    question: "Can you redesign my existing website?",
    answer: "Yes, we specialize in website redesigns. We'll analyze your current site's performance, identify improvement opportunities, and create a modern, effective design while preserving your existing SEO value and implementing new optimizations."
  },
  {
    question: "What platforms and technologies do you use?",
    answer: "We choose the best technology for each project's needs. We work with modern platforms like Next.js, React, and TypeScript for custom development; Framer, WordPress, and Webflow for content-managed sites; and Shopify for e-commerce. All our solutions prioritize performance, security, and scalability."
  }
];

export function WebDesignFAQ() {
  return (
    <section className="py-24">
      <div className="container px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">
              Common Questions About Web Design
            </h2>
            <p className="text-muted-foreground">
              Everything you need to know about working with our design team
            </p>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="space-y-4"
          >
            <Accordion type="single" collapsible className="w-full">
              {faqs.map((faq, index) => (
                <AccordionItem key={index} value={`item-${index}`}>
                  <AccordionTrigger className="text-left">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </motion.div>

          {/* Call to Action */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="mt-16 text-center"
          >
            <p className="text-muted-foreground mb-4">
                Have more questions? We&apos;re here to help.
            </p>
            <button
              onClick={() => window.open('https://cal.com/blueprint-studio/intro-call', '_blank')}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full 
                bg-primary text-white hover:bg-primary/90 transition-colors"
            >
              Schedule a Free Consultation
            </button>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
</WebDesignFAQ.tsx>

<WebDesignHero.tsx>
//components/service-page/web-design/WebDesignHero.tsx
// components/service-page//web-design/WebDesignHero.tsx
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function WebDesignHero() {
  return (
    <section className="relative min-h-[90vh] flex items-center">
      <div className="container px-4 py-32 relative">
        <div className="max-w-3xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-8"
          >
            {/* SEO-optimized heading structure */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/5 border border-primary/10">
              <span className="w-2 h-2 rounded-full bg-primary" />
              <span className="text-sm font-medium">Web Design Services</span>
            </div>

            <h1 className="text-4xl md:text-6xl font-bold leading-tight">
              Web Design That Moves 
              <span className="text-gradient block">Companies Forward</span>
            </h1>

            <p className="text-xl text-muted-foreground max-w-2xl">
              Transform your digital presence with custom web design solutions 
              that drive growth, engage users, and deliver measurable results.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Button 
                size="lg"
                className="group"
                onClick={() => window.open('https://cal.com/blueprint-studio/intro-call', '_blank')}
              >
                Get Started
                <ArrowRight className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-1" />
              </Button>
              
              <Button
                variant="outline"
                size="lg"
                onClick={() => {
                  document.getElementById('solutions')?.scrollIntoView({ 
                    behavior: 'smooth' 
                  });
                }}
              >
                View Solutions
              </Button>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
</WebDesignHero.tsx>

<WebDesignPricing.tsx>
//components/service-page/web-design/WebDesignPricing.tsx
// should become props on PricingSection.tsx instead of being it's own component

// components/PricingSection.tsx
"use client";
import { useState } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, ArrowUpRight } from 'lucide-react';

// For SVGs, we'll use regular img tags instead of Next.js Image component
const previewImages = {
  calendar: "data:image/svg+xml,%3Csvg width='200' height='150' viewBox='0 0 200 150' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Crect width='200' height='150' fill='%23F3F4F6'/%3E%3Crect x='20' y='20' width='160' height='110' rx='4' fill='white'/%3E%3Crect x='30' y='40' width='140' height='20' rx='2' fill='%23E5E7EB'/%3E%3Crect x='30' y='70' width='140' height='20' rx='2' fill='%23E5E7EB'/%3E%3Crect x='30' y='100' width='140' height='20' rx='2' fill='%23E5E7EB'/%3E%3C/svg%3E",
  chat: "data:image/svg+xml,%3Csvg width='200' height='150' viewBox='0 0 200 150' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Crect width='200' height='150' fill='%23F3F4F6'/%3E%3Crect x='20' y='20' width='160' height='110' rx='4' fill='white'/%3E%3Crect x='30' y='90' width='140' height='30' rx='15' fill='%23E5E7EB'/%3E%3Crect x='30' y='40' width='100' height='20' rx='10' fill='%23E5E7EB'/%3E%3C/svg%3E"
};

const subscriptionFeatures = [
  {
    title: "Dedicated team",
    description: "Full-time designers and developers"
  },
  {
    title: "Unlimited requests",
    description: "Submit as many projects as you need"
  },
  {
    title: "Priority support",
    description: "24/7 access to your project manager"
  },
  {
    title: "Rapid delivery",
    description: "Regular updates and deployments"
  }
];

const webDesignProjectFeatures = [
    {
      title: "Custom web design",
      description: "Tailored to your brand & goals"
    },
    {
      title: "Mobile-first design",
      description: "Responsive across all devices"
    },
    {
      title: "SEO optimization",
      description: "Built for search engines"
    },
    {
      title: "CMS integration",
      description: "Easy content management"
    }
  ];

const pricingFaqs = [
    {
      question: "How flexible is the subscription?",
      answer: "Our company subscriptions are highly flexible. You can pause or cancel at any time, and adjust your team size and resource allocation monthly based on your needs."
    },
    {
      question: "What determines the subscription cost?",
      answer: "Pricing varies based on the services and resources needed. Development-intensive projects with multiple developers typically represent the higher end of our range, while marketing-focused engagements often start at lower price points. We'll help determine the right resource mix for your company."
    },
    {
      question: "Can we scale our subscription up or down?",
      answer: "Yes, your company can adjust bandwidth monthly. Need more developers for a big launch? Want to scale back after a major milestone? You have full control over your resource allocation and can modify it based on project demands."
    },
    {
      question: "How does the trial period work?",
      answer: "New companies can start with a 1-week trial period to experience our full service offering. During this time, you'll work with our team just as you would in a regular subscription, allowing you to evaluate if we're the right fit for your needs."
    },
    {
      question: "What happens if we need to pause our subscription?",
      answer: "We understand business needs fluctuate. You can pause your company's subscription at any time and resume when ready, maintaining all your project information and team relationships."
    },
    {
      question: "How do you handle project handoffs and documentation?",
      answer: "Our team provides comprehensive documentation and ensures smooth knowledge transfer for all company projects. Whether you're scaling up or transitioning between phases, we maintain detailed records and clear communication."
    },
    {
      question: "What's the difference between subscription and custom projects?",
      answer: "Subscriptions offer ongoing access to our team with predictable monthly pricing, ideal for companies looking for a consistent partner. Custom projects are better for one-off initiatives with defined scopes and timelines."
    }
  ];
  

  export function WebDesignPricing() {
    const [showCalendarPreview, setShowCalendarPreview] = useState(false);
    const [showChatPreview, setShowChatPreview] = useState(false);
  
    return (
      <section id="pricing" className="py-32 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Web Design Pricing
            </h2>
            <p className="text-gray-600">
              Choose the engagement model that works best for your website project
            </p>
          </div>  

        <div className="grid md:grid-cols-2 gap-8">
          {/* Subscription Card */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="relative group"
          >
            <div className="bg-black text-white p-8 rounded-2xl">
              <div className="absolute -top-3 -right-3">
                <span className="inline-flex items-center bg-blue-500 text-white text-sm px-3 py-1 rounded-full">
                 1-Week Free Trial
                </span>
              </div>

              <h3 className="text-2xl font-semibold mb-2">Design & Build Subscription</h3>
              <div className="text-3xl font-bold mb-4">
                $5k - $20k<span className="text-lg font-normal">/month</span>
              </div>
              <p className="text-gray-400 mb-6">All-inclusive service with dedicated team</p>
              
              <ul className="space-y-4 mb-8">
                {subscriptionFeatures.map((feature, i) => (
                  <motion.li 
                    key={i}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                    className="flex items-start gap-3"
                  >
                    <CheckCircle className="w-5 h-5 text-green-500 shrink-0 mt-1" />
                    <div>
                      <p className="font-medium">{feature.title}</p>
                      <p className="text-gray-400 text-sm">{feature.description}</p>
                    </div>
                  </motion.li>
                ))}
              </ul>

              <button 
                className="w-full bg-white text-black rounded-full py-4 font-medium flex items-center justify-center group-hover:bg-gray-100 transition-colors"
                onMouseEnter={() => setShowCalendarPreview(true)}
                onMouseLeave={() => setShowCalendarPreview(false)}
                onClick={() => window.open('https://cal.com/blueprint-studio/intro-call', '_blank')}
              >
                <span>Book a Call</span>
                <ArrowUpRight className="w-5 h-5 ml-2 opacity-0 group-hover:opacity-100 transition-opacity" />
              </button>

              {/* Calendar Preview */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ 
                  opacity: showCalendarPreview ? 1 : 0,
                  y: showCalendarPreview ? 0 : 10
                }}
                className="absolute top-[calc(100%-12px)] left-[26%] -translate-x-1/2 bg-white text-black p-6 rounded-xl shadow-xl w-48 pointer-events-none z-10"
              >
                <div className="relative">
                  <div className="absolute top-0.5 right-0.5 w-6 h-6 bg-black rounded-full flex items-center justify-center -mt-3 -mr-3 z-20">
                    <ArrowUpRight className="w-4 h-4 text-white" />
                  </div>
                  <img 
                    src={previewImages.calendar}
                    alt="Calendar Interface"
                    className="w-full h-auto rounded-lg mb-2"
                  />
                  <p className="text-xs text-gray-600 text-center mt-4">Select a time</p>
                </div>
              </motion.div>
            </div>
          </motion.div>

          {/* Modified Project Card for Web Design */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="relative group"
          >
            <div className="border border-gray-200 p-8 rounded-2xl bg-white">
              <h3 className="text-2xl font-semibold mb-2">Web Design Project</h3>
              <div className="text-3xl font-bold mb-4">Starting at $899</div>
              <p className="text-gray-600 mb-6">Professional website design & development</p>

              <ul className="space-y-4 mb-8">
                {webDesignProjectFeatures.map((feature, i) => (
                  <motion.li 
                    key={i}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                    className="flex items-start gap-3"
                  >
                    <CheckCircle className="w-5 h-5 text-green-500 shrink-0 mt-1" />
                    <div>
                      <p className="font-medium text-gray-900">{feature.title}</p>
                      <p className="text-gray-600 text-sm">{feature.description}</p>
                    </div>
                  </motion.li>
                ))}
              </ul>

              <button 
                className="w-full border-2 border-black rounded-full py-4 font-medium flex items-center justify-center hover:bg-black hover:text-white transition-colors"
                onClick={() => window.open('https://cal.com/blueprint-studio/intro-call', '_blank')}
                onMouseEnter={() => setShowChatPreview(true)}
                onMouseLeave={() => setShowChatPreview(false)}
              >
                <span>Get Web Design Quote</span>
                <ArrowUpRight className="w-5 h-5 ml-2 opacity-0 group-hover:opacity-100 transition-opacity" />
              </button>


              {/* Chat Preview */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ 
                  opacity: showChatPreview ? 1 : 0,
                  y: showChatPreview ? 0 : 10
                }}
                className="absolute top-[calc(100%-12px)] right-[28%] translate-x-1/2 bg-white p-6 rounded-xl shadow-xl w-48 pointer-events-none z-10"
              >
                <div className="relative">
                  <div className="absolute top-0.5 right-0.5 w-6 h-6 bg-black rounded-full flex items-center justify-center -mt-3 -mr-3 z-20">
                    <ArrowUpRight className="w-4 h-4 text-white" />
                  </div>
                  <img 
                    src={previewImages.chat}
                    alt="Chat Interface"
                    className="w-full h-auto rounded-lg mb-2"
                  />
                  <p className="text-xs text-gray-600 text-center mt-4">Chat right now</p>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>

        {/* FAQ */}
        <div className="mt-20">
        <h3 className="text-2xl font-semibold text-center mb-12">Frequently Asked Questions</h3>
        <div className="max-w-2xl mx-auto space-y-8">
            {pricingFaqs.map((faq, i) => (
            <motion.div 
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
            >
                <h4 className="font-medium mb-2">{faq.question}</h4>
                <p className="text-gray-600">{faq.answer}</p>
            </motion.div>
            ))}
        </div>
        
        <div className="text-center mt-12">
        <p className="text-gray-600">
            Still have questions? Email us at{' '}
            <a href="mailto:blueprint.dao@gmail.com" className="text-black underline hover:no-underline">
            blueprint.dao@gmail.com
            </a>
        </p>
        </div>
        </div>
      </div>
    </section>
  );
}
</WebDesignPricing.tsx>

<WebDesignTestimonials.tsx>
//components/service-page/web-design/WebDesignTestimonials.tsx
// components/service-page/web-design/WebDesignTestimonials.tsx
import { motion } from 'framer-motion';
import { Quote } from 'lucide-react';
import Image from 'next/image';

const testimonials = [
  {
    quote: "Design or strategy needs? Check out Blueprint. They're a really capable team with an impressive background and confidence in their craft.",
    author: "Scott Zimmer",
    title: "Former EVP of Innovation, Truist Bank, Currently Startup Co-Founder",
    image: "/images/testimonials/sarah-chen.jpg",
    logo: "/images/testimonials/techflow-logo.svg"
  },
  {
    quote: "Their relentless dedication and talent accelerated our progress tremendously. Blueprint's blend of design talent and cutting edge ai expertise is truly unique and highly valuable.",
    author: "Andrew Jenkins",
    title: "Former VP of Engineering, Credit Karma, Currently Startup Co-Founder",
    image: "/images/testimonials/michael-rodriguez.jpg",
    logo: "/images/testimonials/elevate-logo.svg"
  },
  {
    quote: "Blueprints ability to deeply understand our needs and translate them into smart solutions was an absolute home run.",
    author: "Steven Luis Howell",
    title: "CEO & Co-Founder, Project Metavision",
    image: "/images/testimonials/emily-foster.jpg",
    logo: "/images/testimonials/growthworks-logo.svg"
  }
];

export function WebDesignTestimonials() {
  return (
    <section className="py-24 relative overflow-hidden">
      <div className="container px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">
              Trusted by Growing Brands
            </h2>
            <p className="text-muted-foreground">
              See what our clients say about working with Blueprint
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-3 md:gap-4 lg:gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={testimonial.author}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ 
                  delay: index * 0.2,
                  duration: 0.5
                }}
                className={`relative p-8 rounded-2xl border bg-background/50 backdrop-blur-sm
                  hover:border-primary/20 transition-all duration-300
                  ${index === 1 ? 'md:translate-y-8' : ''}`}
              >
                <div className="absolute -top-3 -left-3">
                  <div className="p-2 rounded-full bg-primary/5 border border-primary/10">
                    <Quote className="w-4 h-4 text-primary" />
                  </div>
                </div>

                <div className="flex flex-col justify-between h-full">
                  <div className="mb-6">
                    <p className="text-lg leading-relaxed">
                      &quot;{testimonial.quote}&quot;
                    </p>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="relative w-12 h-12 rounded-full overflow-hidden bg-primary/5">
                      {/* Uncomment when you have images */}
                      {/* <Image
                        src={testimonial.image}
                        alt={testimonial.author}
                        fill
                        className="object-cover"
                      /> */}
                    </div>
                    
                    <div>
                      <div className="font-medium">{testimonial.author}</div>
                      <div className="text-sm text-muted-foreground">
                        {testimonial.title}
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="mt-16 text-center"
          >
            <p className="text-sm text-muted-foreground">
              Trusted by companies worldwide • 100+ successful projects • 98% client satisfaction
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
</WebDesignTestimonials.tsx>

