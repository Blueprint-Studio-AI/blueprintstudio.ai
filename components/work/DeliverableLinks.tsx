import Link from "next/link";
import type { Deliverable } from "@/data/portfolioData";
import { projectsFor, workPages } from "@/lib/work";

// A quiet row of links to every deliverable page, the current one marked.
export default function DeliverableLinks({ current }: { current?: Deliverable }) {
  return (
    <nav aria-label="Work by type" className="-mx-3 flex flex-wrap items-center gap-1">
      {workPages.map((page) => {
        const active = page.slug === current;
        return (
          <Link
            key={page.slug}
            href={`/work/${page.slug}`}
            aria-current={active ? "page" : undefined}
            className={`inline-flex h-8 items-center gap-1.5 rounded-full px-3 text-sm font-medium transition-colors duration-200 ${
              active
                ? "bg-black/[0.07] text-[rgba(29,29,31,1)]"
                : "text-[rgba(29,29,31,0.6)] hover:bg-black/[0.04] hover:text-[rgba(29,29,31,0.88)]"
            }`}
          >
            {page.label}
            <span className="font-mono text-[11px] tabular-nums text-neutral-400">{projectsFor(page.slug).length}</span>
          </Link>
        );
      })}
    </nav>
  );
}
