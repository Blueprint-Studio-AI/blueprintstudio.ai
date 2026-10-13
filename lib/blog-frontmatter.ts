import { src } from "@blueprint-studio/galley";
import { z } from "zod";

// The fields at the top of every Insights post (content/insights/*.mdx).

export const PostFrontmatter = z
  .object({
    title: z.string().min(1),
    description: z
      .string()
      .min(1)
      .describe("One or two sentences, shown under the title, on the index and in search results."),
    date: z.iso.date().describe("Publish date, YYYY-MM-DD."),
    image: src().optional().describe("Hero image at the top of the post, 16:9."),
    ogImage: src().optional().describe("Social card, 1200×630. Falls back to the hero image."),
    author: z.string().min(1).default("Blueprint Studio"),
  })
  .strict();

export type PostFrontmatter = z.infer<typeof PostFrontmatter>;
