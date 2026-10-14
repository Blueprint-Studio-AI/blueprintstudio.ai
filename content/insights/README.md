# Insights posts

One MDX file per post, named by its slug: `content/insights/<slug>.mdx` is served at
`/insights/<slug>`. The site uses [Galley](https://github.com/Blueprint-Studio-AI/galley):
posts are Markdown plus the components in `components/galley/`, and nothing else (no HTML,
no `{expressions}`, no imports). Every post is checked when the site builds.

```bash
pnpm galley check [--fix]   # check every post; --fix rewrites the format
pnpm galley list            # the components a post can use, with their props
pnpm galley preview <slug>  # a screenshot of the post (needs `pnpm dev` running)
```

Agents: `.mcp.json` starts `galley mcp`, with tools to list, read, edit, check and preview
posts and import images. `/galley` on the running site shows every component. The full
guide, including how to add a component, is in `AGENTS.md` at the repo root.

Front matter (`lib/blog-frontmatter.ts`): `title`, `description`, `date` (YYYY-MM-DD),
optional `image` (16:9 hero) and `ogImage` (1200×630, falls back to the hero), `author`.
New images go in `public/insights/media/` as WebP; older posts keep theirs in
`public/insights/<slug>/`. After changing a component or the front matter, run
`pnpm galley manifest` and commit `.galley/manifest.json`.
