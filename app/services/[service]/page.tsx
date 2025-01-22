// app/services/[service]/page.tsx
import { ServicePage } from '@/service-components/templates/ServicePage'
import { getServiceData, getAllServices } from '@/service-lib/data'

interface ServicePageProps {
  params: {
    service: string;
  };
}

export default async function Service({ params }: ServicePageProps) {
  const serviceData = await getServiceData(params.service)
  return <ServicePage data={serviceData} />
}

export async function generateStaticParams() {
  const services = await getAllServices()
  return services.map((service) => ({
    service: service.slug,
  }))
}