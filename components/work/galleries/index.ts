import type { ComponentType } from "react";
import type { Deliverable } from "@/data/portfolioData";
import type { ShownWork } from "@/lib/work";
import WebsitesGallery from "./WebsitesGallery";
import LaunchVideosGallery from "./LaunchVideosGallery";
import AppsGallery from "./apps/AppsGallery";
import BrandingGallery from "./branding/BrandingGallery";

// A /work/<deliverable> page can open on a gallery made for its kind of work
// (launch videos as discs, websites as tabs, ...), between the header and the
// pieces themselves. Outside production, ?gallery=off shows the page without it.

export type GalleryProps = { works: ShownWork[] };

export const GALLERIES: Partial<Record<Deliverable, ComponentType<GalleryProps>>> = {
  websites: WebsitesGallery,
  "launch-videos": LaunchVideosGallery,
  apps: AppsGallery,
  branding: BrandingGallery,
};
