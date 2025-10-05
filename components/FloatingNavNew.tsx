"use client";
import { useState, useEffect } from 'react';
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

    // If we're not on new-home, navigate there first
    if (pathname !== '/new-home') {
      window.location.href = `/new-home${href}`;
      return;
    }

    // Smooth scroll to section
    const targetId = href.replace('#', '');
    const element = document.getElementById(targetId);
    if (element) {
      const yOffset = -80; // Offset for better positioning
      const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  return (
    <a
      href={href}
      onClick={handleClick}
      className={`
        flex items-center justify-center
        ${isLogo
          ? 'w-[34px] h-[32px] rounded-lg'
          : 'px-3 py-1.5 rounded-lg'
        }
        text-sm font-medium
        transition-all duration-200
        ${isActive
          ? 'bg-black/10 text-[rgba(29,29,31,1)]'
          : 'text-[rgba(29,29,31,0.66)] hover:text-[rgba(29,29,31,0.88)] hover:bg-black/5'
        }
      `}
    >
      {children}
    </a>
  );
};

export const FloatingNavNew = () => {
  const [activeSection, setActiveSection] = useState('hero');
  const pathname = usePathname();

  const sections = [
    { id: 'hero', label: 'Home', icon: true },
    { id: 'about', label: 'About' },
    { id: 'work', label: 'Work' },
    { id: 'pricing', label: 'Pricing' },
    { id: 'testimonials', label: 'Testimonials' },
    { id: 'faq', label: 'FAQ' },
    { id: 'contact', label: 'Book Call' },
  ];

  // Removed scroll hide/show functionality - nav always visible

  useEffect(() => {
    // Only track sections on new-home page
    if (pathname !== '/new-home') {
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
      className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50"
    >
      <div className={`
        flex items-center
        px-2 py-1.5
        rounded-full
        border border-white/20
        bg-[rgba(244,244,247,0.80)]
        shadow-lg
        backdrop-blur-xl
      `}>
        {sections.map((section) => (
          <NavLink
            key={section.id}
            href={`#${section.id}`}
            isActive={pathname === '/new-home' && activeSection === section.id}
            isLogo={section.icon}
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
          </NavLink>
        ))}
      </div>
    </nav>
  );
};