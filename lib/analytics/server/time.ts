// Days and hours in one time zone, so "today" on the dashboard is Tyler's today.
// The SQL migration uses the same zone; change both together.

export const REPORT_TIME_ZONE = "America/New_York";

const dayFormat = new Intl.DateTimeFormat("en-CA", {
    timeZone: REPORT_TIME_ZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
});
const hourFormat = new Intl.DateTimeFormat("en-GB", { timeZone: REPORT_TIME_ZONE, hour: "2-digit", hourCycle: "h23" });

/** YYYY-MM-DD in the report time zone. */
export const dayOf = (date: Date) => dayFormat.format(date);

/** 00-23 in the report time zone. */
export const hourOf = (date: Date) => hourFormat.format(date).padStart(2, "0");

/** A YYYY-MM-DD day moved by whole days. */
export function addDays(day: string, days: number) {
    const d = new Date(`${day}T12:00:00Z`);
    d.setUTCDate(d.getUTCDate() + days);
    return d.toISOString().slice(0, 10);
}

/** Every day from `from` to `to`, inclusive. */
export function daysBetween(from: string, to: string) {
    const out: string[] = [];
    for (let d = from; d <= to; d = addDays(d, 1)) out.push(d);
    return out;
}
