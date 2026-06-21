"use client";

import { motion, useReducedMotion } from "framer-motion";
import { type CSSProperties, type ReactNode } from "react";

interface GradientButtonProps {
  onClick?: () => void;
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
}

export default function GradientButton({ onClick, children, className = "", style }: GradientButtonProps) {
  const reduce = useReducedMotion();
  return (
    <motion.button
      onClick={onClick}
      // Figma primary-button spec (keep in sync with GradientCTAButton):
      // 52px tall, 12px radius, 16px text, 3-stop gradient, and an inner
      // white sheen. Left stop deepened (#2398EE) + sheen toned to 18% so the
      // white label keeps contrast on the lighter left edge.
      className={`relative w-fit h-[52px] px-7 font-medium flex items-center justify-center text-white rounded-[12px] text-base cursor-pointer overflow-hidden group ${className}`}
      style={{
        background: "linear-gradient(95deg, #2398EE 0%, #1472F6 52%, #444DEB 89%)",
        boxShadow:
          "0 1px 2px rgba(0,0,0,0.1), 0 2px 8px rgba(51,166,247,0.3), inset 100px -11px 40px rgba(255,255,255,0.18)",
        ...style,
      }}
      whileTap={{ scale: 0.97 }}
      transition={{ type: "spring", stiffness: 500, damping: 30 }}
    >
      {/* Static sheen — animating backgroundPosition here was a no-op (no
          backgroundSize set, so nothing moved) yet repainted every frame. */}
      <div
        className="absolute inset-0"
        style={{
          background: "radial-gradient(ellipse 50% 80% at 30% 50%, rgba(147,197,253,0.4) 0%, transparent 50%), radial-gradient(ellipse 40% 70% at 70% 50%, rgba(96,174,238,0.35) 0%, transparent 50%)",
          filter: "blur(1px)",
        }}
      />
      <motion.div
        className="absolute inset-0"
        style={{
          background: "radial-gradient(ellipse 80% 100% at center, rgba(147,197,253,0.3) 0%, transparent 60%)",
          filter: "blur(3px)",
        }}
        animate={reduce ? undefined : { x: ["-40%", "40%", "-40%"] }}
        transition={reduce ? undefined : { duration: 7, repeat: Infinity, ease: "easeInOut" }}
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
