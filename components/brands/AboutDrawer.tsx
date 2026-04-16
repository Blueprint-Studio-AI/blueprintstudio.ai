"use client";
import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface AboutDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  clientName: string;
  children: React.ReactNode;
}

export function AboutDrawer({ isOpen, onClose, clientName, children }: AboutDrawerProps) {
  // Lock body scroll when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  // Close on Escape
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="fixed inset-0 z-[60] bg-black/20 backdrop-blur-[2px]"
            onClick={onClose}
          />

          {/* Drawer panel */}
          <motion.aside
            key="panel"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="fixed top-0 right-0 bottom-0 z-[70] w-full max-w-[480px] bg-[#F6F6F6] border-l border-neutral-200 overflow-y-auto"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-8 py-6 border-b border-neutral-200">
              <span className="text-xs font-medium text-neutral-500 uppercase tracking-[0.12em]">
                About the Brand
              </span>
              <button
                onClick={onClose}
                className="w-7 h-7 flex items-center justify-center rounded-full text-neutral-400 hover:text-neutral-900 hover:bg-neutral-200 transition-all duration-150"
                aria-label="Close"
              >
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                  <path d="M1 1L11 11M11 1L1 11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                </svg>
              </button>
            </div>

            {/* Content */}
            <div className="px-8 py-10">
              <h2 className="font-serif text-3xl leading-tight mb-8 text-neutral-900">
                {clientName}
              </h2>
              <div className="space-y-6 text-[15px] leading-relaxed text-neutral-700">
                {children}
              </div>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
