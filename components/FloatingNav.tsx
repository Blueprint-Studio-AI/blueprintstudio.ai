"use client";
import { useState } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import Link from 'next/link';

const SubNavLink = ({ href, children }: { href: string; children: string }) => (
    <Link 
      href={href}
      className="
        w-full flex items-center justify-between
        px-3 py-1.5 rounded-nav
        text-[rgba(29,29,31,0.66)] hover:text-[rgba(29,29,31,0.88)]
        text-sm font-medium
        transition-colors
        hover:bg-black/5 hover:backdrop-blur-nav-hover
      "
    >
      {children}
      <svg 
        width="12" 
        height="12" 
        viewBox="0 0 12 12" 
        fill="none" 
      >
        <path 
          d="M4 2L8 6L4 10" 
          stroke="currentColor" 
          strokeWidth="1.5" 
          strokeLinecap="round" 
          strokeLinejoin="round"
        />
      </svg>
    </Link>
  );

const NavLink = ({ href, children, darker = false, onHover }: { 
    href: string; 
    children: React.ReactNode;
    darker?: boolean;
    onHover?: () => void;
  }) => {
    return (
      <Link 
        href={href}
        onMouseEnter={onHover}
        className={`
          flex items-center justify-center
          min-w-[48px] px-1.5 py-1 rounded-nav h-[28px]
          hover:bg-black/5 hover:backdrop-blur-nav-hover transition-all
          ${darker ? 'text-[rgba(29,29,31,0.88)]' : 'text-[rgba(29,29,31,0.66)]'}
          text-base font-medium leading-[70%]
        `}
      >
        {children}
      </Link>
    );
};
  
// ... SubNavLink and NavLink components stay the same ...

export const FloatingNav = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [isHovered, setIsHovered] = useState(false);
    const [isClosing, setIsClosing] = useState(false);
  
    const handleClose = () => {
      setIsClosing(true);
      setIsOpen(false);
      setTimeout(() => {
        setIsClosing(false);
      }, 300);
    };
  
    return (
      <nav 
        className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => {
          setIsHovered(false);
          handleClose();
        }}
      >
        <motion.div 
          initial={{
            height: 'var(--base-height)',
            borderRadius: '9999px'
          }}
          animate={{
            height: isOpen ? '166px' : 'var(--base-height)',
            borderRadius: isOpen ? '20px' : '9999px',
          }}
          transition={{
            height: { 
              duration: 0.2, 
              delay: isOpen ? 0.05 : 0
            },
            borderRadius: { 
              duration: 0,
              delay: isOpen ? 0 : 0.2
            }
          }}
          style={{
            '--base-height': '40px'
          } as any}
          className={`
            relative
            flex flex-col ${isOpen || isClosing ? 'justify-end' : 'justify-center'}
            rounded-full
            border border-white/20
            bg-[rgba(244,244,247,0.70)]
            bg-blend-nav
            shadow-nav
            backdrop-blur-nav
            overflow-hidden
          `}
        >
          {isOpen && (
            <>
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.1 }}
                className="absolute top-0 left-0 w-full p-1.5 space-y-1.5"
              >
                <SubNavLink href="/services">Services</SubNavLink>
                <SubNavLink href="/ideas">Ideas</SubNavLink>
                <SubNavLink href="/tools">Tools</SubNavLink>
              </motion.div>
              <div 
                className="absolute bottom-[40px] left-0 w-full" 
                style={{ borderBottom: '1px solid rgba(0, 0, 0, 0.05)' }} 
              />
            </>
          )}

          <div className="
            flex items-center gap-1.5
            pr-3 pl-2
            h-10
            min-w-[140px]
          ">
            <Link href="/" className="flex-shrink-0">
              <Image
                src="/blueprint-logo.svg"
                alt="Logo"
                width={22}
                height={22}
                className={`
                  w-[26px] h-[26px] 
                  transition-all
                  ${isHovered ? '' : 'filter grayscale'}
                `}
              />
            </Link>

            <div className="flex items-center gap-1.5">
              <NavLink href="/start" darker>
                Start
              </NavLink>
              <NavLink 
                href="/learn"
                onHover={() => setIsOpen(true)}
              >
                Learn
              </NavLink>
            </div>
          </div>
        </motion.div>
      </nav>
    );
};