
import OuterContainer from "@/components/ui/OuterContainer";
import { ReactNode } from "react";

interface SectionHeaderProps {
  leftText: string | ReactNode;
  rightText: string | ReactNode;
  centerContent?: ReactNode;
}

export default function SectionHeader({ leftText, rightText, centerContent }: SectionHeaderProps) {
  return (
    <div className="w-full">
      <OuterContainer>
        <div className="flex w-full justify-between items-center pt-4 pb-2 px-2.5 sm:pt-6 sm:pb-3 sm:px-6 lg:pt-8 relative">
          <div className="text-[8px] sm:text-xs uppercase font-medium leading-[136%] text-neutral-500 custom:invisible wide:visible cursor-default" style={{ letterSpacing: '-0.24px' }}>
            {leftText}
          </div>
          {centerContent && (
            <div className="absolute left-1/2 transform -translate-x-1/2">
              {centerContent}
            </div>
          )}
          <div className="text-[8px] sm:text-xs uppercase font-medium leading-[136%] text-neutral-500 text-right custom:invisible wide:visible cursor-default" style={{ letterSpacing: '-0.24px' }}>
            {rightText}
          </div>
        </div>
      </OuterContainer>
      <div className="w-full line-dash-x"/>
    </div>
  );
}
