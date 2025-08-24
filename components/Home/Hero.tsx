import Section from "@/components/ui/Section";
import OuterContainer from "@/components//ui/OuterContainer";
import InnerContainer from "@/components/ui/InnerContainer";
import Image from "next/image";

export default function Hero() {
    return (
        <Section className="flex flex-col">
            {/* Header */}
            <OuterContainer>
                <div className="flex w-full justify-between items-center pt-4 pb-2 px-3 sm:pt-6 sm:pb-3 sm:px-6 lg:pt-8">
                    <div className="text-xs uppercase font-medium leading-[136%] text-[#C3C6CC]" style={{ letterSpacing: '-0.24px' }}>
                        Design & Build
                    </div>
                    <div className="text-xs uppercase font-medium leading-[136%] text-[#C3C6CC] text-right" style={{ letterSpacing: '-0.24px' }}>
                        {new Date().toLocaleDateString('en-US', { 
                            month: '2-digit', 
                            day: '2-digit', 
                            year: 'numeric' 
                        }).replace(/\//g, '.')}
                    </div>
                </div>
            </OuterContainer>
            
            <div className="w-screen line-dash-x"/>
            
            {/* Main Content */}
            <OuterContainer className="flex-1 flex items-center">
                <InnerContainer className="text-center pt-8 sm:pt-12 lg:pt-16 px-3 sm:px-6">
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
                    <p className="text-center font-normal max-w-sm sm:max-w-md lg:max-w-lg mx-auto mb-12 sm:mb-14 lg:mb-16 text-[#9A9A9A]" 
                       style={{ 
                         fontSize: 'clamp(20px, 4vw, 28px)', 
                         lineHeight: '110%', 
                         letterSpacing: '-0.96px' 
                       }}>
                        We partner with founders to build the future. We partner with founders
                        <br />
                        <br />
                        to build the future. We partner with founders to build the future. We partner 
                        with founders to build the future.
                    </p>
                    
                    {/* Current Partners */}
                    <div className="mb-10 sm:mb-12 lg:mb-14">
                        <p className="text-center font-normal mb-4 text-[#B0B0B0]" 
                           style={{ 
                             fontSize: 'clamp(16px, 3vw, 20px)', 
                             lineHeight: '110%' 
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
            
            <div className="line-dash-x"/>
            
            {/* Video Section */}
            <OuterContainer>
                <InnerContainer className="py-12">

                    
                    {/* Video Placeholder */}
                    <div className="w-full max-w-4xl mx-auto aspect-video bg-neutral-200 rounded-lg shadow-lg flex items-center justify-center">
                        <div className="text-center text-neutral-500">
                            <div className="w-16 h-16 mx-auto mb-4 bg-neutral-300 rounded-full flex items-center justify-center">
                                <div className="w-0 h-0 border-l-6 border-l-neutral-500 border-t-4 border-t-transparent border-b-4 border-b-transparent ml-1"></div>
                            </div>
                            <p className="text-sm">Video Placeholder</p>
                        </div>
                    </div>
                </InnerContainer>
            </OuterContainer>
            
            <div className="line-dash-x"/>
        </Section>

    )
}