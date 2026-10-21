import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ServicePage from "@/components/services/ServicePage";
import { getService, services } from "@/lib/services";
import { workMetadata } from "@/lib/work";

// One static page per service (lib/services); any other slug is a 404.
export const dynamicParams = false;

export function generateStaticParams() {
  return services.map((s) => ({ service: s.slug }));
}

type Props = { params: Promise<{ service: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const service = getService((await params).service);
  if (!service) return {};
  return workMetadata({
    path: `/services/${service.slug}`,
    title: service.metaTitle,
    description: service.metaDescription,
    image: service.ogImage,
  });
}

export default async function Page({ params }: Props) {
  const service = getService((await params).service);
  if (!service) notFound();

  // The layout already provides WebSite + Organization. No offer: a website on
  // its own has no published price.
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: service.metaTitle,
    serviceType: service.serviceType,
    description: service.metaDescription,
    url: `https://blueprintstudio.ai/services/${service.slug}`,
    areaServed: "Worldwide",
    provider: { "@type": "Organization", name: "Blueprint Studio", url: "https://blueprintstudio.ai" },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
      />
      <ServicePage service={service} />
    </>
  );
}
