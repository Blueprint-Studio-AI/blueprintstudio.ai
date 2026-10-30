// The home page's reel picks up where the visitor left it, later in the same
// visit (a reload, Back). Leaving, the page keeps where the film was and a still
// of the frame on screen in the visit's storage. Coming back, the still covers
// the frame from the first paint, the film is cued to the same moment under it,
// and fades in over it once it's there: the page comes back on the frame it left.

/** sessionStorage: { src, t }, where the reel was. */
export const REEL_AT = "bp:reel-at";
/** sessionStorage: { wide, url }, the frame on screen as a JPEG data URL, and whether it was the full reel. */
export const REEL_STILL = "bp:reel-still";
/** The full reel from here up; below it, the 2:3 phone reel. */
export const WIDE_REEL = "(min-width: 640px)";

/**
 * Puts the still up as --reel-still (the reel's cover uses it) when the page
 * comes back without the opening, and it's of the film this window plays.
 * Self-contained (the keys are spelled out), so the layout can inline it as a
 * script that runs before the first paint, after introScript has marked the skip.
 */
export function showReelStill() {
    try {
        const root = document.documentElement;
        if (location.pathname !== "/" || root.getAttribute("data-intro") !== "skip") return;
        const still = JSON.parse(sessionStorage.getItem("bp:reel-still") ?? "null");
        if (still && still.wide === matchMedia("(min-width: 640px)").matches) root.style.setProperty("--reel-still", `url("${still.url}")`);
    } catch {}
}

/** For the layout's head, after introScript. */
export const reelStillScript = `(${showReelStill.toString()})()`;
