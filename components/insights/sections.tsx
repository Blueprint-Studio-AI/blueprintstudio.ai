import Link from "next/link";
import Image from "next/image";
import { defineCard, defineCollection, defineLayout, defineSection, type SectionContext } from "@blueprint-studio/galley";
import { SectionText } from "@blueprint-studio/galley/section-text";
import { z } from "zod";
import type { BlogPost } from "@/lib/blog";

// The sections the Insights page is built from (content/pages/insights.json): its heading,
// and its posts as a Collection with Insights' own card and grid. Registered in
// galley.config.ts.

/** Words a person edits where they show: editable in edit mode, plain text on the site. */
const words = (context: SectionContext, prop: string, value: string) => (context.edit ? <SectionText prop={prop} value={value} /> : value);

/** The posts, imported when a section renders (galley.config lists the sections, and the posts' loader reads galley.config). */
const blog = () => import("@/lib/blog");

export const heading = defineSection({
  name: "InsightsHeading",
  label: "Heading",
  category: "Text",
  single: true,
  description: "The page's title, large.",
  props: z.object({ title: z.string().min(1, "Give the page a title").max(60).meta({ title: "Title" }) }),
  defaults: { title: "Insights" },
  Component: ({ title, context }) => (
    <div className="mb-16 sm:mb-20">
      <h1 className="font-medium text-black cursor-default text-[clamp(32px,6vw,48px)] leading-[1.15] tracking-[-2px]">{words(context, "title", title)}</h1>
    </div>
  ),
});

type Post = BlogPost & { publishedAt: string };

function noWidow(text: string, minTail = 15) {
  let i = text.length;
  while (text.length - i < minTail) {
    const prev = text.lastIndexOf(" ", i - 1);
    if (prev <= 0) return text;
    i = prev;
  }
  return text.slice(0, i) + text.slice(i).replace(/ /g, " ");
}

const formatDate = (date: string) => new Date(`${date}T00:00:00`).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });

const card = defineCard<Post>({
  name: "card",
  label: "Card",
  description: "Picture, date and author, title and description",
  Component: ({ post }) => (
    <Link href={`/insights/${post.slug}`} className="group block">
      <article className="flex flex-col gap-4">
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
        <div className="flex items-center gap-1.5 text-xs uppercase tracking-wide text-neutral-500">
          <time dateTime={post.date}>{formatDate(post.date)}</time>
          <span className="text-neutral-300">|</span>
          <span>{post.author}</span>
        </div>
        <h2 className="text-xl sm:text-2xl font-medium text-neutral-900 tracking-[-0.5px] leading-[1.2] group-hover:text-neutral-600 transition-colors duration-200">{noWidow(post.title)}</h2>
        <p className="text-sm sm:text-base text-neutral-500 leading-[1.5]">{post.description}</p>
      </article>
    </Link>
  ),
});

const grid = defineLayout<Post>({
  name: "grid",
  label: "Grid",
  description: "Cards two to a row.",
  capacity: { min: 1, max: 60 },
  slots: [{ match: "rest", accepts: ["card"], default: "card" }],
  Component: ({ items, heading, context }) => (
    <>
      {heading ? <h2 className="mb-8 text-2xl font-medium tracking-[-0.5px]">{heading}</h2> : null}
      {items.length ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-12 sm:gap-y-16">{items.map((item) => item.node)}</div>
      ) : (
        <p className="text-neutral-400 text-sm">{context.edit ? "No posts fit what this shows. Change it in its settings." : "No posts yet. Check back soon."}</p>
      )}
    </>
  ),
});

export const posts = defineCollection<Post>({
  layouts: [grid],
  cards: [card],
  posts: async () => (await blog()).getAllPosts().map((p) => ({ ...p, publishedAt: p.date })),
  text: words,
  defaults: { layout: "grid", limit: 24, skipShown: false },
});

export const SECTIONS = [heading, posts];
