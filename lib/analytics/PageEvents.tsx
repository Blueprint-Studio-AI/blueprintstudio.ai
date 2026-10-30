"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { syncPageView, trackOnce } from "./track";
import { observeSections, onClick, onIdle } from "./dom";

// The events every page records without its components doing anything: clicks
// (dom.ts), sections seen, how far down the page people get, and pages that
// aren't there. Mounted once, in the root layout, so it lives across client-side
// navigations and starts each page view afresh.

const DEPTHS = [25, 50, 75, 90, 100] as const;

export default function PageEvents() {
    const pathname = usePathname();
    const marks = useRef<(HTMLDivElement | null)[]>([]);

    useEffect(() => {
        document.addEventListener("click", onClick, true);
        document.addEventListener("auxclick", onClick, true);
        return () => {
            document.removeEventListener("click", onClick, true);
            document.removeEventListener("auxclick", onClick, true);
        };
    }, []);

    useEffect(() => {
        syncPageView();
        const stopSections = observeSections();

        // Scroll depth with no scroll handler: a mark at 25%, 50%, 75% and 90% of
        // the page's height and one at its foot, which move with the page as it
        // grows. A mark coming on screen means the screen's bottom edge has reached
        // it. Observing afresh starts each page view's marks from scratch.
        const depth = new IntersectionObserver((entries) => {
            for (const entry of entries) {
                if (entry.isIntersecting) trackOnce("scroll_depth", { percent: Number((entry.target as HTMLElement).dataset.depth) });
            }
        });
        for (const mark of marks.current) if (mark) depth.observe(mark);

        // A path with no page: Next's not-found page, by its title (or its heading).
        const cancelNotFound = onIdle(() => {
            const notFound = document.title.startsWith("404") || document.querySelector(".next-error-h1")?.textContent === "404";
            if (notFound) trackOnce("page_not_found", { path: location.pathname });
        }, 1500);

        return () => {
            stopSections();
            depth.disconnect();
            cancelNotFound();
        };
    }, [pathname]);

    // Placed against the body (position: relative in the root layout), so a
    // percentage of their containing block is a percentage of the whole page.
    return (
        <>
            {DEPTHS.map((d, i) => (
                <div
                    key={d}
                    ref={(el) => {
                        marks.current[i] = el;
                    }}
                    aria-hidden
                    data-depth={d}
                    className="pointer-events-none invisible absolute left-0 h-px w-px"
                    style={d === 100 ? { bottom: 0 } : { top: `${d}%` }}
                />
            ))}
        </>
    );
}
