// app/(coming-soon)/[slug]/page.tsx
"use client";
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Footer } from '@/components/Footer';

export default function ComingSoonPage({
  params
}: {
  params: { slug: string }
}) {
  const title = params.slug
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');

  return (
    <main className="min-h-screen bg-background text-foreground services-theme relative">
      {/* Background patterns */}
      <div className="fixed inset-0 bg-dot-pattern opacity-5 pointer-events-none" />
      
      {/* Content */}
      <div className="relative">
        <section className="min-h-[80vh] flex items-center">
          <div className="container px-4">
            <div className="max-w-3xl mx-auto text-center">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="space-y-8"
              >
                {/* Coming Soon Tag */}
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/5 border border-primary/10">
                  <span className="w-2 h-2 animate-pulse rounded-full bg-primary" />
                  <span className="text-sm font-medium">Coming Soon</span>
                </div>

                {/* Title */}
                <h1 className="text-4xl md:text-6xl font-bold leading-tight">
                  Blueprint {title}
                </h1>

                <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                  We&apos;re working on something exciting. Check back soon.
                </p>

                {/* Progress Indicator */}
                <div className="pt-12">
                  <div className="flex justify-between text-sm text-muted-foreground mb-2">
                    <span>Progress</span>
                    <span>65%</span>
                  </div>
                  <div className="h-2 bg-primary/10 rounded-full overflow-hidden">
                    <motion.div
                      className="h-full bg-primary"
                      initial={{ width: 0 }}
                      animate={{ width: '65%' }}
                      transition={{ duration: 1, delay: 0.5 }}
                    />
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>
        <Footer />
      </div>
    </main>
  );
}