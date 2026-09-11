"use client";

// Downloads — the take-away section, replacing the old Implementation writeup.
//
// The step-by-step adoption guide went away because the design system now ships
// as a file an agent can read (see AgentDoc); walking a human through the same
// tokens in prose was the long way round.
//
// Every entry is config-driven and only renders if the brand actually declares
// that bundle, so this section can't advertise a file that 404s.
import { useBrand } from "@/components/brands/kit/BrandContext";
import { metaFor } from "@/components/brands/kit/types";
import AgentDoc from "@/components/brands/kit/AgentDoc";
import { useToast } from "@/components/brands/kit/ui/Toast";
import { DownloadIcon, LinkIcon } from "@/components/brands/kit/ui/icons";

// The deck leads: it's the one file that explains the rest.
const ORDER = ["guidelines", "logos", "tokens", "assets", "kit"] as const;

const FALLBACK_LABELS: Record<(typeof ORDER)[number], string> = {
  guidelines: "Brand guidelines",
  logos: "Logo system",
  tokens: "Design tokens",
  assets: "Brand assets",
  kit: "Full brand kit",
};

export default function Downloads() {
  const brand = useBrand();
  const toast = useToast();
  const { downloads, downloadLabels, kit, agentDoc, fileSizes } = brand;
  const meta = metaFor(brand);

  const rows = ORDER.filter((k) => downloads[k]).map((k) => {
    const href = downloads[k]!;
    // An absolute URL (a shared Drive deck) opens in a tab; `download` would be
    // ignored cross-origin anyway.
    const external = /^https?:\/\//.test(href);
    return {
      key: k,
      href,
      external,
      label: downloadLabels?.[k] ?? FALLBACK_LABELS[k],
      // sizes come from measure() at build time
      meta: external
        ? new URL(href).hostname.replace(/^www\./, "")
        : k === "logos" && kit
          ? `${kit.logoFiles} files · ${kit.logoZip}`
          : [k === "assets" ? meta.assets : href.split("/").pop(), fileSizes?.[href]].filter(Boolean).join(" · "),
    };
  });

  if (!rows.length && !agentDoc) return null;

  return (
    <section id="downloads" className="bg-chip px-edge py-section">
      <div className="flex max-w-measure flex-col gap-10">
        <h2 className="text-title font-medium text-ink">Downloads</h2>

        {rows.length > 0 && (
          <ul className="flex list-none flex-col">
            {rows.map((r) => (
              <li key={r.key} className="border-t border-line first:border-t-0">
                <a
                  href={r.href}
                  {...(r.external
                    ? { target: "_blank", rel: "noopener noreferrer" }
                    : { download: true, onClick: () => toast(`Downloading ${r.label.toLowerCase()}`) })}
                  className="group flex items-center justify-between gap-6 py-5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink"
                >
                  <span className="flex min-w-0 flex-col gap-1">
                    <span className="text-body-lg font-medium text-ink">{r.label}</span>
                    <span className="font-mono text-micro uppercase tracking-tight text-muted-3">{r.meta}</span>
                  </span>
                  <span className="flex shrink-0 items-center gap-2.5 text-meta font-medium text-muted-2 transition-colors group-hover:text-ink">
                    {r.external ? "Open" : "Download"}
                    {r.external ? <LinkIcon /> : <DownloadIcon />}
                  </span>
                </a>
              </li>
            ))}
          </ul>
        )}

        <AgentDoc />
      </div>
    </section>
  );
}
