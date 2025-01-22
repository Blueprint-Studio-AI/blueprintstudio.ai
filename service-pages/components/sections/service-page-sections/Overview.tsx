// service-pages/components/sections/service-page/Overview.tsx
interface Capability {
    title: string;
    description: string;
    icon?: string;
  }
  
  interface TechStack {
    category: string;
    technologies: string[];
  }
  
  interface OverviewProps {
    capabilities: Capability[];
    approach: {
      title: string;
      description: string;
      steps: string[];
    };
    techStack: TechStack[];
    qualityStandards: string[];
    support: {
      description: string;
      features: string[];
    };
  }
  
  export function Overview({ capabilities, approach, techStack, qualityStandards, support }: OverviewProps) {
    return (
      <section className="py-24">
        <div className="container">
          {/* Core Capabilities */}
          <h2 className="text-3xl font-bold">Core Capabilities</h2>
          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-8">
            {capabilities.map((capability, index) => (
              <div key={index} className="p-6 bg-white rounded-lg shadow">
                {capability.icon && <span className="text-2xl">{capability.icon}</span>}
                <h3 className="mt-4 text-xl font-semibold">{capability.title}</h3>
                <p className="mt-2 text-gray-600">{capability.description}</p>
              </div>
            ))}
          </div>
  
          {/* Development Approach */}
          <div className="mt-16">
            <h2 className="text-3xl font-bold">{approach.title}</h2>
            <p className="mt-4 text-gray-600">{approach.description}</p>
            <div className="mt-8 space-y-4">
              {approach.steps.map((step, index) => (
                <div key={index} className="flex items-start">
                  <span className="flex-shrink-0 w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center">
                    {index + 1}
                  </span>
                  <p className="ml-4 text-gray-600">{step}</p>
                </div>
              ))}
            </div>
          </div>
  
          {/* Tech Stack */}
          <div className="mt-16">
            <h2 className="text-3xl font-bold">Technology Stack</h2>
            <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-8">
              {techStack.map((category, index) => (
                <div key={index} className="p-6 bg-white rounded-lg shadow">
                  <h3 className="text-xl font-semibold">{category.category}</h3>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {category.technologies.map((tech, techIndex) => (
                      <span key={techIndex} className="px-3 py-1 bg-gray-100 rounded-full text-sm">
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
  
          {/* Quality & Support */}
          <div className="mt-16 grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h2 className="text-3xl font-bold">Quality Standards</h2>
              <ul className="mt-6 space-y-4">
                {qualityStandards.map((standard, index) => (
                  <li key={index} className="flex items-center">
                    <span className="text-primary">✓</span>
                    <span className="ml-2">{standard}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h2 className="text-3xl font-bold">Support Structure</h2>
              <p className="mt-4 text-gray-600">{support.description}</p>
              <ul className="mt-6 space-y-4">
                {support.features.map((feature, index) => (
                  <li key={index} className="flex items-center">
                    <span className="text-primary">✓</span>
                    <span className="ml-2">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>
    )
  }