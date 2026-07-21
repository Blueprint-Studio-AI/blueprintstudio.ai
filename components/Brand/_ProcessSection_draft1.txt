{/*
  DRAFT 1 — Thumbprint transition section
  Saved checkpoint. Linear gradient + curved white path approach.
  Top fade mask: gradual fade from transparent to visible.
  Bottom: linear blue→white gradient with solid white curve overlay.

  To restore: copy this block back into ProcessSection.tsx replacing the
  current "Thumbprint transition" block.
*/}

{/* Thumbprint transition */}
<div className="relative w-full z-10 overflow-visible bg-neutral-50">
  <div className="relative w-full overflow-visible" style={{ aspectRatio: "1440 / 500" }}>
    {/* Blue gradient BEHIND thumbprints — bottom 50% */}
    <div
      className="absolute bottom-0 left-0 right-0 z-0"
      style={{
        height: "50%",
        background:
          "linear-gradient(to bottom, rgba(51,166,247,0) 0%, rgba(51,166,247,0.14) 10%, rgba(51,166,247,0.35) 25%, rgba(51,166,247,1) 45%, rgba(20,114,246,1) 65%, rgba(68,77,235,1) 100%)",
      }}
    />

    {/* Thumbprint image — extends 20% above container */}
    <div
      className="absolute left-0 right-0 bottom-0 select-none pointer-events-none z-[1]"
      style={{
        height: "120%",
        mixBlendMode: "multiply",
        opacity: 0.85,
        maskImage:
          "linear-gradient(to bottom, transparent 0%, transparent 15%, black 70%, black 100%)",
        WebkitMaskImage:
          "linear-gradient(to bottom, transparent 0%, transparent 15%, black 70%, black 100%)",
      }}
    >
      <Image
        src="/images/thumbprints.png"
        alt=""
        fill
        className="object-cover object-bottom"
        draggable={false}
        sizes="100vw"
        quality={100}
        unoptimized
        priority
      />
    </div>

    {/* Linear gradient blue→white + curved white path on top creates the curve effect */}
    <svg
      viewBox="0 0 1440 600"
      preserveAspectRatio="none"
      className="absolute bottom-0 left-0 right-0 w-full block pointer-events-none z-[2]"
      style={{ height: "60%" }}
    >
      <defs>
        <linearGradient id="curveFade" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#2168F3" stopOpacity="0" />
          <stop offset="50%" stopColor="#2168F3" stopOpacity="0.4" />
          <stop offset="80%" stopColor="#FFFFFF" stopOpacity="1" />
          <stop offset="100%" stopColor="#FFFFFF" stopOpacity="1" />
        </linearGradient>
      </defs>
      <rect x="0" y="0" width="1440" height="600" fill="url(#curveFade)" />
      <path
        d="M0,600 C480,360 960,360 1440,600 L1440,600 L0,600 Z"
        fill="white"
      />
    </svg>
  </div>
</div>
