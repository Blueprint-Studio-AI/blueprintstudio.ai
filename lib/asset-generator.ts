// Blueprint Studio Asset Generator lives in the tools monorepo, on its own subdomain.
const TOOLS_ORIGIN = "https://tools.blueprintstudio.ai";

/** The product page, and the page that connects it to Claude, ChatGPT, Cursor and more. */
type ToolsPage = "/asset-generator/landing" | "/mcp-setup";

/**
 * A link into the Asset Generator, tagged with where on this site it was clicked
 * (`placement`), so the tools analytics can tell the nav from the home band.
 */
export function assetGeneratorUrl(page: ToolsPage, placement: string): string {
  const url = new URL(page, TOOLS_ORIGIN);
  url.searchParams.set("utm_source", "blueprintstudio.ai");
  url.searchParams.set("utm_medium", "referral");
  url.searchParams.set("utm_campaign", "asset_generator");
  url.searchParams.set("utm_content", placement);
  return url.toString();
}
