import Image from "next/image";
import { Icon } from "@iconify/react";
import Link from 'next/link';
import Section from '../ui/Section';
import OuterContainer from '../ui/OuterContainer';
import InnerContainer from '../ui/InnerContainer';
import EmailCapture from "./EmailCapture";
import FooterFX from "./FooterFX.client";

const footerLinks = {
  // services: {
  //   title: 'Services',
  //   links: [
  //     { name: 'Web Design', href: '/web-design' },
  //     { name: 'Service Design', href: '/service-design' },
  //     { name: 'Small Business', href: '/small-business-web-design' },
  //     { name: 'All Services', href: '/services-index' },
  //   ]
  // },
  tools: {
    title: 'Tools',
    links: [
      { name: 'Roast My Site', href: '/tools/roast-my-site' },
      // { name: 'All Tools', href: '/tools' },
    ]
  },
  company: {
    title: 'Company',
    links: [
      { name: 'About', href: 'https://read.cv/teams/blueprint', external: true },
      { name: 'Contact', href: 'mailto:blueprint.dao@gmail.com' },
      // { name: 'Careers', href: '/careers' },
    ]
  },
  // resources: {
  //   title: 'Resources',
  //   links: [
  //     { name: 'Blog', href: '/blog' },
  //     { name: 'Case Studies', href: '/case-studies' },
  //   ]
  // },
  legal: {
    title: 'Legal',
    links: [
      { name: 'Terms of Service', href: '/terms' },
      { name: 'Privacy Policy', href: '/privacy-policy' },
    ]
  }
};

export function Footer() {

  const iconStyle = "text-neutral-600 hover:text-neutral-500 transition-colors duration-200"

  return (
    <footer className="relative w-full flex flex-col">

       {/* Background */}
      <div className="absolute inset-0 -z-[10] pointer-events-auto bg-neutral-900">
        <Section semantic="div" >
        {/* Artificial vertical lines to match the background */}
        <div className="absolute inset-0 flex justify-center pointer-events-none px-2.5 sm:px-[60px]">
            <div className="w-full flex-1 flex justify-center relative">
                {/* Left dashed vertical line (mobile) / solid line (desktop) */}
                <div className="absolute left-0 top-0 bottom-0 line-dash-y border-neutral-700 custom:hidden" />
                <div className="absolute left-0 top-0 bottom-0 w-px bg-neutral-700 hidden custom:block" />
                
                {/* Right dashed vertical line (mobile) / solid line (desktop) */}
                <div className="absolute right-0 top-0 bottom-0 line-dash-y border-neutral-700 custom:hidden" />
                <div className="absolute right-0 top-0 bottom-0 w-px bg-neutral-700 hidden custom:block" />
            </div>
        </div>
        </Section>
        {/* <FooterFX/>  */}
      </div>

       {/* Logo */}
      <Section semantic="div" className="flex-1">
        <OuterContainer>
          <div className="w-full pt-16 md:pt-28 px-2.5 md:px-6">
            <Image
              src="/logo-blueprint.svg"
              alt="Blueprint Logo"
              width={639}
              height={83}
              style={{ filter: 'grayscale(100%)' }}
            />
          </div>
        </OuterContainer>
      </Section>

      {/* Footer Links Section */}
      <Section semantic="div" className="flex-1">
        <div className="w-full px-2.5 py-16 md:py-28 md:px-0 ">
          <div className="flex flex-col md:flex-row gap-10 md:gap-12 w-full md:px-6">
            {Object.entries(footerLinks).map(([key, section]) => (
              <div key={key} className="flex flex-col min-w-0">
                <h3 className="text-neutral-400 text-sm font-medium mb-4 md:mb-6">{section.title}</h3>
                <ul className="flex flex-col gap-4 md:gap-4">
                  {section.links.map((link) => (
                    <li key={link.name}>
                      {link.external ? (
                        <Link
                          href={link.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-neutral-500 hover:text-neutral-300 text-sm transition-colors duration-200 flex items-center gap-1 w-fit"
                        >
                          {link.name}
                          <svg
                            width="9"
                            height="9"
                            viewBox="0 0 11 12"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                            className="opacity-50 flex-shrink-0"
                          >
                            <path
                              d="M1.70985 4.5H7.7804M7.7804 4.5V10.5705M7.7804 4.5L0.780396 11.5"
                              stroke="currentColor"
                              strokeWidth="1.3"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                        </Link>
                      ) : (
                        <Link
                          href={link.href}
                          className="text-neutral-500 hover:text-neutral-300 text-sm transition-colors duration-200 block w-fit"
                        >
                          {link.name}
                        </Link>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Mobile Social Links */}
          <div className="w-full pl-0 pb-0 pt-16 md:hidden">
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
        </div>
      </Section>

      <div className="line-dash-x border-neutral-700" />

       {/* Newsletter and Socials */}
      <Section semantic="div" className="flex-none">
        <OuterContainer>
          <div className="w-full flex flex-col md:flex-row md:justify-between md:items-center gap-6 md:gap-0 md:pr-6">
            <EmailCapture/>
            <ul className="hidden md:flex flex-row gap-4">
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

      <div className="line-dash-x border-neutral-700" />
      
      {/* Bottom */}
      <Section semantic="div" className="flex-none">
        <OuterContainer>
          <div className="w-full flex flex-col md:flex-row md:justify-between gap-4 md:gap-0 px-6 pb-7 pt-20">
            <h1 className="text-neutral-600 text-sm tracking-[-0.02em]">Copyright © Blueprint Studio 2025</h1>
            <h1 className="text-neutral-600 text-[12px] tracking-[-0.02em]">33°59&apos;19.0&quot;N 118°28&apos;33.8&quot;W</h1>
          </div>
        </OuterContainer>
      </Section>

    </footer>
  );
}