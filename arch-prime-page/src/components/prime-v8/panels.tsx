"use client";

// The app's own panels, simplified: Lend, Borrow, Trade and the vaults, one at a time inside the
// climb. Each is a small working piece of the real thing (public/img/prime/v6/screen-*.png), not
// a picture of it: the token pill toggles, the loan meter drags, the pair flips, the vault tabs
// switch. Nothing here shows a figure except the meter's two limits; every value the app can't
// show yet is its own placeholder, "[ --- ]". Every panel ends in the page's one action.
// Desktop panels share one fixed 440×560 frame so nothing jumps when they swap; `fluid` lets a
// panel take the column's width and its own height (phones). Reduced motion: instant everything.

import { useId, useLayoutEffect, useRef, useState, useSyncExternalStore, type ChangeEvent, type KeyboardEvent, type ReactNode } from "react";
import { flushSync } from "react-dom";
import { Mark, type MarkKind } from "@/components/prime-marks";
import { EARLY_HREF } from "@/data/prime-v6";

export type LoanCopy = {
  max: number;
  liq: number;
  maxLabel: string;
  liqLabel: string;
  price: string;
  holds: string;
  falls: string;
  chip: { room: string; limit: string; past: string };
};

export type VaultItem = {
  id: "primeBTC" | "primeUSD";
  kind: string;
  line: string;
  facts: readonly { label: string; value: string }[];
  caution: string;
};

const INK = "#292a2e";
const GREEN = "#00a032";
const VAULT_UNDERLINE: Record<VaultItem["id"], string> = { primeBTC: "#EF8E16", primeUSD: "#1F5543" };
const DASH = "[ --- ]";
const SWAP_EASE = "cubic-bezier(.65,0,.35,1)";
const TOKENS = [
  { kind: "btc", name: "aBTC" },
  { kind: "usd", name: "aUSD" },
] as const satisfies readonly { kind: MarkKind; name: string }[];

const FOCUS = "outline-none focus-visible:ring-2 focus-visible:ring-[#ff5e00]";

// Range-input internals and the reduced-motion switch can't be written as utilities. React 19
// hoists this into <head> once, however many panels render.
const CSS = `
.v8p-range{-webkit-appearance:none;appearance:none;background:transparent;margin:0;padding:0;cursor:grab;outline:none;touch-action:pan-y}
.v8p-range:active{cursor:grabbing}
.v8p-range::-webkit-slider-runnable-track{height:44px;background:transparent;border:0}
.v8p-range::-moz-range-track{height:44px;background:transparent;border:0}
.v8p-range::-moz-range-progress{background:transparent}
.v8p-range::-webkit-slider-thumb{-webkit-appearance:none;appearance:none;box-sizing:border-box;width:14px;height:40px;margin-top:2px;border-radius:6px;background:#fff;border:1px solid rgba(41,42,46,.15);box-shadow:0 2px 8px rgba(0,0,0,.18)}
.v8p-range::-moz-range-thumb{box-sizing:border-box;width:14px;height:40px;border-radius:6px;background:#fff;border:1px solid rgba(41,42,46,.15);box-shadow:0 2px 8px rgba(0,0,0,.18)}
.v8p-range:focus-visible::-webkit-slider-thumb{box-shadow:0 0 0 2px #fff,0 0 0 4px #ff5e00}
.v8p-range:focus-visible::-moz-range-thumb{box-shadow:0 0 0 2px #fff,0 0 0 4px #ff5e00}
@media (prefers-reduced-motion: reduce){.v8p,.v8p *{transition-duration:0ms!important;transition-delay:0ms!important;animation-duration:0ms!important}}
`;

const REDUCED = "(prefers-reduced-motion: reduce)";
const subscribeReduced = (cb: () => void) => {
  const mq = window.matchMedia(REDUCED);
  mq.addEventListener("change", cb);
  return () => mq.removeEventListener("change", cb);
};
function useReducedMotion() {
  return useSyncExternalStore(subscribeReduced, () => window.matchMedia(REDUCED).matches, () => false);
}

/* ─── shared pieces ─────────────────────────────────────────────────────────────────────── */

function PanelShell({ label, fluid, children }: { label: string; fluid?: boolean; children: ReactNode }) {
  return (
    <div
      role="group"
      aria-label={label}
      data-panel={label}
      className={`v8p flex flex-col rounded-[24px] bg-white p-7 text-[#292a2e] shadow-[0_30px_80px_rgba(0,0,0,.35)] ${fluid ? "w-full max-w-[440px]" : "h-[560px] w-[440px] shrink-0"}`}
    >
      <style href="prime-v8-panels" precedence="default">
        {CSS}
      </style>
      {children}
    </div>
  );
}

// The panel's one button: pinned to the bottom of the fixed frame, 24px under the content when fluid.
function PanelCta({ cta }: { cta: string }) {
  return (
    <>
      <div aria-hidden className="min-h-6 grow" />
      <a
        href={EARLY_HREF}
        className={`flex h-[52px] shrink-0 items-center justify-center rounded-[14px] bg-[#222] text-[17px] font-medium text-white transition-colors duration-200 hover:bg-black focus-visible:ring-offset-2 ${FOCUS}`}
      >
        {cta}
      </a>
    </>
  );
}

type TabItem = { key: string; label: ReactNode; disabled?: boolean };

// Tabs over a 3px track; the active underline slides. `cols` is the grid template: equal columns
// for the app's own tabs, `auto` for a tab that carries a tag. The underline sits in column 1 and
// moves by whole column widths, so the columns it visits must be equal.
function Tabs({ idBase, label, items, active, onSelect, color, cols }: { idBase: string; label: string; items: readonly TabItem[]; active: number; onSelect: (i: number) => void; color: string; cols?: string }) {
  const refs = useRef<(HTMLButtonElement | null)[]>([]);
  const enabled = items.flatMap((t, i) => (t.disabled ? [] : [i]));
  const onKey = (e: KeyboardEvent<HTMLButtonElement>) => {
    const at = enabled.indexOf(active);
    let next = -1;
    if (e.key === "ArrowRight") next = enabled[(at + 1) % enabled.length];
    else if (e.key === "ArrowLeft") next = enabled[(at - 1 + enabled.length) % enabled.length];
    else if (e.key === "Home") next = enabled[0];
    else if (e.key === "End") next = enabled[enabled.length - 1];
    if (next < 0) return;
    e.preventDefault();
    onSelect(next);
    refs.current[next]?.focus();
  };
  return (
    <div role="tablist" aria-label={label} className="grid shrink-0" style={{ gridTemplateColumns: cols ?? `repeat(${items.length}, minmax(0, 1fr))` }}>
      {items.map((t, i) => {
        const on = i === active;
        return (
          <button
            key={t.key}
            ref={(n) => {
              refs.current[i] = n;
            }}
            id={`${idBase}-tab-${i}`}
            type="button"
            role="tab"
            aria-selected={on}
            aria-disabled={t.disabled || undefined}
            tabIndex={on ? 0 : -1}
            onKeyDown={onKey}
            onClick={() => {
              if (!t.disabled) onSelect(i);
            }}
            className={`flex h-10 items-center justify-center gap-1.5 rounded-[8px] px-2 text-[16px] font-medium whitespace-nowrap transition-colors duration-200 ${FOCUS} ${
              t.disabled ? "cursor-not-allowed text-[#b6b6b6]" : on ? "text-[#292a2e]" : "cursor-pointer text-[#8a8a8a] hover:text-[#4d4d4d]"
            }`}
            style={{ gridRow: 1, gridColumn: i + 1 }}
          >
            {t.label}
          </button>
        );
      })}
      <div aria-hidden className="h-[3px] bg-[#d9d9d9]" style={{ gridRow: 2, gridColumn: "1 / -1" }} />
      <div
        aria-hidden
        className="h-[3px] transition-[transform,background-color] duration-[250ms] ease-[cubic-bezier(.22,1,.36,1)]"
        style={{ gridRow: 2, gridColumn: 1, background: color, transform: `translateX(${active * 100}%)` }}
      />
    </div>
  );
}

function Box({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="rounded-[18px] bg-[#f4f4f4] p-[18px]">
      <div className="text-[14px] leading-5 text-[#8a8a8a]">{label}</div>
      <div className="mt-2 flex justify-end">{children}</div>
    </div>
  );
}

// Borrow's boxes, folded to one 56px row each so the meter fits the frame.
function CompactBox({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="flex h-14 shrink-0 items-center justify-between gap-3 rounded-[18px] bg-[#f4f4f4] pr-1.5 pl-[18px]">
      <span className="text-[14px] leading-5 text-[#8a8a8a]">{label}</span>
      {children}
    </div>
  );
}

const PILL = "inline-flex h-11 items-center gap-2.5 rounded-full bg-white pr-4 pl-2.5 text-[17px] leading-none whitespace-nowrap";

function Pill({ kind, name }: { kind: MarkKind; name: string }) {
  return (
    <span className={`${PILL} shrink-0`}>
      <Mark kind={kind} size={24} />
      {name}
    </span>
  );
}

function Rows({ labels }: { labels: readonly string[] }) {
  return (
    <dl className="px-4">
      {labels.map((l) => (
        <div key={l} className="flex h-9 items-center justify-between gap-4">
          <dt className="text-[15px] text-[#787878]">{l}</dt>
          <dd className="text-[15px] whitespace-nowrap">{DASH}</dd>
        </div>
      ))}
    </dl>
  );
}

/* ─── 1. Lend ───────────────────────────────────────────────────────────────────────────── */

// Lend's token pill: tap to switch aBTC ⇄ aUSD. Both faces are stacked in one grid cell and
// crossfade; the pill's width is written straight to the DOM from the active face's own width,
// so it eases from one to the other.
function TokenToggle() {
  const [at, setAt] = useState(0);
  const btn = useRef<HTMLButtonElement>(null);
  const faces = useRef<(HTMLSpanElement | null)[]>([]);
  useLayoutEffect(() => {
    const b = btn.current;
    const f = faces.current[at];
    if (b && f) b.style.width = `${f.offsetWidth}px`;
  }, [at]);
  const next = TOKENS[1 - at];
  return (
    <button
      ref={btn}
      type="button"
      onClick={() => setAt(1 - at)}
      aria-label={`${TOKENS[at].name}. Switch to ${next.name}`}
      className={`grid h-11 shrink-0 cursor-pointer justify-items-start overflow-hidden rounded-full bg-white transition-[width,box-shadow] duration-200 ease-[cubic-bezier(.22,1,.36,1)] hover:shadow-[0_0_0_1px_rgba(41,42,46,.14)] focus-visible:ring-offset-2 focus-visible:ring-offset-[#f4f4f4] ${FOCUS}`}
    >
      {TOKENS.map((t, i) => (
        <span
          key={t.name}
          ref={(n) => {
            faces.current[i] = n;
          }}
          aria-hidden
          className={`${PILL} col-start-1 row-start-1 transition-opacity duration-200`}
          style={{ opacity: i === at ? 1 : 0 }}
        >
          <Mark kind={t.kind} size={24} />
          {t.name}
        </span>
      ))}
    </button>
  );
}

export function LendPanel({ cta, fluid }: { cta: string; fluid?: boolean }) {
  const id = useId();
  const [tab, setTab] = useState(0);
  return (
    <PanelShell label="Lend" fluid={fluid}>
      <Tabs
        idBase={id}
        label="Lend"
        items={[
          { key: "lend", label: "Lend" },
          { key: "withdraw", label: "Withdraw" },
        ]}
        active={tab}
        onSelect={setTab}
        color={GREEN}
      />
      <div className="mt-5">
        <Box label="Amount">
          <TokenToggle />
        </Box>
      </div>
      <div className="mt-4">
        <Rows labels={["Interest you earn", "Network fee"]} />
      </div>
      <PanelCta cta={cta} />
    </PanelShell>
  );
}

/* ─── 2. Borrow ─────────────────────────────────────────────────────────────────────────── */

// The meter: 20 segments of 5%. Green up to the most you can borrow, orange up to the point where
// some Bitcoin can be taken, red past it (hatched when empty). The slider stops physically at the
// first limit; "Falls" shows the same loan against Bitcoin worth less (the loan over 0.85, never
// shown), which is how a loan crosses the second.
const SEGS = 20;
const HATCH = "repeating-linear-gradient(135deg,#e2e2e2 0 3px,#f6f6f6 3px 6px)";
const FALL = 0.85;
const gapAt = (k: number) => `calc(${k} * (100% + 3px) / ${SEGS} - 1.5px)`; // the gap after segment k

function loanWords(v: number, max: number) {
  if (v >= max) return "The most you can borrow";
  if (v >= max / 2) return "A mid-size loan";
  return "A small loan";
}

export function BorrowPanel({ cta, loan, fluid }: { cta: string; loan: LoanCopy; fluid?: boolean }) {
  const id = useId();
  const reduced = useReducedMotion();
  const [tab, setTab] = useState(0);
  const [amount, setAmount] = useState(50);
  const [falls, setFalls] = useState(false);
  const knock = useRef<HTMLDivElement>(null);

  const kMax = Math.round(loan.max / 5);
  const kLiq = Math.round(loan.liq / 5);
  const f = falls ? Math.min(100, amount / FALL) : amount;
  const n = Math.round(f / 5);

  // remember where the fill came from, so the recolour ripples outward from there
  const [trail, setTrail] = useState({ n, from: n });
  if (trail.n !== n) setTrail({ n, from: trail.n });
  const delay = (i: number) => {
    if (reduced) return 0;
    if (trail.n > trail.from && i > trail.from && i <= trail.n) return (i - trail.from - 1) * 25;
    if (trail.n < trail.from && i > trail.n && i <= trail.from) return (trail.from - i) * 25;
    return 0;
  };

  const onRange = (e: ChangeEvent<HTMLInputElement>) => {
    const v = e.currentTarget.valueAsNumber;
    // the knock: arriving at the stop, the next segment flinches
    if (v >= loan.max && amount < loan.max && !reduced && typeof knock.current?.animate === "function") {
      knock.current.animate([{ opacity: 0 }, { opacity: 0.6 }, { opacity: 0 }], { duration: 180, easing: "ease-out" });
    }
    setAmount(v);
  };

  const past = f > loan.liq;
  const chip = past
    ? { text: loan.chip.past, bg: "#fde7e3", fg: "#b3261e" }
    : f >= loan.max - 5
      ? { text: loan.chip.limit, bg: "#fff0e5", fg: "#b04a00" }
      : { text: loan.chip.room, bg: "#e6f4ea", fg: "#1b7a3e" };

  return (
    <PanelShell label="Borrow" fluid={fluid}>
      <Tabs
        idBase={id}
        label="Borrow"
        items={[
          { key: "borrow", label: "Borrow" },
          { key: "repay", label: "Repay" },
          { key: "withdraw", label: "Withdraw" },
        ]}
        active={tab}
        onSelect={setTab}
        color={GREEN}
      />

      <div className="mt-3">
        <CompactBox label="Put up">
          <Pill kind="btc" name="aBTC" />
        </CompactBox>
      </div>
      <div className="mt-2">
        <CompactBox label="Borrow">
          <Pill kind="usd" name="aUSD" />
        </CompactBox>
      </div>

      {/* the two limits, over the gaps they sit at */}
      <div aria-hidden className="relative mt-4 h-[22px] shrink-0">
        {[
          { k: kMax, label: `${loan.max}%` },
          { k: kLiq, label: `${loan.liq}%` },
        ].map((t) => (
          <div key={t.k} className="absolute bottom-0 flex -translate-x-1/2 flex-col items-center" style={{ left: gapAt(t.k) }}>
            <span className="text-[12px] leading-[14px] font-medium">{t.label}</span>
            <span className="h-2 w-px" style={{ background: "rgba(41,42,46,.4)" }} />
          </div>
        ))}
      </div>

      <div className="relative mt-2 shrink-0">
        <div aria-hidden className="flex h-7 gap-[3px]">
          {Array.from({ length: SEGS }, (_, k) => {
            const i = k + 1;
            const fill = i <= kMax ? "#19a24a" : i <= kLiq ? "#ff8a3d" : "#d93d1f";
            return (
              <div key={i} className="relative min-w-0 flex-1 overflow-hidden rounded-[3px]" style={{ background: i <= kLiq ? "#e8e8e8" : HATCH }}>
                <div className="absolute inset-0" style={{ background: fill, opacity: i <= n ? 1 : 0, transition: `opacity 120ms linear ${delay(i)}ms` }} />
                {i === kMax + 1 && <div ref={knock} className="absolute inset-0 opacity-0" style={{ background: "#ff8a3d" }} />}
              </div>
            );
          })}
        </div>
        {/* the control: a native range laid over the meter, from its left edge to the first limit.
            It's a thumb-width wider (half each side) so the thumb's centre lands on the value. */}
        <input
          type="range"
          min={0}
          max={loan.max}
          step={5}
          defaultValue={50}
          onChange={onRange}
          aria-label="How much you borrow"
          aria-valuetext={loanWords(amount, loan.max)}
          className="v8p-range absolute"
          style={{ top: -8, height: 44, left: -7, width: `calc(${kMax} * (100% + 3px) / ${SEGS} - 1.5px + 14px)` }}
        />
      </div>

      <div className="mt-3 flex shrink-0">
        <span
          aria-live="polite"
          className="inline-flex h-7 items-center rounded-full px-3 text-[13px] font-medium transition-colors duration-200"
          style={{ background: chip.bg, color: chip.fg }}
        >
          {chip.text}
        </span>
      </div>

      <ul className="mt-2.5 shrink-0 text-[14px] leading-5">
        <li className="transition-opacity duration-200" style={{ opacity: past ? 0.45 : 1 }}>
          <span className="font-semibold">{loan.max}%</span> · {loan.maxLabel}
        </li>
        <li className="transition-opacity duration-200" style={{ opacity: past ? 1 : 0.45 }}>
          <span className="font-semibold">{loan.liq}%</span> · {loan.liqLabel}
        </li>
      </ul>

      <div className="mt-3 flex shrink-0 flex-wrap items-center justify-between gap-x-3 gap-y-2">
        <span id={`${id}-price`} className="text-[14px] leading-5 text-[#787878]">
          {loan.price}
        </span>
        <div role="radiogroup" aria-labelledby={`${id}-price`} className="flex rounded-full bg-[#f4f4f4] p-[3px]">
          {[
            { v: false, label: loan.holds },
            { v: true, label: loan.falls },
          ].map((o) => (
            <label key={o.label} className="relative cursor-pointer">
              <input type="radio" name={`${id}-price`} checked={falls === o.v} onChange={() => setFalls(o.v)} className="peer sr-only" />
              <span className="flex h-8 items-center rounded-full px-4 text-[14px] font-medium text-[#787878] transition-[background-color,color,box-shadow] duration-200 peer-checked:bg-white peer-checked:text-[#292a2e] peer-checked:shadow-[0_1px_3px_rgba(0,0,0,.14)] peer-focus-visible:ring-2 peer-focus-visible:ring-[#ff5e00]">
                {o.label}
              </span>
            </label>
          ))}
        </div>
      </div>

      <PanelCta cta={cta} />
    </PanelShell>
  );
}

/* ─── 3. Trade ──────────────────────────────────────────────────────────────────────────── */

function SwapIcon() {
  return (
    <svg viewBox="0 0 20 20" width="18" height="18" fill="none" stroke={INK} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M7 16V4M3.5 7.5L7 4l3.5 3.5" />
      <path d="M13 4v12M9.5 12.5L13 16l3.5-3.5" />
    </svg>
  );
}

export function TradePanel({ cta, fluid }: { cta: string; fluid?: boolean }) {
  const reduced = useReducedMotion();
  const [flipped, setFlipped] = useState(false);
  const [turns, setTurns] = useState(0);
  const payRef = useRef<HTMLSpanElement>(null);
  const getRef = useRef<HTMLSpanElement>(null);
  const busy = useRef(false);
  const pay = TOKENS[flipped ? 1 : 0];
  const get = TOKENS[flipped ? 0 : 1];

  // The pills cross over, each by the measured distance between their centres; then the pair
  // swaps and the transforms drop in the same frame.
  const swap = () => {
    if (busy.current) return;
    setTurns((t) => t + 1);
    const a = payRef.current;
    const b = getRef.current;
    if (reduced || !a || !b || typeof a.animate !== "function") {
      setFlipped((v) => !v);
      return;
    }
    const ra = a.getBoundingClientRect();
    const rb = b.getBoundingClientRect();
    const dx = rb.left + rb.width / 2 - (ra.left + ra.width / 2);
    const dy = rb.top + rb.height / 2 - (ra.top + ra.height / 2);
    const opts: KeyframeAnimationOptions = { duration: 350, easing: SWAP_EASE, fill: "forwards" };
    busy.current = true;
    const aa = a.animate([{ transform: "translate(0px, 0px)" }, { transform: `translate(${dx}px, ${dy}px)` }], opts);
    const bb = b.animate([{ transform: "translate(0px, 0px)" }, { transform: `translate(${-dx}px, ${-dy}px)` }], opts);
    Promise.all([aa.finished, bb.finished])
      .then(() => {
        flushSync(() => setFlipped((v) => !v));
        aa.cancel();
        bb.cancel();
      })
      .catch(() => {})
      .finally(() => {
        busy.current = false;
      });
  };

  return (
    <PanelShell label="Trade" fluid={fluid}>
      <div className="relative flex shrink-0 flex-col gap-2">
        <Box label="You pay">
          <span ref={payRef} className="relative z-20">
            <Pill kind={pay.kind} name={pay.name} />
          </span>
        </Box>
        <Box label="You get">
          <span ref={getRef} className="relative z-20">
            <Pill kind={get.kind} name={get.name} />
          </span>
        </Box>
        <button
          type="button"
          onClick={swap}
          aria-label="Swap what you pay and what you get"
          className={`absolute top-1/2 left-1/2 z-10 flex size-10 -translate-x-1/2 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full border border-[#e2e2e2] bg-white shadow-[0_0_0_4px_#fff] transition-colors duration-200 hover:bg-[#f7f7f7] ${FOCUS}`}
        >
          <span className="flex" style={{ transform: `rotate(${turns * 180}deg)`, transition: `transform 350ms ${SWAP_EASE}` }}>
            <SwapIcon />
          </span>
        </button>
      </div>
      {turns > 0 && (
        <span className="sr-only" aria-live="polite">
          {`You pay ${pay.name}. You get ${get.name}.`}
        </span>
      )}
      <div className="mt-4">
        <Rows labels={["Rate", "Network fee"]} />
      </div>
      <PanelCta cta={cta} />
    </PanelShell>
  );
}

/* ─── 4. Vaults ─────────────────────────────────────────────────────────────────────────── */

export function VaultPanel({
  cta,
  vaults,
  boostTab,
  planned,
  preview,
  onVault,
  fluid,
}: {
  cta: string;
  vaults: readonly VaultItem[];
  boostTab: string;
  planned: string;
  preview: string;
  onVault?: (id: "primeBTC" | "primeUSD") => void;
  fluid?: boolean;
}) {
  const id = useId();
  const reduced = useReducedMotion();
  const [active, setActive] = useState(0); // the tab, at once
  const [shown, setShown] = useState(0); // the content, after the fade out
  const box = useRef<HTMLDivElement>(null);

  const choose = (i: number) => {
    if (i === active || !vaults[i]) return;
    setActive(i);
    onVault?.(vaults[i].id);
    const el = box.current;
    if (!el || reduced || typeof el.animate !== "function") {
      setShown(i);
      return;
    }
    const from = getComputedStyle(el).opacity;
    el.getAnimations().forEach((a) => a.cancel());
    const out = el.animate([{ opacity: from }, { opacity: 0 }], { duration: 120, easing: "ease-in", fill: "forwards" });
    out.onfinish = () => {
      flushSync(() => setShown(i));
      el.animate([{ opacity: 0, transform: "translateY(6px)" }, { opacity: 1, transform: "translateY(0px)" }], { duration: 200, easing: "cubic-bezier(.22,1,.36,1)" });
      out.cancel();
    };
  };

  const v = vaults[shown] ?? vaults[0];
  const items: TabItem[] = [
    ...vaults.map((x) => ({ key: x.id, label: x.id })),
    {
      key: "boost",
      disabled: true,
      label: (
        <>
          {boostTab}
          <span className="rounded-full bg-[#f1f1f1] px-1.5 py-0.5 text-[11px] leading-[14px] font-medium text-[#9a9a9a]">{planned}</span>
        </>
      ),
    },
  ];

  return (
    <PanelShell label="Vaults" fluid={fluid}>
      <Tabs
        idBase={id}
        label="Vaults"
        items={items}
        active={active}
        onSelect={choose}
        color={VAULT_UNDERLINE[vaults[active]?.id ?? "primeBTC"]}
        cols={`repeat(${vaults.length}, minmax(0, 1fr)) auto`}
      />

      {v && (
        <div ref={box} role="tabpanel" aria-labelledby={`${id}-tab-${shown}`} className="mt-5 flex shrink-0 flex-col">
          <div className="flex items-center gap-3">
            <Mark kind={v.id} size={36} />
            <span className="text-[17px] font-medium">{v.kind}</span>
            <span className="ml-auto inline-flex h-6 items-center rounded-full bg-[#f4f4f4] px-2.5 text-[12px] font-medium text-[#787878]">{preview}</span>
          </div>
          <p className="mt-4 font-serif text-[20px] leading-7 tracking-[-0.01em] text-balance">{v.line}</p>
          <dl className="mt-4 border-b border-[#e6e6e6]">
            {v.facts.map((fact) => (
              <div key={fact.label} className="flex items-baseline justify-between gap-4 border-t border-[#e6e6e6] py-2.5">
                <dt className="shrink-0 text-[14px] leading-5 text-[#787878]">{fact.label}</dt>
                <dd className="text-right text-[15px] leading-5">{fact.value}</dd>
              </div>
            ))}
          </dl>
          <p className="mt-3 text-[13px] leading-5 text-[#787878]">{v.caution}</p>
        </div>
      )}

      <PanelCta cta={cta} />
    </PanelShell>
  );
}
