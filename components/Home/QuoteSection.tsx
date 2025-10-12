"use client";
import Section from "@/components/ui/Section";
import OuterContainer from "@/components/ui/OuterContainer";
import InnerContainer from "@/components/ui/InnerContainer";
import { motion, useScroll, useTransform } from "framer-motion";
import { useEffect, useState } from "react";

export default function QuoteSection() {
    const [shouldAnimate, setShouldAnimate] = useState(false);
    const { scrollY } = useScroll();

    useEffect(() => {
        const unsubscribe = scrollY.on("change", (latest) => {
            // Trigger animation as soon as the heading would be visible
            // The hero section is roughly at the viewport height, so we trigger slightly before
            const triggerPoint = window.innerHeight * 0.5; // Trigger when scrolled ~50% of viewport height

            if (latest > triggerPoint && !shouldAnimate) {
                setShouldAnimate(true);
            }
        });

        return () => unsubscribe();
    }, [scrollY, shouldAnimate]);

    return (
        <div
            className="fixed inset-0 bg-neutral-200 flex items-center justify-center z-10"
            style={{
                backgroundImage: 'radial-gradient(circle, #C3C6CC 1px, transparent 1px)',
                backgroundSize: '16px 16px',
                backgroundColor: '#E6E6E6'
            }}>
            <Section className="w-full">
                <div className="py-32 lg:py-40 text-center px-4">
                    <blockquote>
                            <motion.h1
                                className="font-medium text-neutral-800 mb-8 cursor-default"
                                style={{
                                    fontSize: 'clamp(32px, 6vw, 56px)',
                                    lineHeight: 'clamp(110%, 1.2vw, 120%)',
                                    letterSpacing: '-1.5px',
                                    textWrap: 'balance'
                                }}
                            >
                                {["Blueprint Studio", "partners with", "founders to", "build their\u00A0future."].map((phrase, i) => (
                                    <motion.span
                                        key={i}
                                        className="inline-block"
                                        style={{ marginRight: i < 3 ? '0.3em' : 0 }}
                                        initial={{ opacity: 0, y: 30, filter: 'blur(10px)' }}
                                        animate={shouldAnimate ? { opacity: 1, y: 0, filter: 'blur(0px)' } : { opacity: 0, y: 30, filter: 'blur(10px)' }}
                                        transition={{
                                            duration: 0.6,
                                            ease: [0.16, 1, 0.3, 1],
                                            delay: i * 0.05 // Stagger each phrase
                                        }}
                                    >
                                        {phrase}
                                    </motion.span>
                                ))}
                            </motion.h1>

                            <motion.p
                                className="text-neutral-600 font-normal not-italic cursor-default"
                                style={{
                                    fontSize: 'clamp(16px, 2.5vw, 20px)',
                                    lineHeight: '130%',
                                    letterSpacing: '-0.5px',
                                    textWrap: 'balance'
                                }}
                            >
                                {["An end-to-end", "creative studio for", "products, brands, websites,", "apps, and\u00A0media."].map((phrase, i) => (
                                    <motion.span
                                        key={i}
                                        className="inline-block"
                                        style={{ marginRight: i < 3 ? '0.3em' : 0 }}
                                        initial={{ opacity: 0, y: 30, filter: 'blur(10px)' }}
                                        animate={shouldAnimate ? { opacity: 1, y: 0, filter: 'blur(0px)' } : { opacity: 0, y: 30, filter: 'blur(10px)' }}
                                        transition={{
                                            duration: 0.6,
                                            ease: [0.16, 1, 0.3, 1],
                                            delay: 0.5 + (i * 0.05) // Start after heading with pause and stagger
                                        }}
                                    >
                                        {phrase}
                                    </motion.span>
                                ))}
                            </motion.p>
                        </blockquote>
                </div>
            </Section>
        </div>
    )
}