"use client";

import { useState, type ReactNode } from "react";
import { motion } from "framer-motion";
import { Check } from "lucide-react";

export interface IncludedListItem {
  title: string;
  /** A node, so a service page can mark a line as draft. */
  description: ReactNode;
  image: string;
  /** Names the client the preview is from. */
  caption: string;
  /** "contain" keeps the whole preview in the frame (e.g. a square phone shot). */
  fit?: "cover" | "contain";
}

// /brand's "What's included" list: checked items on the left, each opening
// its line on hover/focus, and a preview of the active one on the right.
// Shared with the service pages, which pass their own items.
export default function IncludedList({ items }: { items: IncludedListItem[] }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const active = items[activeIndex];

  return (
    // Content row, bracketed by construction lines. Content sits 48px in from
    // each line (matching the Process section), and the line gradient spans
    // the list from the first to the last item.
    <div className="relative custom:px-[48px] mt-12 sm:mt-16">
      <div
        className="absolute left-0 top-0 bottom-0 line-dash-y hidden custom:block mask-fade-y"
      />
      <div
        className="absolute right-0 top-0 bottom-0 line-dash-y hidden custom:block mask-fade-y"
      />

      <div className="flex flex-col lg:flex-row gap-12 lg:gap-16">
        {/* Left: deliverables list */}
        <ul className="lg:w-1/2 flex flex-col">
          {items.map((item, index) => {
            const isActive = index === activeIndex;
            return (
              <li
                key={item.title}
                tabIndex={0}
                onMouseEnter={() => setActiveIndex(index)}
                onFocus={() => setActiveIndex(index)}
                onClick={() => setActiveIndex(index)}
                className="relative cursor-default pl-6 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#1472F6]/40 rounded-lg"
              >
                {/* Black active bar — rounded ends, spans only the
                    checkmark + text height and sits in the gutter to the
                    left of the content (outside the divider line). */}
                <span
                  className="absolute left-0 top-5 bottom-5 w-1 rounded-full bg-black transition-opacity duration-300"
                  style={{ opacity: isActive ? 1 : 0 }}
                />

                <div
                  className={`flex items-start gap-3.5 py-5 ${
                    index > 0 ? "border-t border-neutral-200" : ""
                  }`}
                >
                  {/* Green check */}
                  <span className="mt-0.5 flex items-center justify-center w-5 h-5 shrink-0 rounded-full border-2 border-green-500 text-green-500">
                    <Check className="w-3 h-3" strokeWidth={3.5} />
                  </span>

                  <div>
                    <h3
                      className="font-medium text-black"
                      style={{
                        fontSize: "clamp(16px, 2.4vw, 20px)",
                        letterSpacing: "-0.4px",
                      }}
                    >
                      {item.title}
                    </h3>

                    {/* Sub copy reveal (grid-rows trick animates auto height) */}
                    <div
                      className="grid transition-[grid-template-rows] duration-300 ease-out"
                      style={{
                        gridTemplateRows: isActive ? "1fr" : "0fr",
                      }}
                    >
                      <div className="overflow-hidden">
                        <p
                          className="pt-1 text-sm text-neutral-500"
                          style={{ lineHeight: "130%" }}
                        >
                          {item.description}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>

        {/* Right: preview image for the active deliverable. The column
            stretches to the list height; the figure aligns to the top and
            sticks there, so it tracks the scroll instead of sitting
            permanently centered. All images are stacked and cross-faded so
            hovering the list swaps them with no flash (and they preload). */}
        <div className="lg:w-1/2">
          <figure className="w-full max-w-[520px] mx-auto lg:sticky lg:top-16">
            <div className="relative w-full aspect-[3/2] overflow-hidden border border-neutral-200 bg-neutral-50 shadow-sm">
              {items.map((item, index) => (
                <motion.img
                  key={item.title}
                  src={item.image}
                  alt={item.caption}
                  className={`absolute inset-0 h-full w-full ${item.fit === "contain" ? "object-contain" : "object-cover"}`}
                  initial={false}
                  animate={{ opacity: index === activeIndex ? 1 : 0 }}
                  transition={{ duration: 0.4, ease: "easeOut" }}
                  draggable={false}
                />
              ))}
            </div>
            <figcaption className="mt-4 text-center text-sm text-neutral-400 cursor-default">
              {active.caption}
            </figcaption>
          </figure>
        </div>
      </div>
    </div>
  );
}
