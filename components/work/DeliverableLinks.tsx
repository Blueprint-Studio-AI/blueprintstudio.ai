import Link from "next/link";
import type { Deliverable } from "@/data/portfolioData";
import { workPages } from "@/lib/work";

// A quiet row of links: all work, then each kind of work, the current one marked.
export default function DeliverableLinks({ current }: { current?: Deliverable }) {
  const items = [{ href: "/work", label: "All work", active: !current }, ...workPages.map((p) => ({ href: `/work/${p.slug}`, label: p.label, active: p.slug === current }))];
  return (
    <nav aria-label="Work by type" className="-mx-3 flex flex-wrap items-center gap-1">
      {items.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          aria-current={item.active ? "page" : undefined}
          className={`inline-flex h-9 items-center rounded-full px-3.5 text-[15px] font-medium tracking-[-0.01em] transition-colors duration-200 ${
            item.active
              ? "bg-black/[0.07] text-neutral-900"
              : "text-neutral-500 hover:bg-black/[0.04] hover:text-neutral-900"
          }`}
        >
          {item.label}
        </Link>
      ))}
    </nav>
  );
}
