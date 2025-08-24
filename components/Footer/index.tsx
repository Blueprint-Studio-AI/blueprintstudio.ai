import Image from "next/image";
import { Icon } from "@iconify/react";
import Link from 'next/link';
import Section from '../ui/Section';
import OuterContainer from '../ui/OuterContainer';
import InnerContainer from '../ui/InnerContainer';
import EmailCapture from "./EmailCapture";
import FooterFX from "./FooterFX.client";

const companyLinks = [
  { name: 'About', href: 'https://read.cv/teams/blueprint' },
  // { name: 'Careers', href: '/careers' },
  // { name: 'Partners', href: '/partners' },
  // { name: 'Press Kit', href: '/press' },
  { name: 'Contact', href: 'mailto:blueprint.dao@gmail.com' }
];

const resourceLinks = [
  { name: 'Tools', href: '/tools' },
  { name: 'Ideas', href: '/blog' },
  { name: 'Services', href: '/service-index' },
];

export function Footer() {

  const iconStyle = "text-neutral-600 hover:text-neutral-500 transition-colors duration-200"

  return (
    <footer className="relative h-screen w-full flex flex-col">
      <div className="absolute inset-0 pointer-events-auto bg-neutral-900">
        {/* <Section className="h-full" semantic="div" >
          <OuterContainer className="border-r border-l border-neutral-700" direction="row">
            <InnerContainer className="border-r border-neutral-700" />
            <div className="line-dash-y border-neutral-700" />
          </OuterContainer>
        </Section> */}
        <FooterFX/>
      </div>

      {/* <Section semantic="div" className="flex-1">
        <OuterContainer>
          <div className="w-full h-full pt-28 pl-11">
            <Image
              src="logo-blueprint.svg"
              alt="Blueprint Logo"
              width={639}
              height={83}
            />
          </div>
        </OuterContainer>
      </Section>

      <div className="line-dash-x border-neutral-700" />

      <Section semantic="div" className="flex-none">
        <OuterContainer>
          <div className="w-full flex justify-between items-center pr-6">
            <EmailCapture/>
            <ul className="flex flex-row gap-4">
              <li>
                <Link href="https://github.com/Blueprint-Studio-AI" aria-label="GitHub" >
                  <Icon icon="akar-icons:github-fill" width="24" height="24" className={iconStyle} />
                </Link>
              </li>
              <li>
                <Link href="https://x.com/bpstu" aria-label="X" >
                  <Icon icon="bi:twitter-x" width="24" height="24" className={iconStyle} />
                </Link>
              </li>
              <li>
                <Link href="https://www.linkedin.com/company/blueprint-studio-ai" aria-label="LinkedIn" >
                  <Icon icon="bi:linkedin" width="24" height="24" className={iconStyle} />
                </Link>
              </li>
            </ul>
          </div>
        </OuterContainer>
      </Section>

      <div className="border-b border-neutral-700" />
      
      <Section semantic="div" className="flex-none">
        <OuterContainer>
          <div className="w-full flex justify-between px-6 pb-7 pt-20">
            <h1 className="text-neutral-600 text-sm tracking-[-0.02em]" >Copyright © Blueprint Studio 2025</h1>
            <h1 className="text-neutral-600 text-[12px] tracking-[-0.02em]" >33°59&apos;19.0&quot;N 118°28&apos;33.8&quot;W</h1>
          </div>
        </OuterContainer>
      </Section> */}

    </footer>
  );
}