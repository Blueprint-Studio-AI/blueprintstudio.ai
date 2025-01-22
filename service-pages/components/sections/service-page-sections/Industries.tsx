// service-pages/components/sections/service-page/Industries.tsx
interface Industry {
    name: string;
    description: string;
    slug: string;
    benefits: string[];
    metrics?: {
      label: string;
      value: string;
    }[];
  }
  
  interface IndustriesProps {
    industries: Industry[];
    viewAllLabel?: string;
  }
  
  export function Industries({ industries, viewAllLabel = "View All Industries" }: IndustriesProps) {
    const featuredIndustries = industries.slice(0, 3);
  
    return (
      <section className="py-24">
        <div className="container">
          <h2 className="text-3xl font-bold">Industries We Serve</h2>
          
          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8">
            {featuredIndustries.map((industry) => (
              <div key={industry.slug} className="p-6 bg-white rounded-lg shadow">
                <h3 className="text-xl font-semibold">{industry.name}</h3>
                <p className="mt-4 text-gray-600">{industry.description}</p>
                
                {industry.benefits && (
                  <ul className="mt-4 space-y-2">
                    {industry.benefits.slice(0, 2).map((benefit, index) => (
                      <li key={index} className="flex items-center">
                        <span className="text-primary">✓</span>
                        <span className="ml-2 text-sm">{benefit}</span>
                      </li>
                    ))}
                  </ul>
                )}
  
                {industry.metrics && (
                  <div className="mt-4 grid grid-cols-2 gap-4">
                    {industry.metrics.map((metric, index) => (
                      <div key={index}>
                        <div className="text-2xl font-bold">{metric.value}</div>
                        <div className="text-sm text-gray-500">{metric.label}</div>
                      </div>
                    ))}
                  </div>
                )}
                
                <a 
                  href={`/services/web-development/${industry.slug}`}
                  className="mt-4 inline-block text-primary hover:underline"
                >
                  Learn more →
                </a>
              </div>
            ))}
          </div>
  
          {industries.length > 3 && (
            <button className="mt-8 text-primary hover:underline">
              {viewAllLabel}
            </button>
          )}
        </div>
      </section>
    )
  }