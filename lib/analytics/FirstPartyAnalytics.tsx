"use client";

// Mounted once in the root layout: a page view on the first load and on every
// client-side route change, and web vitals (LCP, INP, CLS, TTFB, FCP) in place
// of Vercel Speed Insights. The vitals code is its own chunk, fetched once the
// browser is idle; the metrics are buffered by the browser, so loading it late
// misses nothing.

import { lazy, Suspense, useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { recordPageView } from "./first-party";

const Vitals = lazy(() => import("./vitals"));

export function FirstPartyAnalytics() {
    const pathname = usePathname();
    const [idle, setIdle] = useState(false);
    const counted = useRef<string | null>(null);

    useEffect(() => {
        // Once per route, even when Strict Mode runs effects twice in development.
        if (counted.current === pathname) return;
        counted.current = pathname;
        recordPageView();
    }, [pathname]);

    useEffect(() => {
        if ("requestIdleCallback" in window) {
            const id = requestIdleCallback(() => setIdle(true), { timeout: 4000 });
            return () => cancelIdleCallback(id);
        }
        const id = setTimeout(() => setIdle(true), 2000);
        return () => clearTimeout(id);
    }, []);

    return idle ? (
        <Suspense fallback={null}>
            <Vitals />
        </Suspense>
    ) : null;
}
