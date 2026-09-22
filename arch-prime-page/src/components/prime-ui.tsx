import Link from "next/link";
import type { CSSProperties, ReactNode } from "react";

// The small vocabulary the Prime page is built from, matching the app (arch-prime packages/ui):
// a full-bleed band with backdrop/overlay layers and a content column, the app's button, an
// eyebrow, and the hairline metric list. Type classes carry the app's scale in px.

export const T = {
  eyebrow: "text-[16px] leading-6 tracking-[-0.03em]",
  label: "text-[14px] leading-5",
  body: "text-[16px] leading-6",
  lead: "text-[20px] leading-8",
  sub: "text-[24px] leading-8 tracking-[-0.02em]",
  metric: "text-[28px] leading-9 tracking-[-0.02em]",
  value: "text-[32px] leading-10 tracking-[-0.02em]",
  h2: "font-serif text-[36px] leading-[44px] tracking-[-0.04em] sm:text-[48px] sm:leading-[56px]",
  h1: "font-serif text-[48px] leading-[56px] tracking-[-0.04em] sm:text-[56px] sm:leading-[64px]",
  display: "font-serif text-[48px] leading-[56px] tracking-[-0.04em] sm:text-[64px] sm:leading-[76px]",
} as const;

export function Band({
  as: El = "section",
  id,
  background,
  backdrop,
  overlay,
  className = "",
  inner = "",
  navDark = false,
  children,
}: {
  as?: "section" | "div" | "header" | "footer";
  id?: string;
  background?: string;
  backdrop?: ReactNode;
  overlay?: ReactNode;
  className?: string;
  inner?: string;
  /** the site nav switches to light text over bands flagged dark */
  navDark?: boolean;
  children: ReactNode;
}) {
  const style: CSSProperties | undefined = background ? { background } : undefined;
  return (
    <El id={id} style={style} className={`relative w-full ${className}`} {...(navDark ? { "data-nav-theme": "dark" } : {})}>
      {backdrop && (
        <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
          {backdrop}
        </div>
      )}
      {overlay && (
        <div aria-hidden className="pointer-events-none absolute inset-0 z-[1] overflow-hidden">
          {overlay}
        </div>
      )}
      <div className={`site-container relative z-[2] ${inner}`}>{children}</div>
    </El>
  );
}

export function Eyebrow({ children, onDark = false, color }: { children: ReactNode; onDark?: boolean; color?: string }) {
  return (
    <p className={`${T.eyebrow} ${onDark ? "text-white/60" : "text-[#8c8c8c]"}`} style={color ? { color } : undefined}>
      {children}
    </p>
  );
}

// The app's button: 12px radius, 60px tall (xl 64), label-sized text, an arrow when it leads
// somewhere on the page. `color`/`ink` paint a pale button in a band's own colour.
export function PrimeButton({
  href,
  children,
  size = "lg",
  color = "var(--p-orange)",
  ink = "#ffffff",
  arrow = false,
  className = "",
}: {
  href: string;
  children: ReactNode;
  size?: "lg" | "xl";
  color?: string;
  ink?: string;
  arrow?: boolean;
  className?: string;
}) {
  const cls = `inline-flex items-center justify-center gap-3 rounded-[12px] font-medium tracking-[-0.02em] transition-[transform,filter] duration-200 hover:brightness-[1.06] active:scale-[0.98] ${
    size === "xl" ? "h-16 px-10 text-[18px] sm:px-14" : "h-[60px] px-8 text-[18px]"
  } ${className}`;
  const style = { backgroundColor: color, color: ink };
  const body = (
    <>
      {children}
      {arrow && (
        <svg width="14" height="12" viewBox="0 0 14 12" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
          <path d="M1 6h11M8 2l4 4-4 4" />
        </svg>
      )}
    </>
  );
  if (href.startsWith("http")) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={cls} style={style}>
        {body}
      </a>
    );
  }
  return (
    <Link href={href} className={cls} style={style}>
      {body}
    </Link>
  );
}

export type Metric = { label: string; value: string; unit?: string };

// Label over value, a hairline under each, side by side. `onDark` for the colour bands.
export function Metrics({ items, onDark = false, size = "metric" }: { items: Metric[]; onDark?: boolean; size?: "metric" | "sub" }) {
  return (
    <dl className="m-0 flex flex-wrap gap-x-8 gap-y-6">
      {items.map((m) => (
        <div key={m.label} className={`flex min-w-[152px] flex-col gap-2 border-b pb-3 ${onDark ? "border-white/20" : "border-[#dadada]"}`}>
          <dt className={`${T.label} ${onDark ? "text-white/70" : "text-[#787878]"}`}>{m.label}</dt>
          <dd className={`m-0 ${size === "metric" ? T.metric : T.sub} ${onDark ? "text-white" : "text-[#292a2e]"}`}>
            {m.value}
            {m.unit && <span className={`${T.label} ml-2 ${onDark ? "text-white/70" : "text-[#787878]"}`}>{m.unit}</span>}
          </dd>
        </div>
      ))}
    </dl>
  );
}
