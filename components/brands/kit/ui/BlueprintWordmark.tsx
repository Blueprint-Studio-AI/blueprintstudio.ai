import { BLUEPRINT_WORDMARK_WHITE } from "@/components/brands/kit/lib/logo-white";

// The white Blueprint wordmark, rendered INLINE rather than through <img>.
// Safari rasterises img-loaded SVGs at a fixed size and scales the bitmap, which
// blurs at any size that isn't 1:1; an inline <svg> is drawn as live vector, so
// it stays crisp at 18px (nav) and 84px (footer) alike. The wrapper carries the
// height; the child <svg> fills it and takes its width from the viewBox.
export default function BlueprintWordmark({ className = "" }: { className?: string }) {
  return (
    <span
      role="img"
      aria-label="Blueprint Studio"
      className={`inline-block [&>svg]:block [&>svg]:h-full [&>svg]:w-auto ${className}`}
      dangerouslySetInnerHTML={{ __html: BLUEPRINT_WORDMARK_WHITE }}
    />
  );
}
