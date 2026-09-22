const ARCH_PATH =
  "M198 1137 C376.667 861 711.205 311.863 751 251 C853 95 1072 96 1175.001 258 C1281.417 425.372 1571.667 894.667 1717 1138";

// Legs extended straight along their tangent so they continue smoothly past the
// horizontal cut line, where the clip gives them a flat bottom with sharp corners.
const ARCH_PATH_MOBILE = `M-36 1500 L198 1137 ${ARCH_PATH.slice(ARCH_PATH.indexOf("C"))} L1933 1500`;
const MOBILE_CUT_Y = 1265;

function ArchPath({ d, ease, duration, opacity, clip }: { d: string; ease: string; duration: number; opacity: number; clip?: string }) {
  return (
    <path
      className="arch-draw"
      d={d}
      pathLength={1}
      fill="none"
      stroke="#f3efd7"
      strokeWidth={175}
      strokeLinecap="butt"
      strokeLinejoin="miter"
      strokeOpacity={opacity}
      strokeDasharray={1}
      clipPath={clip}
      style={{ animation: `arch-draw ${duration}s ${ease} 0.3s both` }}
    />
  );
}

export function ArchOverlay({
  ease = "linear",
  duration = 2.6,
  opacity = 0.22,
  blend,
}: {
  ease?: string;
  duration?: number;
  opacity?: number;
  blend?: "soft-light" | "overlay" | "screen";
}) {
  return (
    <>
      <svg
        viewBox="0 -350 1920 1900"
        preserveAspectRatio="xMidYMid slice"
        aria-hidden
        style={blend ? { mixBlendMode: blend } : undefined}
        className="pointer-events-none absolute inset-0 z-4 h-full w-full min-[939px]:hidden"
      >
        <defs>
          <clipPath id="arch-cut" clipPathUnits="userSpaceOnUse">
            <rect x="-1000" y="-1500" width="4000" height={1500 + MOBILE_CUT_Y} />
          </clipPath>
        </defs>
        <ArchPath d={ARCH_PATH_MOBILE} ease={ease} duration={duration} opacity={opacity} clip="url(#arch-cut)" />
      </svg>
      <svg
        viewBox="0 -160 1920 1240"
        preserveAspectRatio="xMidYMax meet"
        aria-hidden
        style={blend ? { mixBlendMode: blend } : undefined}
        className="pointer-events-none absolute inset-0 z-4 hidden h-full w-full min-[939px]:block"
      >
        <ArchPath d={ARCH_PATH} ease={ease} duration={duration} opacity={opacity} />
      </svg>
    </>
  );
}
