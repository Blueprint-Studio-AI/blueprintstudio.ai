import Section from "@/components/ui/Section";
import OuterContainer from "@/components/ui/OuterContainer";
import InnerContainer from "@/components/ui/InnerContainer";
import SectionHeader from "@/components/ui/SectionHeader";

// The Insights page's frame: its band, construction lines and header, around the page's
// sections (content/pages/insights.json). The same in edit mode, so it looks as readers see it.
export function InsightsFrame({ children }: { children: React.ReactNode }) {
  return (
    <Section className="relative z-20 bg-neutral-50 min-h-fit">
      {/* Vertical construction lines */}
      <div className="absolute inset-0 flex justify-center pointer-events-none px-2.5 sm:px-[60px]">
        <div className="w-full flex-1 flex justify-center relative">
          <div className="absolute left-0 top-0 bottom-0 line-dash-y custom:hidden" />
          <div className="absolute left-0 top-0 bottom-0 w-px bg-neutral-300 hidden custom:block" />
          <div className="absolute right-0 top-0 bottom-0 line-dash-y custom:hidden" />
          <div className="absolute right-0 top-0 bottom-0 w-px bg-neutral-300 hidden custom:block" />
        </div>
      </div>

      {/* The top nav above carries the logo now */}
      <SectionHeader leftText="INSIGHTS" rightText="// insights" />

      <OuterContainer>
        <InnerContainer className="pt-16 sm:pt-24 lg:pt-32 pb-16 sm:pb-24 lg:pb-32 px-2.5 sm:px-6 relative">
          {/* Inner construction lines */}
          <div className="absolute left-0 top-0 bottom-0 line-dash-y hidden custom:block" />
          <div className="absolute right-0 top-0 bottom-0 line-dash-y hidden custom:block" />
          {children}
        </InnerContainer>
      </OuterContainer>

      <div className="w-full line-dash-x" />
    </Section>
  );
}
