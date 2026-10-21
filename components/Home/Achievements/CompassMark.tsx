import * as React from "react";
import { motion } from "framer-motion";

// Math helpers
const degToRad = (deg: number) => (deg * Math.PI) / 180;
const toRadians = (deg: number) => (deg - 90) * (Math.PI / 180); // compass 0° = up

// Diamond builder for star points (compass degrees; 0 = up)
function diamondPoints(cx: number, cy: number, angleDeg: number, length: number, width: number) {
  const a = toRadians(angleDeg);
  const tipX = Math.round((cx + Math.cos(a) * (length / 2)) * 1000) / 1000;
  const tipY = Math.round((cy + Math.sin(a) * (length / 2)) * 1000) / 1000;
  const tailX = Math.round((cx - Math.cos(a) * (length / 2)) * 1000) / 1000;
  const tailY = Math.round((cy - Math.sin(a) * (length / 2)) * 1000) / 1000;

  const perp = a + Math.PI / 2;
  const rightX = Math.round((cx + Math.cos(perp) * (width / 2)) * 1000) / 1000;
  const rightY = Math.round((cy + Math.sin(perp) * (width / 2)) * 1000) / 1000;
  const leftX = Math.round((cx - Math.cos(perp) * (width / 2)) * 1000) / 1000;
  const leftY = Math.round((cy - Math.sin(perp) * (width / 2)) * 1000) / 1000;

  return `${tipX},${tipY} ${rightX},${rightY} ${tailX},${tailY} ${leftX},${leftY}`;
}

// Vertex helper for half-filled diamonds
type Pt = [number, number];
function diamondVertices(cx: number, cy: number, angleDeg: number, length: number, width: number) {
  const a = toRadians(angleDeg);
  const tip: Pt = [
    Math.round((cx + Math.cos(a) * (length / 2)) * 1000) / 1000,
    Math.round((cy + Math.sin(a) * (length / 2)) * 1000) / 1000
  ];
  const tail: Pt = [
    Math.round((cx - Math.cos(a) * (length / 2)) * 1000) / 1000,
    Math.round((cy - Math.sin(a) * (length / 2)) * 1000) / 1000
  ];
  const perp = a + Math.PI / 2;
  const right: Pt = [
    Math.round((cx + Math.cos(perp) * (width / 2)) * 1000) / 1000,
    Math.round((cy + Math.sin(perp) * (width / 2)) * 1000) / 1000
  ];
  const left: Pt = [
    Math.round((cx - Math.cos(perp) * (width / 2)) * 1000) / 1000,
    Math.round((cy - Math.sin(perp) * (width / 2)) * 1000) / 1000
  ];
  return { tip, right, tail, left };
}

function fmtPoints(...pts: Pt[]) {
  return pts.map(([x, y]) => `${x},${y}`).join(" ");
}

/** CompassMark — compact, neutral compass for the card field
 *  - Follows the cursor inside the box (discerning/"seeking" motion)
 *  - Springs back to a default heading when the cursor leaves
 *  - Quiet cardinal ticks; single-letter N; watch-style hand
 */
export default function CompassMark({ defaultHeading = -12 }: { defaultHeading?: number }) {
  const cx = 100, cy = 80; // center in the 200x160 viewBox
  // New behavior: keep a single, fixed hand; rotate the COMPASS CARD on hover to align to north
  const [dialRot, setDialRot] = React.useState(defaultHeading);

  const onEnter = () => setDialRot(0); // align north under the hand
  const onLeave = () => setDialRot(defaultHeading); // relax back to a slight off-north angle

  // Ticks
  const major = [0, 90, 180, 270];
  const ticks = Array.from({ length: 24 }).map((_, i) => i * 15);

  // Star geometry
  const CARD_LEN = 96, CARD_W = 10; // long, skinny
  const DIAG_LEN = 36, DIAG_W = 8; // slightly longer diagonals

  return (
    <svg
      viewBox="0 0 200 160"
      className="absolute inset-0 w-full h-full text-neutral-900/80"
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
      aria-label="Taste compass"
    >
      {/* Rotating CARD: rings, ticks, labels, star, hub, accents */}
      <motion.g
        style={{ transformOrigin: `${cx}px ${cy}px` }}
        initial={false}
        animate={{ rotate: dialRot }}
        transition={{ type: "spring", stiffness: 260, damping: 24, mass: 0.7 }}
      >
        {/* Outer ring */}
        <circle cx={cx} cy={cy} r={60} fill="none" stroke="rgba(0,0,0,0.12)" strokeWidth={2} />
        <circle cx={cx} cy={cy} r={62} fill="none" stroke="rgba(0,0,0,0.06)" strokeWidth={1} />
        {/* Dark outer edge line */}
        <circle cx={cx} cy={cy} r={63} fill="none" stroke="rgba(0,0,0,0.55)" strokeWidth={1.5} />
        {/* Inner anchor ring at tick base */}
        <circle cx={cx} cy={cy} r={54} fill="none" stroke="rgba(0,0,0,0.10)" strokeWidth={1} />

        {/* Ticks */}
        {ticks.map((deg) => {
          const isMajor = major.includes(deg);
          const r1 = isMajor ? 50 : 54;
          const r2 = isMajor ? 62 : 60;
          const a = toRadians(deg);
          const x1 = Math.round((cx + Math.cos(a) * r1) * 1000) / 1000;
          const y1 = Math.round((cy + Math.sin(a) * r1) * 1000) / 1000;
          const x2 = Math.round((cx + Math.cos(a) * r2) * 1000) / 1000;
          const y2 = Math.round((cy + Math.sin(a) * r2) * 1000) / 1000;
          return (
            <line
              key={deg}
              x1={x1}
              y1={y1}
              x2={x2}
              y2={y2}
              stroke="rgba(0,0,0,0.28)"
              strokeWidth={isMajor ? 1.8 : 1}
            />
          );
        })}

        {/* N label (quiet) */}
        <text x={cx} y={cy - 38} textAnchor="middle" fontSize="10" fill="rgba(0,0,0,0.45)" style={{ letterSpacing: 1 }}>
          N
        </text>

        {/* Star: 4 long cardinal diamonds (half-toned) */}
        {[0, 90, 180, 270].map((deg) => {
          const v = diamondVertices(cx, cy, deg, CARD_LEN, CARD_W);
          const dark = "rgba(0,0,0,0.50)";
          const light = "rgba(0,0,0,0.26)";
          return (
            <g key={"c" + deg}>
              <polygon points={fmtPoints(v.tip, v.right, v.tail)} fill={dark} stroke="rgba(0,0,0,0.25)" strokeWidth={1} />
              <polygon points={fmtPoints(v.tip, v.tail, v.left)} fill={light} stroke="rgba(0,0,0,0.25)" strokeWidth={1} />
            </g>
          );
        })}

        {/* Star: 4 smaller diagonal diamonds (lighter) */}
        {[45, 135, 225, 315].map((deg) => (
          <polygon
            key={"d" + deg}
            points={diamondPoints(cx, cy, deg, DIAG_LEN, DIAG_W)}
            fill="rgba(0,0,0,0.18)"
            stroke="rgba(0,0,0,0.22)"
            strokeWidth={1}
          />
        ))}

        {/* Central hub (part of rotating card for subtle parallax under the hand) */}
        <circle cx={cx} cy={cy} r={6} fill="white" stroke="rgba(0,0,0,0.3)" />

        {/* Inner ring accent */}
        <circle cx={cx} cy={cy} r={40} fill="none" stroke="rgba(0,0,0,0.08)" strokeDasharray="2 4" />
      </motion.g>

      {/* Fixed single-direction hand (always points up) */}
      <g>
        <line x1={cx} y1={cy + 4} x2={cx} y2={cy - 45} stroke="currentColor" strokeWidth={1.7} />
        <path d={`M ${cx} ${cy - 57} L ${cx + 6} ${cy - 45} L ${cx - 6} ${cy - 45} Z`} fill="currentColor" />
        <circle cx={cx} cy={cy} r={3.8} fill="currentColor" />
      </g>
    </svg>
  );
}