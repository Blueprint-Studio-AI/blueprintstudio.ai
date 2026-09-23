import Image from "next/image";
import { EXTERNAL } from "@/lib/site";
import { ArchButton } from "@/components/button";
import { RevealWords, Reveal, RevealClip, RevealGroup } from "@/components/reveal";
import { Typewriter } from "@/components/typewriter";
import { CountUp } from "@/components/count-up";
import { Marquee, type MarqueeLogo } from "@/components/marquee";
import { Faq } from "@/components/faq";
import { SiteFooter } from "@/components/site-footer";
import { ArchOverlay } from "@/components/arch-overlay";
import { HOME_FAQS } from "@/data/home-faqs";
// The 2T+ card renders a live illustration layer; chain.css carries its
// (.chain-scope-namespaced) styles, which only load on /chain otherwise.
import { ChainCity } from "@/components/chain-city";
import "../chain/chain.css";

const MARQUEE_LOGOS: MarqueeLogo[] = [
  { src: "/img/partners/tangent.svg", alt: "Tangent", width: 110 },
  { src: "/img/partners/utxo.svg", alt: "UTXO", width: 40 },
  { src: "/img/partners/cypher.svg", alt: "Cypher", width: 110 },
  { src: "/img/partners/image37.avif", alt: "DPI Capital", width: 40 },
  { src: "/img/partners/asymmetric.avif", alt: "Asymmetric", width: 110 },
  { src: "/img/partners/portal.svg", alt: "Portal", width: 110 },
  { src: "/img/partners/logo1.svg", alt: "ARK Invest", width: 80 },
  { src: "/img/partners/ambush.svg", alt: "Ambush", width: 110 },
  { src: "/img/partners/bigbrain.svg", alt: "Big Brain", width: 110 },
  { src: "/img/partners/newman.svg", alt: "Newman", width: 110 },
  { src: "/img/partners/cms.svg", alt: "CMS", width: 80 },
  { src: "/img/partners/okx.svg", alt: "OKX", width: 80 },
];

export default function Home() {
  return (
    <>
      <header className="relative z-0 flex h-screen items-end justify-center overflow-hidden bg-black text-white">
        {/* poster is the video's own first frame, so the hero paints a still
            instantly and the clip starts over an identical frame — no black
            flash while it buffers. */}
        <video
          autoPlay
          loop
          muted
          playsInline
          poster="/video/hero-home-poster.jpg"
          className="absolute inset-0 z-0 h-full w-full bg-black object-cover"
          style={{ filter: "saturate(1.07) contrast(1.035)" }}
        >
          <source src="/video/hero-home.mp4" type="video/mp4" />
        </video>
        <div className="pointer-events-none absolute inset-x-0 top-0 z-1 h-2/5 bg-gradient-to-b from-black/[0.88] to-transparent" />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 z-1 h-2/5 bg-[linear-gradient(to_top,rgba(0,0,0,0.82)_10%,transparent)]" />
        <ArchOverlay />

        <div className="relative z-10 mx-auto flex min-h-[180px] w-[92%] max-w-(--container-site) flex-col items-start justify-between gap-5 pb-10 lg:flex-row lg:items-center">
          <div className="flex flex-col gap-1.5">
            <h1 className="mb-0 min-h-[56px] font-serif text-[clamp(52px,12vw,82px)] font-light leading-[95%] lg:min-h-[76px]">
              <Typewriter words={["Real Bitcoin.", "Finally Programmable."]} />
            </h1>
            <p className="relative text-[14px] leading-[140%] sm:text-[16px] lg:text-[20px]">
              Bitcoin Capital Markets Infrastructure
            </p>
          </div>
          {/* ponytail: parked — reusable hero CTA slot. Uncomment to restore
              "Sign the Manifesto" (or repoint href/label for a future promo). */}
          {/* <a
            href={EXTERNAL.manifesto}
            target="_blank"
            rel="noopener noreferrer"
            className="flex w-full min-w-40 items-center justify-center rounded-2xl bg-light p-[18px] text-center text-dark-purple transition-colors duration-400 hover:bg-dark-purple hover:text-light md:w-auto"
          >
            Sign the Manifesto
          </a> */}
        </div>
      </header>

      <main>
        <section className="relative pt-8 pb-25 md:pt-25">
          <div className="mx-auto grid w-[92%] max-w-(--container-site) gap-x-2.5 gap-y-10 lg:grid-cols-2">
            {/* .city-bleed lets the illustration overflow its top-half box so its
                front corner sits over the purple (clipped only by the rounded
                card). It's also a container: when the CARD itself is narrow
                (small-desktop / mobile — not wide tablet), a container query
                shifts the city further left via --city-left. */}
            <style>{`.city-bleed{container-type:inline-size}.city-bleed .cta-city{overflow:visible}@container (max-width:560px){.city-bleed .illo{--city-left:-110px}}`}</style>
            {/* 2T+ card: the base-chain scene (illustration layer 1), live via
                <ChainCity>, on a dark panel bleeding over the purple stat block. */}
            <RevealClip className="relative w-full overflow-hidden rounded-[20px] order-2 lg:order-none lg:aspect-square lg:min-w-[480px]">
              <div className="grid h-full grid-rows-[260px_auto] lg:grid-rows-[50%_auto]">
                <div className="city-bleed relative z-10 w-full bg-[#2e2d33]">
                  <ChainCity layer={1} override={{ scale: 1.0, bottom: -300, left: -30 }} />
                </div>
                <div className="relative z-0 flex min-h-[240px] flex-col items-start justify-center gap-1.5 overflow-hidden bg-purple p-[6%] text-light md:min-h-0 md:justify-end">
                  <div className="flex items-center font-sans text-[clamp(42px,7vw,200px)] font-bold leading-[1.18]">
                    <CountUp end={2} duration={400} />
                    T+
                  </div>
                  <p className="max-w-[420px] text-[18px] leading-[120%] lg:text-[26px]">
                    Unlocking trillions in Bitcoin capital—natively.
                  </p>
                </div>
              </div>
            </RevealClip>

            {/* Tablet (md) reflows to a row: text block + button across, sitting
                ABOVE the card (order-1). Mobile keeps it stacked (button below);
                desktop (lg) restores the in-cell column. */}
            <div className="flex max-w-[420px] flex-col items-start justify-center gap-10 py-8 order-1 md:max-w-none md:flex-row md:items-start md:justify-between md:gap-10 lg:order-none lg:mx-auto lg:max-w-[420px] lg:flex-col lg:items-start lg:justify-center">
              <div className="flex flex-col items-start gap-10 md:max-w-[480px]">
                <RevealWords
                  as="h2"
                  text={"Bitcoin should do more.\nNow it Can."}
                  className="font-serif text-[32px] font-normal leading-[1.18] lg:text-[36px]"
                />
                <RevealWords
                  as="p"
                  variant="text"
                  text={
                    "Bitcoin is the world’s strongest store of value—but mostly can’t be used productively without giving up custody. Arch is Bitcoin-native financial rails so it can now have native credit, yield, and trading while staying anchored to Bitcoin’s settlement and core values."
                  }
                  className="text-[14px] leading-[150%] text-grey sm:text-[16px]"
                />
              </div>
              <Reveal>
                <ArchButton href="/chain">How the Chain Works</ArchButton>
              </Reveal>
            </div>
          </div>
        </section>

        <section className="relative bg-light py-25 text-black">
          <div className="mx-auto grid w-[92%] max-w-(--container-site) gap-x-2.5 gap-y-15 md:grid-cols-2">
            <div className="mx-auto flex max-w-[420px] flex-col gap-10 md:mx-0 lg:mx-auto">
              <RevealWords
                as="h2"
                text={"Where Bitcoin becomes productive."}
                className="font-serif text-[32px] font-normal leading-[1.18] lg:text-[36px]"
              />
              <RevealWords
                as="p"
                variant="text"
                text={
                  "Bitcoin is already the reserve asset of digital finance — but it's missing the rails to put it to work. Arch turns Bitcoin into productive capital that earns, borrows, and backs credit at scale."
                }
                className="mt-auto text-[14px] leading-[150%] text-grey sm:text-[16px]"
              />
            </div>

            <div className="mx-auto flex w-full max-w-[450px] flex-col gap-10 md:mx-0 md:max-w-none">
              <RevealWords
                as="h2"
                text={"From digital gold to the foundation of global finance."}
                className="max-w-[90vw] font-serif text-[32px] font-normal leading-[1.18] lg:w-[450px] lg:text-[36px]"
              />
              <div className="grid w-full max-w-[420px] grid-cols-[120px_1px_1fr] gap-x-[10%]">
                <div className="flex flex-col gap-1.5">
                  <div className="flex items-center font-sans text-[42px] font-medium leading-[1.18]">
                    <CountUp end={31} />%
                  </div>
                  <div className="text-grey">supply held by institutions</div>
                </div>
                <div className="my-[5%] h-[90%] w-px bg-grey/50" />
                <div className="flex flex-col gap-1.5">
                  <div className="flex items-center font-sans text-[42px] font-medium leading-[1.18]">
                    <CountUp end={70} />%
                  </div>
                  <div className="text-grey">crypto investors motivated by yield opportunities</div>
                </div>
              </div>
            </div>

            <RevealClip className="relative -mt-2.5 min-h-[320px] w-full overflow-hidden rounded-[20px] sm:mt-2.5 md:col-span-2 lg:min-h-[460px]">
              <Image src="/img/stats.avif" alt="" fill sizes="92vw" className="object-cover" />
            </RevealClip>
          </div>

          <div className="mx-auto mt-25 flex w-[94%] max-w-[640px] flex-col gap-9 text-center">
            <h2 className="font-serif text-[26px] font-normal text-black">Backed by:</h2>
            <div className="mb-5 flex flex-col items-center justify-center gap-10 sm:flex-row sm:gap-16">
              <Image src="/img/partners/pantera.svg" alt="Pantera" width={200} height={48} className="w-[200px] max-w-[80%] brightness-0" />
              <Image src="/img/partners/multicoin.svg" alt="Multicoin Capital" width={200} height={48} className="w-[200px] max-w-[80%] brightness-0" />
            </div>
          </div>

          <div className="mt-12">
            <Marquee logos={MARQUEE_LOGOS} />
          </div>
        </section>

        <section className="relative py-25">
          <RevealClip
            as="div"
            className="mx-auto grid w-[92%] max-w-(--container-site) grid-cols-1 gap-5 rounded-[20px] bg-orange p-2.5 text-white lg:grid-cols-[1fr_380px]"
          >
            <div className="relative order-last min-h-[300px] w-full overflow-hidden rounded-3xl sm:order-none lg:min-h-full">
              <Image src="/img/risk.avif" alt="" fill sizes="(max-width: 992px) 92vw, 880px" className="object-cover" />
            </div>
            <div className="flex flex-col justify-start gap-10 px-0 py-5 lg:min-h-[420px] lg:max-w-[362px] lg:justify-between lg:px-2.5">
              <RevealWords
                as="h2"
                text={"The Risk Infrastructure Bitcoin Credit Requires"}
                className="font-serif text-[32px] font-light leading-[1.18] lg:text-[36px]"
              />
              <RevealWords
                as="p"
                variant="text"
                text={
                  "Capital markets require credit. Credit requires risk infrastructure that can't fail. Arch was built differently than the systems crypto inherited — a high-performance stack with deterministic liquidation and native Bitcoin settlement, vertically integrated to hold under stress and built to scale Bitcoin credit as the foundation for everything that comes next."
                }
                className="text-[14px] leading-[150%] sm:text-[16px]"
              />
            </div>
          </RevealClip>
        </section>

        <section className="relative flex min-h-screen flex-col items-start justify-between gap-y-[200px] overflow-hidden bg-black py-25 text-white lg:gap-y-0">
          <video
            autoPlay
            loop
            muted
            playsInline
            poster="/video/anchored-poster.jpg"
            className="absolute top-0 left-1/2 z-0 h-full w-[120%] min-w-full -translate-x-1/2 object-cover"
          >
            <source src="/video/anchored.mp4" type="video/mp4" />
          </video>
          <div className="pointer-events-none absolute inset-x-0 top-0 z-1 h-2/5 bg-[linear-gradient(to_bottom,rgba(0,0,0,0.9)_11%,transparent)]" />
          <div className="pointer-events-none absolute inset-x-0 bottom-0 z-1 h-2/5 bg-[linear-gradient(to_top,rgba(0,0,0,0.9)_10%,transparent)]" />

          <div className="relative z-2 mx-auto grid w-[92%] max-w-(--container-site) lg:grid-cols-2">
            <RevealGroup as="div" className="flex max-w-[420px] flex-col gap-10">
              <RevealWords
                as="h2"
                text={"Anchored to Bitcoin. Aligned with its future."}
                className="font-serif text-[32px] font-light leading-[1.18] lg:text-[36px]"
              />
              <RevealWords
                as="p"
                variant="text"
                text={
                  "Arch settles financial logic directly on Bitcoin. This reinforces miner incentives, strengthening network security, and keeps liquidity in the ecosystem instead of fragmenting across other bridges and networks."
                }
                className="text-[14px] leading-[150%] sm:text-[16px]"
              />
            </RevealGroup>
          </div>

          <div className="relative z-2 mx-auto grid w-[92%] max-w-(--container-site) gap-10 lg:grid-cols-2">
            <Reveal className="order-2 max-w-full md:ml-auto md:w-[420px] lg:order-none lg:ml-0 lg:w-auto lg:self-end">
              <ArchButton href="/ecosystem">Join the Ecosystem</ArchButton>
            </Reveal>
            <RevealGroup
              as="div"
              className="order-1 flex max-w-[420px] flex-col gap-10 md:ml-auto lg:order-none lg:self-start"
            >
              <RevealWords
                as="h2"
                text={"Arch doesn’t change Bitcoin. It finally lets Bitcoin change the world."}
                className="font-serif text-[32px] font-light leading-[1.18] lg:text-[36px]"
              />
              <RevealWords
                as="p"
                variant="text"
                text={
                  "Our partners share our core vision: preserve Bitcoin's foundations while expanding what's possible with it. Together, we're building the credit, yield, and trading infrastructure that turns Bitcoin from a store of value into the base layer for capital markets."
                }
                className="text-[14px] leading-[150%] sm:text-[16px]"
              />
            </RevealGroup>
          </div>
        </section>

        <section className="relative overflow-hidden pt-25 pb-[70px] sm:pb-25">
          <div className="mx-auto w-[92%] max-w-(--container-site)">
            <RevealWords
              as="h2"
              text={"The Arch Unlock"}
              className="font-serif text-[38px] font-light leading-[1.08] text-dark-purple sm:text-[42px] md:text-[62px]"
            />
            <div className="mt-12 grid gap-x-2.5 gap-y-10 sm:mt-20 lg:grid-cols-2 lg:gap-y-2.5">
              <div className="grid gap-2.5 sm:grid-cols-2">
                <h3 className="mb-5 font-serif text-[36px] font-normal text-dark-purple sm:col-span-2">For institutions</h3>
                <ArgumentBox
                  delay={0}
                  title={"Yield on\nnative Bitcoin"}
                  text="Arch lets institutions put Bitcoin to work without counterparty risk — turning balance sheet Bitcoin into productive collateral that earns."
                />
                <ArgumentBox
                  delay={0.08}
                  title={"Ready for\nInstitutions"}
                  text="Arch integrates with the custody frameworks institutions already use —without need for re-architecting custody and compliance workflows."
                />
              </div>
              <div className="grid gap-2.5 sm:grid-cols-2">
                <h3 className="mb-5 font-serif text-[36px] font-normal text-dark-purple sm:col-span-2">For users</h3>
                <ArgumentBox
                  delay={0.16}
                  title={"New Bitcoin\nUse Cases"}
                  text="Bitcoin isn't just something you hold — it's something you can now use. Access credit, yield, and structured products with nothing but Bitcoin."
                />
                <ArgumentBox
                  delay={0.24}
                  title="Use Bitcoin like normal — just better."
                  text="Seamless to use and completely invisible. Your keys, your Bitcoin, your access to capital markets — without ever leaving the Bitcoin network."
                />
              </div>
            </div>
          </div>
        </section>

        <section className="relative bg-light-grey bg-[url(/img/grey-bg.svg)] bg-[length:800px] bg-[position:0_100%] bg-no-repeat py-25 text-black">
          <div className="mx-auto w-[92%] max-w-(--container-site)">
            <RevealWords
              as="h2"
              text={"Have any\nquestions?"}
              className="font-serif text-[38px] font-light leading-[1.08] sm:text-[42px] md:text-[62px]"
            />
          </div>
          <div className="mx-auto mt-10 w-[92%] max-w-(--container-site) lg:grid lg:grid-cols-2">
            <div />
            <Faq items={HOME_FAQS} />
          </div>
        </section>
      </main>

      <SiteFooter variant="home" />
    </>
  );
}

function ArgumentBox({ title, text, delay = 0 }: { title: string; text: string; delay?: number }) {
  return (
    <Reveal
      x={-10}
      y={0}
      skew={0}
      duration={0.7}
      delay={delay}
      className="flex min-h-[280px] flex-col justify-between rounded-[32px] bg-light p-6 text-purple md:min-h-[320px]"
    >
      <h2 className="font-serif text-[26px] font-light leading-[110%] whitespace-pre-line">{title}</h2>
      <p className="text-[14px] leading-[120%]">{text}</p>
    </Reveal>
  );
}
