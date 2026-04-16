const TIEMPOS_SCALE = [
  { label: "Headline",  size: "60px", tracking: "-0.025em", leading: "1.22" },
  { label: "Heading 1", size: "48px", tracking: "-0.025em", leading: "1.22" },
  { label: "Heading 2", size: "36px", tracking: "-0.025em", leading: "1.3"  },
  { label: "Heading 3", size: "24px", tracking: "-0.015em", leading: "1.3"  },
  { label: "Heading 4", size: "16px", tracking: "-0.015em", leading: "1.3"  },
];

const GEIST_SCALE = [
  { label: "Body Large", size: "18px", tracking: "0em",    leading: "1.5" },
  { label: "Body",       size: "16px", tracking: "0em",    leading: "1.5" },
  { label: "Body Small", size: "13px", tracking: "0em",    leading: "1.5" },
  { label: "Caption",    size: "11px", tracking: "0.01em", leading: "1.4" },
  { label: "Label",      size: "10px", tracking: "0.04em", leading: "1.4" },
];

const tiempos = { fontFamily: '"Tiempos Text", serif' };
const geist   = { fontFamily: '"Geist", sans-serif' };

interface ScaleRow { label: string; size: string; tracking: string; leading: string }

function TypeChunk({
  label,
  specimen,
  byLine,
  scale,
  fontStyle,
}: {
  label: string;
  specimen: React.ReactNode;
  byLine: React.ReactNode;
  scale: ScaleRow[];
  fontStyle: React.CSSProperties;
}) {
  return (
    <div className="flex flex-col gap-5">
      {/* Label sits above both columns so neither column needs a top offset */}
      <p className="text-[12px] text-neutral-500">{label}</p>

      {/* Two columns — both start at the same y, items-start guarantees top alignment */}
      <div className="flex flex-col sm:flex-row gap-12 sm:gap-20 items-start">

        {/* Left — typeface name + attribution */}
        <div className="flex-1 min-w-0 flex flex-col gap-6">
          <p
            className="leading-[1.1] tracking-[-0.02em] text-[#342115]"
            style={{ ...fontStyle, fontSize: "clamp(40px, 5.5vw, 80px)", whiteSpace: "nowrap" }}
          >
            {specimen}
          </p>
          <p className="text-[13px] text-neutral-500">{byLine}</p>
        </div>

        {/* Right — scale rows, full width, font sizes capped via min() so they
            never overflow on narrow screens while staying true on large ones. */}
        <div className="w-full flex-1 min-w-0">
          {scale.map((row) => (
            <div
              key={row.label}
              className="flex items-baseline justify-between pb-4 mb-4 border-b border-neutral-200 last:border-0 last:mb-0 last:pb-0"
            >
              <span
                className="text-[#342115] min-w-0"
                style={{ ...fontStyle, fontSize: `min(${row.size}, calc(3.5vw + 6px))`, letterSpacing: row.tracking, lineHeight: row.leading }}
              >
                {row.label}
              </span>
              <span className="text-[11px] text-neutral-500 ml-4 flex-shrink-0 font-mono tabular-nums">
                {row.size} / {row.leading} / {row.tracking}
              </span>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}

export function TypeScaleSection() {
  return (
    <section className="px-6 sm:px-10 flex flex-col gap-20 pt-3 pb-16">
      <TypeChunk
        label="Headings typeface"
        specimen={<>Tiempos<br />Text</>}
        byLine={
          <>
            By{" "}
            <a
              href="https://klim.co.nz/fonts/tiempos-text/"
              target="_blank"
              rel="noopener noreferrer"
              className="underline underline-offset-2 hover:text-neutral-700 transition-colors"
            >
              Klim Type Foundry
            </a>
          </>
        }
        scale={TIEMPOS_SCALE}
        fontStyle={tiempos}
      />

      <TypeChunk
        label="Body typeface"
        specimen={<>Geist<br />Regular</>}
        byLine={
          <>
            By{" "}
            <a
              href="https://vercel.com/font"
              target="_blank"
              rel="noopener noreferrer"
              className="underline underline-offset-2 hover:text-neutral-700 transition-colors"
            >
              Vercel
            </a>
          </>
        }
        scale={GEIST_SCALE}
        fontStyle={geist}
      />
    </section>
  );
}
