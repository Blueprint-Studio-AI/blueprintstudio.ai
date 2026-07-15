// Numbered section header (Figma 291:646): eyebrow number, then a single row
// with the title left and the value group (count + CTA pills) right.
import type { ReactNode } from "react";

export function PillLink({
  href,
  external,
  children,
}: {
  href: string;
  external?: boolean;
  children: ReactNode;
}) {
  const extra = external ? { target: "_blank", rel: "noopener noreferrer" } : { download: true };
  return (
    <a
      href={href}
      {...extra}
      className="whitespace-nowrap rounded-full border border-line bg-white px-[18px] py-3 text-meta font-medium text-muted-1 transition-colors hover:border-muted-3 hover:text-ink"
    >
      {children}
    </a>
  );
}

export default function SectionHeader({
  id,
  num,
  title,
  meta,
  children,
}: {
  id: string;
  num: string;
  title: string;
  meta: string;
  children?: ReactNode;
}) {
  return (
    <section id={id} className="px-edge pb-16 pt-section">
      <p className="text-eyebrow uppercase text-muted-2">{num}</p>
      {/* title + value group inline on desktop (Figma 291:646); stacks only on small mobile */}
      <div className="mt-6 flex items-center justify-between gap-x-6 gap-y-4 max-[600px]:flex-col max-[600px]:items-start">
        <h2 className="text-title font-medium text-ink max-[860px]:text-[30px]">{title}</h2>
        <div className="flex flex-wrap items-center justify-end gap-x-6 gap-y-3">
          <span className="whitespace-nowrap text-meta text-muted-1">{meta}</span>
          {children && <div className="flex gap-2">{children}</div>}
        </div>
      </div>
    </section>
  );
}
