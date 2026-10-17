import fs from "fs";
import path from "path";
import page from "@/content/pages/insights.json" with { type: "json" };

// The Insights page's sections (content/pages/insights.json). Imported, so a build carries
// it; in development, read from disk each time, so what edit mode publishes shows at once.
export function getInsightsPage(): unknown {
  if (process.env.NODE_ENV !== "development") return page;
  return JSON.parse(fs.readFileSync(path.join(/*turbopackIgnore: true*/ process.cwd(), "content/pages/insights.json"), "utf8"));
}
