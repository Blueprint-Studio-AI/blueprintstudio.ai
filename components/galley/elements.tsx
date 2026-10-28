import type { Elements } from "@blueprint-studio/galley/render";

// How plain Markdown looks in an Insights post: headings, paragraphs, lists, links. Posts
// write ordinary Markdown; these give it the site's type. Headings arrive with the ids
// that the post's table of contents links to.

const external = (href?: string) => Boolean(href && /^https?:\/\//.test(href));

export const elements: Elements = {
  h2: ({ id, children }) => (
    <h2
      id={id}
      className="mb-5 mt-14 scroll-mt-24 text-2xl font-medium tracking-[-0.5px] text-neutral-900 sm:text-3xl"
    >
      {children}
    </h2>
  ),
  h3: ({ id, children }) => (
    <h3
      id={id}
      className="mb-3 mt-10 scroll-mt-24 text-lg font-medium tracking-[-0.3px] text-neutral-900 sm:text-xl"
    >
      {children}
    </h3>
  ),
  p: ({ children }) => (
    <p className="text-base leading-[1.75] text-neutral-600 sm:text-[17px]">{children}</p>
  ),
  strong: ({ children }) => <strong className="font-medium text-neutral-900">{children}</strong>,
  ul: ({ children }) => (
    <ul className="my-4 list-disc pl-5 marker:text-neutral-400">{children}</ul>
  ),
  ol: ({ children, start }) => (
    <ol start={start} className="my-4 list-decimal pl-5 marker:text-neutral-400">
      {children}
    </ol>
  ),
  li: ({ children }) => (
    <li className="mb-2 text-base leading-[1.75] text-neutral-600 sm:text-[17px]">{children}</li>
  ),
  blockquote: ({ children }) => (
    <blockquote className="my-8 border-l-2 border-neutral-300 pl-5 italic text-neutral-500">
      {children}
    </blockquote>
  ),
  a: ({ href, children }) => (
    <a
      href={href}
      {...(external(href) ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      className="text-neutral-900 underline decoration-neutral-300 underline-offset-2 transition-colors duration-200 hover:decoration-neutral-900"
    >
      {children}
    </a>
  ),
  pre: ({ children }) => (
    <pre className="my-6 overflow-x-auto rounded-lg border border-neutral-200 bg-neutral-100 p-4 text-sm">
      {children}
    </pre>
  ),
  code: ({ children, className }) =>
    className?.includes("language-") ? (
      <code className={className}>{children}</code>
    ) : (
      <code className="rounded border border-neutral-200 bg-neutral-100 px-1.5 py-0.5 text-sm text-neutral-800">
        {children}
      </code>
    ),
  hr: () => <hr className="my-10 border-neutral-200" />,
  table: ({ children }) => (
    <div className="my-8 overflow-x-auto">
      <table className="w-full border-collapse text-left text-sm sm:text-base">{children}</table>
    </div>
  ),
  th: ({ children }) => (
    <th className="border-b border-neutral-300 py-2 pr-4 font-medium text-neutral-900">{children}</th>
  ),
  td: ({ children }) => (
    <td className="border-b border-neutral-200 py-2 pr-4 align-top text-neutral-600">{children}</td>
  ),
  img: ({ src, alt }) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={src} alt={alt || ""} className="my-8 h-auto max-w-full rounded-lg" />
  ),
};
