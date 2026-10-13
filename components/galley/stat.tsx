import { defineComponent, defineContract, src } from "@blueprint-studio/galley";
import { z } from "zod";

// Blueprint's own component: the one figure a section turns on, with its source.

const Stat = defineContract({
  name: "Stat",
  kind: "flow",
  children: "none",
  description:
    "A headline figure with what it measures and where it comes from. Use it for the one number a section turns on, not for every number.",
  props: z.object({
    value: z.string().min(1).max(16).describe('The figure as readers see it: "84%", "$187,500", "3×".'),
    label: z.string().min(1).describe("What the figure measures, in one sentence."),
    source: z.string().optional().describe('Who published it and when, e.g. "6sense, 2025".'),
    href: src().optional().describe("A link to the source."),
  }),
});

export const stat = defineComponent({
  ...Stat,
  examples: [
    {
      title: "With a linked source",
      props: {
        value: "84%",
        label: "of B2B deals are decided before the seller knows a buying journey has started.",
        source: "6sense, 2025",
        href: "https://6sense.com/newsroom/84-of-b2b-deals-are-decided-before-marketers-even-know-about-them/",
      },
    },
  ],
  Component: ({ value, label, source, href }) => (
    <figure className="my-10 border-y border-neutral-200 py-8">
      <p className="text-[clamp(44px,8vw,72px)] font-medium leading-none tracking-[-2px] text-neutral-900">
        {value}
      </p>
      <figcaption className="mt-4 max-w-xl text-base leading-[1.5] text-neutral-600 sm:text-[17px]">
        {label}
        {source ? (
          <span className="mt-2 block text-xs uppercase tracking-wide text-neutral-500">
            {href ? (
              <a
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="underline decoration-neutral-300 underline-offset-2 transition-colors duration-200 hover:decoration-neutral-900"
              >
                {source}
              </a>
            ) : (
              source
            )}
          </span>
        ) : null}
      </figcaption>
    </figure>
  ),
});
