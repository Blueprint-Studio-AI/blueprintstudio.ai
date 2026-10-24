import type { ReactNode } from "react";
import { EYEBROW, TEXT_INSET } from "./WorkHeader";

// A section's heading inside the wide column, with the same inset as the page
// header so every left edge lines up: a mono eyebrow, the title, and an
// optional line (or link) on the right.
export default function SectionTitle({
  eyebrow,
  title,
  aside,
  id,
}: {
  eyebrow?: ReactNode;
  title: string;
  aside?: ReactNode;
  id?: string;
}) {
  return (
    <div className={`${TEXT_INSET} grid gap-4 pb-8 sm:pb-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,440px)] lg:items-end lg:gap-16 lg:pb-14`}>
      <div>
        {eyebrow && <p className={`mb-3 lg:mb-4 ${EYEBROW}`}>{eyebrow}</p>}
        <h2
          id={id}
          className="max-w-[18ch] text-balance text-[clamp(32px,4.4vw,60px)] font-medium leading-[1] tracking-[-0.045em] text-black"
        >
          {title}
        </h2>
      </div>
      {aside && <div className="text-pretty text-[17px] leading-[1.45] text-neutral-600 lg:pb-1">{aside}</div>}
    </div>
  );
}
