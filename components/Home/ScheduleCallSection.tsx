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
      {/* Solid vertical lines */}
      <div className="absolute inset-0 flex justify-center pointer-events-none px-2.5 sm:px-[60px]">
        <div className="w-full flex-1 flex justify-center relative">
          {/* Solid vertical lines */}
          <div className="absolute left-0 top-0 bottom-0 w-px bg-neutral-300" />
          <div className="absolute right-0 top-0 bottom-0 w-px bg-neutral-300" />
        </div>
      </div>

      {/* Dotted background pattern only in center area */}
      <div className="absolute inset-0 flex justify-center pointer-events-none px-2.5 sm:px-[60px]">
        <div className="w-full flex-1 flex justify-center relative">
          <div
            className="absolute left-0 top-0 bottom-0 right-0 opacity-[0.15]"
            style={{
              backgroundImage: `radial-gradient(circle, #000 1px, transparent 1px)`,
              backgroundSize: '20px 20px',
              backgroundPosition: '0 0, 10px 10px'
            }}
          />
        </div>
      </div>

      <OuterContainer>
        <InnerContainer className="relative z-10">
          <div className="py-24 md:py-32">
            {/* Title */}
            <h2 className="font-medium text-black text-center mb-4 cursor-default"
                style={{
                  fontSize: 'clamp(32px, 6vw, 48px)',
                  lineHeight: '110%',
                  letterSpacing: '-1px',
                  textWrap: 'balance'
                }}>
              Get In Touch
            </h2>

            {/* Subtitle */}
            <p className="text-neutral-600 text-lg text-center mb-16 max-w-2xl mx-auto cursor-default"
               style={{
                 textWrap: 'balance'
               }}>
              See if we&apos;re a fit for you
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

      <div className="line-dash-x" />
    </Section>
  );
}