"use client";

import { useEffect, useRef, useState, type PointerEvent } from "react";
import { animate, useInView, useMotionValue, useScroll, useSpring, useTransform } from "framer-motion";
import { usePrefersReducedMotion } from "@/lib/hooks/usePrefersReducedMotion";
import Browser, { tabId } from "./Browser";
import Monitor from "./Monitor";
import Phone from "./Phone";
import TabChips from "./TabChips";
import SiteCaption from "./SiteCaption";
import type { SiteLabels, SiteTab } from "./types";

// The websites gallery: a display with a browser on it from sm up, a phone
// with Safari below. Both are on the page (CSS picks one, so the server's
// HTML is already right); only the one on show loads the live site.
// The device turns to face you as it comes in (scrolled in, or on landing
// when it's already there), then sits exactly face-on.
// Reduced motion gets it still and face-on.

/** Turned away before it faces you: degrees, px and scale at turn = 1. */
const TURN = { rotateY: -17, rotateX: 9, y: 28, scale: 0.05 };
const ENTER = { type: "spring", visualDuration: 1.1, bounce: 0.14 } as const;
const LIGHT = { stiffness: 90, damping: 20, mass: 0.8 };
const PHONE = "(max-width: 639px)";

/** Whether the phone is the device on show; null until the browser says. */
function usePhoneLayout() {
  const [phone, setPhone] = useState<boolean | null>(null);
  useEffect(() => {
    const mq = window.matchMedia(PHONE);
    const update = () => setPhone(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);
  return phone;
}

export default function Computer({ tabs, labels }: { tabs: SiteTab[]; labels: SiteLabels }) {
  const [active, setActive] = useState(tabs[0].key);
  // The first pick turns on the tab's spring; the page loads with it at rest.
  const [touched, setTouched] = useState(false);
  const [reload, setReload] = useState(0);
  const reduce = usePrefersReducedMotion();
  const phone = usePhoneLayout();
  const sectionRef = useRef<HTMLElement>(null);

  // Turned away until it's in: whichever is further from done, the landing
  // spring or the scroll (done once its top is halfway up the screen).
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start end", "start 0.5"] });
  const enter = useMotionValue(0);
  const seen = useInView(sectionRef, { once: true, amount: 0.2 });
  useEffect(() => {
    if (!seen) return;
    const run = animate(enter, 1, ENTER);
    return () => run.stop();
  }, [seen, enter]);
  const turnBy = useTransform(() => Math.max(1 - enter.get(), 1 - scrollYProgress.get()));
  const rotateY = useTransform(() => TURN.rotateY * turnBy.get());
  const rotateX = useTransform(() => TURN.rotateX * turnBy.get());
  const y = useTransform(() => TURN.y * turnBy.get());
  const scale = useTransform(() => 1 - TURN.scale * turnBy.get());
  const turn = { rotateX, rotateY, y, scale };

  // The light on the glass: it drifts with the pointer and sweeps across as the display turns in.
  const light = useSpring(0, LIGHT);
  const glare = useTransform(() => `${50 - 26 * light.get() + 40 * turnBy.get()}% 0%`);
  const lean = (e: PointerEvent<HTMLDivElement>) => {
    if (e.pointerType !== "mouse" || reduce) return;
    const r = e.currentTarget.getBoundingClientRect();
    light.set(Math.max(-1, Math.min(1, ((e.clientX - r.left) / r.width) * 2 - 1)));
  };

  const pick = (key: string) => {
    if (key === active) return;
    setActive(key);
    setTouched(true);
  };
  const restart = () => setReload((r) => r + 1);

  const shared = { tabs, active, reduce, reload, archived: labels.archived, tapLabel: labels.tap };

  return (
    <section ref={sectionRef} aria-label="Websites we've built" className="[container-type:inline-size]">
      <div className="hidden sm:block">
        <Monitor turn={turn} glare={glare} reduce={reduce} onPointerMove={lean} onPointerLeave={() => light.set(0)}>
          <Browser {...shared} touched={touched} original={labels.original} onPick={pick} onReload={restart} enabled={phone === false} />
        </Monitor>
      </div>
      <div className="sm:hidden">
        <Phone {...shared} turn={turn} onReload={restart} enabled={phone === true} labelledBy={tabId(active)} />
      </div>
      <TabChips tabs={tabs} active={active} onPick={pick} reduce={reduce} />
      <SiteCaption tabs={tabs} active={active} original={labels.original} />
    </section>
  );
}
