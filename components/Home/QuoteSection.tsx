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
                <OuterContainer>
                    <InnerContainer className="py-32 lg:py-40 text-center">
                        <blockquote className="max-w-4xl mx-auto">
                            <motion.p 
                                className="text-4xl lg:text-6xl font-medium text-neutral-800 leading-tight mb-8" 
                                style={{ letterSpacing: '-1.2px' }}
                                initial={{ opacity: 0, y: 50 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.8, delay: 0.2 }}
                                viewport={{ once: true, amount: 0.3 }}
                            >
                                "We believe the future belongs to those who build it."
                            </motion.p>
                            <motion.cite 
                                className="text-lg text-neutral-500 font-normal not-italic"
                                initial={{ opacity: 0 }}
                                whileInView={{ opacity: 1 }}
                                transition={{ duration: 0.6, delay: 0.6 }}
                                viewport={{ once: true, amount: 0.3 }}
                            >
                                — Blueprint Studio
                            </motion.cite>
                        </blockquote>
                    </InnerContainer>
                </OuterContainer>
            </Section>
        </div>
    )
}