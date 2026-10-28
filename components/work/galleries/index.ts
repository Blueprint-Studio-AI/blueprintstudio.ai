import type { ComponentType } from "react";
import type { Deliverable } from "@/data/portfolioData";
import type { ShownWork } from "@/lib/work";
import LaunchVideosGallery from "./LaunchVideosGallery";

// A /work/<deliverable> page can open on a gallery made for its kind of work
// (launch videos as discs, websites as tabs, ...), between the header and the
// pieces themselves. Outside production, ?gallery=off shows the page without it.

export type GalleryProps = { works: ShownWork[] };

export const GALLERIES: Partial<Record<Deliverable, ComponentType<GalleryProps>>> = {
  "launch-videos": LaunchVideosGallery,
};
