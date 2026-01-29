"use client";

import Section from "@/components/ui/Section";
import OuterContainer from "@/components/ui/OuterContainer";
import InnerContainer from "@/components/ui/InnerContainer";
import SectionHeader from "@/components/ui/SectionHeader";
import { ArrowUpRight, Check } from "lucide-react";

export default function PricingSection() {
  return (
    <Section className="flex flex-col relative z-20 bg-neutral-50 overflow-hidden">
      {/* Vertical lines */}
      <div className="absolute inset-0 flex justify-center pointer-events-none px-2.5 sm:px-[60px]">
        <div className="w-full flex-1 flex justify-center relative">
          <div className="absolute left-0 top-0 bottom-0 line-dash-y custom:hidden" />
          <div className="absolute left-0 top-0 bottom-0 w-px bg-neutral-300 hidden custom:block" />
          <div className="absolute right-0 top-0 bottom-0 line-dash-y custom:hidden" />
          <div className="absolute right-0 top-0 bottom-0 w-px bg-neutral-300 hidden custom:block" />
        </div>
      </div>

      <SectionHeader leftText="PRICING" rightText="// investment" />

      <OuterContainer className="flex-1 flex items-center">
        <InnerContainer className="pt-8 sm:pt-12 lg:pt-16 pb-8 sm:pb-12 lg:pb-16 px-2.5 sm:px-6 relative">
          <div className="absolute left-0 top-0 bottom-0 line-dash-y hidden custom:block" />
          <div className="absolute right-0 top-0 bottom-0 line-dash-y hidden custom:block" />

          {/* Section Title */}
          <div className="text-center mb-8 sm:mb-10">
            <h2
              className="font-semibold text-black cursor-default"
              style={{
                fontSize: "clamp(40px, 8vw, 72px)",
                lineHeight: "100%",
                letterSpacing: "-2px",
              }}
            >
              Investment
            </h2>
          </div>

          {/* Pricing Cards */}
          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Full Launch Card */}
              <div className="flex flex-col p-6 sm:p-8 rounded-2xl border border-neutral-300 bg-white">
                <h3 className="font-medium text-2xl sm:text-3xl text-black mb-2 cursor-default">
                  Full Launch
                </h3>
                <p className="text-neutral-500 text-sm mb-4 cursor-default">
                  Everything you need to go to market.
                </p>

                {/* Price */}
                <div className="flex items-baseline gap-2 mb-6">
                  <span className="text-3xl sm:text-4xl font-bold text-black">
                    $50,000
                  </span>
                </div>

                {/* Features */}
                <div className="space-y-4 mb-6 flex-1">
                  <div>
                    <div className="flex items-start gap-2 mb-1">
                      <Check className="w-4 h-4 text-green-600 mt-0.5 shrink-0" />
                      <span className="text-sm font-medium text-black">
                        Brand Identity
                      </span>
                    </div>
                    <p className="text-xs text-neutral-500 ml-6">
                      Logo, colors, typography, guidelines, social kit, Brand
                      GPT
                    </p>
                  </div>
                  <div>
                    <div className="flex items-start gap-2 mb-1">
                      <Check className="w-4 h-4 text-green-600 mt-0.5 shrink-0" />
                      <span className="text-sm font-medium text-black">
                        Website
                      </span>
                    </div>
                    <p className="text-xs text-neutral-500 ml-6">
                      Custom design + Framer/Webflow development
                    </p>
                  </div>
                  <div>
                    <div className="flex items-start gap-2 mb-1">
                      <Check className="w-4 h-4 text-green-600 mt-0.5 shrink-0" />
                      <span className="text-sm font-medium text-black">
                        Pitch Deck
                      </span>
                    </div>
                    <p className="text-xs text-neutral-500 ml-6">
                      Narrative strategy + full design (12-20 slides)
                    </p>
                  </div>
                  <div>
                    <div className="flex items-start gap-2 mb-1">
                      <Check className="w-4 h-4 text-green-600 mt-0.5 shrink-0" />
                      <span className="text-sm font-medium text-black">
                        Launch Video
                      </span>
                    </div>
                    <p className="text-xs text-neutral-500 ml-6">
                      Script, production, 30-60s video
                    </p>
                  </div>
                </div>

                {/* Details */}
                <div className="space-y-1 mb-6 text-sm text-neutral-500">
                  <p>• 6-8 week delivery</p>
                  <p>• Dedicated team</p>
                  <p>• One point of contact</p>
                </div>

                {/* CTA */}
                <button
                  className="w-full py-3 px-6 font-medium flex items-center justify-center bg-white text-black border border-neutral-300 rounded-lg hover:bg-black hover:text-white hover:border-black transition-all duration-200 text-sm group"
                  onClick={() =>
                    window.open(
                      "https://cal.com/blueprint-studio/intro-call",
                      "_blank"
                    )
                  }
                >
                  <span>Book a Call</span>
                  <ArrowUpRight className="w-4 h-4 ml-2 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </button>
              </div>

              {/* Full Launch + Product Card (Featured) */}
              <div className="flex flex-col p-6 sm:p-8 rounded-2xl border-2 border-black bg-neutral-900 text-white relative">
                {/* Featured Badge */}
                <div className="absolute -top-3 left-6 px-3 py-1 bg-black text-white text-xs font-medium rounded-full border border-neutral-700">
                  MOST COMPREHENSIVE
                </div>

                <h3 className="font-medium text-2xl sm:text-3xl text-white mb-2 cursor-default mt-2">
                  Full Launch + Product
                </h3>
                <p className="text-neutral-400 text-sm mb-4 cursor-default">
                  Launch ready, with a working product.
                </p>

                {/* Price */}
                <div className="flex items-baseline gap-2 mb-6">
                  <span className="text-3xl sm:text-4xl font-bold text-white">
                    $80,000 – $120,000
                  </span>
                </div>

                {/* Features */}
                <div className="mb-4">
                  <p className="text-sm text-neutral-400 mb-4">
                    Everything in Full Launch, plus:
                  </p>
                  <div className="space-y-4 flex-1">
                    <div>
                      <div className="flex items-start gap-2 mb-1">
                        <Check className="w-4 h-4 text-green-400 mt-0.5 shrink-0" />
                        <span className="text-sm font-medium text-white">
                          Product Design
                        </span>
                      </div>
                      <p className="text-xs text-neutral-500 ml-6">
                        UX strategy, wireframes, high-fidelity UI
                      </p>
                    </div>
                    <div>
                      <div className="flex items-start gap-2 mb-1">
                        <Check className="w-4 h-4 text-green-400 mt-0.5 shrink-0" />
                        <span className="text-sm font-medium text-white">
                          MVP Development
                        </span>
                      </div>
                      <p className="text-xs text-neutral-500 ml-6">
                        Functional product (web or mobile), tech stack tailored
                        to your needs
                      </p>
                    </div>
                  </div>
                </div>

                {/* Details */}
                <div className="space-y-1 mb-6 text-sm text-neutral-400">
                  <p>• 10-12 week delivery</p>
                  <p>• Technical architecture support</p>
                  <p>• Post-launch iteration available</p>
                </div>

                {/* CTA */}
                <button
                  className="w-full py-3 px-6 font-medium flex items-center justify-center bg-white text-black rounded-lg hover:bg-neutral-200 transition-all duration-200 text-sm group mt-auto"
                  onClick={() =>
                    window.open(
                      "https://cal.com/blueprint-studio/intro-call",
                      "_blank"
                    )
                  }
                >
                  <span>Book a Call</span>
                  <ArrowUpRight className="w-4 h-4 ml-2 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </button>
              </div>
            </div>

            {/* Clarification */}
            <div className="mt-8 p-5 rounded-xl border border-neutral-200 bg-neutral-100 text-center">
              <p className="font-medium text-black mb-2 cursor-default">
                Not sure which tier?
              </p>
              <p className="text-neutral-500 text-sm mb-1 cursor-default">
                <strong>Full Launch</strong> is for founders who have a product
                and need the go-to-market package.
              </p>
              <p className="text-neutral-500 text-sm mb-3 cursor-default">
                <strong>Full Launch + Product</strong> is for founders starting
                from zero who need us to build it too.
              </p>
              <p className="text-neutral-600 text-sm cursor-default">
                Book a call and we&apos;ll scope it together.
              </p>
            </div>
          </div>
        </InnerContainer>
      </OuterContainer>

      <div className="w-full line-dash-x" />
    </Section>
  );
}
