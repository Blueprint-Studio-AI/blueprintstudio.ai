// app/tools/page.tsx
"use client";
import { motion } from 'framer-motion';
import { ArrowRight, Zap, Flame, Pen, FileCode, Users, ExternalLink, Bot, Scale } from 'lucide-react';
import Link from 'next/link';
import { Footer } from '@/components/Footer';
import { Spacer } from '@/components/ui/spacer';

type ToolStatus = 'live' | 'coming-soon' | 'external' | 'deprecated';

interface Tool {
  slug: string;
  name: string;
  description: string;
  icon: any;
  status: ToolStatus;
  gradient: string;
  externalUrl?: string;
}

const tools: Tool[] = [
  {
    slug: 'roast-my-site',
    name: 'Roast My Site',
    description: 'Get a brutally honest AI analysis of your website with actionable insights and technical recommendations.',
    icon: Flame,
    status: 'live',
    gradient: 'from-orange-500 to-red-500'
  },
  {
    slug: 'juris-genius',
    name: 'Juris Genius',
    description: 'AI-powered bar exam tutor. Pass the bar in half the time with personalized study plans and adaptive learning.',
    icon: Scale,
    status: 'external',
    gradient: 'from-amber-700 to-yellow-700', // More paper/parchment like colors
    externalUrl: 'https://juris.aibartutor.com'
  },
  {
    slug: 'ai-blog-writer',
    name: 'AI Blog Wizard',
    description: 'Transform rough ideas into polished blog posts. AI-powered writing assistant that maintains your brand voice.',
    icon: Pen,
    status: 'coming-soon',
    gradient: 'from-purple-500 to-pink-500'
  },
  {
    slug: 'aireadme',
    name: 'AIREADME',
    description: 'Export your codebase into AI-optimized prompts. Perfect for technical documentation and AI pair programming.',
    icon: FileCode,
    status: 'coming-soon',
    gradient: 'from-green-500 to-emerald-500'
  },
  {
    slug: 'living-persona',
    name: 'Living Persona',
    description: 'Create dynamic user personas that evolve with your data. [Deprecated - Succeeded by newer tools]',
    icon: Users,
    status: 'deprecated',
    gradient: 'from-gray-500 to-gray-600'
  }
];

function ToolCard({ tool }: { tool: Tool }) {
  const Icon = tool.icon;
  
  return (
    <div className={`
      relative p-6 rounded-2xl border bg-background/50 backdrop-blur-sm
      hover:border-primary/20 transition-all duration-300
      ${tool.status === 'deprecated' ? 'opacity-50' : ''}
      ${tool.status === 'coming-soon' ? 'opacity-75' : ''}
    `}>
      {/* Status Badge */}
      <div className="absolute -top-3 -right-3">
        {tool.status === 'live' && (
          <span className="inline-flex items-center bg-green-500 text-white text-xs px-2 py-1 rounded-full">
            Live
          </span>
        )}
        {tool.status === 'coming-soon' && (
          <span className="inline-flex items-center bg-blue-500 text-white text-xs px-2 py-1 rounded-full">
            Coming Soon
          </span>
        )}
        {tool.status === 'external' && (
          <span className="inline-flex items-center gap-1 bg-indigo-500 text-white text-xs px-2 py-1 rounded-full">
            <ExternalLink className="w-3 h-3" />
            External
          </span>
        )}
        {tool.status === 'deprecated' && (
          <span className="inline-flex items-center bg-gray-500 text-white text-xs px-2 py-1 rounded-full">
            Deprecated
          </span>
        )}
      </div>

      <div className="flex items-start gap-4">
        <div className={`
          p-3 rounded-xl bg-gradient-to-br ${tool.gradient}
          text-white
        `}>
          <Icon className="w-6 h-6" />
        </div>
        
        <div className="flex-1">
          <h3 className="text-xl font-semibold mb-2 group-hover:text-primary transition-colors">
            {tool.name}
          </h3>
          <p className="text-muted-foreground text-sm">
            {tool.description}
          </p>
        </div>

        {(tool.status === 'live' || tool.status === 'external') && (
          <ArrowRight className="w-5 h-5 opacity-0 group-hover:opacity-100 transition-opacity" />
        )}
      </div>
    </div>
  );
}

export default function ToolsPage() {
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
                {/* Tag line */}
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/5 border border-primary/10">
                  <Zap className="w-4 h-4 text-primary" />
                  <span className="text-sm font-medium">Free Tools</span>
                </div>

                {/* Hero Section */}
                <div>
                  <h1 className="text-4xl md:text-6xl font-bold leading-tight mb-4">
                    Powerful Tools for
                    <span className="text-gradient block">Modern Websites</span>
                  </h1>
                  <p className="text-xl text-muted-foreground max-w-2xl">
                    A collection of free tools to help you build, analyze, and optimize your web presence.
                  </p>
                </div>

                {/* Tools Grid */}
                <div className="grid md:grid-cols-2 gap-6 pt-8">
                  {tools.map((tool) => (
                    <motion.div
                      key={tool.slug}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      className="group relative"
                    >
                      {tool.status === 'live' && (
                        <Link href={`/tools/${tool.slug}`}>
                          <ToolCard tool={tool} />
                        </Link>
                      )}
                      
                      {tool.status === 'external' && tool.externalUrl && (
                        <a href={tool.externalUrl} target="_blank" rel="noopener noreferrer">
                          <ToolCard tool={tool} />
                        </a>
                      )}
                      
                      {(tool.status === 'coming-soon' || tool.status === 'deprecated') && (
                        <div className="cursor-default">
                          <ToolCard tool={tool} />
                        </div>
                      )}
                    </motion.div>
                  ))}
                </div>

                {/* Coming Soon Note */}
                <div className="text-center text-sm text-muted-foreground">
                  More tools coming soon! Have a suggestion?{' '}
                  <a 
                    href="mailto:blueprint.dao@gmail.com"
                    className="text-primary hover:underline"
                  >
                    Let us know
                  </a>
                </div>
              </motion.div>
            </div>
          </section>
        </div>
      </div>
      <Spacer size="4xl" />
      <Footer />
    </main>
  );
}
