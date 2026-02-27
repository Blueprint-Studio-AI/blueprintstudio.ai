"use client";

import { motion } from "framer-motion";
import { type ReactNode } from "react";

interface GradientTextProps {
  children: ReactNode;
}

export default function GradientText({ children }: GradientTextProps) {
  return (
    <motion.span
      style={{
        backgroundImage:
          "linear-gradient(135deg, #60AEEE 0%, #3B82F6 25%, #2563EB 50%, #1D4ED8 75%, #4F46E5 100%, #60AEEE 100%)",
        backgroundSize: "300% 300%",
        WebkitBackgroundClip: "text",
        WebkitTextFillColor: "transparent",
        backgroundClip: "text",
        color: "transparent",
      }}
      animate={{ backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"] }}
      transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
    >
      {children}
    </motion.span>
  );
}
