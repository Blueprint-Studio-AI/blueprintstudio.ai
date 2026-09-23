"use client";

import { useState, type ReactNode } from "react";
import Image from "next/image";
import { useInView } from "@/lib/use-in-view";

export type FaqEntry = { question: string; answer: ReactNode };

function FaqItem({ entry, inView, index }: { entry: FaqEntry; inView: boolean; index: number }) {
  const [open, setOpen] = useState(false);
  const delay = index * 0.1;
  return (
    <div
      className="border-b border-black/10"
      style={{
        opacity: inView ? 1 : 0,
        transform: inView ? "none" : "translateY(24px)",
        transition: `opacity 0.7s cubic-bezier(0.16,1,0.3,1) ${delay}s, transform 0.7s cubic-bezier(0.16,1,0.3,1) ${delay}s`,
      }}
    >
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex w-full cursor-pointer items-center justify-between py-8 text-left"
        aria-expanded={open}
      >
        <h3 className="text-[20px] font-normal leading-[120%]">{entry.question}</h3>
        <Image
          src="/img/plus.svg"
          alt=""
          width={20}
          height={20}
          aria-hidden
          className="ml-6 shrink-0 transition-transform duration-300"
          style={{ transform: open ? "rotate(45deg)" : "none" }}
        />
      </button>
      <div
        className="grid transition-[grid-template-rows] duration-400 ease-out"
        style={{ gridTemplateRows: open ? "1fr" : "0fr" }}
      >
        <div className="overflow-hidden">
          <div className="space-y-4 pb-8 text-[14px] leading-[150%] text-black/80 sm:text-[16px] [&_a]:text-dark-purple [&_a]:underline [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:space-y-1">
            {entry.answer}
          </div>
        </div>
      </div>
    </div>
  );
}

export function Faq({ items }: { items: FaqEntry[] }) {
  const { ref, inView } = useInView<HTMLDivElement>("0px 0px -10% 0px");
  return (
    <div ref={ref}>
      {items.map((entry, i) => (
        <FaqItem key={i} entry={entry} inView={inView} index={i} />
      ))}
    </div>
  );
}
