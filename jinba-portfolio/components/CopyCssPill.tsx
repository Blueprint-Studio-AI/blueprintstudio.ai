"use client";

// Type section CTA (Figma 298:936). Where the other sections download a file,
// type hands you the stylesheet — so this pill is the section's "get the
// assets" action, built from the same TYPE data the specimens render from.
import { useRef } from "react";
import { TYPE } from "@/lib/data";
import { copyText } from "@/lib/clipboard";
import Button from "@/components/ui/Button";

const slug = (s: string) => s.toLowerCase().replace(/\s+/g, "-");

function stylesheet() {
  const out: string[] = ["/* Jinba — Type System */", ":root {"];
  for (const [key, face] of Object.entries(TYPE)) out.push(`  --jinba-font-${key}: ${face.css};`);
  out.push("}");

  for (const [key, face] of Object.entries(TYPE)) {
    out.push("", `/* ${key === "display" ? "Display" : "Text"} — ${face.css.split(",")[0].replace(/"/g, "")} */`);
    for (const [label, size, lh, ls] of face.rows) {
      out.push(
        `.jinba-${slug(label)} {`,
        `  font-family: var(--jinba-font-${key});`,
        `  font-size: ${size}px;`,
        `  line-height: ${lh};`,
        `  letter-spacing: ${ls};`,
        `}`,
      );
    }
  }
  return out.join("\n");
}

export default function CopyCssPill() {
  const ref = useRef<HTMLButtonElement>(null);
  return (
    <Button
      ref={ref}
      variant="pill"
      onClick={() => copyText(stylesheet(), ref.current)}
      className="gap-2.5 !text-label"
    >
      Copy CSS
      <svg width="18" height="18" viewBox="0 0 20 20" fill="none" aria-hidden className="shrink-0">
        <path
          d="M8.6 11.4a3 3 0 004.24 0l2.5-2.5a3 3 0 00-4.24-4.24l-1.1 1.1M11.4 8.6a3 3 0 00-4.24 0l-2.5 2.5a3 3 0 004.24 4.24l1.1-1.1"
          stroke="currentColor"
          strokeWidth="1.3"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </Button>
  );
}
