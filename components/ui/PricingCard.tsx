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

export function PricingContainer({ children }: { children: React.ReactNode }) {
  return (
    <div className="max-w-4xl mx-auto rounded-3xl sm:rounded-[48px] border border-neutral-200 bg-white overflow-hidden">
      {children}
    </div>
  );
}

export function PricingFooter({
  total,
  children,
}: {
  total: string;
  children?: React.ReactNode;
}) {
  return (
    <>
      <div className="h-px bg-neutral-200 mx-6 sm:mx-10" />
      <div className="grid grid-cols-1 lg:grid-cols-2 items-center gap-4 py-6 sm:py-8 px-6 sm:px-10">
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
      className="relative w-full py-3 px-8 font-medium flex items-center justify-center text-white rounded-xl text-sm overflow-hidden"
      style={{
        background:
          "linear-gradient(135deg, #60AEEE 0%, #3B82F6 25%, #2563EB 50%, #1D4ED8 75%, #4F46E5 100%)",
        boxShadow: `
          0 1px 2px rgba(0, 0, 0, 0.1),
          0 2px 8px rgba(96, 174, 238, 0.3),
          0 0 0 1px rgba(255, 255, 255, 0.1) inset,
          0 1px 0 rgba(255, 255, 255, 0.2) inset
        `,
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
      <motion.div
        className="absolute inset-0"
        style={{
          background: `
            radial-gradient(ellipse 50% 80% at 30% 50%, rgba(147, 197, 253, 0.4) 0%, transparent 50%),
            radial-gradient(ellipse 40% 70% at 70% 50%, rgba(96, 174, 238, 0.35) 0%, transparent 50%)
          `,
          filter: "blur(1px)",
        }}
        animate={{
          backgroundPosition: [
            "0% 0%, 100% 0%",
            "100% 0%, 0% 0%",
            "0% 0%, 100% 0%",
          ],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "easeInOut",
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
      <ArrowUpRight className="w-4 h-4 ml-2 relative z-10" />
    </motion.button>
  );
}
