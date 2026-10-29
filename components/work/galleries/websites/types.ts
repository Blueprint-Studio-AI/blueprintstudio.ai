import type { ReactNode } from "react";
import type { KitMedia } from "@/data/portfolioData";

/** One site as a browser tab. Serializable, so the server page can hand it over. */
export interface SiteTab {
  /** The work's slug. */
  key: string;
  /** The tab's title: the client, or the page's own title where a client has two sites here. */
  title: string;
  /** The site's favicon or the client's mark, from our files. */
  favicon?: string;
  /** The capture: shown until the live page paints, or instead of it. Its clip plays only when there's no live page. */
  hero: KitMedia & { alt: string; vertical?: KitMedia };
  /** The real page, live in the browser, where we can frame it. */
  frame?: string;
  /** The live page is too heavy for a phone's data (the phone keeps the capture). */
  heavy?: boolean;
  /** The address bar: the live site's domain, or where an archived site used to be. */
  address: { host: string; path: string; live: boolean };
  /** Where "Visit site" goes, for a site that's live. */
  visit?: string;
  /** The live site is still the one we made, unchanged, so it gets the Original tag. */
  original: boolean;
  /** The page's top colour, for the phone's status bar. */
  tint: string;
  /** The caption: the client, the year, the piece, its line, and the links Showcase gives it. */
  name: string;
  year: string;
  label: string;
  summary?: string;
  links: { label: string; href: string }[];
}

/** Copy rendered on the server, so it carries the Draft mark outside production. */
export interface SiteLabels {
  /** The address bar's word for a site that's no longer live. */
  archived: ReactNode;
  /** The tag on a live site that's still the one we made. */
  original: ReactNode;
  /** The phone's hint that a tap hands the screen to the site. */
  tap: ReactNode;
}
