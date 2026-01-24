"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Section from "@/components/ui/Section";
import OuterContainer from "@/components/ui/OuterContainer";
import InnerContainer from "@/components/ui/InnerContainer";
import Image from "next/image";
import SectionHeader from "../ui/SectionHeader";
import AnimatedCitySwitcher from "@/components/ui/AnimatedCitySwitcher";
import AnimatedDate from "@/components/ui/AnimatedDate";
import { useBreakpoint } from "@/lib/breakpoints";
import { motion, AnimatePresence } from "framer-motion";
import { Maximize2, X } from "lucide-react";

export default function HeroB() {
    const [isVideoLoaded, setIsVideoLoaded] = useState(false);
    const [isAnimating, setIsAnimating] = useState(false);
    const [showOverlay, setShowOverlay] = useState(true);
    const [logoEntered, setLogoEntered] = useState(false);
    const [headerLogoVisible, setHeaderLogoVisible] = useState(false);
    const [headerAnimationsReady, setHeaderAnimationsReady] = useState(false);
    const [hasVideoFrame, setHasVideoFrame] = useState(false);
    const [containerEntered, setContainerEntered] = useState(false);
    const [backgroundVisible, setBackgroundVisible] = useState(false);
    const [textAnimated, setTextAnimated] = useState(false);
    const [loaderContentFading, setLoaderContentFading] = useState(false);
    const [isMobile, setIsMobile] = useState(false);
    const [minimumTimeElapsed, setMinimumTimeElapsed] = useState(false);
    const [isClient, setIsClient] = useState(false);
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [hasScrolledAway, setHasScrolledAway] = useState(false);
    const [isFirstFullscreen, setIsFirstFullscreen] = useState(true);
    const triggerTypeRef = useRef<'scroll' | 'button'>('button');
    const videoRef = useRef<HTMLVideoElement>(null);
    const fullscreenVideoRef = useRef<HTMLVideoElement>(null);
    const videoContainerRef = useRef<HTMLDivElement>(null);
    const breakpoint = useBreakpoint();
    const isMobileBreakpoint = breakpoint === 'base' || breakpoint === 'xs';

    const closeFullscreen = useCallback((trigger: 'scroll' | 'button' = 'button') => {
        triggerTypeRef.current = trigger; // Set immediately (sync) before state change
        // Sync inline video to fullscreen video's current time
        if (fullscreenVideoRef.current && videoRef.current) {
            videoRef.current.currentTime = fullscreenVideoRef.current.currentTime;
            videoRef.current.play().catch(() => {});
        }
        setIsFullscreen(false);
        if (isFirstFullscreen) {
            setIsFirstFullscreen(false);
        }
    }, [isFirstFullscreen]);

    const openFullscreen = useCallback((trigger: 'scroll' | 'button' = 'button') => {
        triggerTypeRef.current = trigger; // Set immediately (sync) before state change
        // Pause inline video and sync fullscreen to its current time
        if (videoRef.current) {
            videoRef.current.pause();
        }
        setIsFullscreen(true);
    }, []);

    // Handle scroll - close on scroll down, open on return to top (desktop only)
    useEffect(() => {
        // Skip on mobile - no fullscreen functionality
        if (isMobileBreakpoint) return;
        // Only enable scroll handling after loader is gone
        if (showOverlay) return;

        let lastScrollY = window.scrollY;

        const handleScroll = () => {
            const scrollY = window.scrollY;

            // Close fullscreen if scrolling down past threshold
            if (isFullscreen && scrollY > 50) {
                closeFullscreen('scroll');
                setHasScrolledAway(true);
            }

            // Open fullscreen when returning to top
            if (!isFullscreen && hasScrolledAway && scrollY < 10 && lastScrollY > scrollY) {
                openFullscreen('scroll');
            }

            lastScrollY = scrollY;
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, [isMobileBreakpoint, showOverlay, isFullscreen, hasScrolledAway, closeFullscreen, openFullscreen]);

    // Close fullscreen on escape key
    useEffect(() => {
        if (!isFullscreen) return;

        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                closeFullscreen('button'); // Escape = button-style close (no parallax)
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isFullscreen, closeFullscreen]);

    // Pause inline video when fullscreen is active (only play the one that's visible)
    useEffect(() => {
        if (!videoRef.current) return;

        if (isFullscreen) {
            videoRef.current.pause();
        }
    }, [isFullscreen]);

    // Lock body scroll when fullscreen
    useEffect(() => {
        if (isFullscreen) {
            document.body.style.overflow = 'hidden';
        } else if (!showOverlay) {
            document.body.style.overflow = '';
        }
    }, [isFullscreen, showOverlay]);

    // Determine video source based on breakpoint (only after client-side hydration)
    const videoSource = !isClient ? "/media/highlight-reel/highlight-reel-horizontal-003-compressed.mp4" : // Default to horizontal during SSR
        (breakpoint === 'base' || breakpoint === 'xs')
        ? "/media/highlight-reel/highlight-reel-vertical-004-compressed.mp4"
        : "/media/highlight-reel/highlight-reel-horizontal-003-compressed.mp4";

    // Handle video source changes without recreating the element
    useEffect(() => {
        const video = videoRef.current;
        if (!video || !isClient) return;

        const wasPlaying = !video.paused;

        setHasVideoFrame(false);
        video.src = videoSource;
        video.load(); // Reload the video with new source
        
        // Restore playback state if it was playing
        if (wasPlaying) {
            video.currentTime = 0; // Start from beginning with new video
            video.play().catch(console.error);
        }
    }, [videoSource, isClient])

    // Check if mobile on mount and set client flag
    useEffect(() => {
        setIsClient(true);
        setIsMobile(window.innerWidth < 640);
        const handleResize = () => setIsMobile(window.innerWidth < 640);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    useEffect(() => {
        const video = videoRef.current;
        if (!video) return;
        video.setAttribute('fetchpriority', 'high');
    }, []);

    // Start entrance animations immediately
    useEffect(() => {
        // Container entrance with scale
        const containerTimer = setTimeout(() => {
            setContainerEntered(true);
        }, 100);

        // Logo fade in
        const logoTimer = setTimeout(() => {
            setLogoEntered(true);
        }, 300);

        // Text stagger animation - more delay after logo
        const textTimer = setTimeout(() => {
            setTextAnimated(true);
        }, 600);

        // White background appears after text animation
        const backgroundTimer = setTimeout(() => {
            setBackgroundVisible(true);
        }, 1600);

        // Set minimum display time (2.5 seconds to read the text)
        const minimumTimer = setTimeout(() => {
            setMinimumTimeElapsed(true);
        }, 2500);

        return () => {
            clearTimeout(containerTimer);
            clearTimeout(logoTimer);
            clearTimeout(textTimer);
            clearTimeout(backgroundTimer);
            clearTimeout(minimumTimer);
        };
    }, []);

    useEffect(() => {
        // Lock scroll when overlay is visible
        if (showOverlay) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }

        // Cleanup on unmount
        return () => {
            document.body.style.overflow = '';
        };
    }, [showOverlay]);

    useEffect(() => {
        if (showOverlay) {
            setHeaderLogoVisible(false);
            setHeaderAnimationsReady(false);
        }
    }, [showOverlay]);

    useEffect(() => {
        if (!isAnimating) return;

        setHeaderLogoVisible(true);

        const textTimer = setTimeout(() => {
            setHeaderAnimationsReady(true);
        }, 300);

        return () => {
            clearTimeout(textTimer);
        };
    }, [isAnimating]);

    useEffect(() => {
        const video = videoRef.current;
        if (!video) return;

        const handleVideoReady = () => {
            setHasVideoFrame(true);
            setIsVideoLoaded(true);
        };

        const handleFallback = () => {
            setIsVideoLoaded(true);
        };

        video.addEventListener('loadeddata', handleVideoReady);
        video.addEventListener('canplay', handleVideoReady);
        video.addEventListener('canplaythrough', handleVideoReady);

        if (video.readyState >= 2) {
            handleVideoReady();
        }

        const fallbackTimer = setTimeout(handleFallback, 6000);

        return () => {
            video.removeEventListener('loadeddata', handleVideoReady);
            video.removeEventListener('canplay', handleVideoReady);
            video.removeEventListener('canplaythrough', handleVideoReady);
            clearTimeout(fallbackTimer);
        };
    }, []);

    // Start animation only when both video is loaded AND minimum time has elapsed
    useEffect(() => {
        if (isVideoLoaded && minimumTimeElapsed) {
            // Only activate fullscreen on desktop (mobile video is already almost fullscreen)
            if (!isMobileBreakpoint) {
                setIsFullscreen(true);
            }

            // Start video playback immediately
            if (videoRef.current) {
                videoRef.current.play();
            }

            // After brief moment, start fading the loader
            setTimeout(() => {
                setLoaderContentFading(true);
                setIsAnimating(true);
            }, 100);

            // Remove loader from DOM after fade completes
            setTimeout(() => {
                setShowOverlay(false);
            }, 700);
        }
    }, [isVideoLoaded, minimumTimeElapsed, isMobileBreakpoint]);

    return (
        <>
            {/* Loading Overlay - Fullscreen-sized from the start */}
            {showOverlay && (
                <div
                    className="fixed inset-0 bg-neutral-50 z-[100]"
                    style={{
                        transition: isAnimating
                            ? 'opacity 400ms cubic-bezier(.25, .46, .45, .94) 200ms'
                            : 'none',
                        opacity: isAnimating ? 0 : 1,
                        pointerEvents: isAnimating ? 'none' : 'auto',
                    }}
                >
                    {/* Loader Container - Fullscreen positioned, just fades in at full size */}
                    <div
                        className="loader-container absolute inset-4 sm:inset-8 lg:inset-12 rounded-2xl flex items-center justify-center overflow-hidden"
                        style={{
                            opacity: containerEntered ? 1 : 0,
                            transition: 'opacity 500ms ease-out',
                        }}
                    >
                            {/* White background - simple fade */}
                            <div
                                className="absolute inset-0 rounded-2xl"
                                style={{
                                    backgroundColor: '#FBFBFB',
                                    opacity: loaderContentFading ? 0 : backgroundVisible ? 1 : 0,
                                    transition: loaderContentFading
                                        ? 'opacity 400ms ease-out'
                                        : 'opacity 800ms ease-out',
                                    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.03), 0 4px 16px rgba(0, 0, 0, 0.015)',
                                }}
                            />

                            {/* Logo and text content - centered */}
                            <div
                                className="relative flex flex-col items-center z-10"
                                style={{
                                    opacity: loaderContentFading ? 0 : 1,
                                    transition: 'opacity 400ms ease-out',
                                }}
                            >
                                {/* Blueprint Logo */}
                                <Image
                                    src="/blueprint-logo-dark.svg"
                                    alt="Blueprint Studio"
                                    width={30}
                                    height={30}
                                    className="h-4 sm:h-5 w-auto mb-6 sm:mb-8 transition-opacity duration-700"
                                    style={{
                                        opacity: logoEntered ? 1 : 0,
                                    }}
                                    priority
                                />

                                {/* Two-line text with animation */}
                                <div className="text-center">
                                    <p className="text-neutral-700 text-2xl sm:text-4xl font-medium leading-relaxed cursor-default">
                                        <span className="block mb-1">
                                            {"We partner with founders".split(' ').map((word, i) => (
                                                <span
                                                    key={i}
                                                    className="inline-block transition-all duration-500 mr-1"
                                                    style={{
                                                        opacity: textAnimated ? 1 : 0,
                                                        filter: textAnimated ? 'blur(0px)' : 'blur(10px)',
                                                        transform: textAnimated ? 'translateY(0)' : 'translateY(10px)',
                                                        transitionDelay: `${i * 60}ms`,
                                                    }}
                                                >
                                                    {word}
                                                </span>
                                            ))}
                                        </span>
                                        <span className="block">
                                            {"to build their future".split(' ').map((word, i) => (
                                                <span
                                                    key={i}
                                                    className="inline-block transition-all duration-500 mr-1"
                                                    style={{
                                                        opacity: textAnimated ? 1 : 0,
                                                        filter: textAnimated ? 'blur(0px)' : 'blur(10px)',
                                                        transform: textAnimated ? 'translateY(0)' : 'translateY(10px)',
                                                        transitionDelay: `${240 + (i * 60)}ms`, // Start second line after first
                                                    }}
                                                >
                                                    {word}
                                                </span>
                                            ))}
                                        </span>
                                    </p>
                                </div>
                            </div>
                    </div>
                </div>
            )}

            <Section className="relative z-20 bg-neutral-50 overflow-hidden min-h-fit lg:min-h-[max(600px,80vh)] justify-between">
                {/* Artificial vertical lines to match the background */}
                <div className="absolute inset-0 flex justify-center pointer-events-none px-2.5 sm:px-[60px]">
                    <div className="w-full flex-1 flex justify-center relative">
                        {/* Left dashed vertical line (mobile) / solid line (desktop) */}
                        <div className="absolute left-0 top-0 bottom-0 line-dash-y custom:hidden" />
                        <div className="absolute left-0 top-0 bottom-0 w-px bg-neutral-300 hidden custom:block" />

                        {/* Right dashed vertical line (mobile) / solid line (desktop) */}
                        <div className="absolute right-0 top-0 bottom-0 line-dash-y custom:hidden" />
                        <div className="absolute right-0 top-0 bottom-0 w-px bg-neutral-300 hidden custom:block" />
                    </div>
                </div>
                <SectionHeader
                    leftText={
                        headerAnimationsReady
                            ? <AnimatedCitySwitcher key="city-ready" startDelay={0} />
                            : (
                                <span
                                    aria-hidden="true"
                                    className="inline-block opacity-0"
                                    style={{ minWidth: '350px' }}
                                >
                                    Los Angeles, California
                                </span>
                            )
                    }
                    centerContent={
                        <div
                            style={{
                                opacity: headerLogoVisible ? 1 : 0,
                                filter: headerLogoVisible ? 'blur(0px)' : 'blur(6px)',
                                transform: headerLogoVisible ? 'translateY(0)' : 'translateY(-32px)',
                                transition: 'opacity 600ms cubic-bezier(.16, 1, .3, 1), filter 600ms cubic-bezier(.16, 1, .3, 1), transform 600ms cubic-bezier(.16, 1, .3, 1)',
                            }}
                        >
                            <Image
                                src="/blueprint-logo-dark.svg"
                                alt="Blueprint Studio"
                                width={80}
                                height={20}
                                className="h-3 sm:h-4 w-auto"
                            />
                        </div>
                    }
                    rightText={
                        headerAnimationsReady
                            ? <AnimatedDate key="date-ready" startDelay={0} />
                            : (
                                <span
                                    aria-hidden="true"
                                    className="inline-block opacity-0"
                                    style={{ minWidth: '120px' }}
                                >
                                    00.00.0000
                                </span>
                            )
                    }
                />

                {/* Video Section */}
                <OuterContainer className="flex flex-1 items-center justify-center w-full">
                    <InnerContainer className="py-8 sm:py-10 lg:py-12 px-6 sm:px-10 lg:px-16 relative w-full flex items-center justify-center">
                        {/* Inner dashed vertical lines on desktop */}
                        <div className="absolute left-0 top-0 bottom-0 line-dash-y hidden custom:block" />
                        <div className="absolute right-0 top-0 bottom-0 line-dash-y hidden custom:block" />

                        {/* Video Container - visible from start */}
                        <div
                            ref={videoContainerRef}
                            className="relative w-full max-w-5xl mx-auto aspect-[2/3] sm:aspect-video overflow-hidden group"
                            style={{
                                borderRadius: '0.75rem',
                                backgroundColor: 'transparent',
                            }}
                        >
                            <div
                                className="absolute inset-0 flex items-center justify-center pointer-events-none"
                                style={{
                                    borderRadius: '0.75rem',
                                    backgroundColor: '#FBFBFB',
                                    opacity: hasVideoFrame ? 0 : 1,
                                    transition: 'opacity 400ms cubic-bezier(.25, .46, .45, .94)',
                                    boxShadow: '0 12px 40px rgba(29, 29, 31, 0.04), 0 4px 20px rgba(29, 29, 31, 0.04)'
                                }}
                            >
                                <div className="flex flex-col items-center text-center gap-4 px-6 sm:px-8">
                                    <p className="text-neutral-700 text-xl sm:text-3xl font-medium leading-relaxed cursor-default">
                                        <span className="block mb-1">We partner with founders</span>
                                        <span className="block">to build their future.</span>
                                    </p>
                                </div>
                            </div>
                            {/* Video Element - apply mask to prevent corner bleeding */}
                            <video
                                ref={videoRef}
                                className="absolute inset-0 w-full h-full"
                                style={{
                                    objectFit: 'cover',
                                    borderRadius: '0.75rem',
                                    WebkitMaskImage: '-webkit-radial-gradient(white, black)',
                                    opacity: hasVideoFrame ? 1 : 0,
                                    transition: 'opacity 300ms cubic-bezier(.16, 1, .3, 1)',
                                    backgroundColor: 'transparent',
                                }}
                                loop
                                muted
                                playsInline
                                preload="auto"
                            />

                            {/* Fullscreen Button - desktop only */}
                            {hasVideoFrame && !showOverlay && !isFullscreen && !isMobileBreakpoint && (
                                <motion.button
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: 0.5, duration: 0.3 }}
                                    onClick={() => openFullscreen('button')}
                                    className="absolute right-3 top-3 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-black/40 text-white backdrop-blur-lg transition-all duration-200 hover:bg-black/60 cursor-pointer opacity-0 group-hover:opacity-100"
                                    aria-label="View fullscreen"
                                >
                                    <Maximize2 className="h-3.5 w-3.5" />
                                </motion.button>
                            )}
                        </div>

                        {/* Fullscreen Overlay - Polished "Whoosh" Animations */}
                        <AnimatePresence mode="sync">
                            {isFullscreen && (
                                <>
                                    {/* Backdrop */}
                                    <motion.div
                                        initial={{ opacity: isFirstFullscreen ? 1 : 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                        transition={{ duration: 0.35 }}
                                        className="fixed inset-0 z-[200] bg-black/90 backdrop-blur-md"
                                        onClick={() => closeFullscreen('button')}
                                    />

                                    {/* Fullscreen Video Container */}
                                    <motion.div
                                        initial={isFirstFullscreen
                                            ? { opacity: 1 }  // First time: instant (loader covers us, then fades to reveal)
                                            : triggerTypeRef.current === 'scroll'
                                                ? { opacity: 0, scale: 0.96, y: -50 }  // Scroll: float DOWN from where it exited
                                                : { opacity: 0, scale: 0.96 }  // Button: just scale, no parallax
                                        }
                                        animate={{
                                            opacity: 1,
                                            scale: 1,
                                            y: 0,
                                        }}
                                        exit={triggerTypeRef.current === 'scroll'
                                            ? {
                                                opacity: 0,
                                                scale: 0.96,
                                                y: -50,  // Scroll: float up (parallax)
                                                transition: {
                                                    duration: 0.4,
                                                    ease: [0.4, 0, 0.2, 1],
                                                }
                                            }
                                            : {
                                                opacity: 0,
                                                scale: 0.96,  // Button: just scale, no parallax
                                                transition: {
                                                    duration: 0.35,
                                                    ease: [0.4, 0, 0.2, 1],
                                                }
                                            }
                                        }
                                        transition={{
                                            duration: 0.4,
                                            ease: [0.4, 0, 0.2, 1],
                                        }}
                                        className="fixed inset-4 sm:inset-8 lg:inset-12 z-[201] flex items-center justify-center overflow-hidden"
                                        style={{ borderRadius: '1rem' }}
                                        onClick={() => closeFullscreen('button')}
                                    >
                                        <motion.div
                                            className="relative w-full h-full overflow-hidden flex items-center justify-center"
                                            style={{ borderRadius: '1rem' }}
                                            onClick={(e) => e.stopPropagation()}
                                            initial={isFirstFullscreen
                                                ? { filter: 'blur(0px)' } // First time: no blur
                                                : { filter: 'blur(4px)' }
                                            }
                                            animate={{
                                                filter: 'blur(0px)',
                                            }}
                                            exit={{
                                                filter: 'blur(4px)',
                                                transition: { duration: 0.3 }
                                            }}
                                            transition={{
                                                duration: 0.3,
                                            }}
                                        >
                                            <video
                                                ref={fullscreenVideoRef}
                                                className="w-full h-full object-cover"
                                                style={{
                                                    borderRadius: '1rem',
                                                }}
                                                src={videoSource}
                                                loop
                                                muted
                                                playsInline
                                                onLoadedData={() => {
                                                    // Sync to inline video's time and play
                                                    if (fullscreenVideoRef.current && videoRef.current) {
                                                        fullscreenVideoRef.current.currentTime = videoRef.current.currentTime;
                                                        fullscreenVideoRef.current.play().catch(() => {});
                                                    }
                                                }}
                                            />

                                            {/* Close Button */}
                                            <motion.button
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: 1 }}
                                                exit={{ opacity: 0 }}
                                                transition={{
                                                    delay: isFirstFullscreen ? 0.5 : 0.15, // Wait for loader to fade on first
                                                    duration: 0.25,
                                                }}
                                                onClick={() => closeFullscreen('button')}
                                                className="absolute right-3 top-3 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur-lg transition-all duration-200 hover:bg-white/20 cursor-pointer"
                                                aria-label="Close fullscreen"
                                            >
                                                <X className="h-5 w-5" />
                                            </motion.button>
                                        </motion.div>
                                    </motion.div>
                                </>
                            )}
                        </AnimatePresence>
                    </InnerContainer>
                </OuterContainer>

                {/* <div className="line-dash-x hidden sm:block"/> */}
            </Section>
        </>
    )
}
