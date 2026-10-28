// The numbers the site already publishes for this service (/brand's "25+
// Brands Built", /launch-videos' "2M+ Total Views"), under the hero's buttons
// so the proof sits next to the promise and the work still starts high.
// Static: it's above the fold.
export default function Stats({ stats }: { stats: { value: string; label: string }[] }) {
  return (
    <dl className="mt-10 grid grid-cols-3 gap-4 sm:gap-6 lg:mt-12">
      {stats.map((stat) => (
        <div key={stat.label} className="flex flex-col border-t border-neutral-200 pt-4">
          <dt className="order-2 mt-1.5 text-sm leading-snug text-neutral-500">{stat.label}</dt>
          <dd className="order-1 text-[clamp(24px,2.3vw,30px)] font-medium leading-none tracking-[-0.04em] text-black">
            {stat.value}
          </dd>
        </div>
      ))}
    </dl>
  );
}
