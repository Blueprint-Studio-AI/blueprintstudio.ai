"use client";

// THE CLIMB — the dark tower, floor by floor, and the view at the top.
// Pinned mode (wide, tall enough, motion allowed): a sticky stage holds a lift panel (the rail),
// one app panel in a fixed frame and "your account" under it; the floor articles scroll past on
// the right. One scroll reader decides the floor: the panel changes (the old one leaves upward,
// the new one rises), the account fills with that floor's jobs, the tower gets a shade lighter,
// the rail's fill climbs. After the last floor the penthouse opens out of the very frame the
// reader has been using — the window just grows; the image never scales — and the closing words
// arrive on it. No snapping, no scroll lock.
// Stacked mode (phones, short screens, reduced motion): the same floors as plain articles, each
// with its panel inline, a sticky "02 of 04 · Borrow" readout, and the tower shading by gradient.
// Both markups render; CSS (prime-v8.css) shows the one that applies, so nothing jumps.

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { PIN_QUERY } from "@/components/prime-v6/window-stage";
import { EARLY_HREF } from "@/data/prime-v6";
import type { Part, Split } from "@/data/prime-v8";
import { BorrowPanel, LendPanel, TradePanel, VaultPanel, type LoanCopy, type VaultItem } from "./panels";
import { FLOOR, LEAD, goToFloor } from "./lobby";

export type Floor = { id: string; n: string; rail: string; tag: string | null; title: string; body: string; rules?: string; hint: string; acct: Split };
type AccountCopy = { label: string; parts: Record<Part, string>; caption: string };
type ViewCopyText = { h2: string; body: string };
type Lenis = { scrollTo: (t: number, o?: object) => void };

// the tower gets a shade lighter each floor (index = active + 1)
const SHADE = ["#0a1226", "#0a1226", "#0e1a36", "#122245", "#172b56"];
const PART_COLOR: Record<Exclude<Part, "vault">, string> = { avail: "rgba(255,255,255,0.35)", lent: "#00a032", loan: "#2f97ee" };
const VAULT_COLOR: Record<VaultItem["id"], string> = { primeBTC: "#EF8E16", primeUSD: "#2e714b" };
const EMPTY: Split = { avail: 100, lent: 0, loan: 0, vault: 0 };
const PARTS: Part[] = ["avail", "lent", "loan", "vault"];
const TOP_SPACER = 150; // svh after the last floor: the reveal and its hold

const clamp = (x: number) => Math.max(0, Math.min(1, x));
const ease = (x: number) => (x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2);

const subscribePin = (cb: () => void) => {
  const mq = window.matchMedia(PIN_QUERY);
  mq.addEventListener("change", cb);
  return () => mq.removeEventListener("change", cb);
};

function AccountStrip({ split, vault, copy, compact = false }: { split: Split; vault: VaultItem["id"]; copy: AccountCopy; compact?: boolean }) {
  const color = (p: Part) => (p === "vault" ? VAULT_COLOR[vault] : PART_COLOR[p]);
  return (
    <div className={compact ? "" : "w-full"}>
      {!compact && <p className="text-[13px] leading-5 text-white/50">{copy.label}</p>}
      <div className={`flex gap-[2px] overflow-hidden rounded-[3px] ${compact ? "h-1 w-[72px]" : "mt-2 h-1.5 w-full"}`}>
        {PARTS.map((p) => (
          <span
            key={p}
            className="h-full transition-[flex-grow,background-color] duration-[600ms] ease-[cubic-bezier(.22,1,.36,1)] motion-reduce:transition-none"
            style={{ flexGrow: split[p], flexBasis: 0, background: color(p) }}
          />
        ))}
      </div>
      {!compact && (
        <>
          <ul className="m-0 mt-3 flex list-none flex-wrap gap-x-4 gap-y-1 p-0">
            {PARTS.filter((p) => split[p] > 0).map((p) => (
              <li key={p} className="flex items-center gap-2 text-[13px] leading-5 text-white/70">
                <span aria-hidden className="h-2 w-2 rounded-full" style={{ background: color(p) }} />
                {copy.parts[p]}
              </li>
            ))}
          </ul>
          <p className="mt-2.5 text-[12px] leading-4 text-white/40">{copy.caption}</p>
        </>
      )}
    </div>
  );
}

export function ViewCopy({ copy, cta, note, className = "" }: { copy: ViewCopyText; cta: string; note: string; className?: string }) {
  return (
    <div className={`max-w-[520px] text-white ${className}`}>
      <h2 className="v8-vc text-[40px] leading-[44px] font-medium tracking-[-0.03em] text-balance sm:text-[56px] sm:leading-[60px]">{copy.h2}</h2>
      <p className="v8-vc mt-5 text-[18px] leading-7 text-white/80">{copy.body}</p>
      <div className="v8-vc mt-8">
        <a href={EARLY_HREF} className="inline-flex h-14 min-w-[280px] items-center justify-center rounded-[10px] bg-[var(--p-orange)] px-8 text-[17px] font-medium tracking-[-0.01em] text-white transition-[filter,transform] hover:brightness-[1.06] active:scale-[0.98]">
          {cta}
        </a>
      </div>
      <p className="v8-vc mt-4 text-[14px] leading-5 text-white/65">{note}</p>
    </div>
  );
}

export function Climb({
  floors,
  account,
  loan,
  vaults,
  boostTab,
  planned,
  preview,
  railTop,
  of,
  view,
  cta,
  note,
}: {
  floors: readonly Floor[];
  account: AccountCopy;
  loan: LoanCopy;
  vaults: readonly VaultItem[];
  boostTab: string;
  planned: string;
  preview: string;
  railTop: string;
  of: string;
  view: ViewCopyText;
  cta: string;
  note: string;
}) {
  const pinned = useSyncExternalStore(subscribePin, () => window.matchMedia(PIN_QUERY).matches, () => false);
  const [active, setActive] = useState(-1);
  const [atTop, setAtTop] = useState(false);
  const [arrived, setArrived] = useState(false);
  const [stackActive, setStackActive] = useState(-1);
  const [vault, setVault] = useState<VaultItem["id"]>("primeBTC");

  const section = useRef<HTMLElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const frame = useRef<HTMLDivElement>(null);
  const clip = useRef<HTMLDivElement>(null);
  const img = useRef<HTMLImageElement>(null);

  // pinned: one scroll reader
  useEffect(() => {
    const sec = section.current;
    const st = stage.current;
    const fr = frame.current;
    const cl = clip.current;
    const im = img.current;
    if (!pinned || !sec || !st || !fr || !cl || !im) return;
    let raf = 0;
    let lastActive = -2;
    let lastTop = false;
    let lastArrived = false;
    const draw = () => {
      raf = 0;
      const vh = st.clientHeight;
      const vw = st.clientWidth;
      const U = vh / 100;
      const s = -sec.getBoundingClientRect().top / U;
      const a = s < 0 ? -1 : Math.min(floors.length - 1, Math.floor(s / FLOOR));
      if (a !== lastActive) {
        lastActive = a;
        setActive(a);
      }
      const p = clamp((s - FLOOR * floors.length) / 100);
      sec.style.setProperty("--p", p.toFixed(4));
      const top = p > 0;
      if (top !== lastTop) {
        lastTop = top;
        setAtTop(top);
      }
      // the view opens out of the panel's frame
      const sr = st.getBoundingClientRect();
      const r = fr.getBoundingClientRect();
      const t = r.top - sr.top;
      const l = r.left - sr.left;
      const e = ease(clamp((p - 0.05) / 0.65));
      cl.style.clipPath = `inset(${t * (1 - e)}px ${(vw - (r.right - sr.left)) * (1 - e)}px ${(vh - (r.bottom - sr.top)) * (1 - e)}px ${l * (1 - e)}px round ${24 * (1 - e)}px)`;
      cl.style.opacity = String(Math.min(1, p * 10));
      im.style.transform = `translate3d(${((l + r.width / 2 - 0.52 * vw) * (1 - e)).toFixed(1)}px, 0, 0)`;
      const arr = p >= 0.72 ? true : p < 0.6 ? false : lastArrived;
      if (arr !== lastArrived) {
        lastArrived = arr;
        setArrived(arr);
      }
      // short screens: the panel column scales to fit
      st.style.setProperty("--fs", String(Math.min(1, (window.innerHeight - 220) / 560)));
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(draw);
    };
    draw();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [pinned, floors.length]);

  // stacked: which article is in the middle of the screen, for the readout
  useEffect(() => {
    if (pinned) return;
    const els = floors.map((f) => document.getElementById(`floor-${f.id}`)).filter((e): e is HTMLElement => e !== null);
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((en) => {
          if (en.isIntersecting) setStackActive(els.indexOf(en.target as HTMLElement));
        });
      },
      { rootMargin: "-45% 0px -55% 0px" },
    );
    els.forEach((e) => io.observe(e));
    return () => io.disconnect();
  }, [pinned, floors]);

  const shown = Math.max(0, active);
  const split = active < 0 ? EMPTY : floors[active].acct;
  const panelFor = (i: number, fluid: boolean) => {
    const id = floors[i].id;
    if (id === "earn") return <LendPanel cta={cta} fluid={fluid} />;
    if (id === "borrow") return <BorrowPanel cta={cta} loan={loan} fluid={fluid} />;
    if (id === "trade") return <TradePanel cta={cta} fluid={fluid} />;
    return <VaultPanel cta={cta} vaults={vaults} boostTab={boostTab} planned={planned} preview={preview} onVault={setVault} fluid={fluid} />;
  };
  const railStop = atTop ? floors.length : shown; // 0 = the first floor, floors.length = Top
  const goTop = () => {
    const sec = section.current;
    if (!sec) return;
    const y = sec.getBoundingClientRect().top + window.scrollY + (FLOOR * floors.length + 90) * (window.innerHeight / 100);
    const lenis = (window as Window & { __lenis?: Lenis }).__lenis;
    if (lenis) lenis.scrollTo(y, { duration: 1.2 });
    else window.scrollTo({ top: y, behavior: "smooth" });
  };

  return (
    <section ref={section} id="climb" data-nav-theme="dark" className="v8-climb relative text-white" style={{ ["--p" as string]: 0 }}>
      {/* ——— pinned: the stage ——— */}
      <div ref={stage} className="v8-stage sticky top-0 h-svh overflow-hidden transition-[background-color] duration-[600ms]" style={{ backgroundColor: SHADE[active + 1] }}>
        <div className="site-container relative grid h-full grid-cols-12 items-center gap-x-8">
          {/* the lift panel */}
          <nav aria-label="Floors" className="v8-rail col-span-2 hidden self-center lg:block">
            <ol className="relative m-0 flex list-none flex-col-reverse gap-[22px] p-0 pl-4">
              <span aria-hidden className="absolute top-2 bottom-2 left-0 w-px bg-white/15" />
              <span
                aria-hidden
                className="absolute bottom-2 left-0 w-px origin-bottom bg-white/80 transition-transform duration-[400ms] ease-[cubic-bezier(.22,1,.36,1)]"
                style={{ top: 8, transform: `scaleY(${railStop / floors.length})` }}
              />
              {[...floors.map((f, i) => ({ key: f.id, label: `${f.n} ${f.rail}`, i })), { key: "top", label: railTop, i: floors.length }].map((st) => {
                const on = st.i === railStop;
                return (
                  <li key={st.key}>
                    <a
                      href={st.key === "top" ? "#view-stage" : `#floor-${st.key}`}
                      aria-current={on ? "step" : undefined}
                      onClick={(e) => {
                        e.preventDefault();
                        if (st.key === "top") goTop();
                        else goToFloor(st.key);
                      }}
                      className={`block text-[13px] leading-4 whitespace-nowrap tabular-nums transition-colors duration-300 ${on ? "text-white" : "text-white/40 hover:text-white/70"}`}
                    >
                      {st.label}
                    </a>
                  </li>
                );
              })}
            </ol>
          </nav>

          {/* the panel, and your account under it */}
          <div className="v8-panelcol col-span-12 flex flex-col items-center lg:col-span-5 lg:col-start-3">
            <div className="origin-top" style={{ transform: "scale(var(--fs, 1))" }}>
              <div ref={frame} className="relative h-[560px] w-[440px] -translate-y-5">
                {floors.map((f, i) => {
                  const pos = i === shown ? "active" : i < shown ? "above" : "below";
                  return (
                    <div key={f.id} data-pos={pos} inert={pos !== "active"} className="v8-panel absolute inset-0">
                      {panelFor(i, false)}
                    </div>
                  );
                })}
              </div>
              <div className="mt-4 w-[440px] -translate-y-5">
                <AccountStrip split={split} vault={vault} copy={account} />
              </div>
            </div>
          </div>
        </div>

        {/* the view at the top: opens out of the panel's frame */}
        <div id="view-stage" ref={clip} className="pointer-events-none absolute inset-0 z-20 opacity-0" style={{ clipPath: "inset(50% 50% 50% 50%)" }}>
          {/* a plain img: one transformed layer */}
          <img ref={img} src="/img/prime/v8/penthouse.webp" alt="" className="absolute inset-0 h-full w-full object-cover" style={{ objectPosition: "52% 40%" }} />
          <div aria-hidden className={`absolute inset-0 transition-opacity duration-500 ${arrived ? "opacity-100" : "opacity-0"}`}>
            <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(8,18,40,0.8)_0%,rgba(8,18,40,0.55)_35%,rgba(8,18,40,0)_62%)]" />
            <div className="absolute inset-0 bg-[linear-gradient(to_top,rgba(8,18,40,0.5),transparent_40%)]" />
          </div>
          <div data-arrived={arrived ? "1" : "0"} className={`site-container absolute inset-x-0 bottom-[12vh] ${arrived ? "pointer-events-auto" : ""}`}>
            <ViewCopy copy={view} cta={cta} note={note} />
          </div>
        </div>
      </div>

      {/* ——— the floors: scroll past the stage when pinned; plain articles when stacked ——— */}
      <div className="v8-steps relative z-10">
        {/* stacked: a sticky readout */}
        <div className={`v8-readout sticky top-20 z-20 transition-opacity duration-300 ${stackActive >= 0 ? "opacity-100" : "opacity-0"}`}>
          <div className="flex h-11 items-center justify-between border-b border-white/10 bg-[rgba(10,18,38,0.94)] px-4">
            <span className="text-[14px] leading-5 tabular-nums">
              <span key={stackActive} className="v8-roll inline-block">
                {floors[Math.max(0, stackActive)].n}
              </span>{" "}
              {of} {floors[floors.length - 1].n} · {floors[Math.max(0, stackActive)].rail}
            </span>
            <AccountStrip split={stackActive < 0 ? EMPTY : floors[stackActive].acct} vault={vault} copy={account} compact />
          </div>
        </div>

        <div aria-hidden className="v8-lead" style={{ height: `${LEAD}svh` }} />
        {floors.map((f, i) => (
          <article key={f.id} id={`floor-${f.id}`} className="v8-floor">
            <div className="site-container grid grid-cols-1 gap-x-8 lg:grid-cols-12">
              <div className="v8-inline-panel lg:col-span-6">
                <div className="mx-auto w-full max-w-[440px]">{panelFor(i, true)}</div>
              </div>
              <div className="v8-step lg:col-span-5 lg:col-start-8" style={{ ["--on" as string]: i === shown ? 1 : 0.3 }}>
                <div className="flex items-center gap-3">
                  <span className="text-[13px] leading-5 text-white/50 tabular-nums">{f.n}</span>
                  {f.tag && <span className="rounded-full border border-white/20 px-2 text-[12px] leading-5 text-white/70">{f.tag}</span>}
                </div>
                <h3 className="mt-3 font-serif text-[32px] leading-9 tracking-[-0.02em] sm:text-[36px] sm:leading-10">{f.title}</h3>
                <p className="mt-4 max-w-[420px] text-[17px] leading-7 text-white/75">{f.body}</p>
                {f.rules && <p className="mt-4 max-w-[420px] text-[15px] leading-6 text-white/60">{f.rules}</p>}
                <p className="mt-5 text-[14px] leading-5 text-white/50">
                  <span className="v8-hint-side">← </span>
                  <span className="v8-hint-down">↓ </span>
                  {f.hint}
                </p>
              </div>
            </div>
          </article>
        ))}
        <div aria-hidden className="v8-topspace" style={{ height: `${TOP_SPACER}svh` }} />
      </div>
    </section>
  );
}
