import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./service-pages/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    screens: {
      'xs': "475px",
      'sm': "640px",
      'md': "768px",
      'lg': "1024px",
      'xl': "1280px",
      '2xl': "1536px",
      'custom': "1124px",
      'wide': "1387px",
    },
    extend: {
      fontFamily: {
        sans: ['Helvetica Neue', 'Helvetica', 'Arial', 'sans-serif'],
        // /brands/jinba: Geist gets scoped onto the page via .jinba-root; mono
        // and serif are safe to add globally (nothing else uses them)
        mono: ["var(--font-geist-mono)", "ui-monospace", "SF Mono", "Menlo", "monospace"],
        serif: ['"Tiempos Text"', "Georgia", "serif"],
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        "logo-scroll": {
          from: { transform: "translateX(0)" },
          to: { transform: "translateX(-50%)" },
        },
        "logo-scroll-reverse": {
          from: { transform: "translateX(-50%)" },
          to: { transform: "translateX(0)" },
        },
        "gallery-scroll": {
          from: { transform: "translateX(0)" },
          to: { transform: "translateX(-50%)" },
        },
        "gallery-scroll-reverse": {
          from: { transform: "translateX(-50%)" },
          to: { transform: "translateX(0)" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "logo-scroll": "logo-scroll 120s linear infinite",
        "logo-scroll-reverse": "logo-scroll-reverse 60s linear infinite",
        "gallery-scroll": "gallery-scroll 80s linear infinite",
        "gallery-scroll-reverse": "gallery-scroll-reverse 80s linear infinite",
        caret: "caret 1.1s steps(1) infinite",
      },
      // ── /brands/jinba type scale + spacing (additive) ──
      fontSize: {
        micro: ["11px", { lineHeight: "1.4", letterSpacing: "0.02em" }],
        label: ["12px", { lineHeight: "1.4" }],
        eyebrow: ["13.5px", { lineHeight: "17.5px" }],
        "body-sm": ["13px", { lineHeight: "1.5" }],
        meta: ["14px", { lineHeight: "1.4", letterSpacing: "-0.01em" }],
        nav: ["16px", { lineHeight: "1.2", letterSpacing: "-0.04em" }],
        body: ["16px", { lineHeight: "1.5", letterSpacing: "-0.02em" }],
        "body-lg": ["18px", { lineHeight: "1.4", letterSpacing: "-0.02em" }],
        value: ["18px", { lineHeight: "1.13", letterSpacing: "-0.03em" }],
        "title-sm": ["20px", { lineHeight: "1.28", letterSpacing: "0.02em" }],
        "display-sm": ["34px", { lineHeight: "1.13", letterSpacing: "-0.02em" }],
        promo: ["42px", { lineHeight: "1.13", letterSpacing: "-0.04em" }],
        title: ["32px", { lineHeight: "1.13", letterSpacing: "-0.03em" }],
        "title-mobile": ["30px", { lineHeight: "1.13", letterSpacing: "-0.03em" }],
        headline: ["48px", { lineHeight: "1.13", letterSpacing: "-0.01em" }],
        "headline-mobile": ["36px", { lineHeight: "1.13", letterSpacing: "-0.01em" }],
        specimen: ["64px", { lineHeight: "1.1" }],
      },
      letterSpacing: {
        heading: "-0.03em",
        snug: "-0.02em",
        title: "-0.01em",
      },
      spacing: {
        section: "86px",
        gutter: "128px",
      },
      maxWidth: {
        frame: "1440px",
        measure: "582px",
      },
      colors: {
        neutral: {
          50: "hsl(var(--neutral-50))",
          100: "hsl(var(--neutral-100))",
          200: "hsl(var(--neutral-200))",
          300: "hsl(var(--neutral-300))",
          400: "hsl(var(--neutral-400))",
          500: "hsl(var(--neutral-500))",
          800: "hsl(var(--neutral-800))",
          900: "hsl(var(--neutral-900))",
        },
        border: {
          DEFAULT: "hsl(var(--border))",
        },
        borderRadius: {
          lg: "var(--radius)",
          md: "calc(var(--radius) - 2px)",
          sm: "calc(var(--radius) - 4px)",
          DEFAULT: "var(--radius)",
        },
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
          // /brands/jinba scale (merged, not overriding the site's muted)
          1: "#737373",
          2: "#808080",
          3: "#8c8c8c",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        // ── /brands/jinba brand-kit tokens (additive; only used on that route) ──
        ink: "#252525",
        body: "#5e5e5e",
        faint: "#bebfc2",
        line: { DEFAULT: "#dfdfdf", soft: "#ececec" },
        chip: "#f5f5f5",
        "seg-on": "#e7e7e7",
        signup: "#171717",
        "nav-surface": "#353535",
        urushi: "#322014",
        flow: "#2C50B5",
        toolbox: "#7D95A1",
        app: "#A22727",
        "grade-pass-bg": "#e5f1e8",
        "grade-pass-fg": "#066d3f",
        "grade-fail-bg": "#f5ecec",
        "grade-fail-fg": "#a4575a",
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic": "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
  // Add this safelist to ensure gradient classes are generated
  safelist: [
    'from-primary',
    'to-primary',
    {
      pattern: /^to-primary\/\d+$/,
      variants: ['hover', 'focus'],
    },
  ],
};

export default config;