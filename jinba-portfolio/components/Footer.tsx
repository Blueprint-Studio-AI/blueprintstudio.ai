// The studio footer — recreated 1:1 from blueprintstudio.ai's shared <Footer>
// (components/Footer) for the standalone review app. When this page becomes a
// route in the main site, swap this file for a direct import of that component.
import Newsletter from "@/components/footer/Newsletter";

// The footer keeps the main site's own spacing, not the portfolio's --edge
// frame: full width, content at 84px (60px section + 24px inner) on desktop and
// 20px on mobile, with the dashed rails on the 60px section edge. These are
// literal so nothing above the footer is affected.
const PAD = "px-5 md:px-[84px]"; // content blocks — 20px / 84px, matching the site
const DIV = "mx-2.5 md:mx-[60px]"; // horizontal dividers, spanning between the rails

interface FooterLink {
  name: string;
  href: string;
  external?: boolean;
}

// Structure + hrefs read from the live footer at blueprintstudio.ai. Internal
// paths are made absolute so they resolve from the standalone review app; the
// arrow (external) marks the same links the live site marks.
const COLUMNS: { title: string; links: FooterLink[] }[] = [
  {
    title: "Company",
    links: [
      { name: "Tyler Stupart", href: "https://www.linkedin.com/in/tylerstupart/", external: true },
      { name: "Jaidon Lalor", href: "https://www.linkedin.com/in/jaidonlalor/", external: true },
      { name: "Insights", href: "https://blueprintstudio.ai/insights" },
      { name: "Contact", href: "mailto:blueprint.dao@gmail.com" },
    ],
  },
  {
    title: "Services",
    links: [
      { name: "Brand Identity", href: "https://blueprintstudio.ai/brand" },
      { name: "Launch Package", href: "https://blueprintstudio.ai/launch" },
      { name: "Launch Videos", href: "https://blueprintstudio.ai/launch-videos" },
    ],
  },
  {
    title: "Products",
    links: [{ name: "Asset Generator", href: "https://tools.blueprintstudio.ai/asset-generator", external: true }],
  },
];

const LEGAL: FooterLink[] = [
  { name: "Terms of Service", href: "https://blueprintstudio.ai/terms" },
  { name: "Privacy Policy", href: "https://blueprintstudio.ai/privacy-policy" },
];

const SOCIALS: { label: string; href: string; path: string }[] = [
  {
    label: "GitHub",
    href: "https://github.com/Blueprint-Studio-AI",
    path: "M12 2a10 10 0 00-3.16 19.49c.5.09.68-.22.68-.48v-1.7c-2.78.6-3.37-1.34-3.37-1.34-.45-1.16-1.11-1.47-1.11-1.47-.9-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.9 1.53 2.34 1.09 2.91.83.09-.65.35-1.09.63-1.34-2.22-.25-4.55-1.11-4.55-4.94 0-1.09.39-1.98 1.03-2.68-.1-.25-.45-1.27.1-2.65 0 0 .84-.27 2.75 1.02a9.6 9.6 0 015 0c1.91-1.29 2.75-1.02 2.75-1.02.55 1.38.2 2.4.1 2.65.64.7 1.03 1.59 1.03 2.68 0 3.84-2.34 4.68-4.57 4.93.36.31.68.92.68 1.85v2.74c0 .27.18.58.69.48A10 10 0 0012 2z",
  },
  {
    label: "X",
    href: "https://x.com/bpstu",
    path: "M13.16 10.62L19.28 3.5h-1.45l-5.31 6.18L8.28 3.5H3.4l6.42 9.34-6.42 7.46h1.45l5.61-6.53 4.48 6.53h4.88l-6.66-9.68zm-1.99 2.31l-.65-.93-5.17-7.4h2.23l4.18 5.98.65.93 5.42 7.76h-2.23l-4.43-6.34z",
  },
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/company/blueprint-studio-ai",
    path: "M6.94 5A1.94 1.94 0 113 5a1.94 1.94 0 013.94 0zM7 8.48H3V21h4V8.48zm6.32 0H9.34V21h3.94v-6.57c0-3.66 4.77-4 4.77 0V21H22v-7.93c0-6.17-7.06-5.94-8.72-2.91l.04-1.68z",
  },
];

const ExternalGlyph = () => (
  <svg width="9" height="9" viewBox="0 0 11 12" fill="none" aria-hidden className="flex-shrink-0 opacity-50">
    <path
      d="M1.70985 4.5H7.7804M7.7804 4.5V10.5705M7.7804 4.5L0.780396 11.5"
      stroke="currentColor"
      strokeWidth="1.3"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const Socials = ({ className = "" }: { className?: string }) => (
  <ul className={`flex flex-row gap-4 ${className}`}>
    {SOCIALS.map((s) => (
      <li key={s.label}>
        <a
          href={s.href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={s.label}
          className="text-neutral-600 transition-colors duration-200 hover:text-neutral-400"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
            <path d={s.path} />
          </svg>
        </a>
      </li>
    ))}
  </ul>
);

export default function Footer() {
  return (
    <footer className="relative w-full bg-neutral-900 text-neutral-400">
      {/* dashed side rails on the section edge (60px desktop / 10px mobile) */}
      <div aria-hidden className="pointer-events-none absolute inset-y-0 left-2.5 w-px bg-[repeating-linear-gradient(to_bottom,rgb(64_64_64)_0_6px,transparent_6px_12px)] md:left-[60px]" />
      <div aria-hidden className="pointer-events-none absolute inset-y-0 right-2.5 w-px bg-[repeating-linear-gradient(to_bottom,rgb(64_64_64)_0_6px,transparent_6px_12px)] md:right-[60px]" />

      {/* wordmark — natural height, as the site renders it */}
      <div className={`${PAD} pt-16 md:pt-28`}>
        <a href="https://blueprintstudio.ai" aria-label="Blueprint Studio" className="inline-block">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/assets/blueprint-logo.svg" alt="Blueprint Studio" className="h-[46px] w-auto grayscale md:h-[84px]" />
        </a>
      </div>

      {/* link columns */}
      <div className={`${PAD} py-16 md:py-28`}>
        <div className="flex flex-col gap-10 md:flex-row md:gap-12">
          {COLUMNS.map((col) => (
            <div key={col.title} className="flex min-w-0 flex-col md:w-40">
              <h3 className="mb-5 text-sm font-medium text-neutral-400">{col.title}</h3>
              <ul className="flex flex-col gap-4">
                {col.links.map((link) => (
                  <li key={link.name}>
                    <a
                      href={link.href}
                      {...(link.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                      className="flex w-fit items-center gap-1 text-sm text-neutral-500 transition-colors duration-200 hover:text-neutral-300"
                    >
                      {link.name}
                      {link.external && <ExternalGlyph />}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <Socials className="pt-16 md:hidden" />
      </div>

      <div aria-hidden className={`${DIV} h-px bg-[repeating-linear-gradient(to_right,rgb(64_64_64)_0_6px,transparent_6px_12px)]`} />

      {/* newsletter + socials */}
      <div className={`${PAD} py-10`}>
        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between md:gap-0">
          <Newsletter />
          <Socials className="hidden md:flex" />
        </div>
      </div>

      <div aria-hidden className={`${DIV} h-px bg-[repeating-linear-gradient(to_right,rgb(64_64_64)_0_6px,transparent_6px_12px)]`} />

      {/* baseline — copyright + legal left, coordinates right */}
      <div className={`flex flex-col gap-4 ${PAD} pb-7 pt-20 md:flex-row md:items-center md:justify-between md:gap-0`}>
        <div className="flex flex-col gap-2 md:flex-row md:items-center md:gap-6">
          <p className="text-sm tracking-[-0.02em] text-neutral-600">Copyright © Blueprint Studio 2026</p>
          <div className="flex gap-6">
            {LEGAL.map((l) => (
              <a
                key={l.name}
                href={l.href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm tracking-[-0.02em] text-neutral-600 transition-colors hover:text-neutral-400"
              >
                {l.name}
              </a>
            ))}
          </div>
        </div>
        <p className="text-[12px] tracking-[-0.02em] text-neutral-600">33°59&apos;19.0&quot;N 118°28&apos;33.8&quot;W</p>
      </div>
    </footer>
  );
}
