import type { KitMedia, KitStill } from "@/data/portfolioData";
import type { ShowcaseLink } from "@/lib/work";

/** One launch film, as the disc player needs it (serializable, built on the server). */
export interface Film {
  slug: string;
  title: string;
  client: string;
  year: string;
  /** The case's cover: the kit's lead still. */
  cover: KitStill;
  /** The inside of the lid: the kit's second still. */
  booklet: KitStill;
  /** The 16:9 key frame (printed on the disc, and the screen's poster) and its clip. */
  hero: KitMedia & { alt: string };
  /** Where the film's Showcase links: its client's page, where there is one. */
  links: ShowcaseLink[];
}

// The site's springs: small bounce, never ease-in.
export const CASE_SPRING = { type: "spring", visualDuration: 0.34, bounce: 0.14 } as const;
export const LID_SPRING = { type: "spring", visualDuration: 0.3, bounce: 0.1 } as const;
export const LIFT_SPRING = { type: "spring", visualDuration: 0.24, bounce: 0.08 } as const;
// A flight's progress, 0 to 1. It counts as landed once it's within a hair of
// the spot and all but still, not after the spring's last invisible wobble.
export const FLIGHT_SPRING = { type: "spring", visualDuration: 0.5, bounce: 0.06, restDelta: 0.008, restSpeed: 0.8 } as const;
// A disc rising off the spindle (px).
export const POP_SPRING = { type: "spring", visualDuration: 0.13, bounce: 0, restDelta: 1, restSpeed: 60 } as const;
// A disc dropping onto the spindle.
export const SEAT_SPRING = { type: "spring", visualDuration: 0.28, bounce: 0.4 } as const;
export const EASE_OUT = [0.16, 1, 0.3, 1] as const;

/** A disc's place on the page: its centre and diameter, relative to the gallery. */
export interface Spot {
  x: number;
  y: number;
  size: number;
}

export const wait = (ms: number) => new Promise<void>((r) => setTimeout(r, ms));

/** "0:04" */
export function clock(seconds: number) {
  const s = Math.max(0, Math.floor(seconds));
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;
}

/** Track numbers as a deck shows them: 01, 02. */
export const track = (i: number) => String(i + 1).padStart(2, "0");
