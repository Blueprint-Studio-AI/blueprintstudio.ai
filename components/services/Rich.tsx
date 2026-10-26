import Link from "next/link";
import type { RichText } from "@/lib/services";

// Renders a data file's text with inline links, styled like /brand's FAQ links.
export default function Rich({ text }: { text: RichText }) {
  if (typeof text === "string") return <>{text}</>;
  return (
    <>
      {text.map((run, i) =>
        typeof run === "string" ? (
          <span key={i}>{run}</span>
        ) : (
          <Link key={i} href={run.href} className="underline transition-colors hover:text-neutral-900">
            {run.label}
          </Link>
        )
      )}
    </>
  );
}
