// service-pages/components/sections/Footer.tsx
import { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowRight, Github, Linkedin, Twitter, ArrowUpRight, Mail, ChevronDown, X, Loader2, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { validateEmail } from '@/lib/validation';
import Cookies from 'js-cookie';

const COOKIE_NAME = 'blueprint_email_access';

const companyLinks = [
  { name: 'About', href: 'https://read.cv/teams/blueprint' },
  // { name: 'Careers', href: '/careers' },
  // { name: 'Partners', href: '/partners' },
  // { name: 'Press Kit', href: '/press' },
  { name: 'Contact', href: 'mailto:blueprint.dao@gmail.com' }
];

const resourceLinks = [
  { name: 'Tools', href: '/tools' },
  { name: 'Ideas', href: '/blog' },
  { name: 'Services', href: '/service-index' },
];

const socialLinks = [
  { icon: Github, href: 'https://github.com/Blueprint-Studio-AI', label: 'GitHub' },
  { icon: Twitter, href: 'https://x.com/blueprint_dao', label: 'X' },
  { icon: Linkedin, href: 'https://www.linkedin.com/company/blueprint-studio-ai', label: 'LinkedIn' }
];

export function Footer() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [showSubscribe, setShowSubscribe] = useState(true);
  const [isSuccess, setIsSuccess] = useState(false);

  // Check for existing subscription on mount
  useEffect(() => {
    const emailAccessToken = Cookies.get(COOKIE_NAME);
    if (emailAccessToken) {
      setShowSubscribe(false);
    }
  }, []);

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validate email
    const { isValid, message } = validateEmail(email);
    if (!isValid) {
      setError(message || 'Invalid email');
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch('/api/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Subscription failed');
      }

      // Show success state
      setIsSuccess(true);

      // Animate out after delay
      setTimeout(() => {
        setShowSubscribe(false);
      }, 2000);

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to subscribe');
    } finally {
      setIsLoading(false);
    }
  };


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
                <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                  Build with us
                  <Button 
                    className="group text-base bg-white text-black hover:bg-white/90 w-fit"
                    onClick={() => window.location.href = 'https://cal.com/blueprint-studio/intro-call'}
                  >
                    Start
                    <ArrowRight className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-1" />
                  </Button>
                </div>
              </h2>
              <AnimatePresence>
                {showSubscribe && (
                  <motion.p 
                    initial={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="text-lg text-white/60 mb-8 max-w-md"
                  >
                    Join our newsletter for expert insights on web development, design, and digital innovation.
                  </motion.p>
                )}
              </AnimatePresence>
            </motion.div>

            {/* Newsletter Subscribe Section */}
            <AnimatePresence>
              {showSubscribe && (
                <motion.form
                  onSubmit={handleSubscribe}
                  initial={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="flex gap-4"
                >
                  <div className="relative flex-1">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40 z-10 pointer-events-none" />
                    <input
                      type="email"
                      placeholder="Enter your email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      disabled={isLoading || isSuccess}
                      className={`w-full h-12 bg-white/5 border ${
                        error ? 'border-red-500' : 'border-white/10'
                      } rounded-lg pl-12 pr-4 
                      text-white placeholder:text-white/40 
                      transition-colors duration-200
                      outline-none focus:outline-none
                      disabled:opacity-50`}
                    />
                    {error && (
                      <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="absolute -bottom-6 left-0 text-red-500 text-sm"
                      >
                        {error}
                      </motion.p>
                    )}
                  </div>
                  <Button 
                    type="submit"
                    disabled={isLoading || isSuccess}
                    className={`shrink-0 h-12 px-6 transition-all duration-200 ${
                      isSuccess 
                        ? 'bg-green-500 hover:bg-green-500'
                        : 'bg-white/10 hover:bg-white/20'
                    }`}
                  >
                    {isSuccess ? (
                      <motion.span
                        initial={{ scale: 0.5 }}
                        animate={{ scale: 1 }}
                        className="flex items-center gap-2"
                      >
                        <Check className="w-5 h-5" />
                        Subscribed!
                      </motion.span>
                    ) : isLoading ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      'Subscribe'
                    )}
                  </Button>
                </motion.form>
              )}
            </AnimatePresence>

            {/* Social Links */}
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
          <div className="grid md:grid-cols-3 gap-12 md:gap-16 lg:gap-24 md:pl-12">
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
                <Link href="/services-index" className="block text-white/60 hover:text-white transition-colors">
                  Design
                </Link>
                <Link href="/services-index" className="block text-white/60 hover:text-white transition-colors">
                  Development
                </Link>
                <Link href="/services-index" className="block text-white/60 hover:text-white transition-colors">
                  Marketing
                </Link>
                <Link href="/services-index" className="block text-white/60 hover:text-white transition-colors">
                  Strategy
                </Link>
              </div>
            </motion.div>

            {/* Company Links */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              viewport={{ once: true }}
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
            {resourceLinks.length > 0 && (
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
            )}
          </div>
        </div>

        {/* Bottom Bar */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="pt-8 mt-16 border-t border-white/10"
        >
          <div className="flex flex-col md:flex-row justify-between gap-8">
            <div className="flex flex-col md:flex-row items-start md:items-center gap-4 md:gap-8">
              <div className="flex flex-col md:flex-row gap-4 md:gap-8 whitespace-nowrap">
                <Link href="/privacy-policy" className="text-white/60 hover:text-white text-sm transition-colors">
                  Privacy Policy
                </Link>
                <Link href="/terms" className="text-white/60 hover:text-white text-sm transition-colors">
                  Terms of Service
                </Link>
                <span className="text-white/40 text-sm">
                  © 2025 Blueprint Studio
                </span>
              </div>
            </div>
            <div className="flex items-center gap-2 text-white/40 text-sm mt-4 md:mt-0 whitespace-nowrap">
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
              <span> by Blueprint</span>
            </div>
          </div>
        </motion.div>

      </div>
    </footer>
  );
}