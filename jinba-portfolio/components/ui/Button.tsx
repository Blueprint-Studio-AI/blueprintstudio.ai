import type { ReactNode } from "react";

/**
 * The single button primitive for the page.
 *
 * Role → variant (never pick a style for looks, pick it for the job):
 *   solid    primary action           Download
 *   glass    CTA on a dark surface    nav CTA over the hero art
 *   pill     selectable / section CTA format + size filters, Download Zip, Get Tiempos
 *   ghost    low-emphasis navigation  nav links, inline text actions
 *   chip     mono utility action      Copy CSS
 *   segment  one option in a group    Glyph / Lockup / Compact
 *
 * Size → sm 32px · md 40px · lg 56px · xl 62px. Radius is a property of the
 * variant, never chosen ad-hoc. Every variant gets the same focus-visible ring.
 */
export type ButtonVariant = "solid" | "glass" | "pill" | "ghost" | "chip" | "segment";
export type ButtonSize = "sm" | "md" | "lg" | "xl";

const BASE =
  "inline-flex items-center justify-center gap-2 whitespace-nowrap cursor-pointer transition-colors " +
  "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink " +
  "disabled:pointer-events-none disabled:opacity-50";

const VARIANT: Record<ButtonVariant, string> = {
  solid: "rounded-lg bg-ink font-medium text-white/90 hover:bg-black",
  // translucent — reads on dark/photographic surfaces without punching a hole
  // in them (Figma 300:1072)
  glass: "rounded-full bg-white/10 font-medium text-white hover:bg-white/20 focus-visible:outline-white",
  pill: "rounded-full border border-line bg-white font-medium text-muted-1 hover:border-muted-3 hover:text-ink",
  ghost: "rounded-lg text-muted-1 hover:bg-black/[0.04] hover:text-ink",
  chip: "rounded bg-chip font-mono text-muted-1 hover:text-ink",
  segment: "flex-1 font-medium text-muted-1 hover:text-ink",
};

/** Selected state per variant (pills and segments are selectable). */
const SELECTED: Partial<Record<ButtonVariant, string>> = {
  pill: "border-transparent bg-seg-on text-ink",
  segment: "bg-seg-on text-ink",
};

const SIZE: Record<ButtonSize, string> = {
  sm: "h-8 px-3 text-body-sm",
  md: "h-10 px-4 text-meta",
  lg: "h-14 px-8 text-meta",
  xl: "h-[62px] px-[42px] text-body-lg", // the page's one conversion CTA (Figma 303:1204)
};

/** Segments fill their container, so they only take height from the size. */
const SEGMENT_SIZE: Record<ButtonSize, string> = {
  sm: "h-10 text-meta",
  md: "h-12 text-meta",
  lg: "h-14 text-meta",
  xl: "h-14 text-meta",
};

export interface ButtonProps {
  variant?: ButtonVariant;
  size?: ButtonSize;
  selected?: boolean;
  href?: string;
  external?: boolean;
  download?: boolean;
  onClick?: (e: React.MouseEvent<HTMLElement>) => void;
  /** only meaningful without href — lets callers flash the copy confirmation */
  ref?: React.Ref<HTMLButtonElement>;
  className?: string;
  children: ReactNode;
  "aria-label"?: string;
  "aria-pressed"?: boolean;
}

export default function Button({
  variant = "pill",
  size = "md",
  selected,
  href,
  external,
  download,
  onClick,
  ref,
  className = "",
  children,
  ...aria
}: ButtonProps) {
  const sizing = variant === "segment" ? SEGMENT_SIZE[size] : SIZE[size];
  const cls = [BASE, VARIANT[variant], sizing, selected ? SELECTED[variant] ?? "" : "", className]
    .filter(Boolean)
    .join(" ");

  if (href) {
    const extra = external ? { target: "_blank", rel: "noopener noreferrer" } : download ? { download: true } : {};
    return (
      <a href={href} onClick={onClick} className={cls} {...extra} {...aria}>
        {children}
      </a>
    );
  }
  return (
    <button ref={ref} onClick={onClick} className={cls} {...aria}>
      {children}
    </button>
  );
}
