// Overview — intro headline + body. Copy is the home page's own framing:
// "Real Bitcoin." above the fold, "Finally programmable." on the unfurl.

export default function Overview() {
  return (
    <section id="overview" className="px-edge py-section">
      <div className="flex items-start gap-gutter max-[1360px]:gap-24 max-[860px]:flex-col max-[860px]:gap-10">
        <div className="w-[596px] shrink-0 max-[1360px]:w-[45%] max-[1200px]:w-1/2 max-[860px]:w-full">
          <h1 className="text-headline font-medium text-ink max-[860px]:text-headline-mobile">
            Real Bitcoin.
            <br />
            <span className="text-faint">Finally programmable.</span>
          </h1>
        </div>
        <div className="flex min-w-0 flex-1 flex-col gap-[1.4em] text-body-lg text-body">
          <p>
            Arch is Bitcoin-native financial market infrastructure. Bitcoin is the world&apos;s strongest store of
            value, but it mostly can&apos;t be used productively without giving up custody. Arch gives it native
            credit, yield, and trading while staying anchored to Bitcoin&apos;s settlement and core values.
          </p>
          <p>
            The identity is built on that contrast: a warm editorial serif and the parchment ground of a financial
            institution, cut by a single signal orange and a mark of four nested arches. Serious where it counts,
            never cold.
          </p>
        </div>
      </div>
    </section>
  );
}
