"use client";

// §2's diagram is the account's window itself — the object the hero closed into — now showing
// what it holds: three parts, as three bands. The cuts give each band the same area (for the
// arch, area above a cut at height f grows as f², so thirds sit at √⅓ and √⅔; for the circle,
// the chords that trisect a disc), so no proportion is implied. Each part is named outside the
// window on a hairline leader drawn from the window's own edge.

import { AccountWindow } from "./account-window";
import { RATIO, useShape, type Shape } from "./shape";
import { T } from "@/components/prime-ui";

type Part = { id: string; label: string; value: string; tone: string };

const CUTS = { arch: [0, 0.577, 0.816, 1], circle: [0, 0.3675, 0.6325, 1] } as const;

export function AccountDiagram({ parts, shape: forced }: { parts: readonly Part[]; shape?: Shape }) {
  const picked = useShape();
  const shape = forced ?? picked;
  const cuts = CUTS[shape];
  const bands = parts.map((p, i) => ({ ...p, top: cuts[i], bottom: cuts[i + 1], mid: (cuts[i] + cuts[i + 1]) / 2 }));
  // the window's right edge at a given height, as a fraction of its width
  const edge = (f: number) => (shape === "arch" ? 0.5 + 0.5 * f : 0.5 + Math.sqrt(Math.max(0, 0.25 - (f - 0.5) ** 2)));

  const fill = (
    <>
      {bands.map((b) => (
        <div key={b.id} className="absolute inset-x-0" style={{ top: `${b.top * 100}%`, height: `${(b.bottom - b.top) * 100}%`, background: b.tone }} />
      ))}
    </>
  );

  const W = 380;
  const H = W * RATIO[shape];
  const LABELS = W + 28;

  return (
    <>
      {/* desktop: the window, each band named on a leader */}
      <div className="relative hidden lg:block" style={{ height: H, minWidth: LABELS + 210 }}>
        <div className="absolute top-0 left-0">
          <AccountWindow shape={forced} width={`${W}px`} fill={bands[0].tone}>
            {fill}
          </AccountWindow>
        </div>
        {bands.map((b) => (
          <div key={b.id} className="absolute flex items-center" style={{ top: b.mid * H, left: edge(b.mid) * W, transform: "translateY(-50%)" }}>
            <span aria-hidden className="h-px bg-[#c9c9c9]" style={{ width: LABELS - edge(b.mid) * W }} />
            <span className="ml-3 flex flex-col">
              <span className="text-[15px] leading-5 font-medium whitespace-nowrap">{b.label}</span>
              <span className="text-[13px] leading-[18px] whitespace-nowrap text-[#6e6e6e]">{b.value}</span>
            </span>
          </div>
        ))}
      </div>

      {/* phone and tablet: the window, then the parts as a legend */}
      <div className="lg:hidden">
        <div className="flex justify-center">
          <AccountWindow shape={forced} width="min(260px, 64vw)" fill={bands[0].tone}>
            {fill}
          </AccountWindow>
        </div>
        <ul className="m-0 mt-8 list-none p-0">
          {bands.map((b) => (
            <li key={b.id} className="flex items-baseline gap-3 border-b border-black/[0.06] py-3 last:border-0">
              <span aria-hidden className="h-2.5 w-2.5 shrink-0 rounded-full" style={{ background: b.tone }} />
              <span className="flex flex-col">
                <span className="text-[16px] leading-6 font-medium">{b.label}</span>
                <span className={`${T.label} text-[#6e6e6e]`}>{b.value}</span>
              </span>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}
