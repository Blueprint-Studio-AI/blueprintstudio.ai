// app/analytics/page.tsx
// Our own analytics, in plain words. Private: behind ANALYTICS_PASSWORD (see
// auth.ts), noindex, and not linked from anywhere or listed in the sitemap.
// Everything here renders on the server; the trend chart is the one client
// component, and it loads only on this route.

import type { Metadata } from "next";
import { cookies } from "next/headers";
import { notFound } from "next/navigation";
import { getStore } from "@/lib/analytics/server/store";
import { dayOf, hourOf } from "@/lib/analytics/server/time";
import { buildReport, FUNNEL_STEPS, HERO_ACTIONS, humanize, PERIODS, rangeFor, VITAL_BANDS, VITAL_ORDER, type Period, type Report } from "@/lib/analytics/server/report";
import { signIn, signOut } from "./actions";
import { COOKIE, dashboardPassword, isProduction, isSignedIn } from "./auth";
import { BarList, Card, Delta, Empty, fmt, big, pct, RateCell, RateScale, shareFirst, Status, StatusKey, Tile, withShare, formatVital } from "./parts";
import TrendChart, { type TrendPoint } from "./TrendChart";
import styles from "./dashboard.module.css";

export const metadata: Metadata = {
    title: "Analytics",
    robots: { index: false, follow: false, nocache: true, googleBot: { index: false, follow: false } },
    alternates: { canonical: null },
};

export const dynamic = "force-dynamic";

type Search = Promise<{ period?: string; denied?: string }>;

function Shell({ children }: { children: React.ReactNode }) {
    // Fixed over the site's nav and background; data-lenis-prevent keeps the
    // smooth-scroll library off this scroller.
    return (
        <div className={styles.root} data-lenis-prevent>
            <div className={styles.wrap}>{children}</div>
        </div>
    );
}

function SignIn({ denied }: { denied?: string }) {
    return (
        <div className={styles.signin}>
            <h1 className={styles.title} style={{ fontSize: 22 }}>
                Analytics
            </h1>
            <p className={styles.subtitle}>blueprintstudio.ai</p>
            <form action={signIn}>
                <label htmlFor="password" className="sr-only">
                    Password
                </label>
                <input id="password" name="password" type="password" autoComplete="current-password" placeholder="Password" required autoFocus className={styles.input} />
                {denied && <p className={styles.down} style={{ margin: 0, fontSize: 13 }}>{denied === "wait" ? "Too many tries. Wait 15 minutes." : "That's not it."}</p>}
                <button type="submit" className={styles.buttonPrimary}>
                    Open
                </button>
            </form>
        </div>
    );
}

const dayLabel = (day: string) => new Date(`${day}T12:00:00Z`).toLocaleDateString("en-US", { month: "short", day: "numeric", timeZone: "UTC" });
const hourLabel = (hh: string) => {
    const h = Number(hh);
    return h === 0 ? "12am" : h < 12 ? `${h}am` : h === 12 ? "12pm" : `${h - 12}pm`;
};

export default async function AnalyticsPage({ searchParams }: { searchParams: Search }) {
    if (isProduction() && !dashboardPassword()) notFound();
    const params = await searchParams;
    if (!isSignedIn((await cookies()).get(COOKIE)?.value)) {
        return (
            <Shell>
                <SignIn denied={params.denied} />
            </Shell>
        );
    }

    const period: Period = PERIODS.some((p) => p.key === params.period) ? (params.period as Period) : "7d";
    const now = new Date();
    const range = rangeFor(period, dayOf(now));
    const store = getStore();

    let report: Report;
    let live = 0;
    try {
        const [rows, liveNow] = await Promise.all([store.report(range.prevFrom, range.to), store.live(5)]);
        report = buildReport(rows, range);
        live = liveNow;
    } catch (error) {
        return (
            <Shell>
                <Header period={period} live={null} />
                <div className={styles.error}>
                    Couldn&apos;t read the analytics store ({store.kind}): {error instanceof Error ? error.message : String(error)}. If this is Supabase, has the
                    migration in supabase/migrations been applied?
                </div>
            </Shell>
        );
    }

    return (
        <Shell>
            <Header period={period} live={live} />
            {report.sample > 0 && (
                <div className={styles.banner}>
                    <strong>Sample data.</strong> {fmt(report.sample)} events in this period are made up by scripts/analytics-seed.mjs, in the local dev store only. Remove
                    them with <code>node scripts/analytics-seed.mjs --remove</code>.
                </div>
            )}
            {store.kind === "none" && (
                <div className={styles.banner}>No database is set up, so nothing is being kept. Set ANALYTICS_SUPABASE_URL and ANALYTICS_SUPABASE_SERVICE_KEY.</div>
            )}
            <Dashboard report={report} upToHour={Number(hourOf(now))} />
            <footer className={styles.footer}>
                <div>
                    <p>
                        Our own visits (opened with ?analytics=off) aren&apos;t counted:{" "}
                        {report.internal.n ? `${fmt(report.internal.n)} page views in this period.` : "none in this period."}
                    </p>
                    <p>
                        Visitors are counted without cookies, with a code that changes every day, so someone who comes back on another day counts again. Bots and automated
                        browsers are left out. Data: {store.kind === "supabase" ? "Supabase" : store.kind === "local" ? "local dev store (.analytics/)" : "none"}.
                    </p>
                </div>
                <form action={signOut}>
                    <button type="submit" className={styles.button}>
                        Sign out
                    </button>
                </form>
            </footer>
        </Shell>
    );
}

function Header({ period, live }: { period: Period; live: number | null }) {
    return (
        <header className={styles.header}>
            <div>
                <h1 className={styles.title}>Analytics</h1>
                <p className={styles.subtitle}>blueprintstudio.ai · our own numbers, no cookies</p>
            </div>
            <div className={styles.controls}>
                {live !== null && (
                    <span className={styles.live} title="Visitors with any activity in the last 5 minutes">
                        <span className={`${styles.liveDot} ${live ? "" : styles.liveDotOff}`} />
                        {live === 1 ? "1 person on the site now" : `${fmt(live)} people on the site now`}
                    </span>
                )}
                <nav className={styles.periods} aria-label="Period">
                    {PERIODS.map((p) => (
                        <a key={p.key} href={`/analytics?period=${p.key}`} className={`${styles.period} ${p.key === period ? styles.periodOn : ""}`} aria-current={p.key === period ? "page" : undefined}>
                            {p.label}
                        </a>
                    ))}
                </nav>
            </div>
        </header>
    );
}

function Dashboard({ report: r, upToHour }: { report: Report; upToHour: number }) {
    const before = r.range.period === "today" ? "yesterday" : `the ${r.range.days.length} days before`;
    const visited = r.steps.visited;

    // The trend: days, or for today the hours so far.
    const points: TrendPoint[] =
        r.range.period === "today"
            ? r.trend.slice(0, upToHour + 1).map((p) => ({ ...p, label: hourLabel(p.key) }))
            : r.trend.map((p) => ({ ...p, label: dayLabel(p.key) }));
    const last = points.length - 1;
    // Axis labels: every 6 hours, every day of a week, or weekly across 30 days;
    // one too close to the last label gives way to it.
    const every = r.range.period === "today" ? 6 : r.range.period === "7d" ? 1 : 7;
    const gap = r.range.period === "today" ? 3 : r.range.period === "7d" ? 1 : 4;
    const ticks = points.map((_, i) => i).filter((i) => i === last || (i % every === 0 && last - i >= gap));

    const heroPickers = r.hero.reduce((t, h) => t + h.visitors, 0);

    return (
        <>
            <div className={styles.tiles}>
                <Tile hero label="Visitors" value={big(r.visitors)}>
                    <Delta now={r.visitors} prev={r.prev.visitors} before={before} />
                </Tile>
                <Tile label="Page views" value={big(r.views)}>
                    <Delta now={r.views} prev={r.prev.views} before={before} />
                </Tile>
                <Tile label="Reached the work" value={pct(r.steps.work, visited)}>
                    <div className={styles.tileSub}>{fmt(r.steps.work)} visitors</div>
                </Tile>
                <Tile label="Booked or sent a form" value={fmt(r.steps.converted)}>
                    <div className={styles.tileSub}>
                        {pct(r.steps.converted, visited)} of visitors · {r.prev.converted ? `${fmt(r.prev.converted)} before` : "none before"}
                    </div>
                </Tile>
            </div>

            <Card title="Visitors and page views" note={r.range.period === "today" ? "By hour today, New York time." : "By day, New York time."}>
                {r.views ? (
                    <>
                        <ul className={styles.legend}>
                            <li>
                                <span className={styles.key} style={{ background: "var(--series-1)" }} /> Visitors
                            </li>
                            <li>
                                <span className={styles.key} style={{ background: "var(--series-2)" }} /> Page views
                            </li>
                        </ul>
                        <TrendChart points={points} ticks={ticks} />
                        <details className={styles.details}>
                            <summary>Show as a table</summary>
                            <div className={styles.scroller}>
                                <table className={styles.table}>
                                    <thead>
                                        <tr>
                                            <th>{r.range.period === "today" ? "Hour" : "Day"}</th>
                                            <th>Visitors</th>
                                            <th>Page views</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {points.map((p) => (
                                            <tr key={p.key}>
                                                <td>{p.label}</td>
                                                <td>{fmt(p.visitors)}</td>
                                                <td>{fmt(p.views)}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </details>
                    </>
                ) : (
                    <Empty>No visits in this period yet.</Empty>
                )}
            </Card>

            <div className={styles.grid}>
                <Card
                    title="How far people get on the home page"
                    note={r.homeViews ? `Of ${fmt(r.homeViews)} home page views, the share that reached each section, top to bottom.` : undefined}
                >
                    <BarList
                        items={r.reach.map((s) => ({ key: `${s.index}-${s.section}`, label: `${s.index + 1}. ${humanize(s.section)}`, value: s.n, text: shareFirst(s.n, r.homeViews) }))}
                        of={r.homeViews || undefined}
                        limit={20}
                        empty="No section views yet."
                    />
                </Card>

                <div className={styles.stack}>
                    <Card
                        title="From visit to booking"
                        note="Each step on its own, as a share of visitors: someone who books straight from the hero still counts as booked."
                    >
                        <BarList
                            items={FUNNEL_STEPS.map((s) => ({ key: s.key, label: s.label, value: r.steps[s.key] ?? 0, text: shareFirst(r.steps[s.key] ?? 0, visited) }))}
                            of={visited || undefined}
                            empty="No visits yet."
                        />
                        {r.forms.length > 0 && (
                            <>
                                <h3 className={styles.subhead}>Forms sent</h3>
                                <BarList
                                    items={r.forms.map((f) => ({ key: `${f.form}-${f.ok}`, label: humanize(f.form), sub: f.ok ? "" : "(failed)", value: f.n }))}
                                />
                            </>
                        )}
                    </Card>

                    <Card title="How far down the home page they scroll" note="Share of home page views that scrolled at least this far.">
                        <BarList
                            items={r.scroll.map((s) => ({ key: String(s.percent), label: s.percent === 100 ? "To the end" : `${s.percent}%`, value: s.n, text: shareFirst(s.n, r.homeViews) }))}
                            of={r.homeViews || undefined}
                            empty="No scroll marks yet."
                        />
                    </Card>
                </div>
            </div>

            <Card
                title="Hero words"
                note={
                    heroPickers
                        ? `${fmt(r.heroOpens.visitors)} visitors tried the words (rested on one or picked one) and ${fmt(heroPickers)} picked a word. Below: what they did next, credited to the last word picked before it.`
                        : "Which word visitors pick in the hero, and what they do after."
                }
            >
                {r.hero.length ? (
                    <>
                        <BarList items={r.hero.map((h) => ({ key: h.key, label: humanize(h.key), value: h.visitors, text: withShare(h.visitors, heroPickers) }))} limit={10} />
                        <h3 className={styles.subhead}>After picking each word</h3>
                        <div className={styles.scroller}>
                            <table className={`${styles.table} ${styles.matrix}`}>
                                <thead>
                                    <tr>
                                        <th>Word, picked by</th>
                                        {HERO_ACTIONS.map((a) => (
                                            <th key={a.key}>{a.label}</th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {r.heroThen.map((h) => (
                                        <tr key={h.variant}>
                                            <td>
                                                {humanize(h.variant)}
                                                <div className={styles.labelSub}>{fmt(h.visitors)} visitors</div>
                                            </td>
                                            {HERO_ACTIONS.map((a) => (
                                                <td key={a.key}>
                                                    <RateCell part={h.actions[a.key]} of={h.visitors} />
                                                </td>
                                            ))}
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        <RateScale />
                    </>
                ) : (
                    <Empty>No words picked yet.</Empty>
                )}
            </Card>

            <div className={styles.grid}>
                <Card title="Where visitors come from" note="The site that sent them, counted once per visit.">
                    <BarList items={r.sources.map((s) => ({ key: s.key || "direct", label: s.label, value: s.visitors }))} />
                </Card>
                <Card title="Campaigns" note="Links tagged with utm_source (and Google Ads clicks).">
                    <BarList items={r.campaigns.map((c) => ({ key: c.key, label: c.label, sub: c.sub, value: c.visitors }))} empty="No tagged links in this period." />
                </Card>
            </div>

            <div className={styles.grid}>
                <Card title="Top pages" note="Page views per page.">
                    <BarList items={r.pages.map((p) => ({ key: p.key, label: p.key, value: p.n, title: `${fmt(p.visitors)} visitors` }))} limit={10} />
                </Card>
                <Card title="Countries" note="Visitors, from the network they browse from.">
                    <BarList items={r.countries.map((c) => ({ key: c.key || "unknown", label: c.label, value: c.visitors, text: withShare(c.visitors, r.visitors) }))} limit={10} />
                </Card>
            </div>

            <div className={styles.grid}>
                <Card title="Devices" note="Visitors by kind of device and browser.">
                    <BarList items={r.devices.map((d) => ({ key: d.key, label: d.label, value: d.visitors, text: withShare(d.visitors, r.visitors) }))} />
                    <h3 className={styles.subhead}>Browsers</h3>
                    <BarList items={r.browsers.map((b) => ({ key: b.key, label: b.label, value: b.visitors, text: withShare(b.visitors, r.visitors) }))} limit={6} />
                </Card>
                <Card title="Menu clicks" note="Which menu items people use, and in which menu.">
                    <BarList
                        items={r.nav.map((n) => ({
                            key: n.key,
                            label: n.label,
                            sub: r.navRows
                                .filter((x) => x.item === n.key)
                                .sort((x, y) => y.n - x.n)
                                .map((x) => `${x.menu || "?"} ${fmt(x.n)}`)
                                .join(" · "),
                            value: n.n,
                        }))}
                        limit={10}
                        empty="No menu clicks yet."
                    />
                    {r.navMenus.length > 0 && (
                        <>
                            <h3 className={styles.subhead}>By menu</h3>
                            <BarList items={r.navMenus.map((m) => ({ key: m.key, label: humanize(m.key), value: m.n }))} />
                        </>
                    )}
                </Card>
            </div>

            <div className={styles.grid}>
                <Card title="Button clicks" note="Calls to action, by button and where on the page it sits.">
                    <BarList items={r.ctas.map((c) => ({ key: c.key, label: c.label, sub: c.sub, value: c.n, title: `${fmt(c.visitors)} visitors` }))} limit={10} empty="No button clicks yet." />
                </Card>
                <Card
                    title="The reel"
                    note={r.homeViews ? `How much of the reel people saw while it was on screen, of ${fmt(r.homeViews)} home page views. ${r.reelOpens ? `${fmt(r.reelOpens)} opened it full screen (${pct(r.reelOpens, r.homeViews)}).` : "Nobody opened it full screen."}` : "How much of the reel people saw on the home page, and how many opened it full screen."}
                >
                    {r.homeViews ? (
                        <BarList
                            items={r.reel.map((p) => ({ key: String(p.percent), label: p.percent === 100 ? "Saw it all" : `Saw ${p.percent}%`, value: p.n, text: shareFirst(p.n, r.homeViews) }))}
                            of={r.homeViews}
                        />
                    ) : (
                        <Empty>Nobody saw the home page in this period.</Empty>
                    )}
                </Card>
            </div>

            <div className={styles.grid}>
                <Card title="Questions opened" note="FAQ answers people opened.">
                    <BarList items={r.faq.map((f) => ({ key: f.key, label: f.key, value: f.n }))} limit={10} empty="No questions opened yet." />
                </Card>
                <Card title="Projects opened" note="Work people clicked into.">
                    <BarList items={r.projects.map((p) => ({ key: p.key, label: p.label, value: p.n }))} limit={10} empty="No projects opened yet." />
                    {r.outbound.length > 0 && (
                        <>
                            <h3 className={styles.subhead}>Links out</h3>
                            <BarList items={r.outbound.map((o) => ({ key: o.key, label: o.key.replace(/^https?:\/\/(www\.)?/, ""), value: o.n }))} limit={6} />
                        </>
                    )}
                </Card>
            </div>

            <Vitals report={r} />

            <Card title="Every event" note="All the events recorded in this period, including any added later.">
                <BarList items={r.events.map((e) => ({ key: e.key, label: e.key, value: e.n, title: `${fmt(e.visitors)} visitors` }))} limit={30} empty="No events yet." />
            </Card>
        </>
    );
}

function Vitals({ report: r }: { report: Report }) {
    const rows = [r.vitals.sitewide, ...r.vitals.pages.slice(0, 8)];
    return (
        <Card
            title="Site speed"
            note="Web vitals from real visits: the value 75% of page loads beat (p75), per page. Good, needs work and poor are Google's thresholds. The first three are the Core Web Vitals."
        >
            {r.vitals.sitewide.loads ? (
                <>
                    <div className={styles.scroller}>
                        <table className={styles.table}>
                            <thead>
                                <tr>
                                    <th>Page</th>
                                    {VITAL_ORDER.map((m) => (
                                        <th key={m}>
                                            {m}
                                            <br />
                                            <span style={{ fontWeight: 400 }}>{VITAL_BANDS[m].label.toLowerCase()}</span>
                                        </th>
                                    ))}
                                    <th>Loads</th>
                                </tr>
                            </thead>
                            <tbody>
                                {rows.map((row) => (
                                    <tr key={row.path}>
                                        <td style={row.path === "All pages" ? { fontWeight: 600 } : undefined}>{row.path}</td>
                                        {VITAL_ORDER.map((m) => {
                                            const v = row.metrics[m];
                                            return (
                                                <td key={m}>
                                                    {v ? (
                                                        <span className={v.samples < 5 ? styles.few : undefined} title={`${fmt(v.samples)} samples`}>
                                                            <Status band={v.band}>{formatVital(m, v.value)}</Status>
                                                        </span>
                                                    ) : (
                                                        <span className={styles.few}>–</span>
                                                    )}
                                                </td>
                                            );
                                        })}
                                        <td>{fmt(row.loads)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    <StatusKey />
                </>
            ) : (
                <Empty>No speed samples yet.</Empty>
            )}
        </Card>
    );
}
