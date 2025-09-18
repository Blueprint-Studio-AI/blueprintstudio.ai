import Section from "@/components/ui/Section";
import OuterContainer from "@/components/ui/OuterContainer";
import InnerContainer from "@/components/ui/InnerContainer";
import Image from "next/image";
import SectionHeader from "../ui/SectionHeader";

export default function Hero() {
    return (
        <Section className="flex flex-col relative z-20 bg-neutral-50 overflow-hidden">
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
                leftText="Design & Build" 
                rightText={new Date().toLocaleDateString('en-US', {
                    month: '2-digit',
                    day: '2-digit',
                    year: 'numeric'
                }).replace(/\//g, '.')}
            />
            
            {/* Main Content */}
            <OuterContainer className="flex-1 flex items-center">
                <InnerContainer className="text-center pt-8 sm:pt-12 lg:pt-16 px-2.5 sm:px-6 relative">
                    {/* Inner dashed vertical lines on desktop */}
                    <div className="absolute left-0 top-0 bottom-0 line-dash-y hidden custom:block" />
                    <div className="absolute right-0 top-0 bottom-0 line-dash-y hidden custom:block" />
                    {/* Main Heading */}
                    <h1 className="font-medium text-black mb-6 sm:mb-8 lg:mb-10" 
                        style={{ 
                          fontSize: 'clamp(41px, 8vw, 68px)', 
                          lineHeight: 'clamp(97%, 1vw, 100%)',
                          letterSpacing: '-2.04px' 
                        }}>
                        Blueprint Studio
                    </h1>
                    
                    {/* Description */}
                    <p className="text-center font-normal max-w-sm sm:max-w-md md:max-w-lg lg:max-w-lg mx-auto mb-12 sm:mb-14 lg:mb-16 text-[#9A9A9A]" 
                       style={{ 
                         fontSize: 'clamp(20px, 4vw, 28px)', 
                         lineHeight: '110%', 
                         letterSpacing: '-0.96px' 
                       }}>
                        We design and develop products for founders that care.
                    </p>
                    
                    {/* Current Partners */}
                    <div className="mb-0 sm:mb-6 lg:mb-8">
                        <p className="text-center font-normal mb-4 text-[#B0B0B0]" 
                           style={{ 
                             fontSize: 'clamp(16px, 3vw, 18px)', 
                             lineHeight: '100%' 
                           }}>
                           Current Partners:
                        </p>
                        <div className="flex items-center justify-center gap-4 sm:gap-6 lg:gap-8">
                            {/* Arch Network */}
                            <div className="flex items-center">
                                <Image 
                                    src="/logos/arch-gray-logo.svg" 
                                    alt="Arch Network" 
                                    width={112} 
                                    height={33}
                                    className="w-20 h-auto sm:w-24 lg:w-28"
                                />
                            </div>
                            
                            {/* TokenWorks */}
                            <div className="flex items-center">
                                <Image 
                                    src="/logos/tokenworks-gray-logo.svg" 
                                    alt="TokenWorks" 
                                    width={149} 
                                    height={41}
                                    className="w-24 h-auto sm:w-32 lg:w-36"
                                />
                            </div>
                        </div>
                    </div>
                </InnerContainer>
            </OuterContainer>
            
            <div className="line-dash-x hidden sm:block"/>
            
            {/* Video Section */}
            <OuterContainer>
                <InnerContainer className="pt-8 pb-12 sm:py-12 relative">
                    {/* Inner dashed vertical lines on desktop */}
                    <div className="absolute left-0 top-0 bottom-0 line-dash-y hidden custom:block" />
                    <div className="absolute right-0 top-0 bottom-0 line-dash-y hidden custom:block" />

                    
                    {/* Video Placeholder */}
                    <div className="w-full max-w-4xl mx-auto aspect-[9/16] sm:aspect-video bg-neutral-200 rounded sm:rounded-lg shadow-lg flex items-center justify-center">
                        <div className="text-center text-neutral-500">
                            <div className="w-16 h-16 mx-auto mb-4 bg-neutral-300 rounded-full flex items-center justify-center">
                                <div className="w-0 h-0 border-l-6 border-l-neutral-500 border-t-4 border-t-transparent border-b-4 border-b-transparent ml-1"></div>
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