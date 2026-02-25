"use client";

import { motion } from "framer-motion";
import { type ReactNode } from "react";

interface GradientButtonProps {
  onClick?: () => void;
  children: ReactNode;
  className?: string;
}

export default function GradientButton({ onClick, children, className = "" }: GradientButtonProps) {
  return (
    <motion.button
      onClick={onClick}
      className={`relative w-fit py-3.5 px-7 font-medium flex items-center justify-center text-white rounded-lg text-md cursor-pointer overflow-hidden group ${className}`}
      style={{
        background: "linear-gradient(135deg, #60AEEE 0%, #3B82F6 25%, #2563EB 50%, #1D4ED8 75%, #4F46E5 100%)",
        boxShadow: "0 1px 2px rgba(0,0,0,0.1), 0 2px 8px rgba(96,174,238,0.3), 0 0 0 1px rgba(255,255,255,0.1) inset, 0 1px 0 rgba(255,255,255,0.2) inset",
      }}
      whileTap={{ scale: 0.97 }}
      transition={{ type: "spring", stiffness: 500, damping: 30 }}
    >
      <motion.div
        className="absolute inset-0"
        style={{
          background: "radial-gradient(ellipse 50% 80% at 30% 50%, rgba(147,197,253,0.4) 0%, transparent 50%), radial-gradient(ellipse 40% 70% at 70% 50%, rgba(96,174,238,0.35) 0%, transparent 50%)",
          filter: "blur(1px)",
        }}
        animate={{ backgroundPosition: ["0% 0%, 100% 0%", "100% 0%, 0% 0%", "0% 0%, 100% 0%"] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute inset-0"
        style={{
          background: "radial-gradient(ellipse 80% 100% at center, rgba(147,197,253,0.3) 0%, transparent 60%)",
          filter: "blur(3px)",
        }}
        animate={{ x: ["-40%", "40%", "-40%"] }}
        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
      />
      <div
        className="absolute inset-x-0 top-0 h-[1px]"
        style={{ background: "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.4) 20%, rgba(255,255,255,0.5) 50%, rgba(255,255,255,0.4) 80%, transparent 100%)" }}
      />
      <span className="relative z-10 flex items-center" style={{ textShadow: "0 1px 2px rgba(0,0,0,0.2)" }}>
        {children}
      </span>
    </motion.button>
  );
}
