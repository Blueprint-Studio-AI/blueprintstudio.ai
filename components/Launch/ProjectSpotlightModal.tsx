"use client";

import { useEffect } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import Image from "next/image";
import DeliverablePill from "@/components/ui/DeliverablePill";
import { useSmoothScroll } from "@/components/SmoothScroll";

interface ProjectSpotlightModalProps {
  isOpen: boolean;
  onClose: () => void;
  project: {
    name: string;
    logo: string;
    title: string;
    description: string;
    deliverables: { num: string; label: string }[];
    image: string;
  };
}

export default function ProjectSpotlightModal({
  isOpen,
  onClose,
  project,
}: ProjectSpotlightModalProps) {
  const { scroll } = useSmoothScroll();

  useEffect(() => {
    if (!isOpen) return;

    scroll?.stop();
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleEsc);

    return () => {
      scroll?.start();
      window.removeEventListener("keydown", handleEsc);
    };
  }, [isOpen, onClose, scroll]);

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
          onWheel={(e) => e.stopPropagation()}
          onTouchMove={(e) => e.stopPropagation()}
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 20 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="relative w-full max-w-4xl max-h-[90vh] flex flex-col bg-white rounded-2xl shadow-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex-shrink-0 flex items-center justify-between px-6 py-3 border-b border-neutral-100">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/blueprint-logo-dark.svg"
                alt="Blueprint Studio"
                className="h-4 w-auto grayscale"
              />
              <button
                onClick={onClose}
                className="p-2 text-neutral-600 hover:text-neutral-800 rounded-full bg-neutral-100 hover:bg-neutral-200 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto overscroll-contain">
            <div className="relative w-full aspect-[4/1] overflow-hidden">
              <Image
                src="/launch-assets/honeyb-spotlight/honeycombs.png"
                alt={project.name}
                fill
                className="object-cover"
              />
            </div>

            <div className="px-8 sm:px-10 py-8 sm:py-12 space-y-10">
              <div>
                <p className="text-neutral-500 text-[14px] uppercase tracking-wider mb-4">
                  Overview
                </p>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={project.logo}
                  alt={project.name}
                  className="h-14 object-contain mb-4"
                />
                <h2 className="text-2xl sm:text-2xl font-medium text-black tracking-[-0.5px] mb-3">
                  {project.title}
                </h2>
                <p className="text-neutral-500 leading-[128%] max-w-2xl">
                  {project.description}
                </p>
                <div className="flex flex-wrap gap-2 mt-5">
                  {project.deliverables.map((item) => (
                    <DeliverablePill key={item.num} num={item.num} label={item.label} size="sm" />
                  ))}
                </div>

                <div className="flex flex-col gap-3 mt-8">
                  <div className="flex gap-3 h-80">
                    <div className="relative w-[60%] rounded-xl bg-neutral-100 border border-neutral-200 overflow-hidden">
                      <Image src="/launch-assets/honeyb-spotlight/honeyb-image1.png" alt="" fill className="object-cover" />
                    </div>
                    <div className="relative w-[40%] rounded-xl bg-neutral-100 border border-neutral-200 overflow-hidden">
                      <Image src="/launch-assets/honeyb-spotlight/honeyb-image2.png" alt="" fill className="object-cover" />
                    </div>
                  </div>
                  <div className="relative aspect-[21/9] rounded-xl bg-neutral-100 border border-neutral-200 overflow-hidden">
                    <Image src="/launch-assets/honeyb-spotlight/honeyb-image3.jpg" alt="" fill className="object-cover" />
                  </div>
                </div>
              </div>

              {[
                { num: "01", title: "Brand\nIdentity", description: "Placeholder — describe what was delivered for the brand identity." },
                { num: "02", title: "Website", description: "Placeholder — describe what was delivered for the website." },
                { num: "03", title: "Pitch\nDeck", description: "Placeholder — describe what was delivered for the pitch deck." },
              ].map((item, i) => (
                <div key={item.num} className={i > 0 ? "pt-10 border-t border-neutral-200" : ""}>
                  <span className="text-4xl font-medium text-neutral-300 block mb-2">{item.num}</span>
                  <h3 className="font-medium text-black whitespace-pre-line text-2xl leading-[110%] tracking-[-0.5px]">
                    {item.title}
                  </h3>
                  <p className="text-neutral-500 leading-relaxed mt-3 max-w-2xl">
                    {item.description}
                  </p>
                </div>
              ))}
            </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
}
