interface DeliverablePillProps {
  num: string;
  label: string;
  className?: string;
}

export default function DeliverablePill({ num, label, className }: DeliverablePillProps) {
  return (
    <div className={`flex items-center gap-3 px-3.5 sm:px-4 py-2 text-black border border-neutral-300 rounded-full cursor-default ${className ?? "bg-white"}`}>
      <span className="text-base font-normal text-neutral-400">{num}</span>
      <span className="text-base font-normal">{label}</span>
    </div>
  );
}
