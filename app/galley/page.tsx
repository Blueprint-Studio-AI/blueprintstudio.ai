import type { Metadata } from "next";
import { exampleMdx, listComponents } from "@blueprint-studio/galley";
import { renderPost } from "@blueprint-studio/galley/render";
import { elements } from "@/components/galley/elements";
import galley from "@/galley.config";

// Every component an Insights post can use, with its props and its examples rendered for
// real. It's where people and agents see the kit (`galley preview --components`
// screenshots it), and it isn't indexed.

export const metadata: Metadata = {
  title: "Insights components",
  robots: { index: false, follow: false },
};

export default function ComponentGallery() {
  const docs = new Map(listComponents(galley).map((c) => [c.name, c]));
  return (
    <main className="bg-neutral-50 px-4 pb-24 pt-28 sm:px-6 sm:pt-32">
      <div className="mx-auto flex max-w-2xl min-w-0 flex-col gap-16">
        <header className="flex flex-col gap-4">
          <p className="text-xs font-medium uppercase tracking-wide text-neutral-400">Galley</p>
          <h1 className="text-[clamp(32px,6vw,52px)] font-medium leading-[1.15] tracking-[-1.5px] text-black">
            Insights components
          </h1>
          <p className="text-base leading-[1.5] text-neutral-500 sm:text-lg">
            Every component a post can use, with its props and an example. Posts write them as
            MDX, exactly as shown.
          </p>
        </header>

        {galley.components.map((c) => {
          const doc = docs.get(c.name)!;
          return (
            <section
              key={c.name}
              id={c.name.toLowerCase()}
              className="flex min-w-0 flex-col gap-6 border-t border-neutral-200 pt-10"
            >
              <div className="flex flex-col gap-2">
                <h2 className="text-2xl font-medium tracking-[-0.5px] text-neutral-900">
                  &lt;{c.name}&gt;
                </h2>
                <p className="text-neutral-500">{c.description}</p>
                <p className="text-xs uppercase tracking-wide text-neutral-400">
                  {doc.placement} · {doc.content}
                </p>
              </div>
              <dl className="grid grid-cols-[auto_1fr] gap-x-6 gap-y-2 text-[15px]">
                {Object.entries(doc.props).map(([name, p]) => (
                  <div key={name} className="contents">
                    <dt className="font-mono text-[13px] text-neutral-900">
                      {name}
                      {p.optional ? "?" : ""}
                    </dt>
                    <dd className="min-w-0 text-neutral-500">
                      {[p.type, p.description].filter(Boolean).join(" · ")}
                    </dd>
                  </div>
                ))}
              </dl>
              {(c.examples ?? []).map((example, i) => {
                const mdx = exampleMdx(c.name, c.kind, example);
                return (
                  <div key={i} className="flex min-w-0 flex-col gap-4">
                    {example.title ? (
                      <p className="text-xs uppercase tracking-wide text-neutral-400">{example.title}</p>
                    ) : null}
                    <pre className="max-w-full overflow-x-auto rounded-lg border border-neutral-200 bg-white p-4 font-mono text-[13px] leading-relaxed">
                      <code>{mdx}</code>
                    </pre>
                    <div className="min-w-0 space-y-6">{renderPost(mdx, galley, { elements })}</div>
                  </div>
                );
              })}
            </section>
          );
        })}
      </div>
    </main>
  );
}
