"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArchLogo, XIcon } from "@/components/icons";
import { NAV_LINKS, EXTERNAL, type NavLeaf } from "@/lib/site";

const navIn = (i: number) => ({
  animation: `nav-in 0.6s ease-out ${0.15 + i * 0.12}s both`,
});

export function Nav({ lightHero = false }: { lightHero?: boolean } = {}) {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  // true while the nav sits over a section that opted into a dark theme
  // (`data-nav-theme="dark"`) → light content, no glass.
  const [overDark, setOverDark] = useState(false);
  // true while a section flags `data-nav-glass="1"` under the nav: an edge crossing its line
  // (the /prime-v6 scroll moments) → a light glass so dark content reads over either side.
  const [edgeGlass, setEdgeGlass] = useState(false);

  const isEcosystem = pathname === "/ecosystem";
  // /prime-v6, -v7, -v8 (local prototypes): the nav's button carries the page's one action;
  // "#early-access" opens the sign-up dialog (components/prime-v6/early-access.tsx).
  const isPrimeV6 = ["/prime-v6", "/prime-v7", "/prime-v8", "/prime-v9", "/prime-v10", "/prime-v11"].some((r) => pathname.startsWith(r));
  const cta = isPrimeV6
    ? { label: "Get early access", href: "#early-access" }
    : isEcosystem
      ? { label: "Start Building", href: EXTERNAL.docs }
      : { label: "Become a partner", href: EXTERNAL.typeform };
  const menuCta = isPrimeV6 ? cta : { label: "Join the Ecosystem", href: EXTERNAL.typeform };

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY >= window.innerHeight - 80);
      const line = 40; // mid-nav probe line
      let over = false;
      document.querySelectorAll('[data-nav-theme="dark"]').forEach((el) => {
        const r = el.getBoundingClientRect();
        if (r.top <= line && r.bottom > line) over = true;
      });
      setOverDark(over);
      let edge = false;
      document.querySelectorAll('[data-nav-glass="1"]').forEach((el) => {
        const r = el.getBoundingClientRect();
        if (r.top <= line && r.bottom > line) edge = true;
      });
      setEdgeGlass(edge);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  const dark = scrolled || menuOpen;
  // glass only over light sections; over dark sections the bar goes bare + light
  const glassShown = (dark && !overDark) || edgeGlass;
  // /prime-v6 only, phones only: once scrolled, a dark glass over dark sections, so a headline
  // passing under the bare light nav (the view) never collides with it
  const darkGlassShown = isPrimeV6 && scrolled && overDark && !menuOpen;
  // the open menu is a white sheet, so its content is dark whatever sits behind the bar
  const darkText = menuOpen || (!overDark && (dark || lightHero));
  const linkColor = darkText ? "text-black" : "text-white";

  function NavLink({ link, onClick, big }: { link: NavLeaf; onClick?: () => void; big?: boolean }) {
    const cls = `whitespace-nowrap ${big ? "text-[20px]" : "text-sm"} transition-colors duration-200 ${linkColor}`;
    return link.external ? (
      <a href={link.href} target="_blank" rel="noopener noreferrer" onClick={onClick} className={cls}>
        {link.label}
      </a>
    ) : (
      <Link
        href={link.href}
        aria-current={pathname === link.href ? "page" : undefined}
        onClick={onClick}
        className={cls}
      >
        {link.label}
      </Link>
    );
  }

  // Desktop-only dropdown for a labelled group (e.g. Resources → Blog, Docs).
  // Pure hover/focus-within reveal; the white panel keeps dark text regardless
  // of the nav's light/dark flip, so it stays legible over any section.
  function NavDropdown({ item }: { item: { label: string; children: readonly NavLeaf[] } }) {
    return (
      <div className="group relative">
        <button type="button" className={`relative inline-flex items-center whitespace-nowrap text-sm transition-colors duration-200 ${linkColor}`}>
          {item.label}
          {/* Chevron is absolute (left-full) so it adds no layout width — the
              nav labels stay optically centered instead of being nudged left. */}
          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" className="absolute left-full top-1/2 ml-1 -translate-y-1/2 opacity-70 transition-transform duration-200 group-hover:rotate-180">
            <path d="M6 9l6 6 6-6" />
          </svg>
        </button>
        {/* -left-3 + card p-1 + link px-2 = 12px, so item text aligns flush
            under the trigger label. */}
        <div className="invisible absolute -left-3 top-full pt-3 opacity-0 transition-opacity duration-200 group-hover:visible group-hover:opacity-100 group-focus-within:visible group-focus-within:opacity-100">
          <div className="flex min-w-[120px] flex-col rounded-2xl bg-white p-1 shadow-[0_12px_40px_rgba(0,0,0,0.14)] ring-1 ring-black/5">
            {item.children.map((c) => (
              <a
                key={c.label}
                href={c.href}
                target={c.external ? "_blank" : undefined}
                rel={c.external ? "noopener noreferrer" : undefined}
                className="rounded-xl px-2 py-2 text-sm text-black/75 transition-colors duration-150 hover:bg-black/[0.05] hover:text-black"
              >
                {c.label}
              </a>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <nav className="fixed inset-x-0 top-0 z-100 flex h-20 items-center">
      <div
        className={`pointer-events-none absolute inset-0 backdrop-blur-[12px] transition-opacity duration-400 ${edgeGlass ? "bg-[#f7f6f6]/85" : "bg-white/30"} ${
          glassShown ? "opacity-100" : "opacity-0"
        }`}
      />
      {isPrimeV6 && (
        <div
          className={`pointer-events-none absolute inset-0 bg-[#0d2249]/60 backdrop-blur-[12px] transition-opacity duration-400 md:hidden ${
            darkGlassShown ? "opacity-100" : "opacity-0"
          }`}
        />
      )}
      <div className="relative z-10 mx-auto flex w-[94%] max-w-(--container-site) items-center justify-between">
        <Link href="/" aria-label="Arch Network home" className={`nav-anim relative z-10 ${linkColor}`} style={navIn(0)}>
          <ArchLogo className="h-8 w-auto" />
        </Link>

        <div className="absolute left-1/2 hidden -translate-x-1/2 items-center gap-5 md:flex">
          {NAV_LINKS.map((link, i) => (
            <span key={link.label} style={navIn(i + 1)}>
              {"children" in link ? <NavDropdown item={link} /> : <NavLink link={link} />}
            </span>
          ))}
        </div>

        <div className="hidden items-center gap-3 md:flex" style={navIn(NAV_LINKS.length + 1)}>
          <a
            href={EXTERNAL.x}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Arch on X"
            className={linkColor}
          >
            <XIcon className="h-4 w-4" />
          </a>
          <a
            href={cta.href}
            target={cta.href.startsWith("http") ? "_blank" : undefined}
            rel={cta.href.startsWith("http") ? "noopener noreferrer" : undefined}
            className={`rounded-xl border px-5 py-2 text-sm transition-colors duration-400 hover:border-dark-purple hover:bg-dark-purple hover:text-white ${
              darkText ? "border-black text-black" : "border-white text-white"
            }`}
          >
            {cta.label}
          </a>
        </div>

        <button
          type="button"
          aria-label="Toggle menu"
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((v) => !v)}
          className="relative z-10 flex h-8 w-8 flex-col items-center justify-center gap-1 md:hidden"
        >
          <span className={`block h-0.5 w-5 transition-all duration-300 ${darkText ? "bg-black" : "bg-white"} ${menuOpen ? "translate-y-[6px] rotate-45" : ""}`} />
          <span className={`block h-0.5 w-5 transition-all duration-300 ${darkText ? "bg-black" : "bg-white"} ${menuOpen ? "opacity-0" : ""}`} />
          <span className={`block h-0.5 w-5 transition-all duration-300 ${darkText ? "bg-black" : "bg-white"} ${menuOpen ? "-translate-y-[6px] -rotate-45" : ""}`} />
        </button>
      </div>

      <div
        className={`fixed inset-x-0 top-0 flex flex-col items-start gap-7 rounded-b-[28px] bg-white px-[3%] pt-[90px] pb-6 transition-transform duration-400 md:hidden ${
          menuOpen ? "translate-y-0" : "-translate-y-[120%]"
        }`}
      >
        {/* Mobile flattens the Resources group — Chain, Blog, Docs as one list. */}
        {NAV_LINKS.flatMap((link) => ("children" in link ? link.children : [link])).map((link) => (
          <NavLink key={link.label} link={link} big onClick={() => setMenuOpen(false)} />
        ))}
        <a
          href={menuCta.href}
          target={menuCta.href.startsWith("http") ? "_blank" : undefined}
          rel={menuCta.href.startsWith("http") ? "noopener noreferrer" : undefined}
          onClick={() => setMenuOpen(false)}
          className="mt-2 w-full rounded-2xl bg-orange px-6 py-3 text-center text-base text-white transition-colors duration-400 hover:bg-dark-purple"
        >
          {menuCta.label}
        </a>
      </div>
    </nav>
  );
}
