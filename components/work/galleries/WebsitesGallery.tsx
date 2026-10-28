import { workShowcase, type ShownWork } from "@/lib/work";
import Draft from "../Draft";
import { TEXT_INSET, WIDE } from "../WorkHeader";
import type { GalleryProps } from ".";
import Computer from "./websites/Computer";
import type { SiteTab } from "./websites/types";

// /work/websites opens on a desktop display with a browser on it, each site
// we built a tab. Where the site is still live and still ours, the tab shows
// the real thing in a sandboxed frame you can scroll and click; where it
// isn't, our build as it shipped, or our own capture of it. Never a client's
// current site we didn't make.

type Source =
  /** Live, and still the version we made. */
  | { kind: "live"; url: string; heavy?: boolean }
  /** Changed or gone where it shipped, but our build is still deployed. */
  | { kind: "build"; url: string; shipped: string; title?: string }
  /** Nothing we can frame: our capture. */
  | { kind: "capture"; shipped: string };

// Where each site can be seen, checked 2026-10-28 against our kit captures
// and the client registry. Work missing here shows its capture.
const SOURCES: Record<string, Source> = {
  // The live page is our kit capture; honeybtc/landing-page is our build.
  "honeyb-website": { kind: "live", url: "https://www.honeybtc.com/" },
  // The live page is our kit capture; the brand and site are ours.
  "jinba-website": { kind: "live", url: "https://jinba.io/" },
  // The live page is our kit capture; "the live pavepower.com is ours" (Tyler).
  "pavepower-website": { kind: "live", url: "https://www.pavepower.com/" },
  // Our build (Blueprint-Studio-AI/hashplay-site), still deployed; hashplay.xyz is parked.
  // Its game reels make it about 23 MB to load, so phones keep the capture.
  "hashplay-website": { kind: "live", url: "https://hashplay-site.vercel.app/", heavy: true },
  // arch.network/chain is a new design that isn't ours; our build (Arch-Network/arch-site) is still deployed.
  "arch-chain": { kind: "build", url: "https://arch-site-drab.vercel.app/chain", shipped: "arch.network/chain", title: "Chain | Arch" },
  // arch.network/ecosystem now redirects into the new site; our build's page is still deployed.
  "arch-site": { kind: "build", url: "https://arch-site-drab.vercel.app/ecosystem", shipped: "arch.network/ecosystem", title: "Ecosystem | Arch" },
  // perena.org has been redesigned since and refuses framing.
  "perena-landing": { kind: "capture", shipped: "perena.org" },
  // Today's idscanner.com isn't ours; our 2024 build's deployments are behind a login.
  "tokenworks-idvisor-page": { kind: "capture", shipped: "idscanner.com" },
};

// The tab icons: each site's own favicon where it's our build, else the
// client's mark from our logo files (TokenWorks' is a letter of its wordmark).
const FAVICONS: Record<string, string> = {
  perena: "/media/favicons/perena.png",
  honeyb: "/brands/honeyb/logos/honeyb-glyph-color.svg",
  "arch-network": "/media/favicons/arch.png",
  jinba: "/brands/jinba/dl/glyph.svg",
  tokenworks: "/media/favicons/tokenworks.png",
  pavepower: "/media/favicons/pavepower.png",
  hashplay: "/media/favicons/hashplay.svg",
};

/** Each page's top colour, for the phone's status bar (black where the phone shows a capture). */
const TINTS: Record<string, string> = {
  "honeyb-website": "#FFFFFF",
  "jinba-website": "#F4F1EC",
  "pavepower-website": "#FFFFFF",
  "hashplay-website": "#0A0A0A",
  "arch-chain": "#FBFAF6",
  "arch-site": "#172E3E",
};

/** "https://www.arch.network/chain" as a browser shows it: arch.network, then /chain. */
function split(url: string) {
  const { hostname, pathname } = new URL(url.includes("://") ? url : `https://${url}`);
  return { host: hostname.replace(/^www\./, ""), path: pathname === "/" ? "" : pathname.replace(/\/$/, "") };
}

/**
 * Whether a site is still up and still lets other sites frame it
 * (X-Frame-Options, CSP frame-ancestors), checked at most hourly. A check
 * that can't connect counts as yes: the browser keeps the capture up if the
 * page never loads.
 */
async function frameable(url: string): Promise<boolean> {
  try {
    const res = await fetch(url, { method: "HEAD", next: { revalidate: 3600 }, signal: AbortSignal.timeout(3000) });
    // Gone (a 404 or 410 would load as a page and replace the capture); 405 is only a server that won't answer HEAD.
    if (!res.ok && res.status !== 405) return false;
    const xfo = res.headers.get("x-frame-options")?.toLowerCase() ?? "";
    if (xfo.includes("deny") || xfo.includes("sameorigin")) return false;
    const ancestors = res.headers.get("content-security-policy")?.match(/frame-ancestors([^;]*)/i)?.[1] ?? null;
    return ancestors === null || /(^|\s)(\*|https:|https:\/\/blueprintstudio\.ai)(\s|$)/.test(ancestors);
  } catch {
    return true;
  }
}

async function tabOf(work: ShownWork, works: ShownWork[]): Promise<SiteTab> {
  const { client, kit } = work;
  const source: Source = SOURCES[work.slug] ?? { kind: "capture", shipped: work.liveUrl ?? "" };
  const frame = source.kind !== "capture" && (await frameable(source.url)) ? source.url : undefined;
  const twice = works.filter((w) => w.client.slug === client.slug).length > 1;
  // A reel's stretch is an edited film (Perena's zooms in), not a screen, so it
  // never plays here; a kit's own clip is a recording of the site, and plays
  // when there's no live page.
  const recording = !frame && kit.hero.src?.startsWith(`/media/kits/${work.slug}/`);
  const live = source.kind === "live";
  return {
    key: work.slug,
    title: (source.kind === "build" && source.title) || (twice ? work.title : client.name),
    favicon: FAVICONS[client.slug],
    hero: {
      alt: kit.hero.alt,
      poster: kit.hero.poster,
      ...(recording ? { src: kit.hero.src, clip: kit.hero.clip, posterTime: kit.hero.posterTime } : {}),
      ...(kit.hero.vertical ? { vertical: kit.hero.vertical } : {}),
    },
    frame,
    heavy: source.kind === "live" && source.heavy,
    address: { ...split(live ? source.url : source.shipped), live },
    visit: live ? (work.liveUrl ?? source.url) : undefined,
    tint: (frame && !(source.kind === "live" && source.heavy) && TINTS[work.slug]) || "#000000",
    name: client.name,
    year: work.year,
    label: work.title,
    summary: work.summary,
    // The Visit link lives in the address bar.
    links: workShowcase(work).links.filter((l) => !l.external).map(({ label, href }) => ({ label, href })),
  };
}

export default async function WebsitesGallery({ works }: GalleryProps) {
  if (works.length === 0) return null;
  const tabs = await Promise.all(works.map((w) => tabOf(w, works)));
  return (
    <div className={`${WIDE} pb-16 sm:pb-24 lg:pb-32`}>
      <div className={TEXT_INSET}>
        {/* New copy, so it's marked Draft outside production. */}
        <Computer tabs={tabs} labels={{ archived: <Draft>Archived</Draft>, tap: <Draft>Tap to use the site</Draft> }} />
      </div>
    </div>
  );
}
