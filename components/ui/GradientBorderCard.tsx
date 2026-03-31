"use client";

import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { type ReactNode } from "react";

export const GRADIENT_BORDER_BG =
  "linear-gradient(135deg, #60AEEE 0%, #3B82F6 25%, #2563EB 50%, #1D4ED8 75%, #4F46E5 100%, #60AEEE 100%)";

interface GradientBorderCardProps {
  isActive: boolean;
  onToggle: () => void;
  title: string;
  price: string;
  description: string;
  children?: ReactNode;
  /** "compact" for inline pricing toggle, "full" for package add-on cards */
  size?: "compact" | "full";
}

export default function GradientBorderCard({
  isActive,
  onToggle,
  title,
  price,
  description,
  children,
  size = "full",
}: GradientBorderCardProps) {
  const isCompact = size === "compact";

  return (
    <div className="relative rounded-2xl h-full p-[2px]">
      <motion.div
        className="absolute inset-0 rounded-2xl"
        style={{
          background: GRADIENT_BORDER_BG,
          backgroundSize: "300% 300%",
        }}
        initial={{ opacity: 0 }}
        animate={{
          opacity: isActive ? 1 : 0,
          backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
        }}
        transition={{
          opacity: { duration: 0.3 },
          backgroundPosition: {
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut",
          },
        }}
      />
      <div
        className={`relative rounded-[14px] flex flex-col h-full transition-colors duration-300 ${
          isCompact ? "p-4 sm:p-5" : "p-6 sm:p-8"
        } ${isActive ? "bg-white" : "bg-neutral-50 line-dash-border"}`}
      >
        <div className="flex items-center justify-between mb-2">
          <h4
            className={`font-medium text-black cursor-default ${
              isCompact ? "text-sm" : "text-xl"
            }`}
          >
            <span className="text-neutral-400">+</span> {title}
          </h4>
          {isCompact && (
            <span className="text-sm font-medium text-neutral-600">
              {price}
            </span>
          )}
        </div>

        {!isCompact && (
          <p className="text-neutral-500 text-sm cursor-default">
            {description}
          </p>
        )}

        {!isCompact && (
          <div className="mt-4">
            <span className="text-xs text-neutral-500 block">Add-on</span>
            <span className="font-semibold text-black text-[clamp(24px,4vw,32px)] leading-tight">
              {price}
            </span>
          </div>
        )}

        {isCompact && (
          <p className="text-neutral-500 text-xs mb-4 cursor-default">
            {description}
          </p>
        )}

        {children}

        <div className={isCompact ? "" : "mt-auto pt-6"}>
          <button
            onClick={onToggle}
            className={`w-full rounded-lg border text-sm font-medium transition-colors cursor-pointer flex items-center justify-center gap-1.5 ${
              isCompact ? "py-2 px-4" : "py-2.5 px-6"
            } ${
              isActive
                ? "border-blue-600 text-blue-600"
                : "border-neutral-300 text-neutral-600 hover:border-neutral-400 hover:text-neutral-800"
            }`}
          >
            {isActive && <Check className="w-4 h-4" />}
            {isActive ? "Added" : "+ Add to Package"}
          </button>
        </div>
      </div>
    </div>
  );
}
