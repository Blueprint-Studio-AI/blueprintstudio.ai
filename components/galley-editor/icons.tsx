"use client";

/** The rail's icons, drawn inline so the editor brings no icon set with it. */
export function Icon({ name }: { name: "back" | "plus" | "details" | "comment" | "check" | "layers" | "eye" | "eye-off" | "undo" | "redo" | "history" }) {
  const paths = {
    back: "M15 18l-6-6 6-6",
    plus: "M12 5v14M5 12h14",
    details: "M4 7h10M18 7h2M4 17h4M12 17h8M14 4v6M8 14v6",
    comment: "M20 15a2 2 0 0 1-2 2H8l-4 4V6a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2z",
    check: "M5 12.5l4.5 4.5L19 7.5",
    undo: "M9 14L4 9l5-5M4 9h10.5a5.5 5.5 0 0 1 0 11H11",
    redo: "M15 14l5-5-5-5M20 9H9.5a5.5 5.5 0 0 0 0 11H13",
    history: "M3 12a9 9 0 1 0 2.6-6.4L3 8M3 3v5h5M12 7v5l3 2",
    layers: "M12 4l8.5 4.5L12 13 3.5 8.5 12 4zM3.5 12.5L12 17l8.5-4.5M3.5 16.5L12 21l8.5-4.5",
    eye: "M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12zM12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6z",
    "eye-off": "M3 3l18 18M10.6 5.1A10 10 0 0 1 12 5c6.5 0 10 7 10 7a17 17 0 0 1-3.2 4.2M6.6 6.6C3.9 8.3 2 12 2 12s3.5 7 10 7c1.8 0 3.4-.5 4.7-1.2M9.9 9.9a3 3 0 0 0 4.2 4.2",
  };
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d={paths[name]} />
    </svg>
  );
}
