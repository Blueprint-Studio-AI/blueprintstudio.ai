// service-pages/components/sections/Header.tsx
import Link from 'next/link'
import { motion } from 'framer-motion'
import Image from 'next/image'

export function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border">
      <div className="container py-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <Image
              src="/blueprint-logo.svg"
              alt="Blueprint Studio"
              width={32}
              height={32}
            />
            <span className="font-semibold">Blueprint Studio</span>
          </Link>
          
          <nav className="hidden md:flex items-center gap-6">
            <Link href="/services" className="text-sm hover:text-primary transition-colors">
              Services
            </Link>
            <Link href="/about" className="text-sm hover:text-primary transition-colors">
              About
            </Link>
            <Link href="/contact" className="text-sm hover:text-primary transition-colors">
              Contact
            </Link>
          </nav>
        </div>
      </div>
    </header>
  )
}