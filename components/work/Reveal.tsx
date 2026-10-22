"use client";

import { MotionConfig, motion } from "framer-motion";
import type { ReactNode } from "react";

const EASE_OUT = [0.22, 1, 0.36, 1] as const;

// The wall's entrance (rise, unblur) for anything else on the work pages.
export default function Reveal({ children, delay = 0, className }: { children: ReactNode; delay?: number; className?: string }) {
  return (
    <MotionConfig reducedMotion="user">
      <motion.div
        initial={{ opacity: 0, y: 48, filter: "blur(10px)" }}
        whileInView={{ opacity: 1, y: 0, filter: "blur(0px)", transitionEnd: { filter: "none" } }}
        viewport={{ once: true, margin: "0px 0px -8% 0px" }}
        transition={{
          y: { type: "spring", stiffness: 70, damping: 18, delay },
          opacity: { duration: 0.7, ease: EASE_OUT, delay },
          filter: { duration: 0.8, ease: EASE_OUT, delay },
        }}
        className={className}
      >
        {children}
      </motion.div>
    </MotionConfig>
  );
}
