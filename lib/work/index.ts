import type { Metadata } from "next";
import {
  clients,
  featuredWork,
  workTypeLabels,
  type Client,
  type Deliverable,
  type Industry,
  type MediaKit,
  type WorkItem,
  type WorkType,
} from "@/data/portfolioData";
import type { WorkPageConfig } from "./types";
import { websites } from "./websites";
import { apps } from "./apps";
import { branding } from "./branding";
import { launchVideos } from "./launch-videos";
import { decks } from "./decks";

export type { WorkPageConfig } from "./types";

// Fewer pieces than this and a deliverable gets no page (a wall of one isn't proof).
export const MIN_PROJECTS = 2;
// A client gets its own page once it has this many pieces of work to show.
export const MIN_CLIENT_PAGE = 3;

const allPages: WorkPageConfig[] = [websites, apps, branding, launchVideos, decks];
const DELIVERABLES: Deliverable[] = ["websites", "apps", "branding", "launch-videos", "decks"];

export const isDeliverable = (t: WorkType): t is Deliverable => (DELIVERABLES as WorkType[]).includes(t);

/** A piece of work we show: public, with a kit, from a client in the Feature or Show tier. */
export type ShownWork = WorkItem & { type: Deliverable; kit: MediaKit; client: Client };

export const isShown = (client: Client) => client.tier === "Feature" || client.tier === "Show";

const shown = (client: Client): ShownWork[] =>
  client.tier === "Hide"
    ? []
    : client.work.flatMap((w) =>
        (isShown(client) || w.showWhenArchived) && w.visibility === "public" && w.kit && isDeliverable(w.type)
          ? [{ ...w, type: w.type, kit: w.kit, client }]
          : []
      );

/** Every piece of work we show, in client order. */
export const shownWork: ShownWork[] = clients.flatMap(shown);

/** A client's shown work. Archived clients have none here, even with a deck shown on /work/decks. */
export function shownWorkOf(client: Client): ShownWork[] {
  return isShown(client) ? shownWork.filter((w) => w.client.slug === client.slug) : [];
}

export function clientBySlug(slug: string): Client | undefined {
  return clients.find((c) => c.slug === slug);
}

/** One deliverable's work, in its page's order; work that isn't listed follows in data order. */
export function workFor(slug: Deliverable): ShownWork[] {
  const order = allPages.find((p) => p.slug === slug)?.order ?? [];
  const rank = (id: string) => {
    const i = order.indexOf(id);
    return i === -1 ? order.length : i;
  };
  return shownWork
    .filter((w) => w.type === slug)
    .map((w, i) => ({ w, i }))
    .sort((a, b) => rank(a.w.slug) - rank(b.w.slug) || a.i - b.i)
    .map(({ w }) => w);
}

/** Work by slug, in the order given; unknown or hidden slugs are skipped. */
export function workBySlugs(slugs: string[]): ShownWork[] {
  return slugs.flatMap((s) => shownWork.find((w) => w.slug === s) ?? []);
}

/** The deliverable pages that exist, in nav order. */
export const workPages: WorkPageConfig[] = allPages.filter((p) => workFor(p.slug).length >= MIN_PROJECTS);

export function getWorkPage(slug: string): WorkPageConfig | undefined {
  return workPages.find((p) => p.slug === slug);
}

export function hasWorkPage(slug: Deliverable): boolean {
  return workPages.some((p) => p.slug === slug);
}

/** Clients with enough shown work for a page of their own (/work/clients/<slug>). */
export const clientPages: Client[] = clients.filter((c) => shownWorkOf(c).length >= MIN_CLIENT_PAGE);

export function hasClientPage(client: Client): boolean {
  return clientPages.some((c) => c.slug === client.slug);
}

export const clientPath = (client: Client) => `/work/clients/${client.slug}`;

/** Where a piece of work lives: its client's page, else its deliverable's wall. */
export function workHref(work: ShownWork): string {
  if (hasClientPage(work.client)) return `${clientPath(work.client)}#${work.slug}`;
  return hasWorkPage(work.type) ? `/work/${work.type}#${work.slug}` : "/work";
}

/** Where a client's name links: its page, else its only work's brand case study or wall. */
export function clientHref(client: Client, lead?: ShownWork): string | undefined {
  if (hasClientPage(client)) return clientPath(client);
  const work = lead ?? shownWorkOf(client)[0];
  if (!work) return undefined;
  if (work.brandPage && work.type === "branding") return `/brands/${work.brandPage}`;
  return workHref(work);
}

/** What we made for a client, from all its work that isn't waiting on Tyler: "Launch videos, website". */
export function madeFor(client: Client): string {
  const counts = new Map<WorkType, number>();
  for (const w of client.work) if (w.visibility !== "needs-ok") counts.set(w.type, (counts.get(w.type) ?? 0) + 1);
  const parts = [...counts].map(([t, n]) => (n > 1 ? workTypeLabels[t].many : workTypeLabels[t].one));
  return parts.map((p, i) => (i === 0 ? p : p.toLowerCase())).join(", ");
}

// --- The showcase: one big frame, three stills, a title and a line ----------
// Serializable, so server pages can hand it to the client component.

export interface ShowcaseFrame {
  /** The work's slug. */
  key: string;
  label: string;
  hero: MediaKit["hero"];
}

export interface ShowcaseStill {
  src: string;
  alt: string;
  /** The frame this still plays when picked. */
  frame: string;
}

export interface ShowcaseLink {
  label: string;
  href: string;
  external?: boolean;
}

export interface ShowcaseData {
  id: string;
  title: string;
  href?: string;
  /** "2023–2026" before the labels for a client; empty for one piece of work. */
  lead: string;
  /** The meta line's items; the active frame's lights up. */
  items: { key: string; label: string }[];
  summary?: string;
  frames: ShowcaseFrame[];
  stills: ShowcaseStill[];
  /** The frame that plays with nothing picked. */
  initial: string;
  links: ShowcaseLink[];
}

const frameOf = (w: ShownWork): ShowcaseFrame => ({ key: w.slug, label: w.label, hero: w.kit.hero });

/**
 * A client as one showcase. Its strongest work (or its first of `lead`'s kind)
 * plays in the big frame; the three stills come from three different pieces
 * of work where it has them (the first still of each), so the breadth shows.
 */
export function clientShowcase(client: Client, lead?: Deliverable, pool?: ShownWork[]): ShowcaseData | null {
  // `pool` narrows it to some of the client's work (an industry page's).
  const all = pool ?? shownWorkOf(client);
  if (all.length === 0) return null;
  const first = (lead && all.find((w) => w.type === lead)) || all[0];
  const ordered = [first, ...all.filter((w) => w !== first)];
  const used = ordered.slice(0, 3);
  // Round robin: A1, B1, C1; with two pieces A1, B1, A2; with one, its three.
  const stills = [0, 1, 2].map((i) => {
    const w = used[i % used.length];
    const still = w.kit.stills[Math.floor(i / used.length)];
    return { ...still, frame: w.slug };
  });
  const single = used.length === 1;
  return {
    id: client.slug,
    title: client.name,
    href: clientHref(client, first),
    lead: single ? "" : client.years,
    items: single
      ? [{ key: first.slug, label: `${workTypeLabels[first.type].one} · ${first.year}` }]
      : used.map((w) => ({ key: w.slug, label: w.label })),
    summary: client.summary,
    frames: used.map(frameOf),
    stills,
    initial: first.slug,
    links: [],
  };
}

/** One piece of work as a showcase: its hero and its own three stills. */
export function workShowcase(work: ShownWork, opts: { clientLink?: boolean } = {}): ShowcaseData {
  const { client } = work;
  const links: ShowcaseLink[] = [];
  if (work.brandPage) links.push({ label: "Brand page", href: `/brands/${work.brandPage}` });
  if (work.liveUrl) links.push({ label: "Visit site", href: work.liveUrl, external: true });
  if (opts.clientLink !== false && hasClientPage(client)) links.push({ label: `All ${client.name} work`, href: clientPath(client) });
  return {
    id: work.slug,
    title: client.name,
    lead: "",
    items: [{ key: work.slug, label: `${work.title} · ${work.year}` }],
    summary: work.summary,
    frames: [frameOf(work)],
    stills: work.kit.stills.map((s) => ({ ...s, frame: work.slug })),
    initial: work.slug,
    links,
  };
}

export interface DeckSlide {
  src: string;
  alt: string;
  blurred?: boolean;
}

/** A deck as a showcase: the cover plays in the big frame, the slides sit under it and take its place when picked. */
export function deckShowcase(work: ShownWork): ShowcaseData & { slides: (DeckSlide & { frame: string })[]; coverBlurred: boolean } {
  const base = workShowcase(work);
  const slides = (work.deck?.slides ?? []).map((slide, i) => ({ ...slide, frame: `${work.slug}-${i + 1}` }));
  return {
    ...base,
    frames: [
      { key: work.slug, label: "Cover", hero: { ...work.kit.hero, vertical: undefined } },
      ...slides.map((slide) => ({ key: slide.frame, label: slide.alt, hero: { poster: slide.src, alt: slide.alt } })),
    ],
    slides,
    coverBlurred: !!work.deck?.coverBlurred,
  };
}

/**
 * Several pieces of work as one showcase, for a page's hero: the first plays,
 * the next three's first stills sit beside it and play when picked.
 */
export function collectionShowcase(works: ShownWork[], title: string, lead = ""): ShowcaseData | null {
  if (works.length === 0) return null;
  const [first, ...rest] = works;
  const others = rest.slice(0, 3);
  const used = others.length >= 3 ? others : [first, ...others];
  const stills = [0, 1, 2].map((i) => {
    const w = used[i % used.length];
    return { ...w.kit.stills[Math.floor(i / used.length)], frame: w.slug };
  });
  const frames = [first, ...others].map(frameOf);
  return {
    id: "showcase",
    title,
    lead,
    items: [first, ...others].map((w) => ({ key: w.slug, label: w.client.name })),
    frames,
    stills,
    initial: first.slug,
    links: [],
  };
}

/**
 * Featured clients for the home page and /work: the Feature tier, in
 * featuredWork's order. For one kind of work, the Feature clients with that
 * kind (featuredWork.lead first); when fewer than two have any, Show clients
 * with it fill in, so a filter never shows a lone card.
 */
export function featuredClients(filter: Deliverable | null): Client[] {
  const has = (c: Client) => shownWorkOf(c).some((w) => !filter || w.type === filter);
  const rank = (slugs: string[]) => (c: Client) => {
    const i = slugs.indexOf(c.slug);
    return i === -1 ? slugs.length : i;
  };
  const byOrder = (list: Client[], slugs: string[]) =>
    list.map((c, i) => ({ c, i })).sort((a, b) => rank(slugs)(a.c) - rank(slugs)(b.c) || a.i - b.i).map(({ c }) => c);
  const feature = byOrder(clients.filter((c) => c.tier === "Feature" && has(c)), featuredWork.all);
  if (!filter) return feature.slice(0, featuredWork.max);
  const picked = byOrder(feature, featuredWork.lead[filter] ?? []);
  const fill = picked.length < 2 ? clients.filter((c) => c.tier === "Show" && has(c)) : [];
  return [...picked, ...fill].slice(0, featuredWork.max);
}

/** Industry tags for a piece of work, minus the page's own industry. */
export function industriesOf(work: ShownWork, except?: Industry): Industry[] {
  return work.client.industry.filter((i) => i !== except);
}

// Copy for /work and for the call-to-action band at the foot of every work page.
// Placeholders: factual, but Tyler to write the real lines.
export const workIndex = {
  intro: "Websites, apps, brands and launch videos for founders, from first sketch to launch.",
  introIsDraft: true,
  metaTitle: "Work",
  metaDescription:
    "Selected work by Blueprint Studio: websites, apps, brand identities and launch videos for founders in crypto and AI.",
};

export const workCta = {
  heading: "Have something to launch?",
  body: "Book a call and tell us what you’re building.",
  isDraft: true,
};

export function workMetadata({
  path,
  title,
  description,
  image,
}: {
  path: string;
  title: string;
  description: string;
  /** A 2400x1260 share image; the site-wide one when omitted. */
  image?: string;
}): Metadata {
  // The root layout's template appends "| Blueprint Studio" to `title`; OG and
  // Twitter titles don't go through the template, so they get it here.
  const full = `${title} | Blueprint Studio`;
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: {
      type: "website",
      url: `https://blueprintstudio.ai${path}`,
      title: full,
      description,
      images: [
        image
          ? { url: image, width: 2400, height: 1260, alt: full }
          : { url: "/og-image.jpg", width: 1200, height: 630, alt: "Blueprint Studio" },
      ],
    },
    twitter: { card: "summary_large_image", title: full, description, images: [image ?? "/og-image.jpg"] },
  };
}
