"use client";

// Visitors and page views over the period, on one axis (both are counts).
// Hand-drawn SVG at the card's real width; a crosshair snaps to the nearest
// day (or hour) and the tooltip lists both series. Arrow keys move it too.
// The same numbers are in the table under the chart.

import { useEffect, useRef, useState } from "react";
import styles from "./dashboard.module.css";

export type TrendPoint = { key: string; label: string; views: number; visitors: number };

const HEIGHT = 220;
const PAD = { top: 12, right: 86, bottom: 26, left: 36 };
const SERIES = [
    { key: "visitors", label: "Visitors", color: "var(--series-1)" },
    { key: "views", label: "Page views", color: "var(--series-2)" },
] as const;

/** A round axis maximum: 1, 2 or 5 times a power of ten, split into 4 steps. */
function niceMax(max: number) {
    if (max <= 4) return 4;
    const step = max / 4;
    const power = 10 ** Math.floor(Math.log10(step));
    const nice = [1, 2, 2.5, 5, 10].find((m) => m * power >= step)! * power;
    return nice * 4;
}

const compact = new Intl.NumberFormat("en-US", { notation: "compact", maximumFractionDigits: 1 });
const whole = new Intl.NumberFormat("en-US");

export default function TrendChart({ points, ticks }: { points: TrendPoint[]; ticks: number[] }) {
    const box = useRef<HTMLDivElement>(null);
    const [width, setWidth] = useState(640);
    const [active, setActive] = useState<number | null>(null);

    useEffect(() => {
        const el = box.current;
        if (!el) return;
        const observer = new ResizeObserver(([entry]) => setWidth(Math.max(260, Math.round(entry.contentRect.width))));
        observer.observe(el);
        return () => observer.disconnect();
    }, []);

    const max = niceMax(Math.max(0, ...points.map((p) => Math.max(p.views, p.visitors))));
    const plotW = width - PAD.left - PAD.right;
    const plotH = HEIGHT - PAD.top - PAD.bottom;
    const x = (i: number) => PAD.left + (points.length === 1 ? plotW / 2 : (i / (points.length - 1)) * plotW);
    const y = (v: number) => PAD.top + plotH - (v / max) * plotH;
    const path = (k: "views" | "visitors") => points.map((p, i) => `${i ? "L" : "M"}${x(i).toFixed(1)},${y(p[k]).toFixed(1)}`).join("");
    const last = points.length - 1;

    const pick = (clientX: number) => {
        const rect = box.current!.getBoundingClientRect();
        const rel = clientX - rect.left - PAD.left;
        const i = points.length === 1 ? 0 : Math.round((rel / plotW) * (points.length - 1));
        setActive(Math.min(last, Math.max(0, i)));
    };

    // Axis labels that fit: at least 56px apart, and the last one always shows.
    const shown: number[] = [];
    for (const i of ticks) {
        if (shown.length && x(i) - x(shown[shown.length - 1]) < 56) {
            if (i === last) shown.pop();
            else continue;
        }
        shown.push(i);
    }

    const p = active === null ? null : points[active];
    const tipLeft = active === null ? 0 : Math.min(Math.max(x(active) - 70, 0), width - 150);

    return (
        <div
            ref={box}
            className={styles.chart}
            tabIndex={0}
            role="img"
            aria-label={`Visitors and page views, ${points[0]?.label} to ${points[last]?.label}. The table below has every value.`}
            onPointerMove={(e) => pick(e.clientX)}
            onPointerDown={(e) => pick(e.clientX)}
            onPointerLeave={() => setActive(null)}
            onBlur={() => setActive(null)}
            onKeyDown={(e) => {
                if (e.key === "ArrowLeft") setActive((a) => Math.max(0, (a ?? last + 1) - 1));
                else if (e.key === "ArrowRight") setActive((a) => Math.min(last, (a ?? -1) + 1));
                else if (e.key === "Escape") setActive(null);
            }}
        >
            <svg width={width} height={HEIGHT} aria-hidden="true">
                {[0, 1, 2, 3, 4].map((t) => {
                    const v = (max / 4) * t;
                    return (
                        <g key={t}>
                            <line x1={PAD.left} x2={width - PAD.right} y1={y(v)} y2={y(v)} stroke={t ? "var(--grid)" : "var(--axis)"} strokeWidth={1} shapeRendering="crispEdges" />
                            <text x={PAD.left - 8} y={y(v)} dy="0.32em" textAnchor="end" fontSize={11} fill="var(--muted)" style={{ fontVariantNumeric: "tabular-nums" }}>
                                {compact.format(v)}
                            </text>
                        </g>
                    );
                })}
                {shown.map((i) => (
                    <text key={i} x={x(i)} y={HEIGHT - 6} textAnchor={i === 0 ? "start" : i === last ? "end" : "middle"} fontSize={11} fill="var(--muted)">
                        {points[i].label}
                    </text>
                ))}
                {active !== null && <line x1={x(active)} x2={x(active)} y1={PAD.top} y2={PAD.top + plotH} stroke="var(--axis)" strokeWidth={1} shapeRendering="crispEdges" />}
                {SERIES.map((s) => (
                    <path key={s.key} d={path(s.key)} fill="none" stroke={s.color} strokeWidth={2} strokeLinejoin="round" strokeLinecap="round" />
                ))}
                {SERIES.map((s) => {
                    const i = active ?? last;
                    return <circle key={s.key} cx={x(i)} cy={y(points[i][s.key])} r={4} fill={s.color} stroke="var(--surface)" strokeWidth={2} />;
                })}
                {/* Direct labels at the line ends, pushed apart if they'd overlap. */}
                {(() => {
                    const ya = y(points[last].visitors);
                    const yb = y(points[last].views);
                    const gap = 13;
                    const [la, lb] = Math.abs(ya - yb) >= gap ? [ya, yb] : ya <= yb ? [ya - (gap - (yb - ya)) / 2, yb + (gap - (yb - ya)) / 2] : [ya + (gap - (ya - yb)) / 2, yb - (gap - (ya - yb)) / 2];
                    return (
                        <g fontSize={11} fill="var(--ink-2)">
                            <text x={x(last) + 9} y={la} dy="0.32em">{whole.format(points[last].visitors)} visitors</text>
                            <text x={x(last) + 9} y={lb} dy="0.32em">{whole.format(points[last].views)} views</text>
                        </g>
                    );
                })()}
            </svg>
            {p && (
                <div className={styles.tooltip} style={{ left: tipLeft }}>
                    <div className={styles.tipTitle}>{p.label}</div>
                    {SERIES.map((s) => (
                        <div key={s.key} className={styles.tipRow}>
                            <span className={styles.key} style={{ background: s.color }} />
                            <strong>{whole.format(p[s.key])}</strong>
                            <span>{s.label.toLowerCase()}</span>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
