import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ServicePage from "@/components/services/ServicePage";
import { getService, plainText, services } from "@/lib/services";
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

  // The layout already provides WebSite + Organization. The Service carries an
  // Offer only for a price the page publishes for the service itself (a
  // website on its own has none); the FAQPage repeats the questions shown.
  const url = `https://blueprintstudio.ai/services/${service.slug}`;
  const offers = service.pricing.options.flatMap((option) =>
    option.offerPrice
      ? [
          {
            "@type": "Offer",
            name: option.name,
            price: String(option.offerPrice),
            priceCurrency: "USD",
            url,
            availability: "https://schema.org/InStock",
          },
        ]
      : []
  );
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Service",
        "@id": `${url}#service`,
        name: service.metaTitle,
        serviceType: service.serviceType,
        description: service.metaDescription,
        url,
        areaServed: "Worldwide",
        provider: { "@type": "Organization", name: "Blueprint Studio", url: "https://blueprintstudio.ai" },
        ...(offers.length > 0 ? { offers: offers.length === 1 ? offers[0] : offers } : {}),
      },
      {
        "@type": "FAQPage",
        "@id": `${url}#faq`,
        mainEntity: service.faqs.map((faq) => ({
          "@type": "Question",
          name: faq.question,
          acceptedAnswer: { "@type": "Answer", text: plainText(faq.answer) },
        })),
      },
    ],
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
