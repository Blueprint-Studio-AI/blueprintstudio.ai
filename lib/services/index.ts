import type { ServiceConfig } from "./types";
import { websites } from "./websites";
import { apps } from "./apps";
import { branding } from "./branding";
import { launchVideos } from "./launch-videos";

export type { IncludedItem, PricingOption, RichText, ServiceConfig } from "./types";

// In the /work pages' order: one service page per deliverable.
export const services: ServiceConfig[] = [websites, apps, branding, launchVideos];

export function getService(slug: string): ServiceConfig | undefined {
  return services.find((s) => s.slug === slug);
}

/** Text with its links dropped, for structured data. */
export function plainText(text: ServiceConfig["faqs"][number]["answer"]): string {
  return typeof text === "string" ? text : text.map((run) => (typeof run === "string" ? run : run.label)).join("");
}
