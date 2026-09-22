import Image from "next/image";
import { EXTERNAL } from "@/lib/site";

// A quiet footer for /prime-v6. The site footer opens with its own headline and a full-bleed
// photograph, which would be a third ending after the view; here Arch closes the frame instead:
// the sign-off ("Arch Prime is built on Arch Network.") and the site's links, nothing louder.

const SOCIALS = [
  { href: EXTERNAL.discord, src: "/img/social-discord.svg", label: "Discord" },
  { href: EXTERNAL.youtube, src: "/img/social-youtube.svg", label: "YouTube" },
  { href: EXTERNAL.linkedin, src: "/img/social-linkedin.svg", label: "LinkedIn" },
  { href: EXTERNAL.x, src: "/img/social-x.svg", label: "X" },
];

export function PrimeFooter({ line }: { line: string }) {
  return (
    <footer className="relative bg-dark-purple text-light">
      <div className="mx-auto flex w-[92%] max-w-(--container-site) flex-col gap-10 py-12 lg:flex-row lg:items-end lg:justify-between">
        <div className="flex flex-col gap-5">
          <Image src="/img/arch-logo-white.svg" alt="Arch Network" width={104} height={30} className="h-auto w-[104px]" />
          <p className="max-w-[420px] text-[15px] leading-[150%] text-light/75">{line}</p>
        </div>
        <div className="flex flex-wrap items-center gap-x-6 gap-y-4">
          <a href={EXTERNAL.book} target="_blank" rel="noopener noreferrer" className="text-xs text-light/80 hover:underline">
            Documentation
          </a>
          <a href={EXTERNAL.blog} target="_blank" rel="noopener noreferrer" className="text-xs text-light/80 hover:underline">
            See the Latest Arch News
          </a>
          <a href={EXTERNAL.typeform} target="_blank" rel="noopener noreferrer" className="text-xs text-light/80 hover:underline">
            Build with us
          </a>
          <div className="flex items-center gap-1.5">
            {SOCIALS.map((s) => (
              <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer" aria-label={s.label} className="flex h-9 w-9 items-center justify-center">
                <Image src={s.src} alt="" width={20} height={20} className="h-5 w-5" />
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
