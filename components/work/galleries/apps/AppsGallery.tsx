import { workShowcase, type ShownWork } from "@/lib/work";
import { TEXT_INSET, WIDE } from "../../WorkHeader";
import type { GalleryProps } from "..";
import HomeScreen, { type AppIcon, type AppItem, type AppScreen } from "./HomeScreen";

// /work/apps's gallery: the apps as icons on a tablet's home screen (on a
// phone, the phone's own screen). Each opens onto its real screens from its
// kit: the hero (or its clip), the phone screen where there is one, the stills.

/** Icons from each client's own mark, our logo files. */
const ICONS: Record<string, AppIcon> = {
  livingip: { kind: "mark", src: "/media/galleries/apps/livingip-mark.png" },
  // The IDScanner shield, as the portal we designed carries it.
  tokenworks: { kind: "shield" },
  bump: { kind: "tile", src: "/logos-match-height/bump.png" },
  herth: { kind: "mark", src: "/media/galleries/apps/herth-mark.png" },
};

/** What each kit's phone screen shows (its hero's alt describes the wide frame, not this). */
const PHONE_ALT: Record<string, string> = {
  "tokenworks-app": "The customer portal on a phone: My Devices",
  "herth-app": "Herth’s map search on a phone",
};

/**
 * Heroes that are presentations rather than screens: LivingIP's is the app in
 * a phone (and its clip a laptop), Herth's its site in a browser window on a
 * green ground. Inside the tablet they'd read as a device in a device, so these
 * apps open on their own captures; the heroes stay in the pieces below.
 */
const PRESENTATION_HERO = new Set(["livingip-app", "herth-app"]);

/** The stills in the order they read best as an app's screens, where not the kit's. */
const STILL_ORDER: Record<string, number[]> = { "livingip-app": [2, 1, 0] };

function screens(work: ShownWork): AppScreen[] {
  const { hero, stills } = work.kit;
  const list: AppScreen[] = [];
  if (hero.vertical) list.push({ src: hero.vertical.poster, alt: PHONE_ALT[work.slug] ?? `${work.title}, on a phone`, shape: "tall" });
  if (!PRESENTATION_HERO.has(work.slug)) {
    // The full screen leads; the phone screen pairs with the first still after it.
    list.unshift({
      src: hero.poster,
      alt: hero.alt,
      shape: "wide",
      ...(hero.src ? { clip: { src: hero.src, range: hero.clip, start: hero.posterTime } } : {}),
    });
  }
  for (const i of STILL_ORDER[work.slug] ?? [0, 1, 2]) list.push({ src: stills[i].src, alt: stills[i].alt, shape: "square" });
  return list;
}

function app(work: ShownWork): AppItem {
  return {
    slug: work.slug,
    name: work.client.name,
    title: work.title,
    year: work.year,
    summary: work.summary,
    icon: ICONS[work.client.slug] ?? { kind: "letter" },
    screens: screens(work),
    links: workShowcase(work).links,
  };
}

export default function AppsGallery({ works }: GalleryProps) {
  return (
    // The same space below it as between the pieces (STACK).
    <div className={`${WIDE} ${TEXT_INSET} mb-20 sm:mb-24 lg:mb-28`}>
      <HomeScreen apps={works.map(app)} />
    </div>
  );
}
