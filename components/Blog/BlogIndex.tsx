"use client";

import Link from "next/link";
import Image from "next/image";

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
import type { BlogPost } from "@/lib/blog";

function formatDate(dateStr: string) {
  const date = new Date(dateStr + "T00:00:00");
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function PostCard({ post }: { post: BlogPost }) {
  return (
    <Link href={`/insights/${post.slug}`} className="group block">
      <article className="flex flex-col gap-4">
        {/* Image */}
        <div className="relative aspect-[16/9] w-full overflow-hidden rounded-lg border border-neutral-200 bg-neutral-100">
          {post.image ? (
            <Image
              src={post.image}
              alt={post.title}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-[1.02]"
              sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
            />
          ) : (
            <div className="absolute inset-0 bg-neutral-100" />
          )}
        </div>

        {/* Meta */}
        <div className="flex items-center gap-1.5 text-xs uppercase tracking-wide text-neutral-500">
          <time dateTime={post.date}>{formatDate(post.date)}</time>
          <span className="text-neutral-300">|</span>
          <span>{post.author}</span>
        </div>

        {/* Title */}
        <h2 className="text-xl sm:text-2xl font-medium text-neutral-900 tracking-[-0.5px] leading-[1.2] group-hover:text-neutral-600 transition-colors duration-200">
          {noWidow(post.title)}
        </h2>

        {/* Description */}
        <p className="text-sm sm:text-base text-neutral-500 leading-[1.5]">
          {post.description}
        </p>
      </article>
    </Link>
  );
}

export default function BlogIndex({ posts }: { posts: BlogPost[] }) {
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
          rightText="// insights"
        />

        <OuterContainer>
          <InnerContainer className="pt-16 sm:pt-24 lg:pt-32 pb-16 sm:pb-24 lg:pb-32 px-2.5 sm:px-6 relative">
            {/* Inner construction lines */}
            <div className="absolute left-0 top-0 bottom-0 line-dash-y hidden custom:block" />
            <div className="absolute right-0 top-0 bottom-0 line-dash-y hidden custom:block" />

            {/* Header */}
            <div className="mb-16 sm:mb-20">
              <h1 className="font-medium text-black cursor-default text-[clamp(32px,6vw,48px)] leading-[1.15] tracking-[-2px]">
                Insights
              </h1>
            </div>

            {/* Posts grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-12 sm:gap-y-16">
              {posts.map((post) => (
                <PostCard key={post.slug} post={post} />
              ))}
            </div>

            {posts.length === 0 && (
              <p className="text-neutral-400 text-sm">No posts yet. Check back soon.</p>
            )}
          </InnerContainer>
        </OuterContainer>

        <div className="w-full line-dash-x" />
      </Section>

      <Footer />
    </div>
  );
}
