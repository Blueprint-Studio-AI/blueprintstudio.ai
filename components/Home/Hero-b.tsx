"use client";

import { useState, useEffect, useRef } from "react";
import Section from "@/components/ui/Section";
import OuterContainer from "@/components/ui/OuterContainer";
import InnerContainer from "@/components/ui/InnerContainer";
import Image from "next/image";
import SectionHeader from "../ui/SectionHeader";
import AnimatedCitySwitcher from "@/components/ui/AnimatedCitySwitcher";
import AnimatedDate from "@/components/ui/AnimatedDate";

export default function HeroB() {
    const [isVideoLoaded, setIsVideoLoaded] = useState(false);
    const [isAnimating, setIsAnimating] = useState(false);
    const [showOverlay, setShowOverlay] = useState(true);
    const [videoRevealed, setVideoRevealed] = useState(false);
    const [logoEntered, setLogoEntered] = useState(false);
    const [logoBreathing, setLogoBreathing] = useState(false);
    const videoRef = useRef<HTMLVideoElement>(null);
    const videoContainerRef = useRef<HTMLDivElement>(null);

    // Start logo entrance animation immediately
    useEffect(() => {
        const timer = setTimeout(() => {
            setLogoEntered(true);

            // Start breathing after entrance completes
            setTimeout(() => {
                setLogoBreathing(true);
            }, 250); // Match entrance duration
        }, 20); // Very short delay for black screen

        return () => clearTimeout(timer);
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
        const video = videoRef.current;
        if (!video) return;

        const handleVideoLoad = () => {
            if (isVideoLoaded) return; // Prevent duplicate calls

            setIsVideoLoaded(true);

            // Start the animation sequence
            setTimeout(() => {
                setIsAnimating(true);

                // Start video reveal animation
                setTimeout(() => {
                    setVideoRevealed(true);
                }, 200); // Slight delay for smoother transition

                // Remove overlay
                setTimeout(() => {
                    setShowOverlay(false);
                }, 450); // Faster, snappier animation
            }, 400); // Shorter pause to show logo
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

        // Fallback timer for any edge cases
        const fallbackTimer = setTimeout(() => {
            handleVideoLoad();
        }, 2000); // Faster fallback for better UX

        return () => {
            video.removeEventListener('loadedmetadata', handleLoadedMetadata);
            video.removeEventListener('loadeddata', handleLoadedData);
            video.removeEventListener('canplay', handleCanPlay);
            video.removeEventListener('canplaythrough', handleCanPlay);
            clearTimeout(fallbackTimer);
        };
    }, []); // Remove isVideoLoaded dependency to prevent re-runs

    return (
        <>
            {/* Loading Overlay - Outside of section for full screen coverage */}
            {showOverlay && (
                <div
                    className="fixed inset-0 bg-black z-[100] flex items-center justify-center"
                    style={{
                        transformOrigin: 'center center',
                        willChange: 'transform, opacity',
                        transition: isAnimating
                            ? 'all 400ms cubic-bezier(.23, 1, .32, 1)' // ease-out-quint - very smooth deceleration
                            : 'none',
                        ...(isAnimating && videoContainerRef.current ? (() => {
                            const rect = videoContainerRef.current.getBoundingClientRect();
                            const scaleX = rect.width / window.innerWidth;
                            const scaleY = rect.height / window.innerHeight;
                            const translateX = rect.left + rect.width / 2 - window.innerWidth / 2;
                            const translateY = rect.top + rect.height / 2 - window.innerHeight / 2;

                            return {
                                transform: `translate(${translateX}px, ${translateY}px) scale(${scaleX}, ${scaleY})`,
                                borderRadius: '0.75rem', // Match video border radius
                                opacity: 0,
                                pointerEvents: 'none' as const,
                            };
                        })() : {
                            transform: 'translate(0, 0) scale(1, 1)',
                            opacity: 1,
                        })
                    }}
                >
                    {/* Logo - starts hidden, enters with scale, then breathes */}
                    <div
                        className={`
                            ${logoEntered ? 'logo-entrance' : ''}
                            ${logoBreathing && !isAnimating ? 'logo-breathing' : ''}
                            transition-opacity duration-200
                            ${isAnimating ? 'opacity-0' : ''}
                        `}
                        style={{
                            transitionTimingFunction: 'cubic-bezier(.25, .46, .45, .94)', // ease-out-quad for exit
                            opacity: !logoEntered ? 0 : undefined, // Start at opacity 0
                        }}
                    >
                        <Image
                            src="/blueprint-logo.svg"
                            alt="Blueprint Studio"
                            width={200}
                            height={50}
                            className="h-12 sm:h-16 w-auto"
                            priority
                        />
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
                    leftText={<AnimatedCitySwitcher />}
                    centerContent={
                        <Image
                            src="/blueprint-logo-dark.svg"
                            alt="Blueprint Studio"
                            width={100}
                            height={25}
                            className="h-5 w-auto"
                        />
                    }
                    rightText={<AnimatedDate />}
                />

                {/* Video Section */}
                <OuterContainer className="flex flex-1 items-center justify-center w-full">
                    <InnerContainer className="py-8 sm:py-10 lg:py-12 px-6 sm:px-10 lg:px-16 relative w-full flex items-center justify-center">
                        {/* Inner dashed vertical lines on desktop */}
                        <div className="absolute left-0 top-0 bottom-0 line-dash-y hidden custom:block" />
                        <div className="absolute right-0 top-0 bottom-0 line-dash-y hidden custom:block" />

                        {/* Video Container with subtle scale animation */}
                        <div
                            ref={videoContainerRef}
                            className="relative w-full max-w-5xl mx-auto aspect-[2/3] sm:aspect-video overflow-hidden"
                            style={{
                                transform: videoRevealed ? 'scale(1)' : 'scale(0.98)',
                                opacity: videoRevealed ? 1 : 0.8,
                                transition: 'all 300ms cubic-bezier(.165, .84, .44, 1)', // ease-out-quart
                                willChange: 'transform, opacity',
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
                                autoPlay
                                loop
                                muted
                                playsInline
                                preload="auto"
                            >
                                <source src="/videos/highlight-reel-horizontal-001-1.mp4" type="video/mp4" />
                                {/* Fallback test video */}
                                {/* <source src="https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4" type="video/mp4" /> */}
                            </video>
                        </div>
                    </InnerContainer>
                </OuterContainer>

                <div className="line-dash-x hidden sm:block"/>
            </Section>
        </>
    )
}