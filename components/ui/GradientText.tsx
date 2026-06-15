"use client";

import { motion, useInView } from "framer-motion";
import { useRef, type ReactNode } from "react";

interface GradientTextProps {
  children: ReactNode;
}

export default function GradientText({ children }: GradientTextProps) {
  // backgroundPosition animates on the CPU (repaints the text every frame),
  // so the drift only runs while the text is actually on screen.
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref);
  return (
    <motion.span
      ref={ref}
      className="px-1 -mx-1"
      style={{
        backgroundImage:
          "linear-gradient(135deg, #60AEEE 0%, #3B82F6 25%, #2563EB 50%, #1D4ED8 75%, #4F46E5 100%, #60AEEE 100%)",
        backgroundSize: "300% 300%",
        WebkitBackgroundClip: "text",
        WebkitTextFillColor: "transparent",
        backgroundClip: "text",
        color: "transparent",
        display: "inline-block",
      }}
      animate={
        inView
          ? { backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"] }
          : { backgroundPosition: "0% 50%" }
      }
      transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
    >
      {children}
    </motion.span>
  );
}
