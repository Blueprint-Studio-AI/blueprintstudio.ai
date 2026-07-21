import type { ReactNode } from "react";
import Button from "@/components/brands/kit/ui/Button";
import { DownloadIcon, LinkIcon } from "@/components/brands/kit/ui/icons";

/**
 * Section CTA pill (Figma 296:854). Every current use is a download, so it wears
 * the download glyph; `external` flips it to the link glyph for anything that
 * points off-site rather than onto disk.
 */
export function PillLink({
  href,
  external,
  children,
}: {
  href: string;
  external?: boolean;
  children: ReactNode;
}) {
  return (
    <Button variant="pill" href={href} external={external} download={!external} className="gap-2.5 !text-label">
      {children}
      {external ? <LinkIcon /> : <DownloadIcon />}
    </Button>
  );
}

/**
 * Section header (Figma 296:854): title left, value group right, on one row.
 * No eyebrow number — the title carries the section.
 *
 * No bottom padding on purpose: the 64px header→content gap is owned by the
 * content block's own pt-16, the way the Figma models it as a single gap.
 * Adding padding here too would double it.
 */
export default function SectionHeader({
  id,
  title,
  meta,
  children,
}: {
  id: string;
  title: string;
  meta: string;
  children?: ReactNode;
}) {
  return (
    <section id={id} className="px-edge pt-section">
      <div className="flex items-center justify-between gap-6 max-[600px]:flex-col max-[600px]:items-start max-[600px]:gap-4">
        <h2 className="text-title font-medium text-ink max-[860px]:text-title-mobile">{title}</h2>
        <div className="flex flex-wrap items-center justify-end gap-6 max-[600px]:justify-start">
          <span className="whitespace-nowrap font-mono text-meta font-medium text-muted-1">{meta}</span>
          {children && <div className="flex gap-2">{children}</div>}
        </div>
      </div>
    </section>
  );
}
