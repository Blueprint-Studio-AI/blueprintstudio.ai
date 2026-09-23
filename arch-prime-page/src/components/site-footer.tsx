import Image from "next/image";
import { EXTERNAL } from "@/lib/site";
import { RevealWords } from "@/components/reveal";

const SOCIALS = [
  { href: EXTERNAL.discord, src: "/img/social-discord.svg", label: "Discord" },
  { href: EXTERNAL.youtube, src: "/img/social-youtube.svg", label: "YouTube" },
  { href: EXTERNAL.linkedin, src: "/img/social-linkedin.svg", label: "LinkedIn" },
  { href: EXTERNAL.x, src: "/img/social-x.svg", label: "X" },
];

const COPY = {
  home: "At Arch, we’re laser focused on bringing the world’s assets onchain. To do this, we need the absolute best settlement layer. The only answer is Bitcoin.",
  ecosystem:
    "Everything that once required other blockchains or centralized intermediaries can now be built directly on Bitcoin — Be a part of Bitcoin’s next chapter.",
};

export function SiteFooter({ variant = "home" }: { variant?: "home" | "ecosystem" }) {
  const bg = variant === "ecosystem" ? "/img/footer-eco.avif" : "/img/footer-home.avif";
  return (
    <footer className="relative z-5 -mt-10 flex min-h-[60vh] flex-col justify-between gap-25 overflow-hidden rounded-t-[20px] bg-dark-purple pt-10 pb-5 text-light">
      <div className="relative z-2 mx-auto flex w-[92%] max-w-(--container-site) flex-col items-start gap-20">
        <Image
          src="/img/arch-logo-white.svg"
          alt="Arch Network"
          width={120}
          height={34}
          className="h-auto w-[120px]"
        />
        <div className="max-w-[460px]">
          <RevealWords
            as="h2"
            text={"Bitcoin proved it could store value. Now it will prove it can power finance."}
            className="font-serif text-[32px] font-light leading-[1.18] sm:text-[36px]"
          />
          <RevealWords
            as="p"
            variant="text"
            text={COPY[variant]}
            className="mt-6 text-[14px] leading-[150%] text-light/85 sm:text-[16px]"
          />
        </div>
      </div>

      <div className="relative z-2 mx-auto flex w-[92%] max-w-(--container-site) flex-col items-start gap-5 lg:flex-row lg:items-center lg:justify-end">
        <a href={EXTERNAL.book} target="_blank" rel="noopener noreferrer" className="text-xs hover:underline">
          Documentation
        </a>
        <a href={EXTERNAL.typeform} target="_blank" rel="noopener noreferrer" className="text-xs hover:underline">
          Build with us
        </a>
        <a href={EXTERNAL.blog} target="_blank" rel="noopener noreferrer" className="text-xs hover:underline">
          See the Latest Arch News
        </a>
        <a href={EXTERNAL.prime} target="_blank" rel="noopener noreferrer" className="text-xs hover:underline">
          Arch Prime
        </a>
        <div className="flex items-center gap-1.5">
          {SOCIALS.map((s) => (
            <a
              key={s.label}
              href={s.href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={s.label}
              className="flex h-9 w-9 items-center justify-center"
            >
              <Image src={s.src} alt="" width={20} height={20} className="h-5 w-5" />
            </a>
          ))}
        </div>
      </div>

      <Image
        src={bg}
        alt=""
        fill
        sizes="100vw"
        className="object-cover object-center"
        style={{ zIndex: 0 }}
      />
      <div className="pointer-events-none absolute inset-x-0 top-0 z-1 h-1/2 bg-gradient-to-b from-black/[0.92] to-transparent" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-1 h-2/5 bg-[linear-gradient(to_top,rgba(0,0,0,0.9)_10%,transparent)]" />
      {variant === "ecosystem" && <div className="pointer-events-none absolute inset-0 z-1 bg-black/15" />}
    </footer>
  );
}
