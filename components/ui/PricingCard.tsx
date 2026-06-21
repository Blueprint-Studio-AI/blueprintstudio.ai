"use client";

import { ArrowUpRight } from "lucide-react";
import { motion } from "framer-motion";
import GreenCheckmark from "@/components/ui/GreenCheckmark";

export function FeatureRow({ title, desc }: { title: string; desc: string }) {
  return (
    <div className="flex items-center gap-4">
      <GreenCheckmark size="sm" />
      <div>
        <span className="text-sm font-medium text-black">{title}</span>
        <p className="text-xs text-neutral-500 mt-0.5">{desc}</p>
      </div>
    </div>
  );
}

export function PricingContainer({
  children,
  maxWidth = "max-w-4xl",
  rounded = "rounded-3xl sm:rounded-[48px]",
}: {
  children: React.ReactNode;
  maxWidth?: string;
  /** Corner radius classes — defaults to the Launch-page card; the Brand
      pricing card overrides to the Figma's 24px. */
  rounded?: string;
}) {
  return (
    <div
      className={`${maxWidth} mx-auto ${rounded} border border-neutral-200 bg-white overflow-hidden`}
    >
      {children}
    </div>
  );
}

export function PricingFooter({
  total,
  children,
  dividerClassName = "mx-6 sm:mx-10",
  rowClassName = "gap-4 py-6 sm:py-8 px-6 sm:px-10",
}: {
  total: string;
  children?: React.ReactNode;
  /** Horizontal inset of the divider — match the card body's padding so it aligns. */
  dividerClassName?: string;
  /** Grid gap + padding of the total/CTA row — match the card body's grid so the
      total and the button align with the columns above. */
  rowClassName?: string;
}) {
  return (
    <>
      <div className={`h-px bg-neutral-200 ${dividerClassName}`} />
      <div className={`grid grid-cols-1 lg:grid-cols-2 items-center ${rowClassName}`}>
        <div className="flex flex-col gap-1">
          <span className="text-xs text-neutral-500 block">Total:</span>
          <span className="font-semibold text-black text-[clamp(32px,5vw,44px)] leading-tight">
            {total}
          </span>
        </div>

        <div>
          <GradientCTAButton />
        </div>
      </div>
      {children}
    </>
  );
}

export function GradientCTAButton() {
  return (
    <motion.button
      // Figma primary-button spec (keep in sync with ui/GradientButton):
      // 52px tall, 12px radius, 16px text, 3-stop gradient, and an inner
      // white sheen (X100 / Y-11 / blur 40 / 25%).
      className="group relative w-full h-[52px] px-8 font-medium flex items-center justify-center text-white rounded-[12px] text-base overflow-hidden"
      style={{
        background: "linear-gradient(95deg, #33A6F7 0%, #1472F6 52%, #444DEB 89%)",
        boxShadow:
          "0 1px 2px rgba(0,0,0,0.1), 0 2px 8px rgba(51,166,247,0.3), inset 100px -11px 40px rgba(255,255,255,0.25)",
      }}
      whileTap={{ scale: 0.97 }}
      transition={{
        type: "spring",
        stiffness: 500,
        damping: 30,
      }}
      onClick={() =>
        window.open(
          "https://cal.com/blueprint-studio/intro-call",
          "_blank"
        )
      }
    >
      {/* Static sheen — animating backgroundPosition here was a no-op (no
          backgroundSize set, so nothing moved) yet repainted every frame. */}
      <div
        className="absolute inset-0"
        style={{
          background: `
            radial-gradient(ellipse 50% 80% at 30% 50%, rgba(147, 197, 253, 0.4) 0%, transparent 50%),
            radial-gradient(ellipse 40% 70% at 70% 50%, rgba(96, 174, 238, 0.35) 0%, transparent 50%)
          `,
          filter: "blur(1px)",
        }}
      />
      <motion.div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 80% 100% at center, rgba(147, 197, 253, 0.3) 0%, transparent 60%)",
          filter: "blur(3px)",
        }}
        animate={{
          x: ["-40%", "40%", "-40%"],
        }}
        transition={{
          duration: 7,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
      <div
        className="absolute inset-x-0 top-0 h-[1px]"
        style={{
          background:
            "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.4) 20%, rgba(255,255,255,0.5) 50%, rgba(255,255,255,0.4) 80%, transparent 100%)",
        }}
      />
      <span
        className="relative z-10"
        style={{ textShadow: "0 1px 2px rgba(0, 0, 0, 0.2)" }}
      >
        Book a Call
      </span>
      <ArrowUpRight className="w-4 h-4 ml-3 relative z-10 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
    </motion.button>
  );
}
