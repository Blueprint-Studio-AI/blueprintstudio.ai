// Footer — provenance line.

export default function Footer() {
  return (
    <footer className="flex flex-wrap items-center justify-between gap-3 border-t border-line-soft px-edge py-12">
      <span className="text-[12px] text-muted-3">Maintained by Blueprint Studio · Updated Jul 14, 2026</span>
      <span className="text-[12px] text-muted-3">
        <a
          href="mailto:hello@blueprintstudio.ai?subject=Jinba%20asset%20request"
          className="text-inherit transition-colors hover:text-ink"
        >
          Request an asset →
        </a>
        &nbsp;&nbsp;·&nbsp;&nbsp;2026
      </span>
    </footer>
  );
}
