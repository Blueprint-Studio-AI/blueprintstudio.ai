import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { clients, type Client } from "@/data/portfolioData";
import { clientPath, hasClientPage, madeFor, shownWorkOf, workHref } from "@/lib/work";

/** Where a client's row links: its page, its brand case study, or its work on a wall. */
function rowHref(client: Client): string | undefined {
  if (hasClientPage(client)) return clientPath(client);
  const brand = client.work.find((w) => w.visibility === "public" && w.brandPage)?.brandPage;
  if (brand) return `/brands/${brand}`;
  const shown = shownWorkOf(client)[0];
  return shown ? workHref(shown) : undefined;
}

// Every client we've had, as a compact, typographic list: the name, what we
// made, and the years where we know them. Names link where there's a page.
export default function AllWorkList() {
  const rows = [...clients]
    .filter((c) => c.work.some((w) => w.visibility !== "needs-ok"))
    .sort((a, b) => a.name.localeCompare(b.name));

  return (
    <div>
      <div className="hidden grid-cols-[minmax(0,1.1fr)_minmax(0,1.6fr)_120px] gap-6 border-b border-black/10 pb-3 font-mono text-[11px] uppercase tracking-wide text-neutral-500 sm:grid">
        <span>Client</span>
        <span>What we made</span>
        <span className="text-right">Year</span>
      </div>
      <ul>
        {rows.map((client) => {
          const href = rowHref(client);
          const name = (
            <span className="text-[17px] font-medium tracking-[-0.015em] text-neutral-900 lg:text-lg">{client.name}</span>
          );
          return (
            <li key={client.slug} className="border-b border-black/10">
              <div className="group grid grid-cols-[minmax(0,1fr)_auto] gap-x-6 gap-y-1 py-3.5 sm:grid-cols-[minmax(0,1.1fr)_minmax(0,1.6fr)_120px] sm:items-baseline sm:py-4">
                <div className="min-w-0">
                  {href ? (
                    <Link href={href} className="inline-flex items-baseline gap-1.5 outline-none focus-visible:underline">
                      {name}
                      <ArrowRight
                        aria-hidden
                        className="h-3.5 w-3.5 translate-y-[1px] self-center text-neutral-300 transition-[color,transform] duration-300 ease-out group-hover:translate-x-0.5 group-hover:text-black"
                      />
                    </Link>
                  ) : (
                    name
                  )}
                </div>
                <span className="order-3 col-span-2 text-[15px] leading-[1.45] text-neutral-500 sm:order-none sm:col-span-1">{madeFor(client)}</span>
                <span className="text-right font-mono text-[13px] tabular-nums text-neutral-500">{client.years || "—"}</span>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
