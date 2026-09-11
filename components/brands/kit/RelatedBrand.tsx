"use client";

// Sibling-brand hand-off (brand.related) — a page whose identity descends from,
// or spawns, another closes by pointing at it. Same-site route, so it's a plain
// link rather than a download or an off-site jump.
import { useBrand } from "@/components/brands/kit/BrandContext";
import Button from "@/components/brands/kit/ui/Button";
import { LinkIcon } from "@/components/brands/kit/ui/icons";

export default function RelatedBrand() {
  const { related } = useBrand();
  if (!related) return null;
  return (
    <section id="related" className="border-t border-line px-edge py-section">
      <div className="flex items-center justify-between gap-6 max-[600px]:flex-col max-[600px]:items-start max-[600px]:gap-5">
        <div className="flex flex-col gap-2">
          <span className="text-label uppercase text-muted-2">{related.eyebrow}</span>
          <h2 className="text-title font-medium text-ink max-[860px]:text-title-mobile">{related.name}</h2>
          <p className="max-w-measure text-body-lg text-body">{related.blurb}</p>
        </div>
        <Button variant="pill" href={related.href} className="gap-2.5 !text-label">
          {related.cta}
          <LinkIcon />
        </Button>
      </div>
    </section>
  );
}
