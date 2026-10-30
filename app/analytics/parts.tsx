// The dashboard's pieces: tiles, cards, bar lists, the hero-word table and the
// web vitals table. Server components, plain HTML: every value is printed, so
// nothing depends on hovering.

import type { ReactNode } from "react";
import styles from "./dashboard.module.css";
import { VITAL_BANDS, type Band } from "@/lib/analytics/server/report";

const whole = new Intl.NumberFormat("en-US");
const compact = new Intl.NumberFormat("en-US", { notation: "compact", maximumFractionDigits: 1 });

export const fmt = (n: number) => whole.format(n);
export const big = (n: number) => (n >= 10_000 ? compact.format(n) : whole.format(n));

/** A share as a percent: one decimal under 10%, whole above. */
export function pct(part: number, whole: number) {
    if (!whole) return "–";
    const p = (part / whole) * 100;
    if (p === 0) return "0%";
    if (p < 0.1) return "<0.1%";
    return `${p < 10 ? p.toFixed(1).replace(/\.0$/, "") : Math.round(p)}%`;
}

/** Change against the period before: "▲ 12% vs yesterday". `before` names that period. */
export function Delta({ now, prev, before }: { now: number; prev: number; before: string }) {
    if (!prev) return <div className={styles.tileSub}>{before === "yesterday" ? "None yesterday" : `None in ${before}`}</div>;
    const change = (now - prev) / prev;
    if (Math.abs(change) < 0.005) return <div className={styles.tileSub}>Same as {before}</div>;
    return (
        <div className={styles.tileSub}>
            <span className={change > 0 ? styles.up : styles.down}>
                {change > 0 ? "▲" : "▼"} {Math.abs(Math.round(change * 100))}%
            </span>{" "}
            vs {before}
        </div>
    );
}

export function Tile({ label, value, children, hero }: { label: string; value: string; children?: ReactNode; hero?: boolean }) {
    return (
        <div className={`${styles.tile} ${hero ? styles.tileHero : ""}`}>
            <div className={styles.tileLabel}>{label}</div>
            <div className={styles.tileValue}>{value}</div>
            {children}
        </div>
    );
}

export function Card({ title, note, children, id }: { title: string; note?: ReactNode; children: ReactNode; id?: string }) {
    return (
        <section className={styles.card} id={id} aria-labelledby={id ? `${id}-title` : undefined}>
            <h2 className={styles.cardTitle} id={id ? `${id}-title` : undefined}>
                {title}
            </h2>
            {note ? <p className={styles.cardNote}>{note}</p> : <div style={{ height: 12 }} />}
            {children}
        </section>
    );
}

export const Empty = ({ children = "Nothing yet in this period." }: { children?: ReactNode }) => <div className={styles.empty}>{children}</div>;

export type BarItem = { key: string; label: ReactNode; sub?: ReactNode; value: number; text?: ReactNode; title?: string };

/**
 * Rows of label, number and a thin bar. Bars are scaled to `of` (a share of
 * something, like home page views) or, without it, to the largest row.
 */
export function BarList({ items, of, limit = 8, unit, empty }: { items: BarItem[]; of?: number; limit?: number; unit?: string; empty?: ReactNode }) {
    if (!items.length) return <Empty>{empty}</Empty>;
    const scale = of ?? Math.max(...items.map((i) => i.value), 1);
    const shown = items.slice(0, limit);
    return (
        <>
            <ul className={styles.list}>
                {shown.map((item) => {
                    const width = Math.min(100, (item.value / scale) * 100);
                    return (
                        <li key={item.key} className={styles.row} title={item.title}>
                            <div className={styles.rowTop}>
                                <span className={styles.label}>
                                    {item.label}
                                    {item.sub ? <span className={styles.labelSub}> {item.sub}</span> : null}
                                </span>
                                <span className={styles.value}>{item.text ?? `${fmt(item.value)}${unit ? ` ${unit}` : ""}`}</span>
                            </div>
                            <div className={`${styles.bar} ${item.value ? "" : styles.barZero}`} style={item.value ? { width: `${width}%` } : undefined} />
                        </li>
                    );
                })}
            </ul>
            {items.length > limit && <div className={styles.more}>And {items.length - limit} more</div>}
        </>
    );
}

/** A count with its share in grey: "1,234 · 56%". */
export const withShare = (n: number, of: number) => (
    <>
        {fmt(n)} <span className={styles.valueSub}>· {pct(n, of)}</span>
    </>
);

/** A share with its count in grey: "56% · 1,234". */
export const shareFirst = (n: number, of: number) => (
    <>
        {pct(n, of)} <span className={styles.valueSub}>· {fmt(n)}</span>
    </>
);

/** Rate cells on a five-step blue ramp (validated light and dark); the number is always printed. */
export const RATE_STEPS = [
    { max: 0, cls: "c0", label: "0" },
    { max: 0.1, cls: "c1", label: "under 10%" },
    { max: 0.25, cls: "c2", label: "10–25%" },
    { max: 0.5, cls: "c3", label: "25–50%" },
    { max: 0.75, cls: "c4", label: "50–75%" },
    { max: Infinity, cls: "c5", label: "75% and up" },
];

export function RateCell({ part, of }: { part: number; of: number }) {
    const rate = of ? part / of : 0;
    const step = RATE_STEPS.find((s) => rate <= s.max)!;
    return (
        <span className={`${styles.cell} ${styles[step.cls]}`} title={`${fmt(part)} of ${fmt(of)}`}>
            {of ? pct(part, of) : "–"}
        </span>
    );
}

export function RateScale() {
    return (
        <div className={styles.scale} aria-hidden="true">
            {RATE_STEPS.slice(1).map((s) => (
                <span key={s.cls}>
                    <span className={`${styles.swatch} ${styles[s.cls]}`} />
                    {s.label}
                </span>
            ))}
        </div>
    );
}

const BAND_TEXT: Record<Band, { icon: string; label: string }> = {
    good: { icon: "✓", label: "Good" },
    "needs-work": { icon: "!", label: "Needs work" },
    poor: { icon: "✕", label: "Poor" },
};

export function formatVital(metric: string, value: number) {
    if (VITAL_BANDS[metric]?.unit !== "ms") return value.toFixed(2);
    return value < 1000 ? `${Math.round(value)} ms` : `${(value / 1000).toFixed(1)} s`;
}

export function Status({ band, children }: { band: Band; children?: ReactNode }) {
    const t = BAND_TEXT[band];
    return (
        <span className={styles.status}>
            <span className={`${styles.statusIcon} ${styles[band]}`} aria-hidden="true">
                {t.icon}
            </span>
            {children ?? t.label}
            {children ? <span className="sr-only"> ({t.label})</span> : null}
        </span>
    );
}

export function StatusKey() {
    return (
        <div className={styles.scale}>
            {(Object.keys(BAND_TEXT) as Band[]).map((b) => (
                <Status key={b} band={b} />
            ))}
        </div>
    );
}
