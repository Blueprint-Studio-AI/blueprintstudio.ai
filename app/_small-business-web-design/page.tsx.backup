// app/small-business-web-design/page.tsx
"use client";

import Script from 'next/script'
import { motion } from 'framer-motion'
import { ArrowRight, CheckCircle } from 'lucide-react'

// Schema.org structured data
const schemaData = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Service',
      '@id': 'https://blueprintstudio.ai/small-business-web-design#service',
      'name': 'Small Business Web Design',
      'provider': {
        '@type': 'Organization',
        'name': 'Blueprint Studio',
        'url': 'https://blueprintstudio.ai'
      },
      'description': 'Professional web design services tailored for small businesses',
      'offers': {
        '@type': 'Offer',
        'price': '2999',
        'priceCurrency': 'USD'
      }
    },
    {
      '@type': 'FAQPage',
      '@id': 'https://blueprintstudio.ai/small-business-web-design#faq',
      'mainEntity': [
        {
          '@type': 'Question',
          'name': 'How much does a small business website cost?',
          'acceptedAnswer': {
            '@type': 'Answer',
            'text': 'Our small business websites start at $2,999 with flexible payment options. Each project is customized to your specific needs and goals.'
          }
        },
        {
          '@type': 'Question',
          'name': 'How long does it take to build a small business website?',
          'acceptedAnswer': {
            '@type': 'Answer',
            'text': 'Most small business websites are completed within 2-4 weeks, depending on project complexity and client feedback turnaround.'
          }
        }
      ]
    }
  ]
}

export default function SmallBusinessWebDesign() {
  return (
    <main className="min-h-screen bg-[#fafaf9]">
      {/* Schema.org JSON-LD */}
      <Script
        id="schema-data"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaData) }}
      />

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern opacity-[0.02]" />
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <span className="inline-flex items-center bg-black text-white rounded-full px-4 py-2 text-sm">
              Small Business Solutions
            </span>
          </div>
          <h1 className="text-5xl md:text-7xl font-bold mb-8">
            Affordable Web Design for Small Businesses
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 mb-12 max-w-2xl">
            Get a professional, high-converting website that helps your business grow. 
            Fixed pricing, fast turnaround, and designed for results.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <button 
              onClick={() => window.location.href = 'https://cal.com/blueprint-studio/intro-call'}
              className="bg-black text-white px-8 py-4 rounded-full text-lg hover:bg-gray-800 transition-colors inline-flex items-center group"
            >
              Get Started
              <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
            </button>
            <button
              onClick={() => {
                document.getElementById('pricing')?.scrollIntoView({ 
                  behavior: 'smooth',
                  block: 'start'
                });
              }}
              className="bg-white text-black border-2 border-black px-8 py-4 rounded-full text-lg hover:bg-black hover:text-white transition-colors"
            >
              View Pricing
            </button>
          </div>
        </div>
      </section>

      {/* We'll continue with additional sections... */}
    </main>
  )
}