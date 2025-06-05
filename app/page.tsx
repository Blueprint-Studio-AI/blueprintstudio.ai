// app/page.tsx
"use client";
import { LazyMotion, motion, domAnimation, useScroll, useSpring, useTransform, useReducedMotion } from "framer-motion";
import Image from 'next/image';
import { Footer } from "@/components/Footer";
import { PhoneCall, Calculator, CheckCircle, ChevronDown, ChevronUp, ArrowUpRight } from "lucide-react";
import { AutoplayVideo } from "@/components/AutoplayVideo";
import { PricingSection } from "@/components/PricingSection";
import { Services } from "@/components/services-index/Services";
import { useEffect, useState, useRef } from "react";

//  perhaps use vh % to space hero elements instead of fixed px 

const workItems = [
  {
    type: 'video',
    src: '/videos/work/idscanner-spotlight-compressed.mp4',
    alt: 'Ecommerce Platform for ID Verification Company',
    description: 'Ecommerce Platform for ID Verification Company'
  },
  {
    type: 'video',
    src: '/videos/work/btc-all-in-compressed.mp4',
    alt: 'Branding & Immersive Media for Bitcoin Conference',
    description: 'Branding & Immersive Media for Bitcoin Conference'
  },
  {
    type: 'video',  
    src: '/videos/work/next-gen-conference-compressed.mp4',
    alt: 'International Design Conference Website',
    description: 'International Design Conference Website'
  },
  // {
  //   type: 'video',
  //   src: '/videos/work/mvt-energy-committee-compressed.mp4',
  //   link: 'https://manchestervtenergycommittee.org',
  //   alt: 'Website for Energy Committee',
  //   description: 'Website for Energy Committee'
  // },
  {
    type: 'image',
    src: '/images/work/ProjectMetaVison-Desktop1.png',
    alt: 'Branding & Service Design for Crypto Startup',
    description: 'Branding & Service Design for Crypto Startup'
  },
  {
    type: 'image',
    src: '/images/work/LivingPersona-Desktop1.png',
    alt: 'Living Persona AI Persona Web App',
    description: 'AI Persona Web App'
  },
  {
    type: 'video',
    src: '/videos/work/workshopai-compressed.mp4',
    alt: 'Workshop AI for Design Consultancy',
    description: 'Workshop AI for Design Consultancy'
  },
];

export default function Home() {
  const prefersReducedMotion = useReducedMotion();
  const [isHydrated, setIsHydrated] = useState(false);
  const heroRef = useRef(null);
  
  useEffect(() => {
    setIsHydrated(true);
  }, []);

  // Scroll-based parallax effect
  const { scrollY } = useScroll();
  const designY = useTransform(scrollY, [0, 300], [0, 30]);
  const buildY = useTransform(scrollY, [0, 300], [0, 15]);
  const ampersandY = useTransform(scrollY, [0, 300], [0, 20]);
  
  // Smooth spring for scroll-based animation
  const smoothDesignY = useSpring(designY, { stiffness: 100, damping: 30 });
  const smoothBuildY = useSpring(buildY, { stiffness: 100, damping: 30 });
  const smoothAmpersandY = useSpring(ampersandY, { stiffness: 80, damping: 30 });

  // Initial smooth reveal animation
  const initialReveal = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { 
        duration: 0.8,
        ease: [0.23, 0.06, 0.25, 1],
        staggerChildren: prefersReducedMotion ? 0 : 0.065,
        delayChildren: 0.1
      }
    }
  };
  
  // Smooth fade for logo - gentle and subtle
  const logoReveal = {
    hidden: { opacity: 0, scale: 0.995 },
    visible: { 
      opacity: 1, 
      scale: 1,
      transition: {
        duration: 0.9,
        ease: [0.25, 0.1, 0.25, 1]
      }
    }
  };

  // Refined animations for headline elements
  const textReveal = {
    hidden: { 
      opacity: 0,
      y: prefersReducedMotion ? 0 : 40
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 1.2,
        ease: [0.16, 1, 0.3, 1] // Custom ease with slight overshoot
      }
    }
  };

  // Special animation for the ampersand
  const ampersandReveal = {
    hidden: { 
      opacity: 0,
      y: prefersReducedMotion ? 0 : 45,
      rotate: prefersReducedMotion ? 0 : -2,
      scale: 0.97
    },
    visible: { 
      opacity: 1,
      y: 0,
      rotate: 0,
      scale: 1,
      transition: {
        duration: 1.3,
        ease: [0.16, 1, 0.3, 1],
        delay: prefersReducedMotion ? 0.1 : 0.13
      }
    }
  };

  // Subtitle with slight delay
  const subtitleReveal = {
    hidden: { 
      opacity: 0,
      y: prefersReducedMotion ? 0 : 20
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 1.1,
        ease: [0.16, 1, 0.3, 1],
        delay: prefersReducedMotion ? 0.2 : 0.38
      }
    }
  };

  return (
    <div className="min-h-screen bg-[#fafaf9] flex flex-col">
      {/* Hero Section - Enhanced with Premium Animation */}
      <section className="flex-1 flex flex-col px-4" ref={heroRef}>
        <div className="max-w-4xl mx-auto w-full pt-4 md:pt-10">
          {/* Logo with refined subtle animation */}
          <LazyMotion features={domAnimation}>
            <motion.div
              variants={logoReveal}
              initial="hidden"
              animate={isHydrated ? "visible" : "hidden"}
              style={{
                willChange: "opacity, transform"
              }}
            >
              <span className="inline-flex items-center">
                <Image 
                  src='/blueprint-logo.svg' 
                  alt='Blueprint Logo' 
                  width='30' 
                  height='30' 
                  className="w-[26px] h-[26px] md:w-[30px] md:h-[30px]"
                  priority
                  quality={100}
                />
                <span className="ml-2.5 font-medium tracking-[-0.3px]" style={{
                  fontSize: 'clamp(20px, 4vw, 24px)'
                }}>
                  blueprint
                  <span className="text-gray-500"> studio</span>
                </span>
              </span>
            </motion.div>
          </LazyMotion>
        </div>
        
        {/* Center Content with premium animation flow */}
        <div className="flex-1 flex items-center justify-center mt-28 mb-8 md:mt-30"> 
          <LazyMotion features={domAnimation}>
            <motion.div 
              className="flex flex-col items-center max-w-full"
              variants={initialReveal}
              initial="hidden"
              animate={isHydrated ? "visible" : "hidden"}
            >
              <h1 className="text-center w-full">
                <motion.div className="overflow-visible">
                  <motion.div 
                    variants={textReveal}
                    style={{ 
                      color: '#000',
                      fontFamily: 'PP Editorial New, serif',
                      fontSize: 'clamp(80px, 12vw, 162.328px)',
                      fontWeight: 400,
                      lineHeight: '1.1',
                      willChange: "opacity, transform",
                      y: prefersReducedMotion ? 0 : smoothDesignY
                    }}
                  >
                    Design
                  </motion.div>
                </motion.div>
                <div className="flex items-center justify-center flex-wrap">
                  {/* Refined ampersand animation */}
                  <motion.div 
                    variants={ampersandReveal}
                    className="overflow-visible"
                    style={{
                      willChange: "opacity, transform",
                      transformOrigin: "center center",
                      y: prefersReducedMotion ? 0 : smoothAmpersandY
                    }}
                  >
                    <span 
                      style={{ 
                        color: '#000',
                        fontFamily: 'PP Editorial New, serif',
                        fontSize: 'clamp(80px, 12vw, 162.328px)',
                        fontStyle: 'italic',
                        fontWeight: 200,
                        lineHeight: '1.1',
                        letterSpacing: 'clamp(-15px, -2vw, -34.089px)',
                        display: 'inline-block'
                      }}
                    >
                      &
                    </span>
                  </motion.div>
                  <motion.div className="overflow-visible" style={{ marginLeft: 'clamp(15px, 2vw, 30px)' }}>
                    <motion.span 
                      variants={textReveal}
                      style={{ 
                        color: '#000',
                        fontFamily: 'PP Editorial New, serif',
                        fontSize: 'clamp(80px, 12vw, 162.328px)',
                        fontWeight: 400,
                        lineHeight: '1.1',
                        display: 'inline-block',
                        willChange: "opacity, transform",
                        y: prefersReducedMotion ? 0 : smoothBuildY
                      }}
                    >
                      Build
                    </motion.span>
                  </motion.div>
                </div>
              </h1>
              
              <motion.p 
                variants={subtitleReveal}
                className="text-xl md:text-2xl text-center font-medium mt-2 mb-2 max-w-2xl text-gray-500"
                style={{
                  willChange: "opacity, transform"
                }}
              >
                We partner with founders<br />
                to build their future
              </motion.p>
            </motion.div>
          </LazyMotion>
        </div>
      </section>

      {/* Work Grid - Original Implementation */}
      <section className="py-20 pt-16 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="grid grid-cols-1 gap-10">
        {workItems.map((item, index) => (
          <div key={index} className="flex flex-col">
            <a 
              href={item.link}
              target="_blank"
              rel="noopener noreferrer" 
              className="rounded-3xl border overflow-hidden transition-all duration-200 bg-gray-100/80 backdrop-blur-sm shadow group"
            >
              <div className="relative w-full" style={{ paddingBottom: '66.67%' }}>
                <div className="absolute inset-0">
                  {item.type === 'image' ? (
                    <Image
                      src={item.src}
                      alt={item.alt || 'Blueprint Studio Image'}
                      fill
                      className="object-cover transition-opacity duration-500"
                      placeholder="blur"
                      blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/4gHYSUNDX1BST0ZJTEUAAQEAAAHIAAAAAAQwAABtbnRyUkdCIFhZWiAH4AABAAEAAAAAAABhY3NwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQAA9tYAAQAAAADTLQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAlkZXNjAAAA8AAAACRyWFlaAAABFAAAABRnWFlaAAABKAAAABRiWFlaAAABPAAAABR3dHB0AAABUAAAABRyVFJDAAABZAAAAChnVFJDAAABZAAAAChiVFJDAAABZAAAAChjcHJ0AAABjAAAADxtbHVjAAAAAAAAAAEAAAAMZW5VUwAAAAgAAAAcAHMAUgBHAEJYWVogAAAAAAAAb6IAADj1AAADkFhZWiAAAAAAAABimQAAt4UAABjaWFlaIAAAAAAAACSgAAAPhAAAts9YWVogAAAAAAAA9tYAAQAAAADTLXBhcmEAAAAAAAQAAAACZmYAAPKnAAANWQAAE9AAAApbAAAAAAAAAABtbHVjAAAAAAAAAAEAAAAMZW5VUwAAACAAAAAcAEcAbwBvAGcAbABlACAASQBuAGMALgAgADIAMAAxADb/2wBDABQODxIPDRQSEBIXFRQdHx4dHRsdHR4dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR3/2wBDAR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR3/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAb/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k="
                    />
                  ) : (
                    <AutoplayVideo
                      src={item.src}
                      className="w-full h-full object-cover"
                    />
                  )}
                </div>
              </div>
            </a>
            {/* Description below the image/video with lighter gray text */}
            <div className="mt-3 pl-2">
              <p className="text-sm md:text-base text-gray-400 font-medium">
                {item.description}
              </p>
            </div>
          </div>
        ))}
        </div>
      </div>
    </section>

      {/* Services - Original Implementation */}
      <section className="relative services-theme">
        <div className="relative">
          <div className="max-w-4xl mx-auto overflow-visible">
            <Services 
              useSimpleTitle={true}
              customTitle="Our Services"
              customDescription="Transforming complex challenges into elegant, user-centric solutions for forward-thinking&nbsp;brands."
            />
          </div>
        </div>
      </section>

      {/* Pricing - Original Implementation */}
      <PricingSection/>

      <Footer/>
    </div>
  );
}