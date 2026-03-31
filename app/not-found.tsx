import Link from "next/link";
import Image from "next/image";
import Section from "@/components/ui/Section";
import OuterContainer from "@/components/ui/OuterContainer";
import SectionHeader from "@/components/ui/SectionHeader";
import { Footer } from "@/components/Footer/index";

const quickLinks = [
  { label: "Home", href: "/" },
  { label: "Design & Build", href: "/#pricing" },
  { label: "Brand Identity", href: "/brand" },
  { label: "Launch Videos", href: "/launch-videos" },
  { label: "Insights", href: "/insights" },
];

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Vertical line system */}
      <div className="absolute inset-0 flex justify-center pointer-events-none px-2.5 sm:px-[60px] z-0">
        <div className="w-full flex-1 flex justify-center relative">
          <div className="absolute left-0 top-0 bottom-0 line-dash-y custom:hidden" />
          <div className="absolute left-0 top-0 bottom-0 w-px bg-neutral-300 hidden custom:block" />
          <div className="absolute right-0 top-0 bottom-0 line-dash-y custom:hidden" />
          <div className="absolute right-0 top-0 bottom-0 w-px bg-neutral-300 hidden custom:block" />
        </div>
      </div>

      {/* Section Header */}
      <SectionHeader
        leftText="404"
        centerContent={
          <Link href="/" className="hover:opacity-70 transition-opacity">
            <Image
              src="/blueprint-logo-dark.svg"
              alt="Blueprint Studio"
              width={80}
              height={20}
              className="h-3 sm:h-4 w-auto"
            />
          </Link>
        }
        rightText="PAGE NOT FOUND"
      />

      {/* Main Content */}
      <Section className="relative z-10 flex-1">
        <OuterContainer className="flex-1">
          <div className="flex-1 flex flex-col justify-center items-start w-full px-2.5 sm:px-6 py-24 sm:py-32 md:py-40">

            {/* Headline */}
            <h1
              className="font-medium tracking-[-0.04em] text-neutral-900 leading-[1.05]"
              style={{ fontSize: "clamp(3rem, 8vw, 7rem)" }}
            >
              Nothing here.
            </h1>

            {/* Subline */}
            <p className="mt-4 sm:mt-6 text-neutral-500 text-sm sm:text-base max-w-md leading-relaxed tracking-[-0.01em]">
              This page doesn&apos;t exist — it may have moved, or the link
              might be off. Here are some places to start.
            </p>

            {/* Dashed separator */}
            <div className="line-dash-x mt-8 sm:mt-10" />

            {/* Quick Links */}
            <nav className="mt-8 sm:mt-10 flex flex-col gap-3 sm:gap-4">
              {quickLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="group flex items-center gap-2 text-neutral-700 hover:text-neutral-900 transition-colors duration-200"
                >
                  <span className="text-sm sm:text-base tracking-[-0.01em]">
                    {link.label}
                  </span>
                  <svg
                    width="10"
                    height="10"
                    viewBox="0 0 11 12"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="opacity-0 group-hover:opacity-60 -translate-x-1 group-hover:translate-x-0 transition-all duration-200"
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
              ))}
            </nav>

            {/* Book a Call CTA */}
            <div className="mt-10 sm:mt-12">
              <Link
                href="https://cal.com/blueprint-studio/intro-call"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-construction inline-flex items-center gap-2 py-2.5 px-5 sm:py-3 sm:px-6 text-sm sm:text-base font-medium text-neutral-800 hover:text-white transition-colors duration-200"
              >
                Book a call
                <svg
                  width="10"
                  height="10"
                  viewBox="0 0 11 12"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="opacity-50"
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
            </div>
          </div>
        </OuterContainer>
      </Section>

      <div className="line-dash-x relative z-10" />

      {/* Footer */}
      <Footer />
    </div>
  );
}
