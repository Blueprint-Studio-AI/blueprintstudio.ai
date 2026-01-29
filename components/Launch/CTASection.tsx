"use client";

import dynamic from "next/dynamic";
import { useEffect } from "react";
import Section from "@/components/ui/Section";
import OuterContainer from "@/components/ui/OuterContainer";
import InnerContainer from "@/components/ui/InnerContainer";

const Cal = dynamic(
  () => import("@calcom/embed-react").then((mod) => mod.default),
  {
    ssr: false,
    loading: () => (
      <div className="h-[520px] flex flex-col items-center justify-center gap-3 text-neutral-500">
        <span className="text-xs uppercase tracking-[0.36em] text-neutral-400">
          Blueprint Studio
        </span>
        <p className="text-sm sm:text-base text-neutral-500">
          Loading calendar...
        </p>
      </div>
    ),
  }
);

export default function CTASection() {
  useEffect(() => {
    (async function () {
      const { getCalApi } = await import("@calcom/embed-react");
      const cal = await getCalApi({ namespace: "launch-call" });
      cal("ui", {
        theme: "light",
        cssVarsPerTheme: {
          light: { "cal-brand": "#000000" },
          dark: { "cal-brand": "#ffffff" },
        },
        hideEventTypeDetails: false,
        layout: "month_view",
      });
    })();
  }, []);

  return (
    <Section className="relative bg-[#fafaf9] overflow-hidden">
      {/* Solid vertical lines */}
      <div className="absolute inset-0 flex justify-center pointer-events-none px-2.5 sm:px-[60px]">
        <div className="w-full flex-1 flex justify-center relative">
          <div className="absolute left-0 top-0 bottom-0 w-px bg-neutral-300" />
          <div className="absolute right-0 top-0 bottom-0 w-px bg-neutral-300" />
        </div>
      </div>

      {/* Dotted background pattern */}
      <div className="absolute inset-0 flex justify-center pointer-events-none px-2.5 sm:px-[60px]">
        <div className="w-full flex-1 flex justify-center relative">
          <div
            className="absolute left-0 top-0 bottom-0 right-0 opacity-[0.15]"
            style={{
              backgroundImage: `radial-gradient(circle, #000 1px, transparent 1px)`,
              backgroundSize: "20px 20px",
              backgroundPosition: "0 0, 10px 10px",
            }}
          />
        </div>
      </div>

      <OuterContainer>
        <InnerContainer className="relative z-10">
          <div className="py-16 sm:py-24 md:py-32">
            {/* Title */}
            <h2
              className="font-medium text-black text-center cursor-default"
              style={{
                fontSize: "clamp(32px, 6vw, 48px)",
                lineHeight: "110%",
                letterSpacing: "-1px",
                textWrap: "balance",
              }}
            >
              Ready to launch?
            </h2>
            <p
              className="text-center text-neutral-500 mt-4 mb-12 cursor-default"
              style={{
                fontSize: "clamp(16px, 3vw, 20px)",
                lineHeight: "140%",
              }}
            >
              Book a call and let&apos;s get started.
            </p>

            {/* Calendar embed container */}
            <div className="max-w-4xl mx-auto">
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 md:p-8">
                <Cal
                  namespace="launch-call"
                  calLink="blueprint-studio/intro-call"
                  style={{ width: "100%", height: "100%" }}
                  config={{ layout: "month_view", theme: "light" }}
                />
              </div>
            </div>
          </div>
        </InnerContainer>
      </OuterContainer>

      <div className="line-dash-x" />
    </Section>
  );
}
