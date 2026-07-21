{/*
  ARCHIVED CSS THUMBPRINT EFFECT
  Replaced with pre-baked image (thumbprint-pattern3.png) for simplicity.
  Keeping this as reference in case we need to recreate programmatically.
*/}

{/* Image + overlays — overflow visible so top extends into spacer */}
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
        "linear-gradient(to bottom, transparent 0%, black 15%, black 100%)",
      WebkitMaskImage:
        "linear-gradient(to bottom, transparent 0%, black 15%, black 100%)",
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

  {/* White curved fade */}
  <svg
    viewBox="0 0 1440 600"
    preserveAspectRatio="none"
    className="absolute bottom-0 left-0 right-0 w-full block pointer-events-none z-[2]"
    style={{ height: "60%" }}
  >
    <defs>
      <linearGradient id="curveFade" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#2168F3" stopOpacity="0" />
        <stop offset="65%" stopColor="#FFFFFF" stopOpacity="1" />
        <stop offset="100%" stopColor="#FFFFFF" stopOpacity="1" />
      </linearGradient>
    </defs>
    <path
      d="M0,80 C480,0 960,0 1440,80 L1440,600 L0,600 Z"
      fill="url(#curveFade)"
    />
  </svg>
</div>
