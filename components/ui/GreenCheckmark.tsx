import { cn } from "@/lib/utils";
import { Check } from "lucide-react";

export default function GreenCheckmark({ className, size = "md" }: {
  className?: string;
  size?: "sm" | "md";
}) {
  const sizeClasses = size === "sm"
    ? "w-3.5 h-3.5 border-[1.5px]"
    : "w-5 h-5 border-[1.85px]";
  const iconClasses = size === "sm" ? "w-2 h-2" : "w-3 h-3";

  return (
    <div className={cn("text-green-500 rounded-full flex items-center justify-center shrink-0 border-green-500", sizeClasses, className)}>
      <Check strokeWidth={size === "sm" ? 4 : 3} className={iconClasses} />
    </div>
  );
}
