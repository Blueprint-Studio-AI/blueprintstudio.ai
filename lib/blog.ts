import fs from "fs";
import path from "path";
import { splitFrontmatter, validatePost } from "@blueprint-studio/galley";
import galley from "@/galley.config";
import type { PostFrontmatter } from "./blog-frontmatter";

// Insights posts: one MDX file per post in content/insights/, named by slug, managed with
// Galley (galley.config.ts). Every post is validated when the site builds, so a broken
// post fails the build with the file, line and reason instead of reaching readers.

// A literal path, so the build traces only the posts folder.
const BLOG_DIR = path.join(process.cwd(), "content/insights");
if (galley.postsDir !== "content/insights") {
  throw new Error("Galley: update BLOG_DIR to match galley.config.ts");
}

export type BlogPost = {
  slug: string;
  title: string;
  description: string;
  date: string;
  image?: string;
  ogImage: string;
  author: string;
  /** Not on Insights yet: left out of the index and sitemap. Edit mode shows it. */
  draft: boolean;
  /** The post's MDX, without its front matter. */
  content: string;
};

function load(file: string): BlogPost {
  const slug = file.replace(/\.mdx$/, "");
  const source = fs.readFileSync(path.join(BLOG_DIR, file), "utf-8");
  const result = validatePost(source, galley);
  if (!result.ok) {
    const lines = result.errors.map((e) => `  content/insights/${file}:${e.line}:${e.column} ${e.message}`);
    throw new Error(`Galley: ${file} isn't a valid post. Run \`pnpm galley check\` for details.\n${lines.join("\n")}`);
  }
  const f = result.frontmatter as PostFrontmatter;
  return {
    slug,
    title: f.title,
    description: f.description,
    date: f.date,
    image: f.image,
    ogImage: f.ogImage ?? f.image ?? "/og-image.jpg",
    author: f.author,
    draft: f.draft ?? false,
    content: splitFrontmatter(source).body,
  };
}

/** Published posts, newest first; `{ drafts: true }` (edit mode) includes drafts. */
export function getAllPosts({ drafts = false }: { drafts?: boolean } = {}): BlogPost[] {
  return fs
    .readdirSync(BLOG_DIR)
    .filter((f) => f.endsWith(".mdx"))
    .map(load)
    .filter((p) => drafts || !p.draft)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

/** Whether readers may see a post: only once it's published. Edit mode (/insights/<slug>/edit) shows drafts. */
export const isPublic = (post: BlogPost) => !post.draft;

export function getPostBySlug(slug: string): BlogPost | undefined {
  if (!/^[a-z0-9-]+$/.test(slug)) return undefined;
  const file = `${slug}.mdx`;
  if (!fs.existsSync(path.join(BLOG_DIR, file))) return undefined;
  return load(file);
}
