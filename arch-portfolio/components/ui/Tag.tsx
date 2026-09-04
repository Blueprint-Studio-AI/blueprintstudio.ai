import type { ReactNode } from "react";

/** Mono asset/token tag — the grey chip that labels each interactive block
 *  (logo filename, colour token, type role). Label only, never interactive. */
export default function Tag({ children }: { children: ReactNode }) {
  return (
    <span className="self-start rounded bg-chip px-3 py-2 font-mono text-meta font-medium text-muted-1">
      {children}
    </span>
  );
}
