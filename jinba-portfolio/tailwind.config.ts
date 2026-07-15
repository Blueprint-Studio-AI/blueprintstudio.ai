import type { Config } from "tailwindcss";

/**
 * Jinba brand-portfolio design tokens.
 * Ported 1:1 from the static prototype, regularised into a coherent scale.
 * Sans/UI = Geist · Mono = Geist Mono · Display = Tiempos Text.
 */
const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./lib/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#252525", // primary text
        body: "#5e5e5e", // body copy
        muted: {
          1: "#737373",
          2: "#808080",
          3: "#8c8c8c",
        },
        faint: "#bebfc2", // dimmed headline line
        line: {
          DEFAULT: "#dfdfdf",
          soft: "#ececec",
        },
        chip: "#f5f5f5", // grey fill (filename tags, impl bg)
        "seg-on": "#e7e7e7", // active segment / inline-code bg
        signup: "#171717", // dark CTA
        urushi: "#322014", // Jinba brand brown
        // sub-brand marks
        flow: "#2C50B5",
        toolbox: "#7D95A1",
        app: "#A22727",
        // contrast-grade pills
        "grade-pass-bg": "#e5f1e8",
        "grade-pass-fg": "#066d3f",
        "grade-fail-bg": "#f5ecec",
        "grade-fail-fg": "#a4575a",
      },
      fontFamily: {
        sans: ["var(--font-geist)", "-apple-system", "Helvetica Neue", "Arial", "sans-serif"],
        mono: ["var(--font-geist-mono)", "ui-monospace", "SF Mono", "Menlo", "monospace"],
        serif: ['"Tiempos Text"', "Georgia", "serif"],
      },
      fontSize: {
        // semantic scale — one source of truth for the whole page
        eyebrow: ["13.5px", { lineHeight: "17.5px" }], // uppercase labels, numbers
        label: ["12px", { lineHeight: "1.4" }], // control labels
        meta: ["14px", { lineHeight: "1.4" }], // nav, tabs, pills, filenames, counts
        "body-sm": ["13px", { lineHeight: "1.5" }],
        body: ["16px", { lineHeight: "1.5", letterSpacing: "-0.02em" }],
        "body-lg": ["18px", { lineHeight: "1.4", letterSpacing: "-0.02em" }],
        "title-sm": ["20px", { lineHeight: "1.28", letterSpacing: "0.02em" }], // hero sub
        title: ["32px", { lineHeight: "1.13", letterSpacing: "-0.03em" }], // section + impl titles
        headline: ["48px", { lineHeight: "1.13", letterSpacing: "-0.01em" }], // overview
        specimen: ["64px", { lineHeight: "1.1" }], // type specimens / big Aa
      },
      letterSpacing: {
        heading: "-0.03em",
        snug: "-0.02em",
        title: "-0.01em",
      },
      spacing: {
        section: "86px", // vertical section rhythm
        gutter: "128px", // wide column gap / base page pad
      },
      maxWidth: {
        frame: "1440px",
        measure: "582px", // implementation reading measure
      },
      keyframes: {
        caret: {
          "0%,55%": { opacity: "0.85" },
          "56%,100%": { opacity: "0" },
        },
      },
      animation: {
        caret: "caret 1.1s steps(1) infinite",
      },
    },
  },
  plugins: [],
};

export default config;
