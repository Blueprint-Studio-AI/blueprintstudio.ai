import type { ReactNode } from "react";

// Marks placeholder copy on previews and in dev, and renders it plain in
// production. Server components only: VERCEL_ENV isn't sent to the browser,
// so in a client component every build would look like a preview.
const SHOW = process.env.VERCEL_ENV !== "production";

export default function Draft({ children, when = true }: { children: ReactNode; when?: boolean }) {
  if (!SHOW || !when) return <>{children}</>;
  return (
    <span title="Placeholder copy: Tyler to write" className="underline decoration-dashed decoration-neutral-400 underline-offset-[5px]">
      {children}
      <span className="ml-1.5 inline-block -translate-y-px rounded-full border border-dashed border-neutral-400 px-1.5 align-middle font-mono text-[10px] uppercase leading-[16px] tracking-wide text-neutral-500 no-underline">
        Draft
      </span>
    </span>
  );
}
