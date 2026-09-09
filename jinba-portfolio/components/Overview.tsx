// Overview — intro headline + body (Figma 289:613).

export default function Overview() {
  return (
    <section id="overview" className="px-edge py-section">
      <div className="flex items-start gap-gutter max-[1360px]:gap-24 max-[860px]:flex-col max-[860px]:gap-10">
        <div className="w-[596px] shrink-0 max-[1360px]:w-[45%] max-[1200px]:w-1/2 max-[860px]:w-full">
          <h1 className="text-headline font-medium text-ink max-[860px]:text-headline-mobile">
            One body, one mind.
            <br />
            <span className="text-faint">Horse and rider move as a single form.</span>
          </h1>
        </div>
        <div className="flex min-w-0 flex-1 flex-col gap-[1.4em] text-body-lg text-body">
          <p>
            Jinba Ittai describes the unity between a horse and its rider, two entities that become indistinguishable in
            motion. For Jinba, it captures what enterprise automation should feel like: the business and its workflows
            operating as one.
          </p>
          <p>
            Clean geometry, deliberate restraint. Jinba serves regulated industries where trust is the product. The
            identity is considered, precise, and calm under pressure.
          </p>
        </div>
      </div>
    </section>
  );
}
