"use client";
import Section from "@/components/ui/Section";
import OuterContainer from "@/components/ui/OuterContainer";
import InnerContainer from "@/components/ui/InnerContainer";
import { motion } from "framer-motion";

export default function QuoteSection() {
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
                            {/* <motion.p 
                                className="text-4xl lg:text-6xl font-medium text-neutral-800 leading-tight mb-8" 
                                style={{ letterSpacing: '-1.2px' }}
                                initial={{ opacity: 0, y: 50 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.8, delay: 0.2 }}
                                viewport={{ once: true, amount: 0.3 }}
                            > */}
                            <h1
                                className="font-medium text-neutral-800 mb-8"
                                style={{
                                    fontSize: 'clamp(48px, 9vw, 80px)',
                                    lineHeight: 'clamp(110%, 1.2vw, 120%)',
                                    letterSpacing: '-2.2px',
                                    textWrap: 'balance'
                                }}
                            >
                                Blueprint Studio partners with founders to build their&nbsp;future.
                            </h1>
                            {/* </motion.p> */}

                            {/* <motion.cite
                                className="text-lg text-neutral-500 font-normal not-italic"
                                initial={{ opacity: 0 }}
                                whileInView={{ opacity: 1 }}
                                transition={{ duration: 0.6, delay: 0.6 }}
                                viewport={{ once: true, amount: 0.3 }}
                            > */}
                            <p
                                className="text-neutral-600 font-normal not-italic"
                                style={{
                                    fontSize: 'clamp(20px, 4vw, 28px)',
                                    lineHeight: '130%',
                                    letterSpacing: '-0.96px',
                                    textWrap: 'balance'
                                }}
                            >
                                You see the&nbsp;future. We design and&nbsp;build&nbsp;it — products, brands, websites, apps, and&nbsp;media.
                            </p>
                               
                            {/* </motion.cite> */}
                        </blockquote>
                </div>
            </Section>
        </div>
    )
}