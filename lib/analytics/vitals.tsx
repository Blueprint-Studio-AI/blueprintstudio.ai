"use client";

// Web vitals through Next's own reporter (next/web-vitals), loaded lazily by
// FirstPartyAnalytics. FID is left out: INP replaced it as a Core Web Vital.

import { useReportWebVitals } from "next/web-vitals";
import { recordVital } from "./first-party";

const METRICS = new Set(["LCP", "INP", "CLS", "TTFB", "FCP"]);

type Metric = Parameters<Parameters<typeof useReportWebVitals>[0]>[0];

// Each reading once: React's strict mode runs the reporter twice in development.
// A later reading of the same metric (CLS or INP growing) has a new value, so it still goes.
const sent = new Set<string>();

function report(metric: Metric) {
    if (!METRICS.has(metric.name)) return;
    const key = `${metric.id}:${metric.value}`;
    if (sent.has(key)) return;
    sent.add(key);
    recordVital({
        metric: metric.name,
        // Milliseconds, except CLS, which is a unitless score.
        value: metric.name === "CLS" ? Math.round(metric.value * 10000) / 10000 : Math.round(metric.value),
        rating: metric.rating,
    });
}

export default function Vitals() {
    useReportWebVitals(report);
    return null;
}
