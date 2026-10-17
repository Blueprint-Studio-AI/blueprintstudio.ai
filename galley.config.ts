import { defineConfig } from "@blueprint-studio/galley";
import { callout } from "./components/galley/callout";
import { image } from "./components/galley/image";
import { stat } from "./components/galley/stat";
import { youtube } from "./components/galley/youtube";
import { PostFrontmatter } from "./lib/blog-frontmatter";

// Galley for blueprintstudio.ai/insights: where posts live, which components a post may
// use, and the fields at the top of every post. `pnpm galley list` shows the components.

export default defineConfig({
  postsDir: "content/insights",
  componentsDir: "components/galley",
  components: [image, youtube, callout, stat],
  frontmatter: PostFrontmatter,
  media: { dir: "public/insights/media", url: "/insights/media" },
  preview: { baseUrl: "http://localhost:3000", post: "/insights/{slug}", components: "/galley" },
  // Edits wait as drafts (in .galley/drafts/) until they're published; a post that isn't on
  // Insights says draft: true, and is dated when it's first published.
  publish: { draftField: "draft", dateField: "date" },
});
