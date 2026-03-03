import { Star } from "lucide-react";
import { type ReactNode } from "react";

interface SocialProofProps {
  children: ReactNode;
  starSize?: "sm" | "md";
  showDivider?: boolean;
  className?: string;
}

export default function SocialProof({
  children,
  starSize = "md",
  showDivider = false,
  className = "",
}: SocialProofProps) {
  const sizeClass =
    starSize === "sm"
      ? "w-3.5 h-3.5"
      : "w-4 h-4 sm:w-5 sm:h-5";

  return (
    <div className={`flex items-center gap-2 sm:gap-3 ${className}`}>
      <div className="flex">
        {[...Array(5)].map((_, i) => (
          <Star key={i} className={`${sizeClass} fill-yellow-400 text-yellow-400`} />
        ))}
      </div>
      {showDivider && (
        <div className="hidden sm:block w-0.5 h-4 bg-neutral-400" />
      )}
      <span className="text-sm sm:text-md text-neutral-600 cursor-default tracking-tight">
        {children}
      </span>
    </div>
  );
}
