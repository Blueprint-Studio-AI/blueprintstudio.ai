"use client";

import Cal, { getCalApi } from "@calcom/embed-react";
import { useEffect } from "react";
import OuterContainer from "../ui/OuterContainer";
import InnerContainer from "../ui/InnerContainer";
import Section from "../ui/Section";

export default function ScheduleCallSection() {
  useEffect(() => {
    (async function () {
      const cal = await getCalApi({ namespace: "intro-call" });
      cal("ui", {
        theme: "light",
        cssVarsPerTheme: {
          light: { "cal-brand": "#000000" },
          dark: { "cal-brand": "#ffffff" }
        },
        hideEventTypeDetails: false,
        layout: "month_view"
      });
    })();
  }, []);

  return (
    <Section className="relative bg-[#fafaf9] overflow-hidden">
      {/* Dotted background pattern */}
      <div
        className="absolute inset-0 opacity-[0.15]"
        style={{
          backgroundImage: `radial-gradient(circle, #000 1px, transparent 1px)`,
          backgroundSize: '20px 20px',
          backgroundPosition: '0 0, 10px 10px'
        }}
      />

      <OuterContainer>
        <InnerContainer className="relative z-10">
          <div className="py-24 md:py-32">
            {/* Title */}
            <h2 className="font-medium text-black text-center mb-4"
                style={{
                  fontSize: 'clamp(32px, 6vw, 48px)',
                  lineHeight: '110%',
                  letterSpacing: '-1px'
                }}>
              Let's see if Blueprint Studio is a fit
            </h2>

            {/* Subtitle */}
            <p className="text-neutral-600 text-lg text-center mb-16 max-w-2xl mx-auto">
              Schedule a free consultation to discuss your project and explore how we can help bring your vision to life
            </p>

            {/* Calendar embed container */}
            <div className="max-w-4xl mx-auto">
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 md:p-8">
                <Cal
                  namespace="intro-call"
                  calLink="blueprint-studio/intro-call"
                  style={{ width: "100%", height: "100%" }}
                  config={{ layout: "month_view", theme: "light" }}
                />
              </div>
            </div>


          </div>
        </InnerContainer>
      </OuterContainer>
    </Section>
  );
}