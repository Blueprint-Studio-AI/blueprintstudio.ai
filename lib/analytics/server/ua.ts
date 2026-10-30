// What a user agent says about the visitor, in broad classes only: bot or not,
// phone, tablet or desktop, and the browser and OS family. No versions, so a
// row can't be narrowed down to one device.

// Crawlers, link previews, uptime checks, HTTP libraries and headless browsers.
const BOT = /bot\b|bot\/|crawl|spider|slurp|scrape|headless|lighthouse|pagespeed|gtmetrix|pingdom|uptime|monitor|statuscake|preview|prerender|inspectiontool|googleother|mediapartners|apis-google|facebookexternalhit|embedly|quora link|vercel|curl\/|wget|python|httpx|aiohttp|axios|node-fetch|undici|go-http|java\/|okhttp|libwww|perl|ruby|php\/|postman|insomnia|phantomjs|playwright|puppeteer|selenium|cypress/i;

export function isBot(ua: string) {
    return !ua || ua.length < 20 || BOT.test(ua);
}

/**
 * Whether the UA looks like an automated browser that the dev override lets
 * through (ANALYTICS_ALLOW_AUTOMATION): Playwright's headless Chrome says
 * "HeadlessChrome", and nothing else about it is a bot.
 */
export const isHeadlessChrome = (ua: string) => /HeadlessChrome/.test(ua) && !BOT.test(ua.replace(/HeadlessChrome/g, "Chrome"));

export type Client = { device: string; browser: string; os: string };

/** `screen` is the screen width in CSS pixels, which tells iPads (that say "Macintosh") apart. */
export function classify(ua: string, screen?: number): Client {
    let os = /iPhone|iPad|iPod/.test(ua)
        ? "iOS"
        : /Android/.test(ua)
          ? "Android"
          : /Windows/.test(ua)
            ? "Windows"
            : /Mac OS X|Macintosh/.test(ua)
              ? "macOS"
              : /CrOS/.test(ua)
                ? "ChromeOS"
                : /Linux/.test(ua)
                  ? "Linux"
                  : "Other";

    let device = "desktop";
    if (/iPad|Tablet|Silk|Kindle/.test(ua) || (/Android/.test(ua) && !/Mobile/.test(ua))) device = "tablet";
    else if (/Mobi|iPhone|iPod|Android/.test(ua)) device = "phone";
    // iPadOS asks for the desktop site and says "Macintosh"; only the screen gives
    // it away (iPads report 744-1032 wide, Macs 1280 and up).
    else if (os === "macOS" && screen && screen >= 700 && screen <= 1100) {
        device = "tablet";
        os = "iOS";
    }

    const browser = /Edg\//.test(ua)
        ? "Edge"
        : /OPR\/|Opera/.test(ua)
          ? "Opera"
          : /SamsungBrowser/.test(ua)
            ? "Samsung Internet"
            : /Firefox\/|FxiOS/.test(ua)
              ? "Firefox"
              : /Chrome\/|CriOS/.test(ua)
                ? "Chrome"
                : /Safari\//.test(ua)
                  ? "Safari"
                  : "Other";

    return { device, browser, os };
}
