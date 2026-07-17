"use client";

// Logo configurator (Figma 296:865) — family / mark / style / format+size,
// live SVG recolour, PNG pre-rasterisation (keeps the download click synchronous
// for Safari), and real file downloads.
import { useEffect, useRef, useState } from "react";
import { FAMILIES, stylesFor, type MarkKey } from "@/lib/data";
import Tag from "@/components/ui/Tag";
import { DownloadIcon } from "@/components/ui/icons";

const svgCache: Record<string, Promise<string>> = {};
function getSvg(src: string): Promise<string> {
  if (!svgCache[src]) {
    svgCache[src] = fetch(src)
      .then((r) => {
        if (!r.ok) throw new Error(String(r.status));
        return r.text();
      })
      .catch((e) => {
        delete svgCache[src]; // never cache a rejection
        throw e;
      });
  }
  return svgCache[src];
}
const stripDims = (t: string) =>
  t.replace(/<svg([^>]*)>/, (_m, a: string) => "<svg" + a.replace(/\s(width|height)="[^"]*"/g, "") + ">");
const recolor = (raw: string, from: string, to: string) => stripDims(raw.split(from).join(to));

function saveBlob(blob: Blob, name: string) {
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = name;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(a.href), 3000);
}

const MARK_LABELS: Record<MarkKey, string> = { glyph: "Glyph", lockup: "Lockup", compact: "Compact" };
const MARK_ORDER: MarkKey[] = ["glyph", "lockup", "compact"];
const SIZES = [512, 1024, 2048];

/** Control group label — 12px uppercase (Figma). */
const CtlLabel = ({ children }: { children: React.ReactNode }) => (
  <span className="text-label uppercase text-muted-2">{children}</span>
);

export default function LogoConfigurator() {
  const [fam, setFam] = useState("jinba");
  const [mark, setMark] = useState<MarkKey>("glyph");
  const [styleKey, setStyleKey] = useState("color");
  const [format, setFormat] = useState<"svg" | "png">("svg");
  const [size, setSize] = useState(1024);
  const [sizeOpen, setSizeOpen] = useState(false);
  const [markHtml, setMarkHtml] = useState("");
  const sizeRef = useRef<HTMLDivElement>(null);
  const sizeBtn = useRef<HTMLButtonElement>(null);

  const family = FAMILIES[fam];
  const styles = stylesFor(fam);
  const st = styles.find((s) => s.key === styleKey) ?? styles[0];
  const md = family.marks[mark] ?? family.marks.glyph!;
  const fileBase = `${fam === "jinba" ? "jinba" : "jinba-" + fam}-${mark}-${styleKey}`;
  const fileName = format === "svg" ? `${fileBase}.svg` : `${fileBase}-${size}.png`;

  // Live recolour, re-entrancy-guarded so a slow fetch can't repaint newer state.
  const seq = useRef(0);
  useEffect(() => {
    const my = ++seq.current;
    getSvg(md.src)
      .then((raw) => {
        if (my === seq.current) setMarkHtml(recolor(raw, family.fill, st.hex));
      })
      .catch(() => {});
  }, [md.src, family.fill, st.hex]);

  // Pre-rasterise the PNG so the download click stays in the user-gesture tick.
  const pngReady = useRef<{ key: string; blob: Blob | null }>({ key: "", blob: null });
  useEffect(() => {
    if (format !== "png") return;
    const key = fileName;
    let cancelled = false;
    getSvg(md.src)
      .then((raw) => {
        const url = URL.createObjectURL(new Blob([recolor(raw, family.fill, st.hex)], { type: "image/svg+xml" }));
        const img = new Image();
        img.onload = () => {
          if (cancelled) return URL.revokeObjectURL(url);
          const h = Math.round((size * img.height) / img.width);
          const c = document.createElement("canvas");
          c.width = size;
          c.height = h;
          c.getContext("2d")!.drawImage(img, 0, 0, size, h);
          URL.revokeObjectURL(url);
          c.toBlob((b) => {
            if (!cancelled) pngReady.current = { key, blob: b };
          }, "image/png");
        };
        img.src = url;
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, [format, fileName, md.src, family.fill, st.hex, size]);

  // close the size menu on outside click / Escape
  useEffect(() => {
    if (!sizeOpen) return;
    const onDown = (e: MouseEvent) => {
      if (sizeRef.current && !sizeRef.current.contains(e.target as Node)) setSizeOpen(false);
    };
    // Escape hands focus back to the trigger — closing unmounts the list, and
    // without this the focused option vanishes and focus drops to <body>.
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      setSizeOpen(false);
      sizeBtn.current?.focus();
    };
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [sizeOpen]);

  function pickFam(k: string) {
    setFam(k);
    if (!FAMILIES[k].marks[mark]) setMark("glyph");
  }

  async function download() {
    try {
      if (format === "svg") {
        const raw = await getSvg(md.src);
        saveBlob(new Blob([recolor(raw, family.fill, st.hex)], { type: "image/svg+xml" }), fileName);
      } else if (pngReady.current.key === fileName && pngReady.current.blob) {
        saveBlob(pngReady.current.blob, fileName); // synchronous path
      } else {
        const raw = recolor(await getSvg(md.src), family.fill, st.hex);
        const url = URL.createObjectURL(new Blob([raw], { type: "image/svg+xml" }));
        const img = new Image();
        img.onload = () => {
          const h = Math.round((size * img.height) / img.width);
          const c = document.createElement("canvas");
          c.width = size;
          c.height = h;
          c.getContext("2d")!.drawImage(img, 0, 0, size, h);
          URL.revokeObjectURL(url);
          c.toBlob((b) => b && saveBlob(b, fileName), "image/png");
        };
        img.src = url;
      }
    } catch {
      /* ignore */
    }
  }

  const pillBase =
    "inline-flex h-[42px] cursor-pointer items-center justify-center gap-2.5 rounded-full px-[18px] text-meta font-medium tracking-snug transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink";

  return (
    <section className="px-edge pb-section pt-16">
      <div className="statement">
        <div className="flex items-start gap-gutter max-[1200px]:gap-16 max-[1024px]:flex-col max-[1024px]:gap-11">
          {/* left — tag + artboard */}
          <div className="flex w-[596px] shrink-0 flex-col gap-8 max-[1200px]:w-[48%] max-[1024px]:w-full max-[1024px]:max-w-[596px] max-[860px]:max-w-none">
            <Tag>{fileName}</Tag>
            <div
              className={`flex h-[532px] w-full items-center justify-center overflow-hidden rounded-3xl transition-colors max-[860px]:h-[380px] ${
                st.dark ? "bg-[#252525]" : "bg-[#fafafa]"
              }`}
              // dot grid — the artboard's resting surface (Figma)
              style={
                st.dark
                  ? undefined
                  : {
                      backgroundImage: "radial-gradient(circle, #e3e3e3 1.5px, transparent 1.5px)",
                      backgroundSize: "66px 66px",
                      backgroundPosition: "center",
                    }
              }
            >
              <div
                className="transition-[width] [&_img]:block [&_img]:h-auto [&_img]:w-full [&_svg]:block [&_svg]:h-auto [&_svg]:w-full"
                style={{ width: md.w }}
                dangerouslySetInnerHTML={{ __html: markHtml }}
              />
            </div>
          </div>

          {/* right — controls */}
          <div className="flex min-w-0 flex-1 flex-col gap-16 max-[860px]:w-full">
            <div className="flex flex-col gap-8">
              {/* family tiles — 64px, fluid so they fit any column */}
              <div className="flex flex-col gap-3.5">
                <CtlLabel>Logo</CtlLabel>
                {/* fixed 24px gap between fixed-width tiles (was flex-1, which
                    auto-distributed them across the column). Tiles drop to 56px
                    on phones so the 24px gap still fits. */}
                <div className="flex gap-6">
                  {Object.entries(FAMILIES).map(([k, f]) => (
                    <button
                      key={k}
                      onClick={() => pickFam(k)}
                      aria-pressed={k === fam}
                      className="flex w-16 shrink-0 flex-col items-center justify-center gap-3 max-[600px]:w-14"
                    >
                      <span
                        className={`flex aspect-square w-full max-w-[64px] items-center justify-center overflow-hidden rounded-lg border bg-white transition-shadow ${
                          k === fam ? "border-ink shadow-[inset_0_0_0_1px_theme(colors.ink)]" : "border-line"
                        }`}
                      >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={f.thumb} alt={f.label} className="max-h-[46%] max-w-[46%] object-contain" />
                      </span>
                      <span className="text-body-sm font-light tracking-snug text-black">{f.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* mark — segmented */}
              <div className="flex flex-col gap-3.5">
                <CtlLabel>Brand Logo</CtlLabel>
                {/* Segments hug their own label rather than splitting the row.
                    Jinba has three formats and the sub-brands have two — with
                    flex-1 the same "Glyph" segment was a third wide on one family
                    and half on the next, so it resized under the cursor when you
                    switched. Hugging keeps each label a fixed width across every
                    family; only the control's overall length changes. */}
                <div className="flex w-fit max-w-full overflow-hidden rounded-lg border border-line">
                  {MARK_ORDER.filter((m) => family.marks[m]).map((m, i) => (
                    <button
                      key={m}
                      onClick={() => setMark(m)}
                      aria-pressed={m === mark}
                      className={`shrink-0 cursor-pointer px-6 py-4 text-meta font-medium tracking-snug transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-ink ${
                        i > 0 ? "border-l border-line" : ""
                      } ${m === mark ? "bg-seg-on text-black" : "bg-white text-muted-3"}`}
                    >
                      {MARK_LABELS[m]}
                    </button>
                  ))}
                </div>
              </div>

              {/* styles */}
              <div className="flex flex-col gap-3.5">
                <CtlLabel>Styles</CtlLabel>
                <div role="group" aria-label="Logo style" className="flex gap-2">
                  {styles.map((s) => (
                    <button
                      key={s.key}
                      onClick={() => setStyleKey(s.key)}
                      aria-pressed={s.key === styleKey}
                      aria-label={s.key === "color" ? `${family.label} brand color` : `${s.key} logo`}
                      title={s.key === "color" ? `${family.label} brand color` : s.key}
                      className={`flex h-[42px] w-[42px] cursor-pointer items-center justify-center rounded-full ${
                        s.key === styleKey ? "shadow-[inset_0_0_0_1.5px_theme(colors.ink)]" : ""
                      }`}
                    >
                      <span className="h-8 w-8 rounded-full border border-black/[0.12]" style={{ background: s.hex }} />
                    </button>
                  ))}
                </div>
              </div>

              {/* format — SVG | PNG(size dropdown) */}
              <div className="flex flex-col gap-3.5">
                <CtlLabel>Brand Logo</CtlLabel>
                <div className="flex flex-wrap items-start gap-3">
                  <button
                    onClick={() => setFormat("svg")}
                    aria-pressed={format === "svg"}
                    className={`${pillBase} ${
                      format === "svg" ? "bg-seg-on text-black" : "border border-line bg-white text-muted-3"
                    }`}
                  >
                    SVG
                  </button>

                  <div ref={sizeRef} className="relative">
                    <button
                      ref={sizeBtn}
                      onClick={() => {
                        setFormat("png");
                        setSizeOpen((o) => !o);
                      }}
                      aria-pressed={format === "png"}
                      aria-expanded={sizeOpen}
                      aria-haspopup="listbox"
                      className={`${pillBase} ${
                        format === "png" ? "bg-seg-on text-black" : "border border-line bg-white text-muted-3"
                      }`}
                    >
                      PNG
                      {format === "png" && <span className="font-mono text-label">{size}</span>}
                      <svg
                        width="10"
                        height="10"
                        viewBox="0 0 10 10"
                        fill="none"
                        aria-hidden
                        className={`transition-transform ${sizeOpen ? "rotate-180" : ""}`}
                      >
                        <path d="M2 3.5l3 3 3-3" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
                      </svg>
                    </button>

                    {sizeOpen && (
                      <ul
                        role="listbox"
                        aria-label="PNG size"
                        className="absolute left-0 top-[calc(100%+6px)] z-20 min-w-[140px] overflow-hidden rounded-lg border border-line bg-white py-1 shadow-[0_10px_30px_rgba(0,0,0,0.12)]"
                      >
                        {SIZES.map((v) => (
                          <li key={v}>
                            <button
                              role="option"
                              aria-selected={v === size}
                              onClick={() => {
                                setSize(v);
                                setSizeOpen(false);
                                sizeBtn.current?.focus();
                              }}
                              className={`flex w-full cursor-pointer items-center justify-between gap-4 px-3 py-2 text-left text-meta transition-colors hover:bg-chip ${
                                v === size ? "font-medium text-ink" : "text-muted-1"
                              }`}
                            >
                              {v} px
                              {v === size && (
                                <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden>
                                  <path
                                    d="M2.4 6.3l2.4 2.3 4.8-5"
                                    stroke="currentColor"
                                    strokeWidth="1.6"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                  />
                                </svg>
                              )}
                            </button>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* download — full-width dark pill */}
            <button
              onClick={download}
              className="flex h-11 w-full cursor-pointer items-center justify-center gap-2.5 rounded-full bg-nav-surface px-8 text-label text-white transition-colors hover:bg-black focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink"
            >
              Download
              <DownloadIcon />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
