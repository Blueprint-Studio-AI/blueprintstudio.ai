// The dashboard's lock: one password (ANALYTICS_PASSWORD), and a cookie that
// holds an HMAC of it, scoped to /analytics. Changing the password signs
// everyone out. Without a password the dashboard is open in development and
// doesn't exist in production.

import { createHash, createHmac, timingSafeEqual } from "node:crypto";

export const COOKIE = "bp_analytics";
export const COOKIE_PATH = "/analytics";

export const dashboardPassword = () => process.env.ANALYTICS_PASSWORD ?? "";
export const isProduction = () => process.env.NODE_ENV === "production";

export const sessionToken = (password: string) =>
    createHmac("sha256", password).update("blueprintstudio.ai analytics dashboard").digest("hex");

/** Constant-time comparison of any two strings. */
export function sameString(a: string, b: string) {
    const x = createHash("sha256").update(a).digest();
    const y = createHash("sha256").update(b).digest();
    return timingSafeEqual(x, y);
}

export function isSignedIn(cookie: string | undefined) {
    const password = dashboardPassword();
    if (!password) return !isProduction();
    return !!cookie && sameString(cookie, sessionToken(password));
}
