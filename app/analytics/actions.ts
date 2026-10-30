"use server";

import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";
import { COOKIE, COOKIE_PATH, dashboardPassword, isProduction, sameString, sessionToken } from "./auth";

// Ten tries per network per quarter hour, then a wait.
const WINDOW_MS = 15 * 60_000;
const MAX_TRIES = 10;
const tries = new Map<string, { count: number; start: number }>();

function tooMany(ip: string) {
    const now = Date.now();
    const entry = tries.get(ip);
    if (!entry || now - entry.start > WINDOW_MS) {
        tries.set(ip, { count: 1, start: now });
        return false;
    }
    return ++entry.count > MAX_TRIES;
}

export async function signIn(form: FormData) {
    const ip = (await headers()).get("x-forwarded-for")?.split(",")[0].trim() || "unknown";
    if (tooMany(ip)) redirect("/analytics?denied=wait");
    const password = dashboardPassword();
    if (!password || !sameString(String(form.get("password") ?? ""), password)) redirect("/analytics?denied=1");
    (await cookies()).set(COOKIE, sessionToken(password), {
        httpOnly: true,
        secure: isProduction(),
        sameSite: "strict",
        path: COOKIE_PATH,
        maxAge: 30 * 24 * 60 * 60,
    });
    redirect("/analytics");
}

export async function signOut() {
    (await cookies()).set(COOKIE, "", { path: COOKIE_PATH, maxAge: 0 });
    redirect("/analytics");
}
