// service-pages/components/sections/service-page/Solutions.tsx
interface Solution {
    name: string;
    description: string;
    slug: string;
    category: string;
   }
   
   interface SolutionsProps {
    solutions: Solution[];
    viewAllLabel?: string;
   }
   
   export function Solutions({ solutions, viewAllLabel = "View All Solutions" }: SolutionsProps) {
    // Only show first 3 by default
    const featuredSolutions = solutions.slice(0, 3);
   
    return (
      <section className="py-24 bg-gray-50">
        <div className="container">
          <h2 className="text-3xl font-bold">Our Solutions</h2>
          
          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8">
            {featuredSolutions.map((solution) => (
              <div key={solution.slug} className="p-6 bg-white rounded-lg shadow">
                <span className="text-sm text-gray-500">{solution.category}</span>
                <h3 className="mt-2 text-xl font-semibold">{solution.name}</h3>
                <p className="mt-4 text-gray-600">{solution.description}</p>
                <a 
                  href={`/services/web-development/solutions/${solution.slug}`}
                  className="mt-4 inline-block text-primary hover:underline"
                >
                  Learn more →
                </a>
              </div>
            ))}
          </div>
   
          {solutions.length > 3 && (
            <button className="mt-8 text-primary hover:underline">
              {viewAllLabel}
            </button>
          )}
        </div>
      </section>
    )
   }