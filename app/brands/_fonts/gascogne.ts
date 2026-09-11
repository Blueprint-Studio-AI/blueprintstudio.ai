import localFont from "next/font/local";

// Gascogne Serial — the licensed display face (SoftMaker) both Arch brands
// share. The woff2s are the ones arch.network serves; they live here, in the
// source tree, rather than under /public so they're served by next/font's
// hashed, same-origin loader and not as an open download.
//
// Loaded once and scoped to the Arch routes via --font-display, which the
// .brand-kit-root scope resolves font-serif from.
export const gascogne = localFont({
  src: [
    { path: "./gascogne/gascogne-extralight.woff2", weight: "200" },
    { path: "./gascogne/gascogne-light.woff2", weight: "300" },
    { path: "./gascogne/gascogne-regular.woff2", weight: "400" },
    { path: "./gascogne/gascogne-medium.woff2", weight: "500" },
    { path: "./gascogne/gascogne-bold.woff2", weight: "700" },
  ],
  variable: "--font-display",
  display: "swap",
  fallback: ["Georgia", "serif"],
});
