"use client";
import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useSmoothScroll } from './SmoothScroll';
import { motion } from 'framer-motion';

const NavLink = ({
  href,
  children,
  isActive = false,
  isLogo = false,
  onClick
}: {
  href: string;
  children: React.ReactNode;
  isActive?: boolean;
  isLogo?: boolean;
  onClick?: () => void;
}) => {
  const pathname = usePathname();

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    onClick?.();

    // If we're not on home, navigate there first
    if (pathname !== '/') {
      window.location.href = `/${href}`;
      return;
    }

    // Smooth scroll to section
    const targetId = href.replace('#', '');
    const element = document.getElementById(targetId);
    if (element) {
      const yOffset = -80; // Consistent offset for all sections
      const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  return (
    <a
      href={href}
      onClick={handleClick}
      className={`
        flex items-center justify-center flex-shrink-0
        ${isLogo
          ? 'w-[34px] h-[32px] rounded-lg'
          : 'px-3 py-1.5 rounded-lg whitespace-nowrap'
        }
        text-sm font-medium
        transition-all duration-200 ease
        ${isActive
          ? 'bg-black/10 text-[rgba(29,29,31,1)]'
          : 'text-[rgba(29,29,31,0.66)] hover:text-[rgba(29,29,31,0.88)] hover:bg-black/5'
        }
      `}
      style={{
        transition: 'all 200ms cubic-bezier(.25, .46, .45, .94)' // ease-out-quad
      }}
    >
      {children}
    </a>
  );
};

export const FloatingNavNew = () => {
  const [activeSection, setActiveSection] = useState('hero');
  const pathname = usePathname();
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const navItemsRef = useRef<(HTMLAnchorElement | null)[]>([]);
  const { scroll, isReady } = useSmoothScroll();

  // Helper function to scroll to element using Locomotive Scroll or fallback
  const scrollToElement = (elementId: string) => {
    const element = document.getElementById(elementId);
    if (!element) return;

    if (isReady && scroll) {
      // Use Locomotive Scroll
      scroll.scrollTo(element, {
        offset: -80,
        duration: 1.2,
      });
    } else {
      // Fallback to native smooth scroll
      const yOffset = -80;
      const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  // Sections shown in nav
  const navSections = [
    { id: 'hero', label: 'Home', icon: true },
    { id: 'about', label: 'About' },
    { id: 'work', label: 'Work' },
    { id: 'pricing', label: 'Pricing' },
    { id: 'testimonials', label: 'Testimonials' },
    { id: 'faq', label: 'FAQ' },
  ];

  // All sections to observe (including contact for proper highlighting)
  const allSections = [...navSections, { id: 'contact', label: 'Contact' }];

  // Auto-scroll to center active item on mobile
  useEffect(() => {
    if (window.innerWidth < 768 && scrollContainerRef.current) {
      const activeIndex = navSections.findIndex(s => s.id === activeSection);
      const activeElement = navItemsRef.current[activeIndex];

      if (activeElement && scrollContainerRef.current) {
        const container = scrollContainerRef.current;
        const elementLeft = activeElement.offsetLeft;
        const elementWidth = activeElement.offsetWidth;
        const containerWidth = container.offsetWidth;
        const scrollLeft = elementLeft - (containerWidth / 2) + (elementWidth / 2);

        container.scrollTo({
          left: scrollLeft,
          behavior: 'smooth'
        });
      }
    }
  }, [activeSection, navSections]);

  useEffect(() => {
    // Only track sections on home page
    if (pathname !== '/') {
      return;
    }

    // Check scroll position to force hero at top
    const checkScrollPosition = () => {
      if (window.scrollY < 200) {
        setActiveSection('hero');
        return true;
      }
      return false;
    };

    // Use Intersection Observer for accurate section detection
    const observerOptions = {
      rootMargin: '-30% 0px -60% 0px', // This creates a detection zone in the upper-middle portion of viewport
      threshold: 0
    };

    const observer = new IntersectionObserver((entries) => {
      // First check if we're at the top
      if (checkScrollPosition()) {
        return;
      }

      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          // Find which section this is
          const sectionId = entry.target.id;
          if (sectionId) {
            setActiveSection(sectionId);
          }
        }
      });
    }, observerOptions);

    // Observe all sections including contact
    allSections.forEach((section) => {
      const element = document.getElementById(section.id);
      if (element) {
        observer.observe(element);
      }
    });

    // Also listen to scroll to check if we're at the top
    const handleScroll = () => {
      checkScrollPosition();
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    // Initial check
    checkScrollPosition();

    return () => {
      allSections.forEach((section) => {
        const element = document.getElementById(section.id);
        if (element) {
          observer.unobserve(element);
        }
      });
      window.removeEventListener('scroll', handleScroll);
    };
  }, [pathname, allSections]);

  return (
    <nav
      className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 w-[calc(100%-32px)] max-w-[650px] md:w-auto"
    >
      <div className={`
        relative
        rounded-full
        border border-white/20
        bg-[rgba(244,244,247,0.80)]
        shadow-lg
        backdrop-blur-xl
      `}>
        <div className="flex items-center px-1.5 py-1.5">
          {/* Scrollable container for mobile - nav items */}
          <div
            ref={scrollContainerRef}
            className={`
              flex items-center
              flex-1
              overflow-x-auto
              scrollbar-hide
              md:overflow-x-visible
              scroll-smooth
            `}
            style={{
              scrollbarWidth: 'none',
              msOverflowStyle: 'none',
              WebkitOverflowScrolling: 'touch'
            }}>
            <style jsx>{`
              .scrollbar-hide::-webkit-scrollbar {
                display: none;
              }
            `}</style>
            <div className="flex items-center flex-nowrap gap-1">
              {navSections.map((section, index) => (
                <a
                  key={section.id}
                  ref={el => { navItemsRef.current[index] = el; }}
                  href={`#${section.id}`}
                  onClick={(e) => {
                    e.preventDefault();
                    // If we're not on home, navigate there first
                    if (pathname !== '/') {
                      window.location.href = `/#${section.id}`;
                      return;
                    }
                    // Smooth scroll to section using Locomotive Scroll
                    scrollToElement(section.id);
                  }}
                  className={`
                    flex items-center justify-center flex-shrink-0
                    ${section.icon
                      ? 'w-[34px] h-[32px] rounded-2xl'
                      : 'px-3 py-1.5 rounded-2xl whitespace-nowrap'
                    }
                    text-sm font-medium
                    ${pathname === '/' && activeSection === section.id
                      ? 'bg-black/10 text-[rgba(29,29,31,1)]'
                      : 'text-[rgba(29,29,31,0.66)] hover:text-[rgba(29,29,31,0.88)] hover:bg-black/5'
                    }
                  `}
                  style={{
                    transition: 'all 200ms cubic-bezier(.25, .46, .45, .94)'
                  }}
                >
                  {section.icon ? (
                    <Image
                      src="/blueprint-logo.svg"
                      alt="Logo"
                      width={22}
                      height={22}
                      className="w-[22px] h-[22px]"
                      style={{
                        imageRendering: '-webkit-optimize-contrast',
                        shapeRendering: 'crispEdges'
                      }}
                    />
                  ) : (
                    section.label
                  )}
                </a>
              ))}
            </div>
          </div>

          {/* Divider - mobile only */}
          <div className="w-px h-5 bg-neutral-300/60 mx-1 flex-shrink-0 md:hidden" />

          {/* Book Call CTA - Always visible on right */}
          <motion.a
            href="#contact"
            onClick={(e) => {
              e.preventDefault();
              if (pathname !== '/') {
                window.location.href = '/#contact';
                return;
              }
              scrollToElement('contact');
            }}
            className="
              relative flex-shrink-0
              ml-2
              px-4 py-1.5
              rounded-full
              text-sm font-medium
              text-white
              overflow-hidden
              whitespace-nowrap
              group
            "
            style={{
              background: 'linear-gradient(135deg, #60AEEE 0%, #3B82F6 25%, #2563EB 50%, #1D4ED8 75%, #4F46E5 100%)',
              boxShadow: `
                0 1px 2px rgba(0, 0, 0, 0.1),
                0 2px 8px rgba(96, 174, 238, 0.3),
                0 0 0 1px rgba(255, 255, 255, 0.1) inset,
                0 1px 0 rgba(255, 255, 255, 0.2) inset
              `,
            }}
            whileTap={{ scale: 0.97 }}
            transition={{
              type: "spring",
              stiffness: 500,
              damping: 30
            }}
          >
            {/* Shader-like animated gradient covering full button */}
            <motion.div
              className="absolute inset-0"
              style={{
                background: `
                  radial-gradient(ellipse 50% 80% at 30% 50%, rgba(147, 197, 253, 0.4) 0%, transparent 50%),
                  radial-gradient(ellipse 40% 70% at 70% 50%, rgba(96, 174, 238, 0.35) 0%, transparent 50%)
                `,
                filter: 'blur(1px)',
              }}
              animate={{
                backgroundPosition: [
                  '0% 0%, 100% 0%',
                  '100% 0%, 0% 0%',
                  '0% 0%, 100% 0%',
                ],
              }}
              transition={{
                duration: 10,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />

            {/* Drifting highlight */}
            <motion.div
              className="absolute inset-0"
              style={{
                background: 'radial-gradient(ellipse 80% 100% at center, rgba(147, 197, 253, 0.3) 0%, transparent 60%)',
                filter: 'blur(3px)',
              }}
              animate={{
                x: ['-40%', '40%', '-40%'],
              }}
              transition={{
                duration: 7,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />

            {/* Top highlight edge */}
            <div
              className="absolute inset-x-0 top-0 h-[1px]"
              style={{
                background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.4) 20%, rgba(255,255,255,0.5) 50%, rgba(255,255,255,0.4) 80%, transparent 100%)',
              }}
            />

            {/* Text */}
            <span
              className="relative z-10"
              style={{
                textShadow: '0 1px 2px rgba(0, 0, 0, 0.2)',
              }}
            >
              Book Call
            </span>
          </motion.a>
        </div>

        {/* Fade indicator for mobile - only on left now */}
        <div className="md:hidden pointer-events-none absolute inset-y-0 left-0 w-8 bg-gradient-to-r from-[rgba(244,244,247,0.80)] to-transparent rounded-l-full" />
      </div>
    </nav>
  );
};