interface DeliverablePillProps {
  num: string;
  label: string;
  className?: string;
  size?: "sm" | "md";
}

export default function DeliverablePill({ num, label, className, size = "md" }: DeliverablePillProps) {
  const sizeClasses = size === "sm"
    ? "gap-2 px-2.5 py-1 text-xs"
    : "gap-3 px-3.5 sm:px-4 py-2 text-base";

  return (
    <div className={`flex items-center ${sizeClasses} text-black border border-neutral-300 rounded-full cursor-default ${className ?? "bg-white"}`}>
      <span className="font-normal text-neutral-400">{num}</span>
      <span className="font-normal">{label}</span>
    </div>
  );
}
