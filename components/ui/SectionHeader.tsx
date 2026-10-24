import OuterContainer from "@/components/ui/OuterContainer";
import { ReactNode } from "react";

interface SectionHeaderProps {
  /** No longer shown: the small corner labels were dropped site-wide. */
  leftText?: string | ReactNode;
  /** No longer shown: the small corner labels were dropped site-wide. */
  rightText?: string | ReactNode;
  /** Shown centred, for pages without the site nav (e.g. the logo). */
  centerContent?: ReactNode;
  /** Set false to drop the dashed divider (default keeps it). */
  divider?: boolean;
}

// A section's top edge: the dashed rule from the blueprint frame. The small
// corner labels it used to carry ("Portfolio", "// Clarity"…) are gone now that
// the site has a real nav and every section has its own title, so without
// centre content it's just the rule.
export default function SectionHeader({ centerContent, divider = true }: SectionHeaderProps) {
  return (
    <div className="w-full">
      {centerContent && (
        <OuterContainer>
          <div className="flex w-full items-center justify-center px-2.5 pb-2 pt-4 sm:px-6 sm:pb-3 sm:pt-6 lg:pt-8">{centerContent}</div>
        </OuterContainer>
      )}
      {divider && <div className="w-full line-dash-x" />}
    </div>
  );
}
