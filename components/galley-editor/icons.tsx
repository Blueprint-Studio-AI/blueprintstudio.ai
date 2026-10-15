"use client";

/** The rail's icons, drawn inline so the editor brings no icon set with it. */
export function Icon({ name }: { name: "back" | "plus" | "details" | "comment" | "check" }) {
  const paths = {
    back: "M15 18l-6-6 6-6",
    plus: "M12 5v14M5 12h14",
    details: "M4 7h10M18 7h2M4 17h4M12 17h8M14 4v6M8 14v6",
    comment: "M20 15a2 2 0 0 1-2 2H8l-4 4V6a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2z",
    check: "M5 12.5l4.5 4.5L19 7.5",
  };
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d={paths[name]} />
    </svg>
  );
}
