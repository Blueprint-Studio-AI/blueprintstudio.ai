import Image from "next/image";

interface MediaItem {
  src: string;
  alt: string;
  caption?: string;
  downloadLabel?: string;
  isVideo?: boolean;
}

interface TwoColumnMediaProps {
  left: MediaItem;
  right: MediaItem;
  /** Aspect ratio for each column. "natural" sizes to the image's intrinsic ratio — no cropping. */
  aspectRatio?: "4/5" | "3/4" | "1/1" | "3/2" | "16/9" | "natural";
}

export function TwoColumnMedia({ left, right, aspectRatio = "4/5" }: TwoColumnMediaProps) {
  const aspectClasses: Record<string, string> = {
    "4/5": "aspect-[4/5]",
    "3/4": "aspect-[3/4]",
    "1/1": "aspect-square",
    "3/2": "aspect-[3/2]",
    "16/9": "aspect-video",
  };

  const MediaBlock = ({ item }: { item: MediaItem }) => (
    <div className="flex-1 min-w-0">
      {aspectRatio === "natural" ? (
        /* Natural mode — no fixed container, image sets its own height */
        <Image
          src={item.src}
          alt={item.alt}
          width={0}
          height={0}
          sizes="(max-width: 768px) 100vw, 48vw"
          className="w-full h-auto rounded-sm block"
        />
      ) : (
      <div className={`relative w-full ${aspectClasses[aspectRatio]} overflow-hidden bg-neutral-300 rounded-sm`}>
        {item.isVideo ? (
          <video
            src={item.src}
            autoPlay
            muted
            loop
            playsInline
            className="absolute inset-0 w-full h-full object-cover"
          />
        ) : (
          <Image
            src={item.src}
            alt={item.alt}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 48vw"
          />
        )}
      </div>
      )}
      {(item.caption || item.downloadLabel) && (
        <div className="flex items-center justify-between mt-2.5 px-0.5">
          {item.caption && (
            <span className="text-xs text-neutral-400">{item.caption}</span>
          )}
          {item.downloadLabel && (
            <a
              href={item.src}
              download
              className="ml-auto inline-flex items-center gap-1.5 text-[11px] text-neutral-500 hover:text-neutral-800 transition-colors duration-150 border border-neutral-300 hover:border-neutral-400 rounded-full px-3 py-1"
            >
              <svg width="10" height="10" viewBox="0 0 12 12" fill="none">
                <path d="M6 1v7M3 6l3 3 3-3M1 10h10" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              {item.downloadLabel}
            </a>
          )}
        </div>
      )}
    </div>
  );

  return (
    <div className="px-6 sm:px-10 my-3">
      <div className="flex flex-col sm:flex-row gap-3">
        <MediaBlock item={left} />
        <MediaBlock item={right} />
      </div>
    </div>
  );
}
