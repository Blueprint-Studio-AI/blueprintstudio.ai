# blueprintstudio.ai

Blueprint Studio's marketing site: Next.js 16 (App Router), Tailwind CSS 3, TypeScript,
deployed on Vercel. `README.md` covers running it locally and the brand pages.

## Blog (Insights) with Galley

The blog at `/insights` runs on Galley (`@blueprint-studio/galley`). A post is one MDX
file: Markdown plus the site's own components, and nothing else. Every post is checked
when the site builds, and a post that breaks a rule fails the build with the file, line
and reason.

### Where things live

| What | Where |
|---|---|
| Posts, one file per post | `content/insights/<slug>.mdx`, served at `/insights/<slug>` |
| Posts folder, components, media folder, preview URLs | `galley.config.ts` |
| Components a post can use (Image, YouTube, Callout, Stat) | `components/galley/` |
| How plain Markdown looks (headings, lists, links, tables) | `components/galley/elements.tsx` |
| Front matter schema | `lib/blog-frontmatter.ts` |
| Loader, which checks every post at build | `lib/blog.ts` |
| Images | `public/insights/media/` (older posts: `public/insights/<slug>/`) |
| Components and front matter as JSON Schema, for agents and CI | `.galley/manifest.json` (generated) |
| The Galley package the site installs | `vendor/blueprint-studio-galley-<version>.tgz` |
| Every component with its examples | `/galley` on the running site |
| A visual editor for posts (dev only) | `/galley/edit` |

### Commands

```bash
pnpm galley check                  # every post and component example; exits 1 on any problem
pnpm galley check --fix            # same, and rewrites posts into the canonical format
pnpm galley list                   # the components a post can use, with their props
pnpm galley preview <slug>         # screenshot of a post; needs `pnpm dev` running
pnpm galley preview --components   # screenshot of /galley; add --mobile for phone width
pnpm galley manifest               # rewrite .galley/manifest.json
pnpm galley add <name>             # copy a starter component into components/galley/
```

### Editing posts with the MCP tools

`.mcp.json` starts `galley mcp` from `./node_modules/.bin/galley`. Don't change it to
`pnpm galley mcp`: pnpm prints a banner on stdout, which breaks the protocol.

- `list_components`: what each component is for, its props and an example. Call it before
  using a component.
- `list_posts`: every post, whether it passes, and its revision.
- `read_post`: a post with numbered lines and its revision.
- `edit_post`: replaces exact text. Copy `oldString` from `read_post` without the line
  numbers, and pass the revision. It's refused if the post changed since you read it.
- `write_post`: creates a post (no revision) or replaces a whole one (with its revision).
- `check_post`: checks MDX without saving it.
- `import_media`: downloads an https image into `public/insights/media/` as optimised WebP
  and returns its path, width and height.
- `preview`: screenshots of a post, or of `/galley`, on the running dev site.

Every save is checked first. A failed check returns line-numbered errors and saves
nothing. Without the MCP server, edit the files directly and run `pnpm galley check`.

### Rules

- Use only the components registered in `galley.config.ts`. Check `pnpm galley list` or
  `list_components` first. Props take plain values: text, numbers, true/false, lists.
- No HTML tags, no `{expressions}`, no `import` or `export`. To show a literal brace,
  write `\{`. Links must be `https://`, `http://`, `mailto:`, `tel:` or a path.
- Name the file by its slug: lowercase letters, digits and hyphens. `galley check` also
  accepts `_`, but `lib/blog.ts` doesn't, so such a post would 404.
- Keep the front matter valid. The fields are `title`, `description` (one or two
  sentences), `date` (`YYYY-MM-DD`), optional `image` (16:9 hero), optional `ogImage`
  (1200×630, falls back to the hero) and `author` (defaults to "Blueprint Studio"). Any
  other field fails the check.
- Run `pnpm galley check` before committing. CI runs it on every pull request that touches
  the blog (`.github/workflows/galley.yml`).
- After changing a component, `galley.config.ts` or `lib/blog-frontmatter.ts`, run
  `pnpm galley manifest` and commit `.galley/manifest.json`. CI fails if it's out of date.
- If a post fails, fix the post. Don't edit `lib/blog.ts`, the renderer or the Galley
  package to make it pass, and don't loosen a component's props to fit one post.

### Adding a component

1. Copy a starter with `pnpm galley add <name>` (image, youtube, tweet, link-card, video,
   file, callout). It's the site's code from then on; restyle it to match. Or write a new
   file with `defineComponent`: a name, `kind` (`flow` on its own line, `text` inside a
   sentence), `children` (`none`, `inline` or `blocks`), a description, a zod `props`
   contract, at least one example and the React component. `components/galley/stat.tsx`
   is one written from scratch.
2. Put interactive parts in a separate `"use client"` file that the component renders, as
   `youtube.tsx` does with `youtube-player.tsx`.
3. Register it in `components` in `galley.config.ts`.
4. Run `pnpm galley check` (it checks the examples too) and `pnpm galley manifest`.
5. Look at it on `/galley`, or with `pnpm galley preview --components`, at desktop and
   phone width.

### Images

- From a URL, for example an image made with Blueprint's Asset Generator: call
  `import_media` and use the path, width and height it returns.
- By hand: save a WebP in `public/insights/media/` and reference it as
  `/insights/media/<file>.webp`, with its width and height.
- Always write `alt` text.

```mdx
<Image src="/insights/media/images/2026/10/chart-1a2b3c.webp" alt="What the chart shows" width={1600} height={900}>
  Source: [Blueprint Studio](https://blueprintstudio.ai), October 2026
</Image>
```

### Checking how it looks

Run `pnpm dev`, then open `/insights/<slug>`, call `preview`, or run
`pnpm galley preview <slug>` (add `--mobile` for phone width). Check both widths after
adding images, tables or components. Screenshots are saved as `.galley/preview-*.jpg`;
don't commit them.
