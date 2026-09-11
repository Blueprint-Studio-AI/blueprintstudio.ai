// The Arch Network lockup as live vector. Paints with currentColor, so the same
// component reads white over the hero and ink on a light surface.
import { GLYPH_PATHS, WORDMARK_PATH, LOCKUP_VIEWBOX } from "@/lib/logo-paths";

export default function ArchLockup({ className = "", title }: { className?: string; title?: string }) {
  return (
    <svg
      viewBox={LOCKUP_VIEWBOX}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      role={title ? "img" : undefined}
      aria-hidden={title ? undefined : true}
    >
      {title && <title>{title}</title>}
      {GLYPH_PATHS.map((d, i) => (
        <path key={i} d={d} fill="currentColor" fillRule="evenodd" clipRule="evenodd" />
      ))}
      <path d={WORDMARK_PATH} fill="currentColor" />
    </svg>
  );
}
