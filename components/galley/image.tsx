import { defineComponent } from "@blueprint-studio/galley";
import { Image } from "@blueprint-studio/galley/contracts";

export const image = defineComponent({
  ...Image,
  examples: [
    {
      title: "With a caption",
      props: {
        src: "/insights/untapped-opportunities-in-mining-equipment-sales/hero.png",
        alt: "Mining equipment on a site at dusk",
        width: 1600,
        height: 900,
      },
      children: "Source: [Blueprint Studio](https://blueprintstudio.ai), March 2026",
    },
  ],
  Component: ({ src, alt, width, height, children }) => (
    <figure className="my-10">
      {/* eslint-disable-next-line @next/next/no-img-element -- sized, lazy, and already optimised on import */}
      <img
        src={src}
        alt={alt}
        width={width}
        height={height}
        loading="lazy"
        decoding="async"
        className="h-auto w-full rounded-lg border border-neutral-200 bg-neutral-100"
      />
      {children ? (
        <figcaption className="mt-3 text-sm leading-[1.5] text-neutral-500">{children}</figcaption>
      ) : null}
    </figure>
  ),
});
