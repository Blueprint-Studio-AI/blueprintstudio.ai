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
          className="fixed inset-0 z-50 overflow-y-auto overscroll-contain bg-black/50 backdrop-blur-sm"
          onWheel={(e) => e.stopPropagation()}
          onTouchMove={(e) => e.stopPropagation()}
          onClick={onClose}
        >
          <div className="flex min-h-full items-center justify-center p-4">
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 20 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="relative w-full max-w-4xl bg-white rounded-2xl shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={onClose}
              className="absolute top-4 right-4 z-20 p-2 text-neutral-400 hover:text-neutral-600 rounded-full hover:bg-neutral-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="relative w-full aspect-[21/9] overflow-hidden rounded-t-2xl">
              <Image
                src={project.image}
                alt={project.name}
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              <div className="absolute bottom-6 left-8 flex items-center gap-3">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={project.logo}
                  alt=""
                  className="h-10 object-contain brightness-0 invert"
                />
              </div>
            </div>

            <div className="px-8 sm:px-10 py-8 sm:py-10 space-y-10">
              <div>
                <p className="text-neutral-400 text-xs uppercase tracking-wider mb-2">
                  Overview
                </p>
                <h2 className="text-2xl sm:text-3xl font-medium text-black tracking-[-0.5px] mb-3">
                  {project.title}
                </h2>
                <p className="text-neutral-500 leading-relaxed max-w-2xl">
                  {project.description}
                </p>
                <div className="flex flex-wrap gap-2 mt-5">
                  {project.deliverables.map((item) => (
                    <DeliverablePill key={item.num} num={item.num} label={item.label} />
                  ))}
                </div>
              </div>

              <div>
                <p className="text-neutral-400 text-xs uppercase tracking-wider mb-2">
                  The Challenge
                </p>
                <p className="text-neutral-500 leading-relaxed max-w-2xl">
                  Placeholder — describe the problem the client faced before
                  engaging Blueprint Studio.
                </p>
              </div>

              <div>
                <p className="text-neutral-400 text-xs uppercase tracking-wider mb-2">
                  The Solution
                </p>
                <p className="text-neutral-500 leading-relaxed max-w-2xl">
                  Placeholder — describe the approach, strategy, and execution
                  that Blueprint Studio delivered.
                </p>
              </div>

              <div>
                <p className="text-neutral-400 text-xs uppercase tracking-wider mb-4">
                  Deliverables
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {project.deliverables.map((item) => (
                    <div
                      key={item.num}
                      className="aspect-[4/3] rounded-xl bg-neutral-100 border border-neutral-200 flex items-center justify-center"
                    >
                      <span className="text-sm text-neutral-400">
                        {item.label} preview
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <p className="text-neutral-400 text-xs uppercase tracking-wider mb-4">
                  Results
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-6">
                  {[
                    { stat: "—", label: "Metric one" },
                    { stat: "—", label: "Metric two" },
                    { stat: "—", label: "Metric three" },
                  ].map((item) => (
                    <div key={item.label}>
                      <p className="text-3xl font-medium text-black tracking-tight">
                        {item.stat}
                      </p>
                      <p className="text-sm text-neutral-400 mt-1">
                        {item.label}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
}
