// Texture grid — download cards inside the construction lines.
import { TEXTURES } from "@/lib/data";

export default function TextureGrid() {
  return (
    <section className="px-edge pb-section pt-16">
      <div className="statement">
        <div className="grid grid-cols-3 gap-x-6 gap-y-12 max-[860px]:grid-cols-1">
          {TEXTURES.map(([name, file, dims, size]) => (
            <figure key={file} className="flex flex-col gap-3">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={`/assets/textures/dl/${file}`}
                alt={name}
                loading="lazy"
                className="aspect-[16/10] w-full rounded-lg bg-[#f4f1eb] object-cover"
              />
              <div className="flex items-baseline justify-between gap-2.5">
                <div>
                  <div className="text-meta font-medium tracking-snug text-ink">{name}</div>
                  <div className="font-mono text-[11px] text-muted-3">
                    PNG · {dims} · {size}
                  </div>
                </div>
                <a
                  href={`/assets/textures/dl/${file}`}
                  download
                  className="whitespace-nowrap text-body-sm font-medium text-muted-1 transition-colors hover:text-ink"
                >
                  Download ↓
                </a>
              </div>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
