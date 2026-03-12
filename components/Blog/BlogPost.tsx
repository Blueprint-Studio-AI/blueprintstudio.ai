"use client";

import Link from "next/link";
import Image from "next/image";
import ReactMarkdown from "react-markdown";

function noWidow(text: string, minTail = 15) {
  let i = text.length;
  while (text.length - i < minTail) {
    const prev = text.lastIndexOf(" ", i - 1);
    if (prev <= 0) return text;
    i = prev;
  }
  return text.slice(0, i) + text.slice(i).replace(/ /g, "\u00A0");
}
import Section from "@/components/ui/Section";
import OuterContainer from "@/components/ui/OuterContainer";
import InnerContainer from "@/components/ui/InnerContainer";
import SectionHeader from "@/components/ui/SectionHeader";
import { Footer } from "@/components/Footer/index";
import type { BlogPost as BlogPostType } from "@/lib/blog";

function formatDate(dateStr: string) {
  const date = new Date(dateStr + "T00:00:00");
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default function BlogPost({ post }: { post: BlogPostType }) {
  return (
    <div>
      <Section className="relative z-20 bg-neutral-50 min-h-fit">
        {/* Vertical construction lines */}
        <div className="absolute inset-0 flex justify-center pointer-events-none px-2.5 sm:px-[60px]">
          <div className="w-full flex-1 flex justify-center relative">
            <div className="absolute left-0 top-0 bottom-0 line-dash-y custom:hidden" />
            <div className="absolute left-0 top-0 bottom-0 w-px bg-neutral-300 hidden custom:block" />
            <div className="absolute right-0 top-0 bottom-0 line-dash-y custom:hidden" />
            <div className="absolute right-0 top-0 bottom-0 w-px bg-neutral-300 hidden custom:block" />
          </div>
        </div>

        <SectionHeader
          leftText="INSIGHTS"
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
          rightText={`// ${post.author.toLowerCase()}`}
        />

        <OuterContainer>
          <InnerContainer className="pt-12 sm:pt-20 lg:pt-24 pb-16 sm:pb-24 lg:pb-32 px-2.5 sm:px-6 relative">
            {/* Inner construction lines */}
            <div className="absolute left-0 top-0 bottom-0 line-dash-y hidden custom:block" />
            <div className="absolute right-0 top-0 bottom-0 line-dash-y hidden custom:block" />

            {/* Article header */}
            <header className="mb-10 sm:mb-14 max-w-2xl">
              <div className="flex items-center gap-1.5 text-xs uppercase tracking-wide text-neutral-500 mb-4">
                <time dateTime={post.date}>{formatDate(post.date)}</time>
                <span className="text-neutral-300">|</span>
                <span>{post.author}</span>
              </div>

              <h1 className="font-medium text-black text-[clamp(32px,6vw,52px)] leading-[1.15] tracking-[-1.5px]">
                {noWidow(post.title)}
              </h1>

              <p className="mt-4 text-neutral-500 text-base sm:text-lg leading-[1.5]">
                {post.description}
              </p>
            </header>

            {/* Hero image */}
            {post.image && (
              <div className="relative aspect-[16/9] w-full overflow-hidden rounded-lg border border-neutral-200 bg-neutral-100 mb-12 sm:mb-16">
                <Image
                  src={post.image}
                  alt={post.title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 1000px) 100vw, 1000px"
                  priority
                />
              </div>
            )}

            {/* Article body */}
            <article className="max-w-2xl text-neutral-700 leading-[1.75] space-y-6">
              <ReactMarkdown
                components={{
                  h2: ({ children }) => (
                    <h2 className="text-xl sm:text-2xl font-medium text-neutral-900 tracking-[-0.5px] mt-12 mb-4">
                      {children}
                    </h2>
                  ),
                  h3: ({ children }) => (
                    <h3 className="text-lg sm:text-xl font-medium text-neutral-900 tracking-[-0.3px] mt-10 mb-3">
                      {children}
                    </h3>
                  ),
                  p: ({ children }) => (
                    <p className="text-base sm:text-[17px] text-neutral-600 leading-[1.75]">
                      {children}
                    </p>
                  ),
                  strong: ({ children }) => (
                    <strong className="font-medium text-neutral-900">{children}</strong>
                  ),
                  ul: ({ children }) => (
                    <ul className="list-disc pl-5 my-4 marker:text-neutral-400">{children}</ul>
                  ),
                  ol: ({ children }) => (
                    <ol className="list-decimal pl-5 my-4 marker:text-neutral-400">{children}</ol>
                  ),
                  li: ({ children }) => (
                    <li className="text-base sm:text-[17px] text-neutral-600 leading-[1.75] mb-2">
                      {children}
                    </li>
                  ),
                  blockquote: ({ children }) => (
                    <blockquote className="border-l-2 border-neutral-300 pl-5 my-8 italic text-neutral-500">
                      {children}
                    </blockquote>
                  ),
                  a: ({ href, children }) => (
                    <a
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-neutral-900 underline underline-offset-2 decoration-neutral-300 hover:decoration-neutral-900 transition-colors duration-200"
                    >
                      {children}
                    </a>
                  ),
                  pre: ({ children }) => (
                    <pre className="bg-neutral-100 border border-neutral-200 p-4 rounded-lg overflow-x-auto my-6 text-sm">
                      {children}
                    </pre>
                  ),
                  code: ({ children, className }) => {
                    const isBlock = className?.includes("language-");
                    return isBlock ? (
                      <code>{children}</code>
                    ) : (
                      <code className="bg-neutral-100 border border-neutral-200 px-1.5 py-0.5 rounded text-sm text-neutral-800">
                        {children}
                      </code>
                    );
                  },
                  hr: () => <hr className="border-neutral-200 my-10" />,
                  img: ({ src, alt }) => (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={src} alt={alt || ""} className="max-w-full h-auto rounded-lg my-8" />
                  ),
                }}
              >
                {post.content}
              </ReactMarkdown>
            </article>
          </InnerContainer>
        </OuterContainer>

        <div className="w-full line-dash-x" />
      </Section>

      <Footer />
    </div>
  );
}
