"use client";

import { useState, useEffect, useRef } from "react";
import Section from "@/components/ui/Section";
import OuterContainer from "@/components/ui/OuterContainer";
import InnerContainer from "@/components/ui/InnerContainer";
import Image from "next/image";
import SectionHeader from "../ui/SectionHeader";
import AnimatedCitySwitcher from "@/components/ui/AnimatedCitySwitcher";
import AnimatedDate from "@/components/ui/AnimatedDate";
import { useBreakpoint } from "@/lib/breakpoints";

export default function HeroB() {
    const [isVideoLoaded, setIsVideoLoaded] = useState(false);
    const [isAnimating, setIsAnimating] = useState(false);
    const [containerAtVideo, setContainerAtVideo] = useState(false);
    const [showOverlay, setShowOverlay] = useState(true);
    const [videoRevealed, setVideoRevealed] = useState(false);
    const [logoEntered, setLogoEntered] = useState(false);
    const [headerLogoVisible, setHeaderLogoVisible] = useState(false);
    const [headerAnimationsReady, setHeaderAnimationsReady] = useState(false);
    const [containerEntered, setContainerEntered] = useState(false);
    const [backgroundVisible, setBackgroundVisible] = useState(false);
    const [textAnimated, setTextAnimated] = useState(false);
    const [isMobile, setIsMobile] = useState(false);
    const [minimumTimeElapsed, setMinimumTimeElapsed] = useState(false);
    const [isClient, setIsClient] = useState(false);
    const videoRef = useRef<HTMLVideoElement>(null);
    const videoContainerRef = useRef<HTMLDivElement>(null);
    const loadStartTime = useRef<number>(Date.now());
    const breakpoint = useBreakpoint();

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
        const currentTime = video.currentTime;
        
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
        }, 1600); // A moment after text has animated in

        // Header logo fade in with slight delay after text
        // Set minimum display time (e.g., 2.5 seconds to read the text)
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
        }, 0);

        return () => {
            clearTimeout(textTimer);
        };
    }, [isAnimating]);

    useEffect(() => {
        const video = videoRef.current;
        if (!video) return;

        const handleVideoLoad = () => {
            if (isVideoLoaded) return; // Prevent duplicate calls

            setIsVideoLoaded(true);
        };

        // Listen for multiple events to catch first load
        const handleLoadedMetadata = () => {
            // Video metadata is loaded, dimensions are known
            if (video.readyState >= 1) {
                handleVideoLoad();
            }
        };

        const handleCanPlay = () => {
            handleVideoLoad();
        };

        const handleLoadedData = () => {
            // First frame is available
            handleVideoLoad();
        };

        // Add all event listeners for first load
        video.addEventListener('loadedmetadata', handleLoadedMetadata);
        video.addEventListener('loadeddata', handleLoadedData);
        video.addEventListener('canplay', handleCanPlay);
        video.addEventListener('canplaythrough', handleCanPlay);

        // Check current state after adding listeners
        if (video.readyState >= 2) {
            // HAVE_CURRENT_DATA or higher - can display current frame
            handleVideoLoad();
        }

        // Fallback timer for any edge cases (allow longer buffer before forcing readiness)
        const fallbackTimer = setTimeout(() => {
            handleVideoLoad();
        }, 6000);

        return () => {
            video.removeEventListener('loadedmetadata', handleLoadedMetadata);
            video.removeEventListener('loadeddata', handleLoadedData);
            video.removeEventListener('canplay', handleCanPlay);
            video.removeEventListener('canplaythrough', handleCanPlay);
            clearTimeout(fallbackTimer);
        };
    }, []); // Remove isVideoLoaded dependency to prevent re-runs

    // Start animation only when both video is loaded AND minimum time has elapsed
    useEffect(() => {
        if (isVideoLoaded && minimumTimeElapsed) {
            // Start the animation sequence
            setTimeout(() => {
                setIsAnimating(true);

                // Start video playback earlier in the animation
                setTimeout(() => {
                    if (videoRef.current) {
                        videoRef.current.play();
                    }
                }, 0); // Start video earlier

                // Container reaches video position
                setTimeout(() => {
                    setContainerAtVideo(true);
                }, 650); // Just before animation completes

                // Start video reveal animation AFTER loader completes transform
                setTimeout(() => {
                    setVideoRevealed(true);
                }, 700); // Match loader animation duration

                // Remove overlay
                setTimeout(() => {
                    setShowOverlay(false);
                }, 750); // Quick fade after reaching position
            }, 300); // Reduced delay before starting animation
        }
    }, [isVideoLoaded, minimumTimeElapsed]);

    return (
        <>
            {/* Loading Overlay - Site background that fades away */}
            {showOverlay && (
                <div
                    className="fixed inset-0 bg-neutral-50 z-[100] flex items-center justify-center"
                    style={{
                        transition: isAnimating
                            ? 'opacity 300ms cubic-bezier(.25, .46, .45, .94)' // ease-out-quad, much quicker
                            : 'none',
                        opacity: isAnimating ? 0 : 1,
                        pointerEvents: isAnimating ? 'none' : 'auto',
                    }}
                >
                    {/* Loader Container - Large, centered */}
                    <div
                        className="loader-container relative rounded-2xl flex items-start justify-center overflow-hidden"
                        style={{
                            width: 'calc(100vw - 80px)',
                            maxWidth: '1200px',
                            aspectRatio: isMobile ? '2/3' : '16/9',
                            transformOrigin: 'center center',
                            willChange: 'transform, opacity, filter',
                            opacity: containerEntered && !containerAtVideo ? 1 : containerEntered && containerAtVideo ? 0 : 0,
                            transform: containerEntered && !isAnimating
                                ? 'scale(1)'
                                : 'scale(0.9)',
                            transition: isAnimating
                                ? containerAtVideo
                                    ? 'opacity 100ms ease-out, transform 700ms cubic-bezier(.23, 1, .32, 1), filter 700ms cubic-bezier(.23, 1, .32, 1)'
                                    : 'transform 700ms cubic-bezier(.23, 1, .32, 1), filter 700ms cubic-bezier(.23, 1, .32, 1)'
                                : 'transform 600ms cubic-bezier(.34, 1.56, .64, 1), opacity 600ms cubic-bezier(.34, 1.56, .64, 1)', // bounce effect
                            ...(isAnimating && videoContainerRef.current ? (() => {
                                const videoRect = videoContainerRef.current.getBoundingClientRect();
                                const loaderEl = document.querySelector('.loader-container');
                                if (!loaderEl) return {};
                                const loaderRect = loaderEl.getBoundingClientRect();

                                const scaleX = videoRect.width / loaderRect.width;
                                const scaleY = videoRect.height / loaderRect.height;
                                const translateX = (videoRect.left + videoRect.width / 2) - (loaderRect.left + loaderRect.width / 2);
                                const translateY = (videoRect.top + videoRect.height / 2) - (loaderRect.top + loaderRect.height / 2);

                                return {
                                    transform: `translate(${translateX}px, ${translateY}px) scale(${scaleX}, ${scaleY})`,
                                    filter: 'blur(2px)',
                                };
                            })() : {})
                        }}
                    >
                            {/* White background with subtle scale animation */}
                            <div
                                className="absolute inset-0 rounded-2xl"
                                style={{
                                    backgroundColor: '#FBFBFB',
                                    transform: backgroundVisible && !containerAtVideo ? 'scale(1)' : 'scale(0.98)',
                                    opacity: backgroundVisible && !containerAtVideo ? 1 : 0,
                                    transition: containerAtVideo
                                        ? 'all 100ms ease-out' // Quick fade with container
                                        : 'all 1600ms cubic-bezier(.165, .84, .44, 1), box-shadow 1600ms cubic-bezier(.165, .84, .44, 1) 800ms', // Slow fade in with shadow
                                    transformOrigin: 'center center',
                                    boxShadow: backgroundVisible && !containerAtVideo ? '0 8px 32px rgba(0, 0, 0, 0.03), 0 4px 16px rgba(0, 0, 0, 0.015)' : 'none',
                                }}
                            />

                            {/* Logo and text content - positioned higher */}
                            <div
                                className={`relative flex flex-col items-center pt-[50%] sm:pt-[20%]`}
                                style={{
                                    opacity: containerAtVideo ? 0 : 1,
                                    transition: 'opacity 100ms ease-out',
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
                            className="relative w-full max-w-5xl mx-auto aspect-[2/3] sm:aspect-video overflow-hidden"
                            style={{
                                borderRadius: '0.75rem', // Use inline style for better control
                                backgroundColor: 'transparent', // Remove any background
                            }}
                        >
                            {/* Video Element - apply mask to prevent corner bleeding */}
                            <video
                                ref={videoRef}
                                className="absolute inset-0 w-full h-full"
                                style={{
                                    objectFit: 'cover',
                                    borderRadius: '0.75rem', // Match container exactly
                                    WebkitMaskImage: '-webkit-radial-gradient(white, black)', // Force GPU rendering
                                }}
                                loop
                                muted
                                playsInline
                                preload="auto"
                            />
                        </div>
                    </InnerContainer>
                </OuterContainer>

                {/* <div className="line-dash-x hidden sm:block"/> */}
            </Section>
        </>
    )
}
