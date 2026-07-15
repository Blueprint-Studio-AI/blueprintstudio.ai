"use client";

// Logo configurator — family / mark / style / format / size, live SVG recolour,
// PNG pre-rasterisation (keeps the download click synchronous for Safari), and
// real file downloads. Ported from the prototype's app.js.
import { useEffect, useRef, useState } from "react";
import { FAMILIES, stylesFor, type MarkKey } from "@/lib/data";

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

export default function LogoConfigurator() {
  const [fam, setFam] = useState("jinba");
  const [mark, setMark] = useState<MarkKey>("glyph");
  const [styleKey, setStyleKey] = useState("color");
  const [format, setFormat] = useState<"svg" | "png">("svg");
  const [size, setSize] = useState(1024);
  const [markHtml, setMarkHtml] = useState("");

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
        // fall back: rasterise now, save when ready
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

  return (
    <section className="px-edge py-16">
      <div className="statement">
        <div className="flex items-start gap-gutter max-[1200px]:gap-16 max-[1024px]:flex-col max-[1024px]:gap-11">
          {/* left — filename + artboard */}
          <div className="flex w-[596px] shrink-0 flex-col gap-8 max-[1200px]:w-[48%] max-[1024px]:w-full max-[1024px]:max-w-[596px] max-[860px]:max-w-none">
            <span className="self-start rounded bg-chip px-[13.33px] py-2 font-mono text-meta font-medium text-muted-1">
              {fileName}
            </span>
            <div
              className={`flex aspect-[596/532] w-full items-center justify-center overflow-hidden rounded-3xl transition-colors ${
                st.dark ? "bg-[#252525]" : "bg-[#fafafa]"
              }`}
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
            {/* family tiles */}
            <div className="flex flex-col gap-3.5">
              <span className="text-label uppercase text-muted-2">Logo</span>
              <div className="flex gap-6 max-[860px]:gap-3.5">
                {Object.entries(FAMILIES).map(([k, f]) => (
                  <button
                    key={k}
                    onClick={() => pickFam(k)}
                    className="flex flex-col items-center gap-3 max-[860px]:min-w-0 max-[860px]:flex-1"
                  >
                    <span
                      className={`flex h-[76px] w-[76px] items-center justify-center overflow-hidden rounded-lg border bg-white transition-shadow max-[860px]:h-auto max-[860px]:aspect-square max-[860px]:w-full max-[860px]:max-w-[76px] ${
                        k === fam ? "border-ink shadow-[inset_0_0_0_1px_theme(colors.ink)]" : "border-line"
                      }`}
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={f.thumb} alt={f.label} className="max-h-[66%] max-w-[66%] object-contain" />
                    </span>
                    <span className="text-body-sm font-light tracking-snug text-black">{f.label}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="flex flex-col gap-8">
              {/* mark */}
              <div className="flex flex-col gap-3.5">
                <span className="text-label uppercase text-muted-2">Mark</span>
                <div className="flex w-full overflow-hidden rounded-lg border border-line">
                  {MARK_ORDER.filter((m) => family.marks[m]).map((m) => (
                    <button
                      key={m}
                      onClick={() => setMark(m)}
                      className={`flex-1 border-0 px-[13.77px] py-4 text-meta font-medium tracking-snug transition-colors ${
                        m === mark ? "bg-seg-on text-black" : "bg-white text-muted-1"
                      }`}
                    >
                      {MARK_LABELS[m]}
                    </button>
                  ))}
                </div>
              </div>

              {/* styles */}
              <div className="flex flex-col gap-3.5">
                <span className="text-label uppercase text-muted-2">Styles</span>
                <div className="flex gap-2">
                  {styles.map((s) => (
                    <button
                      key={s.key}
                      onClick={() => setStyleKey(s.key)}
                      title={s.key === "color" ? `${family.label} brand color` : s.key}
                      className={`flex h-[42px] w-[42px] items-center justify-center rounded-full ${
                        s.key === styleKey ? "shadow-[inset_0_0_0_1.5px_theme(colors.ink)]" : ""
                      }`}
                    >
                      <span className="h-8 w-8 rounded-full border border-black/[0.12]" style={{ background: s.hex }} />
                    </button>
                  ))}
                </div>
              </div>

              {/* format */}
              <div className="flex flex-col gap-3.5">
                <span className="text-label uppercase text-muted-2">Format</span>
                <div className="flex flex-wrap gap-[11.65px]">
                  {(["svg", "png"] as const).map((f) => (
                    <button
                      key={f}
                      onClick={() => setFormat(f)}
                      className={`rounded-full border px-[18px] py-3 text-meta font-medium tracking-snug transition-colors ${
                        f === format ? "border-transparent bg-seg-on text-black" : "border-line bg-white text-muted-1"
                      }`}
                    >
                      {f.toUpperCase()}
                    </button>
                  ))}
                </div>
              </div>

              {/* size — png only */}
              {format === "png" && (
                <div className="flex flex-col gap-3.5">
                  <span className="text-label uppercase text-muted-2">Size</span>
                  <div className="flex flex-wrap gap-[11.65px]">
                    {[
                      [512, "S · 512"],
                      [1024, "M · 1024"],
                      [2048, "L · 2048"],
                    ].map(([v, label]) => (
                      <button
                        key={v}
                        onClick={() => setSize(v as number)}
                        className={`rounded-full border px-[18px] py-3 text-meta font-medium tracking-snug transition-colors ${
                          v === size ? "border-transparent bg-seg-on text-black" : "border-line bg-white text-muted-1"
                        }`}
                      >
                        {label}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* download */}
            <div className="flex gap-4">
              <button
                onClick={download}
                className="flex flex-1 items-center justify-center gap-3 rounded-lg bg-ink px-10 py-5 text-[16px] font-medium tracking-snug text-white/90 transition-colors hover:bg-black"
              >
                Download
                <svg width="10" height="10" viewBox="0 0 10 10" fill="none" className="rotate-90">
                  <path
                    d="M2 5h6M5 2l3 3-3 3"
                    stroke="currentColor"
                    strokeWidth="1.2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
