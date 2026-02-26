import { cn } from "@/lib/utils";
import { Check } from "lucide-react";

export default function GreenCheckmark({ className }: {
  className?: string;
}) {
  return (
    <div className={cn("text-green-500 w-5 h-5 rounded-full flex items-center justify-center shrink-0 border-[1.85px] border-green-500", className)}>
      <Check strokeWidth={3} className="w-3 h-3" />
    </div>
  );
}
