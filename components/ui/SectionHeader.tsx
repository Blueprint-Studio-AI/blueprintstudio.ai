
import OuterContainer from "@/components/ui/OuterContainer";

interface SectionHeaderProps {
  leftText: string;
  rightText: string;
}

export default function SectionHeader({ leftText, rightText }: SectionHeaderProps) {
  return (
    <div className="w-full">
      <OuterContainer>
        <div className="flex w-full justify-between items-center pt-4 pb-2 px-3 sm:pt-6 sm:pb-3 sm:px-6 lg:pt-8">
          <div className="text-xs uppercase font-medium leading-[136%] text-neutral-300 custom:invisible wide:visible" style={{ letterSpacing: '-0.24px' }}>
            {leftText}
          </div>
          <div className="text-xs uppercase font-medium leading-[136%] text-neutral-300 text-right custom:invisible wide:visible" style={{ letterSpacing: '-0.24px' }}>
            {rightText}
          </div>
        </div>
      </OuterContainer>
      <div className="w-full line-dash-x"/>
    </div>
  );
}
