"use client";

import { motion } from "framer-motion";
import { useSmoothScroll } from "@/components/SmoothScroll";

// The hero's primary button, for use further down the page: glides to the
// booking calendar in #contact.
export default function BookCallButton({ className = "" }: { className?: string }) {
  const { scroll } = useSmoothScroll();
  return (
    <motion.a
      href="#contact"
      onClick={(e) => {
        const target = document.getElementById("contact");
        if (!target) return;
        e.preventDefault();
        if (scroll) scroll.scrollTo(target, { offset: -80, duration: 1.2 });
        else window.scrollTo({ top: target.getBoundingClientRect().top + window.scrollY - 80, behavior: "smooth" });
      }}
      whileTap={{ scale: 0.97 }}
      transition={{ type: "spring", stiffness: 500, damping: 30 }}
      className={`flex h-12 shrink-0 items-center justify-center whitespace-nowrap rounded-full px-6 text-[15px] font-medium text-white ${className}`}
      style={{
        background: "linear-gradient(135deg, #60AEEE 0%, #3B82F6 25%, #2563EB 50%, #1D4ED8 75%, #4F46E5 100%)",
        boxShadow:
          "0 1px 2px rgba(0, 0, 0, 0.1), 0 2px 8px rgba(96, 174, 238, 0.3), 0 0 0 1px rgba(255, 255, 255, 0.1) inset, 0 1px 0 rgba(255, 255, 255, 0.2) inset",
        textShadow: "0 1px 2px rgba(0, 0, 0, 0.2)",
      }}
    >
      Book a call
    </motion.a>
  );
}
