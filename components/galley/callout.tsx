import { defineComponent } from "@blueprint-studio/galley";
import { Callout } from "@blueprint-studio/galley/contracts";

const TONE = {
  note: "border-neutral-200 bg-white",
  tip: "border-neutral-900 bg-white",
  warning: "border-amber-300 bg-amber-50",
} as const;

export const callout = defineComponent({
  ...Callout,
  examples: [
    {
      title: "A tip",
      props: { tone: "tip", title: "Start with the website" },
      children: "It handles the 70% of the buying journey that happens before anyone contacts you.",
    },
  ],
  Component: ({ tone = "note", title, children }) => (
    <aside className={`my-8 rounded-lg border p-5 sm:p-6 [&>*+*]:mt-3 ${TONE[tone]}`}>
      <p className="text-xs font-medium uppercase tracking-wide text-neutral-400">{title ?? tone}</p>
      {children}
    </aside>
  ),
});
