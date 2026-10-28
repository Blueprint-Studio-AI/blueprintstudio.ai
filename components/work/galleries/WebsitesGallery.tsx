import { workShowcase, type ShownWork } from "@/lib/work";
import Draft from "../Draft";
import { TEXT_INSET, WIDE } from "../WorkHeader";
import type { GalleryProps } from ".";
import Computer from "./websites/Computer";
import type { SiteTab } from "./websites/types";

// /work/websites opens on a desktop display with a browser on it, each site
// we built a tab. The screen shows our own captures of the site (the kit's
// poster, and its screen recording where it has one), never the live site.

// Each client's mark, from our logo files: the brand kits' glyphs, or cropped
// from /logos (TokenWorks and Pave Power have wordmarks only, so a letter of it).
const FAVICONS: Record<string, string> = {
  perena: "/media/favicons/perena.png",
  honeyb: "/brands/honeyb/logos/honeyb-glyph-color.svg",
  "arch-network": "/brands/arch/logos/glyph.svg",
  jinba: "/brands/jinba/dl/glyph.svg",
  tokenworks: "/media/favicons/tokenworks.png",
  pavepower: "/media/favicons/pavepower.png",
  hashplay: "/media/favicons/hashplay.png",
};

/** "https://www.arch.network/chain" as a browser shows it: arch.network, then /chain. */
function addressOf(url: string): SiteTab["address"] {
  const { hostname, pathname } = new URL(url);
  return { host: hostname.replace(/^www\./, ""), path: pathname === "/" ? "" : pathname.replace(/\/$/, ""), href: url };
}

function tabOf(work: ShownWork, works: ShownWork[]): SiteTab {
  const { client, kit } = work;
  const twice = works.filter((w) => w.client.slug === client.slug).length > 1;
  // A reel's stretch is an edited film (Perena's zooms in), not a screen, so
  // the browser shows its poster; a kit's own clip is a recording of the site.
  const recording = kit.hero.src?.startsWith(`/media/kits/${work.slug}/`);
  return {
    key: work.slug,
    title: twice ? work.title : client.name,
    favicon: FAVICONS[client.slug],
    hero: {
      alt: kit.hero.alt,
      poster: kit.hero.poster,
      ...(recording ? { src: kit.hero.src, clip: kit.hero.clip, posterTime: kit.hero.posterTime } : {}),
    },
    address: work.liveUrl ? addressOf(work.liveUrl) : undefined,
    archived: work.status === "archived",
    name: client.name,
    year: work.year,
    label: work.title,
    summary: work.summary,
    // The Visit link lives in the address bar.
    links: workShowcase(work).links.filter((l) => !l.external).map(({ label, href }) => ({ label, href })),
  };
}

export default function WebsitesGallery({ works }: GalleryProps) {
  if (works.length === 0) return null;
  return (
    <div className={`${WIDE} pb-16 sm:pb-24 lg:pb-32`}>
      <div className={TEXT_INSET}>
        {/* "Archived" is new copy, so it's marked Draft outside production. */}
        <Computer tabs={works.map((w) => tabOf(w, works))} archived={<Draft>Archived</Draft>} />
      </div>
    </div>
  );
}
