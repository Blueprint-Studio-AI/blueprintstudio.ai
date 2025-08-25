"use client";
import Section from "@/components/ui/Section";
import OuterContainer from "@/components/ui/OuterContainer";
import InnerContainer from "@/components/ui/InnerContainer";
import SectionHeader from "../ui/SectionHeader";

const achievements = [
  {
    id: 1,
    title: "Industry Leadership",
    description: "Recognized as a top design studio by leading industry publications and awards."
  },
  {
    id: 2,
    title: "Client Success",
    description: "100% client satisfaction rate with projects delivered on time and within budget."
  },
  {
    id: 3,
    title: "Innovation Focus",
    description: "Pioneering new approaches to design and development for emerging technologies."
  }
];

export default function Achievements() {
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

      <SectionHeader leftText="ACHIEVEMENTS" rightText="/ item 1 ⋯ 3" />

      {/* Main Content */}
      <OuterContainer className="flex-1 flex items-center">
        <InnerContainer className="pt-8 sm:pt-12 lg:pt-16 pb-8 sm:pb-12 lg:pb-16 px-2.5 sm:px-6 relative">
          {/* Inner dashed vertical lines on desktop */}
          <div className="absolute left-0 top-0 bottom-0 line-dash-y hidden custom:block" />
          <div className="absolute right-0 top-0 bottom-0 line-dash-y hidden custom:block" />
          
          {/* Heading and Description Row */}
          <div className="flex flex-col lg:flex-row items-start gap-8 lg:gap-16 mb-12 sm:mb-16 lg:mb-20">
            <div className="flex-1">
              <h1 className="font-medium text-black" 
                  style={{ 
                    fontSize: 'clamp(41px, 8vw, 68px)', 
                    lineHeight: 'clamp(97%, 1vw, 100%)',
                    letterSpacing: '-2.04px' 
                  }}>
                Text
              </h1>
            </div>
            <div className="flex-1">
              <p className="font-normal text-neutral-500" 
                 style={{ 
                   fontSize: 'clamp(20px, 4vw, 28px)', 
                   lineHeight: '110%', 
                   letterSpacing: '-0.96px' 
                 }}>
                Building exceptional digital experiences and establishing lasting partnerships with innovative founders worldwide.
              </p>
            </div>
          </div>

          {/* Achievement Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
            {achievements.map((achievement) => (
              <div 
                key={achievement.id}
                className="flex flex-col items-start gap-4 flex-1 rounded-[20px] border border-neutral-300 bg-neutral-200 p-4 pb-6 h-[361px]"
              >
                {/* Top section with dot background and visual placeholder */}
                <div 
                  className="w-full flex-1 rounded-lg relative border border-neutral-300 bg-neutral-100 overflow-hidden"
                  style={{
                    backgroundImage: 'radial-gradient(circle, hsl(var(--neutral-300)) 1px, transparent 1px)',
                    backgroundSize: '16px 16px',
                  }}
                >
                  {/* Visual placeholder - ready for motion animation */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-16 h-16 bg-neutral-400 rounded-full opacity-60" />
                  </div>
                </div>

                {/* Text content */}
                <div className="flex flex-col items-start gap-3 w-full">
                  <h3 className="font-medium text-black text-lg leading-tight">
                    {achievement.title}
                  </h3>
                  <p className="text-neutral-500 text-sm leading-relaxed">
                    {achievement.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </InnerContainer>
      </OuterContainer>
      
      <div className="w-full line-dash-x"/>
    </Section>
  );
}
