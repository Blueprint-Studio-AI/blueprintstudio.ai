import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ClientPage from "@/components/work/ClientPage";
import { clientPages, madeFor, workMetadata } from "@/lib/work";

// One static page per client with three or more pieces of work to show
// (lib/work); any other slug is a 404.
export const dynamicParams = false;

export function generateStaticParams() {
  return clientPages.map((c) => ({ client: c.slug }));
}

type Props = { params: Promise<{ client: string }> };

const find = (slug: string) => clientPages.find((c) => c.slug === slug);

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const client = find((await params).client);
  if (!client) return {};
  return workMetadata({
    path: `/work/clients/${client.slug}`,
    title: `${client.name}: ${madeFor(client)}`,
    description: client.summary ?? `${client.name}, ${client.years}: ${madeFor(client)} by Blueprint Studio.`,
  });
}

export default async function Page({ params }: Props) {
  const client = find((await params).client);
  if (!client) notFound();
  return <ClientPage client={client} />;
}
