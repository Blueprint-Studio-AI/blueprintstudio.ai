"use client";
import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { usePathname } from 'next/navigation';

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

  const sections = [
    { id: 'hero', label: 'Home', icon: true },
    { id: 'about', label: 'About' },
    { id: 'work', label: 'Work' },
    { id: 'pricing', label: 'Pricing' },
    { id: 'testimonials', label: 'Testimonials' },
    { id: 'faq', label: 'FAQ' },
    { id: 'contact', label: 'Book Call' },
  ];

  // Auto-scroll to center active item on mobile
  useEffect(() => {
    if (window.innerWidth < 768 && scrollContainerRef.current) {
      const activeIndex = sections.findIndex(s => s.id === activeSection);
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
  }, [activeSection, sections]);

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

    // Observe all sections
    sections.forEach((section) => {
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
      sections.forEach((section) => {
        const element = document.getElementById(section.id);
        if (element) {
          observer.unobserve(element);
        }
      });
      window.removeEventListener('scroll', handleScroll);
    };
  }, [pathname, sections]);

  return (
    <nav
      className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 w-[calc(100%-32px)] max-w-[600px] md:w-auto"
    >
      <div className={`
        relative
        rounded-full
        border border-white/20
        bg-[rgba(244,244,247,0.80)]
        shadow-lg
        backdrop-blur-xl
      `}>
        {/* Scrollable container for mobile */}
        <div
          ref={scrollContainerRef}
          className={`
            flex items-center
            px-1.5 py-1.5
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
            {sections.map((section, index) => (
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
                  // Smooth scroll to section
                  const element = document.getElementById(section.id);
                  if (element) {
                    const yOffset = -80; // Consistent offset for all sections
                    const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
                    window.scrollTo({ top: y, behavior: 'smooth' });
                  }
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
                  />
                ) : (
                  section.label
                )}
              </a>
            ))}
          </div>
        </div>

        {/* Fade indicators for mobile */}
        <div className="md:hidden pointer-events-none absolute inset-y-0 left-0 w-8 bg-gradient-to-r from-[rgba(244,244,247,0.80)] to-transparent rounded-l-full" />
        <div className="md:hidden pointer-events-none absolute inset-y-0 right-0 w-8 bg-gradient-to-l from-[rgba(244,244,247,0.80)] to-transparent rounded-r-full" />
      </div>
    </nav>
  );
};