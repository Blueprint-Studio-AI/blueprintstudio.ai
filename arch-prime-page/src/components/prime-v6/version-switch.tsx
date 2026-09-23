"use client";

// Review tool, not part of the page: flip between the Prime page versions, and (on v6) between
// the two candidates for the account's mark. Desktop only.

import { useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { initNotes, setNotes, useNotes } from "./note";
import { setShape, useShape } from "./shape";

const VERSIONS = [
  { label: "v5", href: "/prime" },
  { label: "v6", href: "/prime-v6" },
  { label: "v7", href: "/prime-v7" },
  { label: "v8", href: "/prime-v8" },
  { label: "v9", href: "/prime-v9" },
  { label: "v10", href: "/prime-v10" },
  { label: "v11", href: "/prime-v11" },
];

export function VersionSwitch() {
  const path = usePathname();
  const shape = useShape();
  const notes = useNotes();
  const onV6 = path.startsWith("/prime-v6");
  const onV7 = path.startsWith("/prime-v7");
  const onV8 = path.startsWith("/prime-v8");
  const onV9 = path.startsWith("/prime-v9");
  const onV10 = path.startsWith("/prime-v10");
  const onV11 = path.startsWith("/prime-v11");
  const current = onV11 ? "/prime-v11" : onV10 ? "/prime-v10" : onV9 ? "/prime-v9" : onV8 ? "/prime-v8" : onV7 ? "/prime-v7" : onV6 ? "/prime-v6" : "/prime";
  useEffect(initNotes, []);

  const seg = (active: boolean) =>
    `rounded-full px-2.5 py-1 transition-colors ${active ? "bg-white text-[#16171a]" : "text-white/70 hover:text-white"}`;

  return (
    <div className="fixed bottom-5 left-5 z-[95] hidden items-center gap-2 rounded-full bg-[#16171a]/85 p-1 pl-3.5 text-[12px] leading-4 text-white shadow-[0_8px_24px_rgba(0,0,0,0.25)] backdrop-blur-md md:flex">
      <span className="text-white/50">Prime</span>
      <span className="flex items-center gap-0.5">
        {VERSIONS.map((v) => {
          const active = v.href === current;
          return (
            <Link key={v.href} href={v.href} aria-current={active ? "page" : undefined} className={seg(active)}>
              {v.label}
            </Link>
          );
        })}
      </span>
      {onV6 && (
        <>
          <span aria-hidden className="h-4 w-px bg-white/15" />
          <span className="text-white/50">Mark</span>
          <span className="flex items-center gap-0.5 pr-0.5">
            <button type="button" className={seg(shape === "arch")} onClick={() => setShape("arch")}>
              Arch
            </button>
            <button type="button" className={seg(shape === "circle")} onClick={() => setShape("circle")}>
              Circle
            </button>
          </span>
        </>
      )}
      {(onV6 || onV7 || onV8) && (
        <>
          <span aria-hidden className="h-4 w-px bg-white/15" />
          <button type="button" aria-pressed={notes} className={`${seg(notes)} mr-0.5`} onClick={() => setNotes(!notes)}>
            Notes
          </button>
        </>
      )}
    </div>
  );
}
