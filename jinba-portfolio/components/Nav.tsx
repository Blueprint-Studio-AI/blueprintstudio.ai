// Top bar — Blueprint Studio site nav (Figma 284:187). Static; the section
// tab bar below the overview owns stickiness.

const NAV_LINKS = ["Product", "Pricing", "API"];
const SITE = "https://blueprintstudio.ai";

export default function Nav() {
  return (
    <header className="flex items-center justify-between border-b border-black/15 bg-white px-edge-nav py-6 max-[860px]:px-6 max-[860px]:py-4">
      <a href={SITE} aria-label="Blueprint Studio" className="flex h-[18px] items-center">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/assets/blueprint-studio-nav.png" alt="Blueprint Studio" className="h-[18px] w-auto" />
      </a>
      <nav aria-label="Primary" className="flex items-center gap-2.5">
        <div className="flex items-center max-[860px]:hidden">
          {NAV_LINKS.map((label) => (
            <a
              key={label}
              href={SITE}
              className="rounded-xl px-3 py-1.5 text-meta text-muted-1 transition-colors hover:bg-black/[0.04] hover:text-ink"
            >
              {label}
            </a>
          ))}
        </div>
        <span aria-hidden className="h-4 w-px shrink-0 bg-[rgba(230,230,230,0.8)] max-[860px]:hidden" />
        <div className="flex items-center gap-3">
          <a
            href={SITE}
            className="rounded-xl px-3 py-1.5 text-meta text-muted-1 transition-colors hover:bg-black/[0.04] hover:text-ink"
          >
            Login
          </a>
          <a
            href={SITE}
            className="whitespace-nowrap rounded bg-signup px-3.5 py-1.5 text-meta font-medium text-white transition-colors hover:bg-black"
          >
            Sign up
          </a>
        </div>
      </nav>
    </header>
  );
}
