"use client";

import { ReactNode } from "react";
import { motion, useReducedMotion } from "framer-motion";

export const EASE_OUT = [0.16, 1, 0.3, 1] as const;

// Rises into place the first time it scrolls into view. Opacity and transform
// only, so nothing around it moves.
export default function Reveal({
  children,
  delay = 0,
  className,
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
}) {
  const reduceMotion = useReducedMotion();
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 14 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "0px 0px -10% 0px" }}
      transition={reduceMotion ? { duration: 0 } : { duration: 0.8, ease: EASE_OUT, delay }}
    >
      {children}
    </motion.div>
  );
}
