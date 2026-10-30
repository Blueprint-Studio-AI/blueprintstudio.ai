// The home page's opening (the loader, then the reel full screen) plays on a
// first visit, not again on a reload, the back button or a return within a week
// of the last visit.
// For testing, ?intro=on or ?intro=off forces it on or off in this browser until
// ?intro=auto puts it back to normal.

/**
 * Whether to skip the opening. Self-contained (no outside names), so the layout
 * can inline it as a script that runs before the first paint.
 */
export function introSkipped(): boolean {
    try {
        const flag = new URLSearchParams(location.search).get("intro");
        if (flag === "on" || flag === "off") localStorage.setItem("bp:intro", flag);
        else if (flag === "auto") localStorage.removeItem("bp:intro");
        const forced = localStorage.getItem("bp:intro");
        if (forced) return forced === "off";
        if (sessionStorage.getItem("bp:intro-seen")) return true;
        return Date.now() - Number(localStorage.getItem("bp:intro-at")) < 7 * 24 * 60 * 60 * 1000;
    } catch {
        return false; // storage blocked: play it
    }
}

/** The opening has played (or been skipped): don't play it again soon. */
export function introSeen() {
    try {
        sessionStorage.setItem("bp:intro-seen", "1");
        localStorage.setItem("bp:intro-at", String(Date.now()));
    } catch {}
}

/** For the layout's head: marks <html data-intro="skip"> before the first paint, so the loader never shows. */
export const introScript = `(${introSkipped.toString()})()&&document.documentElement.setAttribute("data-intro","skip")`;
