import type { ServiceConfig } from "./types";
import { websites } from "./websites";

export type { IncludedItem, PricingOption, RichText, ServiceConfig } from "./types";

export const services: ServiceConfig[] = [websites];

export function getService(slug: string): ServiceConfig | undefined {
  return services.find((s) => s.slug === slug);
}
