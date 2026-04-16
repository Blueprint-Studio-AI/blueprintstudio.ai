import Image from "next/image";

interface FullBleedMediaProps {
  src: string;
  alt: string;
  aspectRatio?: "16/9" | "3/2" | "4/3" | "1/1" | "21/9";
  caption?: string;
  /** Set true for videos (mp4) */
  isVideo?: boolean;
  /** Optional download button */
  downloadLabel?: string;
}

export function FullBleedMedia({
  src,
  alt,
  aspectRatio = "3/2",
  caption,
  isVideo = false,
  downloadLabel,
}: FullBleedMediaProps) {
  const aspectClasses: Record<string, string> = {
    "16/9": "aspect-video",
    "3/2": "aspect-[3/2]",
    "4/3": "aspect-[4/3]",
    "1/1": "aspect-square",
    "21/9": "aspect-[21/9]",
  };

  return (
    <div className="px-6 sm:px-10 my-3">
      <div className={`relative w-full ${aspectClasses[aspectRatio]} overflow-hidden bg-neutral-300 rounded-sm`}>
        {isVideo ? (
          <video
            src={src}
            autoPlay
            muted
            loop
            playsInline
            className="absolute inset-0 w-full h-full object-cover"
          />
        ) : (
          <Image
            src={src}
            alt={alt}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 95vw"
          />
        )}
      </div>
      {(caption || downloadLabel) && (
        <div className="flex items-center justify-between mt-2.5 px-1">
          {caption && (
            <span className="text-xs text-neutral-400">{caption}</span>
          )}
          {downloadLabel && (
            <a
              href={src}
              download
              className="ml-auto text-xs font-medium text-neutral-500 hover:text-neutral-900 transition-colors duration-150 flex items-center gap-1.5"
            >
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                <path d="M6 1v7M3 6l3 3 3-3M1 10h10" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              {downloadLabel}
            </a>
          )}
        </div>
      )}
    </div>
  );
}
