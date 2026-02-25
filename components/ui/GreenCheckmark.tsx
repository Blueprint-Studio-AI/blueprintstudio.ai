import { Check } from "lucide-react";

export default function GreenCheckmark() {
  return (
    <div className="w-5 h-5 rounded-full flex items-center justify-center shrink-0 border-[1.85px] border-[#22D462]">
      <Check strokeWidth={3} className="w-3 h-3 text-[#22D462]" />
    </div>
  );
}
