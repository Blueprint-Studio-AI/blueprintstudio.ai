import type { KitMedia } from "@/data/portfolioData";

/** One site as a browser tab. Serializable, so the server page can hand it over. */
export interface SiteTab {
  /** The work's slug. */
  key: string;
  /** The tab's title: the client, or the piece where a client has two sites here. */
  title: string;
  /** The client's mark, from our logo files; a plain globe without one. */
  favicon?: string;
  /** What the screen shows: the kit's poster, and its clip where it's a recording of the site. */
  hero: KitMedia & { alt: string };
  /** The address bar: only for a site that's live, which also gets a Visit link. */
  address?: { host: string; path: string; href: string };
  archived: boolean;
  /** The caption: the client, the year, the piece, its line, and the links Showcase gives it. */
  name: string;
  year: string;
  label: string;
  summary?: string;
  links: { label: string; href: string }[];
}
