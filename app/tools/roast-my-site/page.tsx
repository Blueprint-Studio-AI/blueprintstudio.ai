"use client";
import { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Loader2, Flame } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import ReactMarkdown from 'react-markdown';

export default function RoastMySite() {
  const [url, setUrl] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState('');
  const [analysis, setAnalysis] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url) return;
  
    setError('');
    setAnalysis(null);
    setIsAnalyzing(true);
  
    try {
      const response = await fetch('/api/analyze-site', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url }),
      });
  
      if (!response.ok) {
        throw new Error('Analysis failed');
      }
  
      const data = await response.json();
      setAnalysis(data.analysis);
    } catch (err) {
      setError('Failed to analyze site. Please try again.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <main className="min-h-screen bg-background text-foreground services-theme relative">
      {/* Background patterns */}
      <div className="fixed inset-0 bg-dot-pattern opacity-5 pointer-events-none" />
      
      {/* Content */}
      <div className="relative">
        <div className="max-w-4xl mx-auto overflow-visible">
          <section className="relative min-h-[90vh] flex items-center">
            <div className="container px-4 py-32 relative">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="space-y-8"
              >
                {/* Fun tag line */}
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/5 border border-primary/10">
                  <Flame className="w-4 h-4 text-orange-500" />
                  <span className="text-sm font-medium">Free Website Roast</span>
                </div>

                {/* Hero Section */}
                <div>
                  <h1 className="text-4xl md:text-6xl font-bold leading-tight mb-4">
                    Let Us Roast 
                    <span className="text-gradient block">Your Website</span>
                  </h1>
                  <p className="text-xl text-muted-foreground max-w-2xl">
                    Get a brutally honest analysis of your website's performance, SEO, 
                    accessibility, and security. No sugar coating, just actionable insights.
                  </p>
                </div>

                {/* URL Input Form */}
                <div className="max-w-2xl">
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="flex gap-4">
                      <Input
                        type="url"
                        placeholder="Paste your website URL..."
                        value={url}
                        onChange={(e) => setUrl(e.target.value)}
                        required
                        className="flex-1 h-14 text-lg"
                      />
                      <Button 
                        type="submit" 
                        disabled={isAnalyzing}
                        size="lg"
                        className="h-14 px-8 text-base font-medium"
                      >
                        {isAnalyzing ? (
                          <>
                            <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                            Roasting...
                          </>
                        ) : (
                          <>
                            Roast It
                            <ArrowRight className="w-5 h-5 ml-2" />
                          </>
                        )}
                      </Button>
                    </div>
                    {error && (
                      <p className="text-red-500 text-sm mt-2">{error}</p>
                    )}
                  </form>

                  {/* Fun loading message */}
                  {isAnalyzing && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mt-8"
                    >
                      <div className="p-6 rounded-xl border bg-primary/5 text-center">
                        <div className="flex items-center justify-center gap-2 mb-3">
                          <Flame className="w-5 h-5 text-orange-500 animate-pulse" />
                          <span className="font-medium">Preparing the roast...</span>
                        </div>
                        <p className="text-muted-foreground">
                          Our AI critics are sharpening their wit. This'll be good. 🔥
                        </p>
                      </div>
                    </motion.div>
                  )}

                  {/* Trust indicators */}
                  {!analysis && (
                    <div className="mt-8 flex items-center gap-6 text-sm text-muted-foreground">
                      <div className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
                        100% Free
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
                        No Sign-up Required
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
                        Instant Results
                      </div>
                    </div>
                  )}

                  {/* Analysis Results */}
                  {analysis && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mt-12 prose prose-gray dark:prose-invert max-w-none"
                    >
                      <div className="p-8 rounded-xl border bg-primary/5">
                        <ReactMarkdown
                          components={{
                            h1: ({ children }) => (
                              <h1 className="text-2xl font-bold mb-4">{children}</h1>
                            ),
                            h2: ({ children }) => (
                              <h2 className="text-xl font-semibold mt-6 mb-3">{children}</h2>
                            ),
                            p: ({ children }) => (
                              <p className="mb-4 text-muted-foreground">{children}</p>
                            ),
                            ul: ({ children }) => (
                              <ul className="space-y-2 mb-4">{children}</ul>
                            ),
                            li: ({ children }) => (
                              <li className="flex items-start gap-2">
                                <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2" />
                                <span>{children}</span>
                              </li>
                            ),
                          }}
                        >
                          {analysis}
                        </ReactMarkdown>
                      </div>

                      {/* CTA after analysis */}
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.5 }}
                        className="mt-8 text-center"
                      >
                        <p className="text-muted-foreground mb-4">
                          Want help implementing these improvements?
                        </p>
                        <Button
                          onClick={() => window.open('https://cal.com/blueprint-studio/intro-call', '_blank')}
                          size="lg"
                        >
                          Schedule a Free Consultation
                          <ArrowRight className="w-5 h-5 ml-2" />
                        </Button>
                      </motion.div>
                    </motion.div>
                  )}
                </div>
              </motion.div>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}