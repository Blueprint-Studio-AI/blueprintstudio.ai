import fs from "fs";
import path from "path";
import matter from "gray-matter";

const BLOG_DIR = path.join(process.cwd(), "content/insights");

export type BlogPost = {
  slug: string;
  title: string;
  description: string;
  date: string;
  image: string;
  ogImage: string;
  author: string;
  content: string;
};

export function getAllPosts(): BlogPost[] {
  const files = fs.readdirSync(BLOG_DIR).filter((f) => f.endsWith(".md"));

  const posts = files.map((file) => {
    const slug = file.replace(/\.md$/, "");
    const raw = fs.readFileSync(path.join(BLOG_DIR, file), "utf-8");
    const { data, content } = matter(raw);

    return {
      slug,
      title: data.title,
      description: data.description,
      date: data.date,
      image: data.image,
      ogImage: data.ogImage,
      author: data.author,
      content,
    } as BlogPost;
  });

  return posts.sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );
}

export function getPostBySlug(slug: string): BlogPost | undefined {
  const filePath = path.join(BLOG_DIR, `${slug}.md`);
  if (!fs.existsSync(filePath)) return undefined;

  const raw = fs.readFileSync(filePath, "utf-8");
  const { data, content } = matter(raw);

  return {
    slug,
    title: data.title,
    description: data.description,
    date: data.date,
    image: data.image,
    ogImage: data.ogImage,
    author: data.author,
    content,
  } as BlogPost;
}
