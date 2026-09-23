"use client";

import { useEffect, useState } from "react";
import { useInView } from "@/lib/use-in-view";

// `decimals` renders a fractional count (2.76%); the default keeps the integer behaviour.
export function CountUp({ end, duration = 2000, decimals = 0 }: { end: number; duration?: number; decimals?: number }) {
  const { ref, inView } = useInView<HTMLSpanElement>();
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (!inView) return;
    let frame = 0;
    const start = performance.now();
    const tick = (now: number) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = progress * (2 - progress);
      setValue(decimals > 0 ? Number((eased * end).toFixed(decimals)) : Math.floor(eased * end));
      if (progress < 1) frame = requestAnimationFrame(tick);
      else setValue(end);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [inView, end, duration, decimals]);

  return <span ref={ref}>{decimals > 0 ? value.toFixed(decimals) : value}</span>;
}
