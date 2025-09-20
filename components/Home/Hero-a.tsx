import Section from "@/components/ui/Section";
import OuterContainer from "@/components/ui/OuterContainer";
import InnerContainer from "@/components/ui/InnerContainer";
import Image from "next/image";
import SectionHeader from "../ui/SectionHeader";
import AnimatedCitySwitcher from "@/components/ui/AnimatedCitySwitcher";
import AnimatedDate from "@/components/ui/AnimatedDate";

export default function HeroA() {
    return (
        <Section className="relative z-20 bg-neutral-50 overflow-hidden min-h-fit lg:min-h-[max(600px,80vh)] justify-between">
            {/* Artificial vertical lines to match the background */}
            <div className="absolute inset-0 flex justify-center pointer-events-none px-2.5 sm:px-[60px]">
                <div className="w-full flex-1 flex justify-center relative">
                    {/* Left dashed vertical line (mobile) / solid line (desktop) */}
                    <div className="absolute left-0 top-0 bottom-0 line-dash-y custom:hidden" />
                    <div className="absolute left-0 top-0 bottom-0 w-px bg-neutral-300 hidden custom:block" />

                    {/* Right dashed vertical line (mobile) / solid line (desktop) */}
                    <div className="absolute right-0 top-0 bottom-0 line-dash-y custom:hidden" />
                    <div className="absolute right-0 top-0 bottom-0 w-px bg-neutral-300 hidden custom:block" />
                </div>
            </div>
            <SectionHeader
                leftText={<AnimatedCitySwitcher />}
                centerContent={
                    <Image
                        src="/blueprint-logo-dark.svg"
                        alt="Blueprint Studio"
                        width={100}
                        height={25}
                        className="h-5 w-auto"
                    />
                }
                rightText={<AnimatedDate />}
            />

            {/* Video Section */}
            <OuterContainer className="flex flex-1 items-center justify-center w-full">
                <InnerContainer className="py-8 sm:py-10 lg:py-12 px-6 sm:px-10 lg:px-16 relative w-full flex items-center justify-center">
                    {/* Inner dashed vertical lines on desktop */}
                    <div className="absolute left-0 top-0 bottom-0 line-dash-y hidden custom:block" />
                    <div className="absolute right-0 top-0 bottom-0 line-dash-y hidden custom:block" />

                    {/* Video Placeholder */}
                    <div className="w-full max-w-5xl mx-auto aspect-[2/3] sm:aspect-video bg-neutral-200 rounded sm:rounded-lg shadow-lg flex items-center justify-center">
                        <div className="text-center text-neutral-500">
                            <div className="w-16 h-16 mx-auto mb-4 bg-neutral-300 rounded-full flex items-center justify-center">
                                <div className="w-0 h-0 border-l-[12px] border-l-neutral-500 border-t-[8px] border-t-transparent border-b-[8px] border-b-transparent ml-1"></div>
                            </div>
                            <p className="text-sm">Video Placeholder</p>
                        </div>
                    </div>
                </InnerContainer>
            </OuterContainer>

            <div className="line-dash-x hidden sm:block"/>
        </Section>
    )
}