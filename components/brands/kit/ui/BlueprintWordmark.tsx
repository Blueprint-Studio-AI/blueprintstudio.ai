import type { CSSProperties } from "react";
import { BLUEPRINT_WORDMARK_WHITE } from "@/components/brands/kit/lib/logo-white";
import { BLUEPRINT_WORDMARK_GREY } from "@/components/brands/kit/lib/logo-grey";

// The Blueprint wordmark, rendered INLINE rather than through <img>.
// Safari rasterises img-loaded SVGs at a fixed size and scales the bitmap, which
// blurs at any size that isn't 1:1; an inline <svg> is drawn as live vector, so
// it stays crisp at 18px (nav) and 84px (footer) alike. The wrapper carries the
// height; the child <svg> fills it and takes its width from the viewBox.
//
// Two real assets rather than one filtered one: the grey mark carries its own
// per-path opacities (0.5 on "blueprint", 0.33 on "studio"), which a CSS invert
// of the white mark could only approximate.
const SOURCE = { white: BLUEPRINT_WORDMARK_WHITE, grey: BLUEPRINT_WORDMARK_GREY };

export default function BlueprintWordmark({
  className = "",
  tone = "white",
  style,
  decorative,
}: {
  className?: string;
  tone?: "white" | "grey";
  style?: CSSProperties;
  /** true when a sibling copy already carries the accessible name */
  decorative?: boolean;
}) {
  return (
    <span
      {...(decorative ? { "aria-hidden": true } : { role: "img", "aria-label": "Blueprint Studio" })}
      className={`inline-block [&>svg]:block [&>svg]:h-full [&>svg]:w-auto ${className}`}
      style={style}
      dangerouslySetInnerHTML={{ __html: SOURCE[tone] }}
    />
  );
}
