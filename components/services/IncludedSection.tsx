import type { ReactNode } from "react";
import OuterContainer from "@/components/ui/OuterContainer";
import InnerContainer from "@/components/ui/InnerContainer";
import SectionHeader from "@/components/ui/SectionHeader";
import IncludedList, { type IncludedListItem } from "@/components/Brand/IncludedList";

// /brand's "What's included" (heading, line, then the checked list with its
// preview), for a service page's own items.
export default function IncludedSection({
  title,
  intro,
  items,
  tag,
}: {
  title: string;
  intro: ReactNode;
  items: IncludedListItem[];
  tag: string;
}) {
  return (
    <section className="relative z-20 flex flex-col items-center bg-white px-2.5 sm:px-[60px]">
      <SectionHeader leftText="WHAT'S INCLUDED" rightText={`// ${tag}`} />

      <OuterContainer className="flex flex-1 items-center">
        <InnerContainer className="relative px-2.5 pb-16 pt-16 sm:px-6 sm:pb-24 sm:pt-24 lg:pb-28 lg:pt-28">
          <h2
            className="mb-5 cursor-default font-medium text-black"
            style={{ fontSize: "clamp(28px, 5vw, 44px)", lineHeight: "110%", letterSpacing: "-1.5px" }}
          >
            {title}
          </h2>
          <p className="max-w-sm text-sm text-neutral-500 sm:text-base" style={{ lineHeight: "130%" }}>
            {intro}
          </p>
          <IncludedList items={items} />
        </InnerContainer>
      </OuterContainer>
    </section>
  );
}
