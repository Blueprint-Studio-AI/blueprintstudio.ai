import { ArrowRight, ArrowUpRight } from "lucide-react";
import Section from "@/components/ui/Section";
import OuterContainer from "@/components/ui/OuterContainer";
import InnerContainer from "@/components/ui/InnerContainer";
import { assetGeneratorUrl } from "@/lib/asset-generator";

// A compact pointer to the studio's own product, high on the home page (it was
// only in the footer). Same card, border and CTA styles as the pricing cards and
// the /brand page's Asset Generator band.
export default function AssetGeneratorBand() {
  return (
    <Section className="relative z-30 flex flex-col bg-neutral-100">
      {/* Solid vertical lines, continuing the client ticker's above */}
      <div className="pointer-events-none absolute inset-0 flex justify-center px-2.5 sm:px-[60px]">
        <div className="relative flex w-full flex-1 justify-center">
          <div className="absolute bottom-0 left-0 top-0 w-px bg-neutral-300" />
          <div className="absolute bottom-0 right-0 top-0 w-px bg-neutral-300" />
        </div>
      </div>

      <OuterContainer>
        <InnerContainer className="relative px-2.5 pb-12 sm:px-6 sm:pb-16 lg:pb-20">
          <div className="flex flex-col gap-6 rounded-[20px] border border-neutral-300 bg-white p-5 sm:p-6 md:flex-row md:items-center md:justify-between md:gap-10">
            <div className="flex flex-col gap-2">
              <p
                className="font-medium text-neutral-800"
                style={{ fontSize: "clamp(18px, 2vw, 22px)", lineHeight: 1.25, letterSpacing: "-0.4px" }}
              >
                Blueprint Studio Asset Generator: your brand’s Styles and logos in your AI&nbsp;app.
              </p>
              <p className="text-base text-[#5A5E64]">Works with Claude, ChatGPT and Cursor.</p>
            </div>

            <div className="flex shrink-0 flex-col gap-3 sm:flex-row sm:items-center md:flex-col md:items-stretch lg:flex-row lg:items-center">
              <a
                href={assetGeneratorUrl("/asset-generator/landing", "home_band")}
                target="_blank"
                rel="noopener"
                className="flex h-[52px] items-center justify-center gap-2 rounded-[12px] border-[1.5px] border-[#33A6F7] px-7 transition-colors hover:border-[#1472F6]"
                style={{
                  background:
                    "linear-gradient(90deg, rgba(51,166,247,0.05) 0%, rgba(20,114,246,0.05) 51.923%, rgba(68,77,235,0.05) 88.942%), linear-gradient(90deg, rgba(255,255,255,0.2) 0%, rgba(255,255,255,0.2) 100%)",
                }}
              >
                <span className="whitespace-nowrap text-[16px] tracking-[-0.32px] text-[#111]">Try it now</span>
                <ArrowUpRight aria-hidden className="h-3 w-3 text-[#111]" strokeWidth={2.5} />
              </a>
              <a
                href={assetGeneratorUrl("/mcp-setup", "home_band")}
                target="_blank"
                rel="noopener"
                className="group flex items-center justify-center gap-1.5 whitespace-nowrap px-2 py-2 text-sm font-medium text-neutral-600 transition-colors hover:text-neutral-900"
              >
                Connect your AI app
                <ArrowRight
                  aria-hidden
                  className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-0.5"
                />
              </a>
            </div>
          </div>
        </InnerContainer>
      </OuterContainer>
    </Section>
  );
}
