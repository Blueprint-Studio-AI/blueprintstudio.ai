// service-pages/components/sections/Footer.tsx
import { motion } from 'framer-motion';
import { ArrowRight, Github, Linkedin, Twitter, ArrowUpRight, Mail, ChevronDown, X } from 'lucide-react';
import { Button } from '@/service-pages/components/ui/button';
import { services } from '@/service-pages/data';
import Link from 'next/link';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/service-pages/components/ui/collapsible";

const companyLinks = [
  { name: 'About', href: 'https://read.cv/teams/blueprint' },
  { name: 'Careers', href: '/careers' },
  // { name: 'Partners', href: '/partners' },
  // { name: 'Press Kit', href: '/press' },
  { name: 'Contact', href: '/contact' }
];

const resourceLinks = [
  { name: 'Tools', href: '/resources/tools' },
  { name: 'Ideas', href: '/resources/ideas' },
  { name: 'Testimonials', href: '/testimonials' },
];

const socialLinks = [
  { icon: Github, href: 'https://github.com/Blueprint-Studio-AI', label: 'GitHub' },
  { icon: Twitter, href: 'https://x.com/blueprint_dao', label: 'X' },
  { icon: Linkedin, href: 'https://www.linkedin.com/company/blueprint-studio-ai', label: 'LinkedIn' }
];

export function Footer() {
  return (
    <footer className="relative bg-black text-white overflow-hidden text-foreground services-theme">
      <div className="absolute inset-0 bg-dot-pattern opacity-5" />
      <div className="absolute inset-0 bg-gradient-to-b from-black/50 to-black" />
      
      <div className="container relative pt-32 pb-12">
        {/* Main Footer Content */}
        <div className="grid lg:grid-cols-2 gap-16 mb-24">
          {/* Left Column */}
          <div className="space-y-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Build with us
            <Button 
              className="group ml-4 align-middle text-base bg-white text-black hover:bg-white/90"
              onClick={() => window.location.href = 'https://cal.com/blueprint-studio/intro-call'}
            >
              Start
              <ArrowRight className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-1" />
            </Button>
          </h2>
          <p className="text-lg text-white/60 mb-8 max-w-md">
            Join our newsletter for expert insights on web development, design, and digital innovation.
          </p>
          </motion.div>

          {/* Newsletter Subscribe Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex gap-4"
          >
            <div className="relative flex-1">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40 z-10 pointer-events-none" />
              <input
                type="email"
                placeholder="Enter your email"
                className="w-full h-12 bg-white/5 border border-white/10 rounded-lg pl-12 pr-4 
                text-white placeholder:text-white/40 
                transition-colors duration-200
                outline-none
                focus:outline-none"
              />
            </div>
            <Button 
              size="lg" 
              className="shrink-0 group h-12 bg-white/10 hover:bg-white/20"
            >
              Subscribe
            </Button>
          </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="flex gap-6"
            >
              {socialLinks.map(({ icon: Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-full bg-white/5 hover:bg-white/10 transition-colors group"
                >
                  <Icon className="w-5 h-5 text-white/60 group-hover:text-white transition-colors" />
                </a>
              ))}
            </motion.div>
          </div>

          {/* Right Column - Links Grid */}
          <div className="grid md:grid-cols-3 gap-12 md:gap-16 lg:gap-24">
            {/* Services Column */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h4 className="text-lg font-semibold mb-6 text-white/80">
                Services
              </h4>
              <div className="space-y-4">
                {services.coreServices.map((coreService) => (
                  <Collapsible key={coreService.slug}>
                    <CollapsibleTrigger className="flex items-center justify-between w-full text-left text-white/60 hover:text-white transition-colors group">
                      <span>{coreService.name}</span>
                      <ChevronDown className="w-4 h-4 transition-transform group-data-[state=open]:rotate-180" />
                    </CollapsibleTrigger>
                    <CollapsibleContent className="pl-4 pt-2 space-y-2">
                      {coreService.serviceLines.map(serviceLine => (
                        <Link
                          key={serviceLine.slug}
                          href={`/services/${coreService.slug}/${serviceLine.slug}`}
                          className="block text-sm text-white/60 hover:text-white py-1 transition-colors"
                        >
                          {serviceLine.name}
                        </Link>
                      ))}
                    </CollapsibleContent>
                  </Collapsible>
                ))}
              </div>
            </motion.div>

            {/* Company Links */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              viewport={{ once: true }}
              className="pl-4 md:pl-8"
            >
              <h4 className="text-lg font-semibold mb-6 text-white/80">
                Company
              </h4>
              <ul className="space-y-4">
                {companyLinks.map(({ name, href }) => (
                  <li key={name}>
                    <Link
                      href={href}
                      className="text-white/60 hover:text-white transition-colors inline-flex items-center group"
                    >
                      {name}
                      <ArrowUpRight className="w-4 h-4 ml-1 opacity-0 -translate-y-1 translate-x-1 group-hover:opacity-100 group-hover:translate-y-0 group-hover:translate-x-0 transition-all" />
                    </Link>
                  </li>
                ))}
              </ul>
            </motion.div>

            {/* Resources Links */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              viewport={{ once: true }}
            >
              <h4 className="text-lg font-semibold mb-6 text-white/80">
                Resources
              </h4>
              <ul className="space-y-4">
                {resourceLinks.map(({ name, href }) => (
                  <li key={name}>
                    <Link
                      href={href}
                      className="text-white/60 hover:text-white transition-colors inline-flex items-center group"
                    >
                      {name}
                      <ArrowUpRight className="w-4 h-4 ml-1 opacity-0 -translate-y-1 translate-x-1 group-hover:opacity-100 group-hover:translate-y-0 group-hover:translate-x-0 transition-all" />
                    </Link>
                  </li>
                ))}
              </ul>
            </motion.div>
          </div>
        </div>

        {/* Bottom Bar */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="pt-8 mt-16 border-t border-white/10"
        >
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-8">
              <span className="text-white/40 text-sm">
                © 2024 blueprint. All rights reserved.
              </span>
              <Link href="/legal/privacy" className="text-white/60 hover:text-white text-sm transition-colors">
                Privacy Policy
              </Link>
              <Link href="/legal/terms" className="text-white/60 hover:text-white text-sm transition-colors">
                Terms of Service
              </Link>
            </div>
            <div className="flex items-center gap-2 text-white/40 text-sm">
              <span>made with</span>
              <motion.div
                animate={{
                  scale: [1, 1.2, 1],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                }}
                className="text-red-500"
              >
                ❤️
              </motion.div>
              <span> by blueprint</span>
            </div>
          </div>
        </motion.div>
      </div>
    </footer>
  );
}