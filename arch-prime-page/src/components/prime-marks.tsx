// Token marks in vector, matching Brand/Arch Prime/primeTokens (a coloured disc with the Arch
// Prime glyph in white) and the app's asset marks (public/asset-mark-*.png). Vector so they stay
// crisp at illustration size; the PNGs are 64–139px.

// The glyph path from Brand/Arch Prime/Arch Prime Logos/arch-prime-glyph-black.svg (544×393).
export const GLYPH =
  "M92.3048 392.347H74.1776L5.52914 392.338C1.19219 392.338 -1.44278 387.63 0.840883 383.994L226.923 24.7288C236.684 9.26366 253.494 0.000329024 271.969 0C290.444 0.00026095 307.254 9.22559 317.014 24.7288L543.094 383.994C545.379 387.63 542.746 392.338 538.408 392.338H520.203L451.238 392.347C449.34 392.347 447.556 391.39 446.549 389.782L306.285 166.172C302.566 160.277 297.492 155.568 291.606 152.314C285.68 149.061 278.979 147.301 271.931 147.301C257.833 147.301 245.011 154.343 237.575 166.172L96.993 389.782C95.9859 391.39 94.2024 392.347 92.3048 392.347Z";

export const MARK_COLORS = {
  primeBTC: "#EF8E16",
  primeUSD: "#1F5543",
  autoEarn: "#113671",
  next: "#9A9A9A",
} as const;

export type MarkKind = "btc" | "usd" | keyof typeof MARK_COLORS;

export function Mark({ kind, size = 40, className = "" }: { kind: MarkKind; size?: number; className?: string }) {
  if (kind === "btc") {
    // the standard Bitcoin logo, public domain
    return (
      <svg viewBox="0 0 64 64" width={size} height={size} className={className} aria-hidden>
        <g transform="translate(0.00630876,-0.00301984)">
          <path fill="#f7931a" d="m63.033,39.744c-4.274,17.143-21.637,27.576-38.782,23.301-17.138-4.274-27.571-21.638-23.295-38.78,4.272-17.145,21.635-27.579,38.775-23.305,17.144,4.274,27.576,21.64,23.302,38.784z" />
          <path fill="#FFF" d="m46.103,27.444c0.637-4.258-2.605-6.547-7.038-8.074l1.438-5.768-3.511-0.875-1.4,5.616c-0.923-0.23-1.871-0.447-2.813-0.662l1.41-5.653-3.509-0.875-1.439,5.766c-0.764-0.174-1.514-0.346-2.242-0.527l0.004-0.018-4.842-1.209-0.934,3.75s2.605,0.597,2.55,0.634c1.422,0.355,1.679,1.296,1.636,2.042l-1.638,6.571c0.098,0.025,0.225,0.061,0.365,0.117-0.117-0.029-0.242-0.061-0.371-0.092l-2.296,9.205c-0.174,0.432-0.615,1.08-1.609,0.834,0.035,0.051-2.552-0.637-2.552-0.637l-1.743,4.019,4.569,1.139c0.85,0.213,1.683,0.436,2.503,0.646l-1.453,5.834,3.507,0.875,1.439-5.772c0.958,0.26,1.888,0.5,2.798,0.726l-1.434,5.745,3.511,0.875,1.453-5.823c5.987,1.133,10.489,0.676,12.384-4.739,1.527-4.36-0.076-6.875-3.226-8.515,2.294-0.529,4.022-2.038,4.483-5.155zm-8.022,11.249c-1.085,4.36-8.426,2.003-10.806,1.412l1.928-7.729c2.38,0.594,10.012,1.77,8.878,6.317zm1.086-11.312c-0.99,3.966-7.1,1.951-9.082,1.457l1.748-7.01c1.982,0.494,8.365,1.416,7.334,5.553z" />
        </g>
      </svg>
    );
  }
  if (kind === "usd") {
    // verbatim from the app's asset-mark-dollar.svg
    return (
      <svg viewBox="0 0 64 64" width={size} height={size} className={className} aria-hidden>
        <circle cx="32" cy="32" r="32" fill="#1e5c45" />
        <g fill="none" stroke="#fff" transform="translate(32 32) scale(1.42) translate(-12 -12)">
          <path strokeWidth="2.4" d="M16.8 8C16.2 6.8 14.5 5.2 12 5.2C9.4 5.2 7.4 6.5 7.4 8.6C7.4 10.2 9.8 11.1 12 12C14.2 12.9 16.6 13.8 16.6 15.4C16.6 17.5 14.6 18.8 12 18.8C9.6 18.8 7.5 17.6 7.2 15.5" />
          <path strokeWidth="1.8" d="M12 1.86V22.14" />
        </g>
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 64 64" width={size} height={size} className={className} aria-hidden>
      <circle cx="32" cy="32" r="32" fill={MARK_COLORS[kind]} />
      {/* glyph at ~50% of the disc, centred, as in the token PNGs */}
      <g transform="translate(16 20.5) scale(0.0588)">
        <path d={GLYPH} fill="#fff" />
      </g>
    </svg>
  );
}
