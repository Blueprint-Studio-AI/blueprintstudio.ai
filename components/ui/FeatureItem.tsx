"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import GreenCheckmark from "@/components/ui/GreenCheckmark";
import { cn } from "@/lib/utils";

export interface Feature {
  name: string;
  detail: string;
}

export default function FeatureItem({
  feature,
  isLast = false,
}: {
  feature: Feature;
  isLast?: boolean;
}) {
  const [isHovered, setIsHovered] = useState(false);
  const [isLocked, setIsLocked] = useState(false);
  const isOpen = isHovered || isLocked;

  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => setIsLocked((prev) => !prev)}
      className={cn("relative w-full min-h-[5rem] flex items-center gap-4 py-3 cursor-pointer group", {
        "border-b border-neutral-200": !isLast,
      })}
    >
      <div
        className={cn(
          "transition-all duration-300 absolute bg-black w-1 -left-6 rounded-full top-1/2 -translate-y-1/2",
          isOpen ? "h-12 opacity-100" : "h-4 opacity-0 group-hover:h-12 group-hover:opacity-100"
        )}
      />
      <GreenCheckmark className="w-6 h-6 shrink-0 border-green-500 text-green-500" />
      <div className="flex-1">
        <span className="text-md font-medium text-black">{feature.name}</span>
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2, ease: [0.25, 0.1, 0.25, 1] }}
              className="overflow-hidden"
            >
              <p className="text-sm text-neutral-500 mt-2">{feature.detail}</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
