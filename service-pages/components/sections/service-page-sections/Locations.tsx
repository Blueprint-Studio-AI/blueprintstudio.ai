// service-pages/components/sections/service-page/Locations.tsx
interface Location {
    name: string;
    state: string;
    slug: string;
    description: string;
    marketHighlight?: {
      label: string;
      value: string;
    }[];
  }
  
  interface LocationsProps {
    locations: Location[];
    viewAllLabel?: string;
  }
  
  export function Locations({ locations, viewAllLabel = "View All Locations" }: LocationsProps) {
    const featuredLocations = locations.slice(0, 3);
  
    return (
      <section className="py-24 bg-gray-50">
        <div className="container">
          <h2 className="text-3xl font-bold">Service Locations</h2>
          
          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8">
            {featuredLocations.map((location) => (
              <div key={location.slug} className="p-6 bg-white rounded-lg shadow">
                <h3 className="text-xl font-semibold">
                  {location.name}, {location.state}
                </h3>
                <p className="mt-4 text-gray-600">{location.description}</p>
                
                {location.marketHighlight && (
                  <div className="mt-4 grid grid-cols-2 gap-4">
                    {location.marketHighlight.map((highlight, index) => (
                      <div key={index}>
                        <div className="text-2xl font-bold">{highlight.value}</div>
                        <div className="text-sm text-gray-500">{highlight.label}</div>
                      </div>
                    ))}
                  </div>
                )}
                
                <a 
                  href={`/services/web-development/${location.slug}`}
                  className="mt-4 inline-block text-primary hover:underline"
                >
                  Services in {location.name} →
                </a>
              </div>
            ))}
          </div>
  
          {locations.length > 3 && (
            <button className="mt-8 text-primary hover:underline">
              {viewAllLabel}
            </button>
          )}
        </div>
      </section>
    )
  }