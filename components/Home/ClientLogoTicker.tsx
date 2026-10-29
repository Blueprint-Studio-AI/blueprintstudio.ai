"use client";

import { useEffect, useId, useLayoutEffect, useRef, useState } from "react";
import Link from "next/link";
import { motion, useMotionValue, useReducedMotion, useSpring } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import Section from "@/components/ui/Section";
import OuterContainer from "@/components/ui/OuterContainer";
import { OuterLines } from "./GridLines";
import { CLIENT_LOGOS as clients, type ClientLogo as Client } from "./clientLogos";

const CARD_W = 264;
const EDGE = 8; // the card keeps this clear of the band's sides
const REST_MS = 90; // the pointer rests on a logo this long, and its card opens
const LINGER_MS = 500; // or stays on it this long, still moving
const CLOSE_MS = 160; // time to cross from a logo to its card
const EASE_OUT = [0.23, 1, 0.32, 1] as const;

// Each logo's box in a row of the given height (44px on phones, 60px from sm up, as
// --logo-h below), in whole pixels. A fractional height or nudge leaves a logo's edges
// between two pixel rows. Whenever a logo fades up or turns to colour under the pointer,
// the browser draws it on a layer of its own for the fade and back into the marquee
// after, and each resolves that fraction differently, so the logo hops up or down a
// fraction of a pixel, most visibly at 1x. On whole pixels both draw it the same. The
// width is rounded too, so every logo starts on a whole pixel and only the marquee's own
// offset is fractional.
function logoBox(client: Client, rowH: number) {
  const h = Math.round(rowH * (client.scale ?? 1));
  return {
    h: `${h}px`,
    w: `${Math.round((h * client.w) / 264)}px`,
    top: `${Math.round((rowH - h) / 2 + h * (client.y ?? 0))}px`,
  };
}

// The nav's Services menu, in miniature: grows out of the logo on a spring.
const CARD = {
  closed: { opacity: 0, scale: 0.92, y: -8, transition: { duration: 0.16, ease: EASE_OUT } },
  open: { opacity: 1, scale: 1, y: 0, transition: { type: "spring", visualDuration: 0.34, bounce: 0.2, opacity: { duration: 0.14 } } },
} as const;

// The still shows whenever there is one; the card links, and says so, only with an href.
function CardBody({ client, describedBy }: { client: Client; describedBy: string }) {
  const body = (
    <>
      {client.still && (
        <span className="relative block aspect-[16/10] overflow-hidden rounded-[12px] bg-neutral-200">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={client.still}
            alt=""
            width={560}
            height={350}
            draggable={false}
            className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover/card:scale-[1.04]"
          />
          <span className="absolute inset-0 rounded-[12px] shadow-[inset_0_0_0_1px_rgba(0,0,0,0.08)]" />
        </span>
      )}
      <span className="block px-2 pb-1.5 pt-2.5">
        <span className="flex items-baseline justify-between gap-3">
          <span className="text-sm font-medium leading-5 text-[rgba(28,28,30,0.96)]">{client.name}</span>
          {client.href && (
            <span className="flex shrink-0 items-center gap-0.5 text-[12px] leading-5 text-[rgba(28,28,30,0.5)] transition-colors group-hover/card:text-[rgba(28,28,30,0.85)]">
              See the work
              <ArrowUpRight
                aria-hidden
                strokeWidth={2.25}
                className="h-3 w-3 transition-transform duration-200 group-hover/card:-translate-y-px group-hover/card:translate-x-px"
              />
            </span>
          )}
        </span>
        <span id={describedBy} className="mt-0.5 block text-[13px] leading-[18px] text-[rgba(28,28,30,0.6)]" style={{ textWrap: "pretty" }}>
          {client.line}
        </span>
      </span>
    </>
  );
  return (
    <motion.div
      initial={{ opacity: 0, filter: "blur(3px)" }}
      animate={{ opacity: 1, filter: "blur(0px)" }}
      transition={{ duration: 0.25, ease: EASE_OUT }}
      className="p-1.5"
    >
      {client.href ? (
        // The logo itself is the keyboard's way in, so the card stays out of the tab order.
        <Link href={client.href} prefetch={false} tabIndex={-1} className="group/card block rounded-[12px]">
          {body}
        </Link>
      ) : (
        <div>{body}</div>
      )}
    </motion.div>
  );
}

export default function ClientLogoTicker() {
  const reduceMotion = useReducedMotion();
  const describedBy = useId();
  const bandRef = useRef<HTMLDivElement>(null);
  const marqueeRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  // The open card: which client, and the logo it hangs from (either copy in the loop).
  const [active, setActive] = useState<number | null>(null);
  const [shown, setShown] = useState<number | null>(null); // kept while the card closes
  const [lingering, setLingering] = useState(false); // still animating closed
  const [ringCopy, setRingCopy] = useState(false); // keyboard focus is drawn on the visible copy
  const anchor = useRef<HTMLElement | null>(null);
  const via = useRef<"hover" | "focus" | "touch">("hover");
  const pointerType = useRef("mouse");
  const [pointerIn, setPointerIn] = useState(false);

  const openTimer = useRef<ReturnType<typeof setTimeout>>(undefined);
  const closeTimer = useRef<ReturnType<typeof setTimeout>>(undefined);
  const enteredAt = useRef(0);
  const armedAt = useRef({ x: 0, y: 0 });

  // Where the card sits, in the band's coordinates. The spring glides it from logo to logo.
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const glide = { stiffness: 420, damping: 40, mass: 0.6 };
  const sx = useSpring(x, glide);
  const sy = useSpring(y, glide);
  const [originX, setOriginX] = useState(0.5);

  const place = (jump: boolean) => {
    const band = bandRef.current;
    const el = anchor.current;
    if (!band || !el) return;
    const b = band.getBoundingClientRect();
    const r = el.getBoundingClientRect();
    const centre = r.left + r.width / 2 - b.left;
    const left = Math.min(Math.max(centre - CARD_W / 2, EDGE), b.width - CARD_W - EDGE);
    const top = r.bottom - b.top + 6;
    x.set(left);
    y.set(top);
    if (jump) {
      sx.jump(left);
      sy.jump(top);
      setOriginX((centre - left) / CARD_W);
    }
  };

  // Load the stills once someone reaches for the band, so a card never opens empty.
  const preloaded = useRef(false);
  const preload = () => {
    if (preloaded.current) return;
    preloaded.current = true;
    for (const client of clients) if (client.still) new window.Image().src = client.still;
  };

  const springHeight = useRef(false);
  const open = (index: number, el: HTMLElement) => {
    clearTimeout(openTimer.current);
    clearTimeout(closeTimer.current);
    const wasOpen = active !== null;
    springHeight.current = wasOpen;
    anchor.current = el;
    setActive(index);
    setShown(index);
    setLingering(true);
    place(!wasOpen);
  };
  const close = () => {
    clearTimeout(openTimer.current);
    clearTimeout(closeTimer.current);
    setActive(null);
    setRingCopy(false);
  };
  const closeSoon = () => {
    clearTimeout(closeTimer.current);
    closeTimer.current = setTimeout(close, CLOSE_MS);
  };

  // Hover opens once the pointer rests on a logo (or lingers there), so gliding
  // across the band doesn't flash cards. Once one is open, the next follows at once.
  const arm = (e: React.PointerEvent, index: number) => {
    if (openTimer.current && Math.hypot(e.clientX - armedAt.current.x, e.clientY - armedAt.current.y) < 4) return;
    armedAt.current = { x: e.clientX, y: e.clientY };
    clearTimeout(openTimer.current);
    const el = e.currentTarget as HTMLElement;
    const wait = Math.min(REST_MS, Math.max(0, enteredAt.current + LINGER_MS - performance.now()));
    openTimer.current = setTimeout(() => {
      via.current = "hover";
      open(index, el);
    }, wait);
  };

  // Keyboard focus walks the loop: the focused logo glides to the middle of the band.
  const bringIntoView = (el: HTMLElement, index: number): HTMLElement => {
    const track = trackRef.current;
    const marquee = marqueeRef.current;
    const anim = track?.getAnimations()[0];
    if (!track || !marquee || !anim || reduceMotion) return el;
    const half = track.scrollWidth / 2;
    const duration = Number(anim.effect?.getTiming().duration) || 1;
    const w = el.getBoundingClientRect().width;
    let at = el.getBoundingClientRect().left - track.getBoundingClientRect().left;
    let target = el;
    // Logos at the start of the loop can't reach the middle; their copy can, and looks the same.
    if (at + w / 2 < marquee.clientWidth / 2) {
      const twin = track.querySelector<HTMLElement>(`[data-copy] [data-index="${index}"]`);
      if (twin) {
        target = twin;
        at += half;
      }
    }
    const shift = Math.min(Math.max(at + w / 2 - marquee.clientWidth / 2, 0), half);
    const to = (shift / half) * duration;
    const from = Number(anim.currentTime ?? 0) % duration;
    const start = performance.now();
    const step = (now: number) => {
      const t = Math.min((now - start) / 450, 1);
      anim.currentTime = from + (to - from) * (1 - Math.pow(1 - t, 3));
      if (t < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
    return target;
  };

  // The marquee eases to a stop under the pointer or while a card is open, and back up after.
  const paused = pointerIn || active !== null;
  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;
    const target = paused ? 0 : 1;
    let raf = 0;
    const step = () => {
      let done = true;
      // Re-read each frame: Safari drops stale animation references.
      for (const anim of el.getAnimations()) {
        const diff = target - anim.playbackRate;
        if (Math.abs(diff) < 0.02) anim.playbackRate = target;
        else {
          anim.playbackRate += diff * 0.14;
          done = false;
        }
      }
      if (!done) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [paused]);

  // While open, the card follows its logo as the marquee settles.
  useEffect(() => {
    if (active === null) return;
    let raf = 0;
    const tick = () => {
      place(false);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
    // place reads refs only
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active]);

  // A tap or click anywhere but a logo or the card closes it; so does Escape.
  useEffect(() => {
    if (active === null) return;
    const onDown = (e: PointerEvent) => {
      const t = e.target as HTMLElement;
      if (t.closest?.("[data-logo]") || t.closest?.("[data-logo-card]")) return;
      close();
    };
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && close();
    document.addEventListener("pointerdown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [active]);

  useEffect(
    () => () => {
      clearTimeout(openTimer.current);
      clearTimeout(closeTimer.current);
    },
    [],
  );

  // The card's height springs between clients with and without a still (set when it opens fresh).
  const [height, setHeight] = useState<number | "auto">("auto");
  useLayoutEffect(() => {
    if (contentRef.current) setHeight(contentRef.current.offsetHeight);
  }, [shown]);
  const heightTransition = !springHeight.current || reduceMotion ? { duration: 0 } : { type: "spring" as const, visualDuration: 0.32, bounce: 0.12 };

  const renderList = (copy: boolean) => (
    <ul
      {...(copy ? { "aria-hidden": true, "data-copy": "" } : {})}
      className="flex shrink-0 items-center gap-x-12 pr-12 [--logo-h:44px] sm:gap-x-[72px] sm:pr-[72px] sm:[--logo-h:60px]"
    >
      {clients.map((client, index) => {
        const on = active === index;
        const ring = on && ringCopy && copy;
        const phone = logoBox(client, 44);
        const wide = logoBox(client, 60);
        const logo = (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={`/logos-match-height/${client.logo}.png`}
            alt={copy ? "" : client.name}
            width={client.w}
            height={264}
            decoding="async"
            draggable={false}
            className={`mt-[var(--top)] h-[var(--h)] w-[var(--w)] max-w-none shrink-0 select-none transition-[opacity,filter] duration-500 ease-out sm:mt-[var(--top-sm)] sm:h-[var(--h-sm)] sm:w-[var(--w-sm)] ${on ? "opacity-100" : "opacity-[var(--ink)] [@media(hover:hover)]:group-hover/logo:opacity-[calc(var(--ink)_+_0.2)]"}`}
            style={
              {
                "--h": phone.h,
                "--w": phone.w,
                "--top": phone.top,
                "--h-sm": wide.h,
                "--w-sm": wide.w,
                "--top-sm": wide.top,
                filter: on ? "grayscale(0) brightness(1)" : `grayscale(1) brightness(${client.tone ?? 1})`,
                "--ink": client.ink ?? 0.5,
              } as React.CSSProperties
            }
          />
        );
        const props = {
          "data-logo": "",
          "data-index": index,
          tabIndex: copy ? -1 : undefined,
          "aria-describedby": on && !copy ? describedBy : undefined,
          className: `group/logo flex h-full items-start rounded-lg outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#2563EB] ${ring ? "outline outline-2 outline-offset-4 outline-[#2563EB]" : ""} ${client.href ? "cursor-pointer" : "cursor-default"}`,
          onPointerDown: (e: React.PointerEvent) => {
            pointerType.current = e.pointerType;
            preload();
          },
          onPointerEnter: (e: React.PointerEvent) => {
            if (e.pointerType !== "mouse") return;
            clearTimeout(closeTimer.current);
            if (active !== null) {
              via.current = "hover";
              setRingCopy(false);
              return open(index, e.currentTarget as HTMLElement);
            }
            enteredAt.current = performance.now();
            arm(e, index);
          },
          onPointerMove: (e: React.PointerEvent) => {
            if (e.pointerType === "mouse" && active === null) arm(e, index);
          },
          onPointerLeave: (e: React.PointerEvent) => {
            if (e.pointerType !== "mouse") return;
            clearTimeout(openTimer.current);
            openTimer.current = undefined;
            if (active !== null && via.current === "hover") closeSoon();
          },
          onFocus: (e: React.FocusEvent) => {
            const el = e.currentTarget as HTMLElement;
            if (!el.matches(":focus-visible")) return;
            preload();
            via.current = "focus";
            const target = bringIntoView(el, index);
            setRingCopy(target !== el);
            open(index, target);
          },
          onBlur: (e: React.FocusEvent) => {
            if (via.current !== "focus") return;
            if (!(e.relatedTarget as HTMLElement | null)?.closest?.("[data-logo]")) close();
          },
          onClick: (e: React.MouseEvent) => {
            // Enter or Space: a link goes, a plain logo toggles its card.
            if (e.detail === 0) {
              if (!client.href) {
                if (active === index) close();
                else open(index, e.currentTarget as HTMLElement);
              }
              return;
            }
            // A tap shows the card first; a second tap on the same logo follows its link.
            if (pointerType.current === "mouse") {
              if (active !== index && !client.href) open(index, e.currentTarget as HTMLElement);
              return;
            }
            if (active !== index) {
              e.preventDefault();
              via.current = "touch";
              setRingCopy(false);
              open(index, e.currentTarget as HTMLElement);
            } else if (!client.href) close();
          },
        };
        return (
          <li key={client.name} className="relative flex h-[var(--logo-h)] shrink-0 items-center">
            {client.href ? (
              <Link href={client.href} prefetch={false} {...props}>
                {logo}
              </Link>
            ) : (
              <button type="button" {...props}>
                {logo}
              </button>
            )}
          </li>
        );
      })}
    </ul>
  );

  const client = shown === null ? null : clients[shown];

  return (
    // Above the next section, so an open card can hang over it.
    <Section className="relative z-30 flex flex-col bg-neutral-50">
      <OuterLines />
      <div aria-hidden className="line-dash-x" />

      {/* The marquee spans the whole frame, not just the 1000px column */}
      <OuterContainer>
        <div ref={bandRef} className="relative w-full pb-10 pt-12 sm:pb-14 sm:pt-16">
          <p className="cursor-default text-center text-xs font-medium uppercase tracking-[0.02em] text-neutral-500 sm:text-[13px]">
            Trusted by 30+ partners over 3 years
          </p>

          <div
            ref={marqueeRef}
            className="mt-6 overflow-x-clip py-2 sm:mt-8"
            style={{
              maskImage: "linear-gradient(to right, transparent, #000 10%, #000 90%, transparent)",
              WebkitMaskImage: "linear-gradient(to right, transparent, #000 10%, #000 90%, transparent)",
            }}
            onPointerEnter={(e) => {
              if (e.pointerType !== "mouse") return;
              preload();
              setPointerIn(true);
            }}
            onPointerLeave={(e) => {
              if (e.pointerType !== "mouse") return;
              setPointerIn(false);
              if (active !== null && via.current === "hover") closeSoon();
            }}
          >
            <div
              ref={trackRef}
              className="flex w-max animate-logo-scroll motion-reduce:animate-none"
              style={{ willChange: "transform", backfaceVisibility: "hidden" }}
            >
              {renderList(false)}
              {renderList(true)}
            </div>
          </div>

          {/* One card for the whole band, so it can sit outside the marquee's clip. */}
          <motion.div
            data-logo-card=""
            className="absolute left-0 top-0 z-10"
            style={{
              x: sx,
              y: sy,
              width: CARD_W,
              visibility: active !== null || lingering ? "visible" : "hidden",
              pointerEvents: active !== null ? "auto" : "none",
            }}
            onPointerEnter={(e) => {
              if (e.pointerType === "mouse") clearTimeout(closeTimer.current);
            }}
            onPointerLeave={(e) => {
              if (e.pointerType === "mouse" && via.current === "hover") closeSoon();
            }}
          >
            <motion.div
              initial={false}
              animate={active !== null ? "open" : "closed"}
              variants={CARD}
              transition={reduceMotion ? { duration: 0 } : undefined}
              onAnimationComplete={(label) => {
                if (label === "closed") setLingering(false);
              }}
              style={{ originX, originY: 0 }}
              className="overflow-hidden rounded-[18px] border border-black/[0.06] bg-white/[0.8] shadow-[0_24px_48px_-16px_rgba(0,0,0,0.2),0_8px_20px_-10px_rgba(0,0,0,0.1),inset_0_1px_0_rgba(255,255,255,0.7)] backdrop-blur-xl backdrop-saturate-[1.8]"
            >
              <motion.div initial={false} animate={{ height }} transition={heightTransition} className="overflow-hidden">
                <div ref={contentRef}>{client && <CardBody key={client.logo} client={client} describedBy={describedBy} />}</div>
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
      </OuterContainer>
      <div aria-hidden className="line-dash-x" />
    </Section>
  );
}
