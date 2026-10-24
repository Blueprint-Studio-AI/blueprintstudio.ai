import type { TestimonialId } from "./testimonials";
// The registry's public fields (tier, years, engagement, work types), synced by
// scripts/sync-registry.mjs. Re-run it when the registry changes.
import registry from "./registry.json";

// Every client we've worked with, and the work we did for each. One file, so
// the home page's Featured Work, /work, the service and industry pages and the
// client pages all show the same work and the same images.
//
// Two levels:
// - A client is the relationship: years, engagement, a line on it, a quote.
// - A piece of work (`work[]`) is one deliverable for that client, in a year.
//   Work we show carries a kit: one hero (the 16:9 clip and its poster, plus a
//   vertical cut) and exactly three square stills, all in one treatment (work
//   on a light-grey field, top-anchored, running off the bottom edge). Work
//   without a kit is listed, not shown.
//
// The field names follow the client registry (review-2026-10-23/client-registry/
// registry.json: slug, name, industry, years, engagement, trading, testimonial,
// work[{ title, type, year, status, visibility, source }], images, flags), so
// it can be filled from there. Kit files live in /public/media/kits/<work slug>/
// and are made by the kit composer, not by hand.

// What we made. The first four have /work/<deliverable> pages once at least
// two pieces of work carry them (lib/work).
export type Deliverable = "websites" | "apps" | "branding" | "launch-videos" | "decks";
export type WorkType =
  | Deliverable
  | "service-design"
  | "ai-automation"
  | "content"
  | "development"
  | "research"
  | "merch"
  | "video"
  | "motion"
  | "events"
  | "print"
  | "workshops";

// The client's field, as their own copy and media describe it.
export type Industry = "crypto" | "ai" | "gaming";

export const deliverableLabels: Record<Deliverable, string> = {
  websites: "Websites",
  apps: "Apps",
  branding: "Branding",
  "launch-videos": "Launch videos",
  decks: "Decks",
};

/** One of a kind, for meta lines and the All work list ("Website", "Launch videos" when there are several). */
export const workTypeLabels: Record<WorkType, { one: string; many: string }> = {
  websites: { one: "Website", many: "Websites" },
  apps: { one: "App", many: "Apps" },
  branding: { one: "Brand", many: "Brands" },
  "launch-videos": { one: "Launch video", many: "Launch videos" },
  decks: { one: "Pitch deck", many: "Pitch decks" },
  "service-design": { one: "Service design", many: "Service design" },
  "ai-automation": { one: "AI automation", many: "AI automation" },
  content: { one: "Content", many: "Content" },
  development: { one: "Development", many: "Development" },
  research: { one: "Research", many: "Research" },
  merch: { one: "Merch", many: "Merch" },
  video: { one: "Video", many: "Videos" },
  motion: { one: "Motion", many: "Motion" },
  events: { one: "Event design", many: "Event design" },
  print: { one: "Print", many: "Print" },
  workshops: { one: "Workshop", many: "Workshops" },
};

export const industryLabels: Record<Industry, string> = {
  crypto: "Crypto",
  ai: "AI",
  gaming: "Gaming",
};

/** A clip (or a still) with its poster. `clip` is the stretch to loop, [start, end] in seconds. */
export interface KitMedia {
  /** mp4; leave out for a still hero. */
  src?: string;
  poster: string;
  clip?: [number, number];
  /** Where the poster was taken, inside `clip`: playback starts there so poster and clip line up. */
  posterTime?: number;
}

export interface KitStill {
  src: string;
  alt: string;
}

export interface MediaKit {
  /** 16:9 for desktop; `vertical` is the 2:3 (or 4:5) cut for phones. */
  hero: KitMedia & { alt: string; vertical?: KitMedia };
  /** Exactly three, square, in the kit treatment. The first leads wherever one still stands for the work. */
  stills: [KitStill, KitStill, KitStill];
}

export interface WorkItem {
  slug: string;
  /** Full name, e.g. "AgeVisor 3 launch film". */
  title: string;
  /** Short name for a client's meta line, e.g. "AgeVisor 3 film". */
  label: string;
  type: WorkType;
  year: string;
  /** live: it's up and can be visited; shipped: it went out (a film, an event); archived: no longer up. */
  status: "live" | "shipped" | "archived";
  /** Only public work is shown; private work is listed (e.g. a portal behind a login); needs-ok waits on Tyler. */
  visibility: "public" | "private" | "needs-ok";
  /** Where the work and its media come from. */
  source?: string;
  /** One line on what it is. */
  summary?: string;
  liveUrl?: string;
  /** Slug of its /brands/<slug> case study. */
  brandPage?: string;
  kit?: MediaKit;
  /**
   * A deck's slides for /work/decks (16:9), after its cover (the kit's hero).
   * Sensitive figures and names are blurred into the files themselves, never
   * with CSS over the original; `blurred` puts a note on the slide.
   */
  deck?: { coverBlurred?: boolean; slides: { src: string; alt: string; blurred?: boolean }[] };
  /** Show this piece on its deliverable page even though its client is archived. */
  showWhenArchived?: boolean;
}

export interface Client {
  slug: string;
  name: string;
  industry: Industry[];
  /** "2023–2026", or one year. Empty when we don't know. */
  years: string;
  engagement: "Partnership" | "Project" | "Unknown";
  /** False once the client has closed or its site has gone. */
  trading: boolean;
  /**
   * Where the client shows (the registry's tier): Feature, on the home page's
   * Featured Work and the top of /work (about eight at most); Show, on the
   * /work pages; Archive, only in the All work list; Hide, nowhere.
   */
  tier: "Feature" | "Show" | "Archive" | "Hide";
  testimonial?: TestimonialId;
  /** The relationship, told plainly. */
  summary?: string;
  /** In order of strength: the first shown piece leads wherever the client is shown. */
  work: WorkItem[];
  /** The registry's picks, for clients whose work has no kit yet. */
  images?: { hero?: string; stills?: string[]; alternates?: string[] };
  flags?: string[];
}

type RegistryClient = (typeof registry.clients)[number];
const fromRegistry = (slug: string): RegistryClient | undefined => registry.clients.find((c) => c.slug === slug);

/** A client's tier, from the registry; Archive if the registry doesn't know it. */
function tierOf(slug: string): Client["tier"] {
  const tier = fromRegistry(slug)?.tier;
  return tier === "Feature" || tier === "Show" || tier === "Hide" ? tier : "Archive";
}

const KITS = "/media/kits";
const PROJECTS = "/media/projects";

/** A kit's standard files, /media/kits/<slug>/s1-3.jpg and hero(.mp4|.jpg) with -v for the phone cut. */
function kit(
  slug: string,
  opts: {
    alt: string;
    stills: [string, string, string];
    hero?: Partial<KitMedia>;
    vertical?: Partial<KitMedia> | false;
    /** A composed hero has its own mp4 (hero.mp4, hero-v.mp4); a still hero has none. */
    clip?: boolean;
  }
): MediaKit {
  const base = `${KITS}/${slug}`;
  const own = opts.clip ?? false;
  return {
    hero: {
      alt: opts.alt,
      poster: `${base}/hero.jpg`,
      ...(own ? { src: `${base}/hero.mp4` } : {}),
      ...opts.hero,
      ...(opts.vertical === false
        ? {}
        : { vertical: { poster: `${base}/hero-v.jpg`, ...(own ? { src: `${base}/hero-v.mp4` } : {}), ...opts.vertical } }),
    },
    stills: opts.stills.map((alt, i) => ({ src: `${base}/s${i + 1}.jpg`, alt })) as MediaKit["stills"],
  };
}


/** A deck's files: /media/kits/<slug>/cover.jpg (also hero.jpg), slide-1..4.jpg, s1-3.jpg, hero-v.jpg. */
function deck(slug: string, alts: { cover: string; slides: [string, string, string, string] }, blurred: number[], coverBlurred = false) {
  const base = `${KITS}/${slug}`;
  return {
    kit: kit(slug, {
      alt: alts.cover,
      hero: { poster: `${base}/cover.jpg` },
      stills: [alts.cover, alts.slides[0], alts.slides[2]],
    }),
    deck: {
      coverBlurred,
      slides: alts.slides.map((alt, i) => ({ src: `${base}/slide-${i + 1}.jpg`, alt, blurred: blurred.includes(i + 1) })),
    },
  };
}

// Clients written out above; the registry fills in everyone else.
const CURATED = new Set([
  "tokenworks", "perena", "arch-network", "jinba", "livingip", "honeyb", "bump", "uni", "breeze", "autara", "huch",
  "herth", "pyra", "piris-labs", "pavepower", "hashplay",
]);

const REGISTRY_TYPES: Record<string, WorkType> = {
  brand: "branding", logo: "branding", "design system": "branding",
  website: "websites", "landing page": "websites",
  app: "apps", "product design": "apps",
  "launch video": "launch-videos", "product video": "video",
  content: "content", social: "content", docs: "content", motion: "motion",
  event: "events", merch: "merch", print: "print", workshop: "workshops",
  "pitch deck": "decks", deck: "decks",
  research: "research", "service design": "service-design", "AI automation": "ai-automation",
};

const TW_REEL = `${PROJECTS}/tokenworks-videos/tokenworks-videos-horizontal-compressed.mp4`;

export const clients: Client[] = [
  {
    slug: "tokenworks",
    name: "TokenWorks",
    tier: tierOf("tokenworks"),
    industry: [],
    // The registry has April 2024 to October 2026 (Tyler calls it three years).
    years: "2024–2026",
    engagement: "Partnership",
    trading: true,
    testimonial: "daniel-greene",
    summary:
      "Since 2024, the design and build team behind TokenWorks’ ID scanners: launch and product films, a mobile scanner app and the customer portal, and the product pages of the earlier idscanner.com.",
    work: [
      {
        slug: "tokenworks-agevisor-3",
        title: "AgeVisor 3 launch film",
        label: "AgeVisor 3 film",
        type: "launch-videos",
        year: "2025",
        status: "shipped",
        visibility: "public",
        source: "https://youtu.be/PBJbbMQ17eo; cut from tokenworks-videos-horizontal",
        summary: "The launch film for AgeVisor 3, TokenWorks’ countertop ID scanner, made in seven days.",
        kit: kit("tokenworks-agevisor-3", {
          alt: "AgeVisor 3 launch film",
          hero: { src: TW_REEL, clip: [8.3, 12.3], posterTime: 8.6 },
          vertical: { src: `${KITS}/tokenworks-agevisor-3/hero-v.mp4` },
          stills: ["AgeVisor 3 on a counter", "The AgeVisor 3 screen, close", "AgeVisor 3 under water, from the film"],
        }),
      },
      {
        slug: "tokenworks-app",
        title: "Scanner app and customer portal",
        label: "Scanner app",
        type: "apps",
        year: "2026",
        status: "shipped",
        // Cleared to show in the registry's second pass: the App Store set and the portal screens.
        visibility: "public",
        source: "Registry media: App Store screenshot set, IDScanner portal add-ons, AgeVisor 3 device UI",
        summary: "A mobile ID scanner app with DMV checks, the IDScanner customer portal, and the AgeVisor 3 device screens.",
        kit: kit("tokenworks-app", {
          alt: "The IDScanner customer portal",
          stills: ["The scanner app: Catch fake IDs", "The portal's add-ons store", "The AgeVisor 3 scan screen"],
        }),
      },
      {
        slug: "tokenworks-idvisor-page",
        title: "idVisor product page",
        label: "idVisor page",
        type: "websites",
        year: "2024",
        status: "archived",
        visibility: "public",
        source: "Our screen recording of the page, September 2024 (idVisor product page.mp4)",
        summary: "A product page for idVisor on the IDScanner.com store: the scanner, what it catches, and a configurator to buy it.",
        kit: kit("tokenworks-idvisor-page", {
          alt: "The idVisor product page, scrolling",
          clip: true,
          stills: ["The idVisor page’s opening", "idVisor’s features, one card each", "Configuring an idVisor to buy"],
        }),
      },
      {
        slug: "tokenworks-idvisor",
        title: "IDVisor product films",
        label: "IDVisor films",
        type: "launch-videos",
        year: "2025",
        status: "shipped",
        visibility: "public",
        // The registry confirms the IDVisor product videos (2025–2026) as ours; which
        // YouTube uploads exactly (Smart Plus, V2) is still a question for Tyler.
        source: "Registry: 'IDVisor product videos, IDVisor 3 Amazon video'; cut from tokenworks-videos-horizontal",
        summary: "Product films for IDVisor, the handheld scanner: the reveal, and a scan at the door.",
        kit: kit("tokenworks-idvisor", {
          alt: "IDVisor product film",
          hero: { src: TW_REEL, clip: [1.6, 6.2], posterTime: 4.3 },
          vertical: { src: `${KITS}/tokenworks-idvisor/hero-v.mp4` },
          stills: ["IDVisor, front and side", "IDVisor in the dark, from the film", "Scanning an ID with IDVisor"],
        }),
      },
      {
        slug: "tokenworks-fake-id",
        title: "Fake ID Detection film",
        label: "Fake ID film",
        type: "launch-videos",
        year: "2026",
        status: "shipped",
        visibility: "public",
        source: "https://youtu.be/XdmW5bcyiJU (no local file for a kit yet)",
      },
    ],
    flags: [
      "Is today's idscanner.com homepage still our design? (not shown until confirmed)",
      "Which YouTube uploads beyond AgeVisor 3 and Fake ID Detection are ours?",
    ],
  },
  {
    slug: "perena",
    name: "Perena",
    tier: tierOf("perena"),
    industry: ["crypto"],
    years: "2025–2026",
    engagement: "Partnership",
    trading: true,
    testimonial: "shina-foo",
    summary: "We designed, built and filmed the launch of USD*, Perena’s yield-bearing stablecoin.",
    flags: ["perena.org has been redesigned since: don't link it as our work", "Perena Purple is NDA-gated"],
    work: [
      {
        slug: "perena-landing",
        title: "USD* landing page",
        label: "Landing page",
        type: "websites",
        year: "2025",
        status: "archived",
        visibility: "public",
        source: "perena reel; perena.org has since been redesigned by Perena",
        summary: "Landing page design and development for the launch of USD*.",
        kit: kit("perena-landing", {
          alt: "The USD* landing page on a laptop",
          hero: {
            src: `${PROJECTS}/perena/perena-horizontal-compressed.mp4`,
            poster: `${PROJECTS}/perena/perena-desktop-poster.jpg`,
            clip: [1, 3.6],
            posterTime: 1,
          },
          vertical: {
            src: `${PROJECTS}/perena/perena-vertical-compressed.mp4`,
            poster: `${PROJECTS}/perena/perena-mobile-poster.jpg`,
            clip: [0.5, 3.6],
            posterTime: 1,
          },
          stills: ["The landing page’s dark hero", "Buying USD* on the landing page", "The landing page on two phones"],
        }),
      },
      {
        slug: "perena-film",
        title: "USD* launch film",
        label: "Launch film",
        type: "launch-videos",
        year: "2025",
        status: "shipped",
        visibility: "public",
        source: "https://youtu.be/DwqvawhROwE; https://x.com/perena/status/2002083042308104204",
        summary: "A short film walking through USD*: how it grows, how it’s secured, and how it has performed.",
        kit: kit("perena-film", {
          alt: "USD* launch film",
          hero: { src: `${PROJECTS}/perena/perena-horizontal-compressed.mp4`, clip: [6, 12.2], posterTime: 8.6 },
          vertical: { src: `${PROJECTS}/perena/perena-vertical-compressed.mp4`, clip: [6, 12.2], posterTime: 8.6 },
          stills: ["USD* APY over a field of flowers", "“Fully audited, running publicly on Solana”", "USD*’s performance against the market"],
        }),
      },
    ],
  },
  {
    slug: "arch-network",
    name: "Arch Network",
    tier: tierOf("arch-network"),
    industry: ["crypto"],
    years: "2025–2026",
    engagement: "Partnership",
    trading: true,
    summary:
      "Arch Network’s design partner since 2025: the BTC All-In Summit in Las Vegas, the Arch and Arch Prime identities, and the pages that launch the chain.",
    work: [
      {
        slug: "arch-site",
        title: "arch.network site",
        label: "Website",
        type: "websites",
        year: "2026",
        // Our build of the homepage, /chain and /ecosystem. Today's homepage (Arch Prime) isn't ours, so no link.
        status: "archived",
        visibility: "public",
        source: "Registry media: arch.network homepage hero (our build), chain page, blog redesign preview",
        summary: "The arch.network site we built: the homepage, the chain pages and /ecosystem, and a blog redesign.",
        kit: kit("arch-site", {
          alt: "The arch.network homepage we built: Real Bitcoin. Finally programmable.",
          clip: true,
          vertical: { src: undefined },
          stills: ["Real Bitcoin.", "The financial chain for native Bitcoin", "The Arch blog redesign"],
        }),
      },
      {
        slug: "arch-btc-summit",
        title: "BTC All-In Summit, Las Vegas",
        label: "BTC Summit",
        type: "branding",
        year: "2025",
        status: "shipped",
        visibility: "public",
        source: "arch-vegas reel",
        summary: "Event identity, screens and motion for Arch Network’s BTC All-In Summit in Las Vegas.",
        kit: kit("arch-btc-summit", {
          alt: "BTC All-In Summit reel",
          hero: {
            src: `${PROJECTS}/arch-vegas/arch-vegas-horizontal-compressed.mp4`,
            poster: `${PROJECTS}/arch-vegas/arch-vegas-desktop-poster.jpg`,
          },
          vertical: {
            src: `${PROJECTS}/arch-vegas/arch-vegas-vertical-compressed.mp4`,
            poster: `${PROJECTS}/arch-vegas/arch-vegas-mobile-poster.jpg`,
          },
          stills: ["The summit’s screens at the venue", "The sponsor wall", "The BTC All-In Summit wordmark"],
        }),
      },
      {
        slug: "arch-brand",
        title: "Arch Network identity",
        label: "Identity",
        type: "branding",
        year: "2026",
        status: "live",
        visibility: "public",
        source: "/brands/arch; our versions, not arch.network's current homepage",
        summary: "Arch Network’s identity and design system: the mark, the serif, the orange, and the diagrams.",
        brandPage: "arch",
        kit: kit("arch-brand", {
          alt: "Arch Network: Real Bitcoin. Finally programmable.",
          stills: ["The Arch Network lockup on orange", "An Arch diagram: the finance district", "The Arch glyph"],
        }),
      },
      {
        slug: "arch-chain",
        title: "Chain page",
        label: "Chain page",
        type: "websites",
        year: "2026",
        status: "live",
        visibility: "public",
        source: "Clients/Arch/arch-site/src/app/chain; live page captured 2026-10-23",
        summary: "The page that introduces Arch’s chain, purpose-built for credit at scale. Designed and built.",
        liveUrl: "https://www.arch.network/chain",
        kit: kit("arch-chain", {
          alt: "The Arch chain page, scrolling",
          clip: true,
          stills: ["The chain page’s opening", "“Credit needs its own chain”", "The chain page on a phone"],
        }),
      },
      {
        slug: "arch-prime-brand",
        title: "Arch Prime identity",
        label: "Arch Prime",
        type: "branding",
        year: "2026",
        status: "live",
        visibility: "public",
        source: "/brands/arch-prime",
        summary: "The product brand that descends from Arch Network, with its own palette and a place system for the app.",
        brandPage: "arch-prime",
        kit: kit("arch-prime-brand", {
          alt: "Arch Prime’s key visual and lockup",
          stills: ["Arch Prime’s key visual", "An Arch Prime building, for Earn", "The Arch Prime lockup"],
        }),
      },
      {
        slug: "arch-podcast",
        title: "“Bitcoin Builders” podcast graphics",
        label: "Podcast",
        type: "content",
        year: "2025",
        status: "shipped",
        visibility: "public",
        source: "Figma Arch '25 584:400",
      },
      {
        slug: "arch-prime-films",
        title: "Arch Prime launch films",
        label: "Launch films",
        type: "launch-videos",
        year: "2026",
        status: "shipped",
        visibility: "needs-ok",
        source: "Clients/Arch/launch-video/for-review",
        summary: "The Ascent, Build the Bank, Everything Becomes Prime. Not cleared: voice, score and footage licences.",
      },
    ],
    flags: [
      "arch.network's homepage (Arch Prime) is not our build: never use captures of it",
      "Arch Prime's app, films and decks stay confidential until it launches",
    ],
  },
  {
    slug: "jinba",
    name: "Jinba",
    tier: tierOf("jinba"),
    industry: ["ai"],
    years: "2025–2026",
    engagement: "Partnership",
    trading: true,
    summary: "A YC W26 launch package for an enterprise AI workflow builder: a full rebrand with three sub-brands, a new site and the launch film.",
    work: [
      {
        slug: "jinba-website",
        title: "Website",
        label: "Website",
        type: "websites",
        year: "2026",
        status: "live",
        visibility: "public",
        source: "Live site captured 2026-10-23",
        summary: "A refreshed website for Jinba, in the new brand, with its blog and use cases.",
        liveUrl: "https://jinba.io",
        kit: kit("jinba-website", {
          alt: "jinba.io, scrolling",
          clip: true,
          stills: ["jinba.io’s opening", "Jinba’s security and customers section", "jinba.io on a phone"],
        }),
      },
      {
        slug: "jinba-brand",
        title: "Brand identity",
        label: "Identity",
        type: "branding",
        year: "2026",
        status: "live",
        visibility: "public",
        source: "/brands/jinba",
        summary: "Logo system, brand narrative, materials and a design system for a platform serving regulated industries.",
        brandPage: "jinba",
        kit: kit("jinba-brand", {
          alt: "The Jinba lockup on its brass texture",
          stills: ["The Jinba logo on its texture", "Jinba on LinkedIn", "Jinba’s chocolate brass material"],
        }),
      },
      {
        slug: "jinba-film",
        title: "YC W26 launch film",
        label: "Launch film",
        type: "launch-videos",
        year: "2026",
        status: "shipped",
        visibility: "public",
        source: "https://youtu.be/aD9XnupXf_w (on /launch-videos; no local file for a kit yet)",
      },
    ],
  },
  {
    slug: "livingip",
    name: "LivingIP",
    tier: tierOf("livingip"),
    industry: ["crypto", "ai"],
    // The designs are dated 2025 (the site said 2024).
    years: "2025",
    engagement: "Unknown",
    trading: true,
    summary: "UI, UX and product design for on-chain AI agents. Clarified vision, simplified flows.",
    flags: ["Which parts are client work, and which are Blueprint's own Poaster / Living Persona?"],
    work: [
      {
        slug: "livingip-app",
        title: "On-chain AI agents app",
        label: "App",
        type: "apps",
        year: "2025",
        status: "shipped",
        visibility: "public",
        source: "living-ip reel",
        summary: "Product design for on-chain AI agents: knowledge voting, analytics and contributor profiles.",
        kit: kit("livingip-app", {
          alt: "LivingIP app reel",
          hero: {
            src: `${PROJECTS}/living-ip/living-ip-horizontal-compressed.mp4`,
            poster: `${KITS}/livingip-app/hero.jpg`,
            // The app on a laptop, then a phone. (Earlier stretches include “Poast”,
            // whose ownership is a question for Tyler, and pale blurred transitions.)
            clip: [10.1, 12.7],
          },
          vertical: {
            src: `${PROJECTS}/living-ip/living-ip-vertical-compressed.mp4`,
            poster: `${KITS}/livingip-app/hero-v.jpg`,
            // The phone, as in the apps peek.
            clip: [11.9, 13.3],
            posterTime: 12.4,
          },
          stills: ["A contributor profile in the LivingIP app", "Voting on knowledge", "Achievement badges"],
        }),
      },
    ],
  },
  {
    slug: "honeyb",
    name: "HoneyB",
    tier: tierOf("honeyb"),
    industry: ["crypto"],
    years: "2025–2026",
    engagement: "Partnership",
    trading: true,
    summary: "From a blank slate in September 2025 to an institutional Bitcoin yield platform: the brand, the website, and the product behind it.",
    work: [
      {
        slug: "honeyb-website",
        title: "Website",
        label: "Website",
        type: "websites",
        year: "2026",
        status: "live",
        visibility: "public",
        // The current site, not the earlier “orange Bitcoin” version or the AI mockups under /brands/honeyb/mockups.
        source: "Clients/HoneyB/landing-page; live site captured 2026-10-23 (homepage only; the About page’s team photos are not cleared)",
        summary: "The website for HoneyB, Bitcoin yield for institutions. Designed and built.",
        liveUrl: "https://www.honeybtc.com",
        kit: kit("honeyb-website", {
          alt: "honeybtc.com, scrolling",
          clip: true,
          stills: ["honeybtc.com’s opening", "HoneyB’s products, and “Institutional by Design”", "honeybtc.com on a phone"],
        }),
      },
      {
        slug: "honeyb-brand",
        title: "Brand identity",
        label: "Identity",
        type: "branding",
        year: "2025",
        status: "live",
        visibility: "public",
        source: "/brands/honeyb (brand-kit files only)",
        summary: "The HoneyB identity: the mark, the honeycomb, and the 3D coins and objects that carry it.",
        brandPage: "honeyb",
        kit: kit("honeyb-brand", {
          alt: "The HoneyB lockup over its honeycomb",
          stills: ["The HoneyB glyph as a coin", "A HoneyB wallet", "HoneyB coins"],
        }),
      },
      {
        slug: "honeyb-deck",
        title: "Pitch deck",
        label: "Pitch deck",
        type: "decks",
        year: "2025",
        status: "shipped",
        visibility: "public",
        // The slides /launch already shows (Tyler's fine keeping them); the raise and its lead are blurred.
        source: "public/launch-assets/slide-deck_assets/honeyb_deck-assets",
        summary: "The deck that took HoneyB from a blank slate to its raise: the yield gap, the market and the field.",
        ...deck(
          "honeyb-deck",
          {
            cover: "HoneyB deck: The Yield Layer for Bitcoin",
            slides: ["Meet HoneyB", "Market size", "Competitive landscape", "Raising, with the amount and lead blurred"],
          },
          [4]
        ),
      },
      {
        slug: "honeyb-app",
        title: "Web app",
        label: "App",
        type: "apps",
        year: "2026",
        status: "shipped",
        visibility: "needs-ok",
        source: "Clients/HoneyB/webapp (testnet)",
      },
      {
        slug: "honeyb-print",
        title: "Brochure and Token2049 handout",
        label: "Print",
        type: "branding",
        year: "2026",
        status: "shipped",
        visibility: "needs-ok",
        source: "Clients/HoneyB/Brochure; Figma “Token 2049 Materials”",
      },
    ],
    flags: ["Due-diligence materials are confidential", "The RWY (Double Digit) rename isn’t public yet", "/brands/honeyb/mockups are AI-made: never use"],
  },
  {
    slug: "bump",
    name: "Bump.fun",
    tier: tierOf("bump"),
    industry: ["crypto"],
    years: "2025",
    engagement: "Project",
    trading: true,
    summary: "Brand identity, product design and customer research for a memecoin platform.",
    work: [
      {
        slug: "bump-brand",
        title: "Brand identity",
        label: "Identity",
        type: "branding",
        year: "2025",
        status: "shipped",
        visibility: "public",
        source: "bump reel",
        summary: "“The orange pill for memecoins”: the Bump identity and its launch reel.",
        kit: kit("bump-brand", {
          alt: "Bump brand reel",
          hero: {
            src: `${PROJECTS}/bump/bump-brand-overview-horizontal-compressed.mp4`,
            poster: `${PROJECTS}/bump/bump-desktop-poster.jpg`,
          },
          vertical: {
            src: `${PROJECTS}/bump/bump-brand-overview-vertical-compressed.mp4`,
            poster: `${PROJECTS}/bump/bump-mobile-poster.jpg`,
          },
          stills: ["BUMP on an orange pill", "The blue and orange pills", "“They print money from nothing.”"],
        }),
      },
      {
        slug: "bump-app",
        title: "Memecoin platform",
        label: "Platform",
        type: "apps",
        year: "2025",
        status: "shipped",
        visibility: "public",
        source: "bump-asset-3",
        summary: "Product design for Bump’s platform: trending coins, the watchlist and explore.",
        kit: kit("bump-app", {
          alt: "The Bump platform on a laptop",
          stills: ["Bump’s trending coins", "Bump’s coin grid", "The Bump platform on a laptop"],
        }),
      },
    ],
  },
  {
    slug: "uni",
    name: "UNI",
    tier: tierOf("uni"),
    industry: ["crypto"],
    years: "2025",
    engagement: "Project",
    trading: true,
    flags: ["Trading status unknown (registry)"],
    work: [
      {
        slug: "uni-brand",
        title: "Brand identity",
        label: "Identity",
        type: "branding",
        year: "2025",
        status: "shipped",
        visibility: "public",
        // data/brandPortfolio.ts calls UNI a street-food brand; this artwork says stablecoin.
        source: "uni brand assets",
        summary: "Brand identity for a Bitcoin-denominated stablecoin: logo system, type, palette and visual language.",
        kit: kit("uni-brand", {
          alt: "UNI brand overview",
          stills: ["The UNI badge", "UNI’s “Get started” poster", "The UNI wordmark"],
        }),
      },
      { slug: "uni-landing", title: "Landing page", label: "Landing page", type: "websites", year: "2025", status: "archived", visibility: "public" },
    ],
  },
  {
    slug: "breeze",
    name: "Breeze",
    tier: tierOf("breeze"),
    industry: ["crypto"],
    years: "2025",
    engagement: "Project",
    // The client retired the Breeze name: archive work, listed, not featured.
    trading: false,
    work: [
      {
        slug: "breeze-brand",
        title: "Brand identity",
        label: "Identity",
        type: "branding",
        year: "2025",
        status: "shipped",
        visibility: "public",
        source: "breeze brand assets",
        summary: "“Easy. Breezy. Bitcoin.” Logo system, type and palette, social kit and brand deck.",
        kit: kit("breeze-brand", {
          alt: "Easy. Breezy. Bitcoin.",
          vertical: { poster: `${PROJECTS}/breeze/hero-breeze-mobile.jpg` },
          stills: ["The Breeze B, made of sky", "The Breeze wordmark on a hill", "Breeze’s flying piggy bank"],
        }),
      },
    ],
  },
  {
    slug: "autara",
    name: "Autara",
    tier: tierOf("autara"),
    industry: ["crypto"],
    years: "2025",
    engagement: "Project",
    // Acquired by Arch; autara.xyz is parked. Its work shows on /work, never featured.
    trading: false,
    summary: "Brand identity and a Framer website for Bitcoin lending on Arch. Acquired by Arch.",
    work: [
      {
        slug: "autara-brand",
        title: "Brand identity",
        label: "Identity",
        type: "branding",
        year: "2025",
        status: "archived",
        visibility: "public",
        summary: "Brand identity for Autara, Bitcoin-collateralised lending on Arch: the names, the triangle pattern and the deck. Autara has since been acquired by Arch.",
        source: "autara reel (the hero’s “brands” word still plays it)",
        kit: kit("autara-brand", {
          alt: "Autara brand reel",
          hero: {
            src: `${PROJECTS}/autara/autara-horizontal-compressed.mp4`,
            poster: `${PROJECTS}/autara/autara-hero-poster.jpg`,
            clip: [3.8, 7.8],
          },
          vertical: {
            src: `${PROJECTS}/autara/autara-vertical-compressed.mp4`,
            poster: `${PROJECTS}/autara/autara-mobile-poster.jpg`,
          },
          stills: ["Autara’s triangle pattern", "The Autara wordmark", "Autara’s homepage"],
        }),
      },
      { slug: "autara-landing", title: "Framer landing page", label: "Landing page", type: "websites", year: "2025", status: "archived", visibility: "public" },
    ],
    flags: ["autara.xyz is parked; Autara was acquired by Arch"],
  },
  {
    slug: "huch",
    name: "HUCH",
    tier: tierOf("huch"),
    industry: ["gaming"],
    years: "2025–2026",
    engagement: "Project",
    // No longer trading: listed, not featured.
    trading: false,
    work: [
      {
        slug: "huch-brand",
        title: "Rebrand",
        label: "Rebrand",
        type: "branding",
        year: "2025",
        status: "archived",
        visibility: "public",
        source: "huch reel and brand assets",
        summary: "A full rebrand for HUCH, the tokenization platform for gaming assets.",
        kit: kit("huch-brand", {
          alt: "HUCH brand reel",
          hero: {
            src: `${PROJECTS}/huch/huch-brand-overview-horizontal-compressed.mp4`,
            poster: `${PROJECTS}/huch/huch-desktop-poster.jpg`,
            posterTime: 1.6,
          },
          vertical: {
            src: `${PROJECTS}/huch/huch-brand-overview-vertical-compressed.mp4`,
            poster: `${PROJECTS}/huch/huch-mobile-poster.jpg`,
            posterTime: 1.6,
          },
          stills: ["The HUCH mark", "HUCH's skin analytics", "A HUCH skin card"],
        }),
      },
      { slug: "huch-platform", title: "Platform design and build", label: "Platform", type: "apps", year: "2025", status: "archived", visibility: "public" },
      {
        slug: "huch-deck",
        title: "Pitch deck",
        label: "Pitch deck",
        type: "decks",
        year: "2025",
        status: "shipped",
        visibility: "public",
        // The slides /launch already shows; revenue and raise figures blurred, cover line included.
        source: "public/launch-assets/slide-deck_assets/huch_deck-assets",
        summary: "A pitch deck for HUCH, the tokenization platform for gaming assets.",
        showWhenArchived: true,
        ...deck(
          "huch-deck",
          {
            cover: "HUCH deck cover, with the revenue line blurred",
            slides: ["Tokenization is no longer hype", "HUCH unlocks gaming assets", "Competitive landscape", "Traction, with the figures blurred"],
          },
          [4],
          true
        ),
      },
    ],
  },
  {
    slug: "herth",
    name: "Herth",
    tier: tierOf("herth"),
    industry: ["ai"],
    years: "2025–2026",
    engagement: "Partnership",
    trading: true,
    summary: "The buyer side of Herth’s home search (natural-language search, saved searches, messaging), designed and built on its existing frontend.",
    work: [
      {
        slug: "herth-app",
        title: "Home search product",
        label: "Home search",
        type: "apps",
        year: "2025",
        status: "live",
        visibility: "public",
        source: "Registry media: Herth buyer site, mobile map search, property page",
        summary: "Find a home by how it looks: natural-language search, map search and property pages, on web and mobile.",
        kit: kit("herth-app", {
          alt: "Herth: What does your perfect home look like?",
          stills: ["Herth's mobile map search", "A Herth property page", "Herth's homepage search"],
        }),
      },
    ],
  },
  {
    slug: "pyra",
    name: "Pyra",
    tier: tierOf("pyra"),
    industry: ["crypto"],
    years: "2025",
    engagement: "Project",
    trading: false,
    summary: "A launch film for Pyra’s credit app, made in two days.",
    work: [
      {
        slug: "pyra-film",
        title: "Credit launch film",
        label: "Launch film",
        type: "launch-videos",
        year: "2025",
        status: "shipped",
        visibility: "public",
        source: "https://youtu.be/A1hq1u_M7L8; registry media excerpt",
        summary: "A launch film for Pyra’s credit app, made in two days.",
        kit: kit("pyra-film", {
          alt: "Pyra credit launch film",
          clip: true,
          vertical: { src: undefined },
          stills: ["Easily manage your credit", "Pyra's manage-assets screen", "Watch your portfolio grow"],
        }),
      },
    ],
  },
  {
    slug: "piris-labs",
    name: "Piris Labs",
    tier: tierOf("piris-labs"),
    industry: ["ai"],
    years: "2026",
    engagement: "Project",
    trading: true,
    summary: "The YC W26 launch film for Piris Labs, which builds optical data movement for AI infrastructure.",
    work: [
      {
        slug: "piris-film",
        title: "YC W26 launch film",
        label: "Launch film",
        type: "launch-videos",
        year: "2026",
        status: "shipped",
        visibility: "public",
        source: "https://youtu.be/PeaWXlRNjPE; registry media frames",
        summary: "“We’re building the data movement platform for AI”: the YC W26 launch film, made in Figma and Jitter.",
        kit: kit("piris-film", {
          alt: "Piris Labs launch film: rack-to-rack data movement",
          stills: ["We're building the data movement platform for AI", "Piris Labs benchmarks", "Rack-to-rack data movement"],
        }),
      },
    ],
  },
  {
    slug: "pavepower",
    name: "Pave Power",
    tier: tierOf("pavepower"),
    industry: [],
    years: "",
    engagement: "Project",
    trading: true,
    summary: "The website for Pave Power, which electrifies commercial fleets.",
    work: [
      {
        slug: "pavepower-website",
        title: "Website",
        label: "Website",
        type: "websites",
        year: "",
        status: "live",
        visibility: "public",
        source: "Registry: the live pavepower.com is ours (Tyler)",
        summary: "Enabling commercial fleets to harness the power of electric: the Pave Power website.",
        liveUrl: "https://pavepower.com",
        kit: kit("pavepower-website", {
          alt: "pavepower.com",
          stills: ["pavepower.com's opening", "Pave Power's services", "pavepower.com on a phone"],
        }),
      },
    ],
  },
  {
    slug: "hashplay",
    name: "Hashplay",
    tier: tierOf("hashplay"),
    industry: ["crypto"],
    years: "2025–2026",
    engagement: "Project",
    trading: true,
    summary: "“Steam for Bitcoin”: Hashplay’s website and brand, relaunched for Arch in 2026.",
    work: [
      {
        slug: "hashplay-website",
        title: "Website",
        label: "Website",
        type: "websites",
        year: "2025",
        status: "archived",
        visibility: "public",
        source: "Registry media: hashplay-site (hashplay.xyz is parked)",
        summary: "Steam for Bitcoin. Play, own, trade: the Hashplay site and its games.",
        kit: kit("hashplay-website", {
          alt: "Hashplay: Steam for Bitcoin",
          stills: ["Hashplay's opening over the game grid", "Hashplay game cards", "Deal or No Deal on Hashplay"],
        }),
      },
      { slug: "hashplay-brand", title: "Brand", label: "Brand", type: "branding", year: "2025", status: "shipped", visibility: "public" },
    ],
  },
  // Everyone else in the registry, listed in All work (Hide tier left out).
  ...registry.clients.filter((c) => !CURATED.has(c.slug) && c.tier !== "Hide").flatMap(listedFromRegistry),
];

/** A registry client we list but don't show yet: its name, years, tier and kinds of work. */
function listedFromRegistry(c: RegistryClient): Client[] {
  const types = [...new Set(c.work.flatMap((w) => REGISTRY_TYPES[w.type] ?? []))];
  if (types.length === 0) return [];
  return [
    listed(c.slug, c.name, c.years, types, {
      engagement: c.engagement as Client["engagement"],
      trading: c.trading,
      tier: (c.tier as Client["tier"]) ?? "Archive",
    }),
  ];
}

/** A client we list but don't show yet: a name, its years, and what we made. */
function listed(
  slug: string,
  name: string,
  years: string,
  types: WorkType[],
  { engagement, trading, tier = "Archive" }: Pick<Client, "engagement" | "trading"> & { tier?: Client["tier"] }
): Client {
  return {
    slug,
    name,
    industry: [],
    years,
    engagement,
    trading,
    tier,
    work: types.map((type, i) => ({
      slug: `${slug}-${i + 1}`,
      title: workTypeLabels[type].one,
      label: workTypeLabels[type].one,
      type,
      year: years,
      status: "shipped" as const,
      visibility: "public" as const,
    })),
  };
}

// The home page's Featured Work and /work's featured clients: the Feature
// tier, in `all`'s order. A word picked in the hero shows the Feature clients
// with work of that kind (`lead` first), each leading with it; when fewer than
// two have any, Show clients with it fill in. At most `max`.
export const featuredWork: {
  max: number;
  all: string[];
  lead: Partial<Record<Deliverable, string[]>>;
} = {
  max: 8,
  all: ["tokenworks", "arch-network", "perena", "jinba", "honeyb", "livingip", "bump", "autara"],
  lead: {
    apps: ["livingip", "tokenworks", "bump"],
    websites: ["perena", "arch-network", "honeyb", "jinba"],
    branding: ["jinba", "arch-network", "honeyb", "bump", "autara"],
    "launch-videos": ["tokenworks", "perena"],
  },
};
