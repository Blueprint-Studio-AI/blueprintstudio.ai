// service-pages/components/sections/service-page/WhyChooseUs.tsx
interface Differentiator {
    title: string;
    description: string;
    icon?: string;
  }
  
  interface Metric {
    value: string;
    label: string;
    description?: string;
  }
  
  interface WhyChooseUsProps {
    title?: string;
    description?: string;
    differentiators: Differentiator[];
    expertise: {
      description: string;
      highlights: string[];
    };
    benefits: string[];
    metrics: Metric[];
  }
  
  export function WhyChooseUs({ 
    title = "Why Choose Us",
    description,
    differentiators,
    expertise,
    benefits,
    metrics 
  }: WhyChooseUsProps) {
    return (
      <section className="py-24 bg-gray-50">
        <div className="container">
          <h2 className="text-3xl font-bold">{title}</h2>
          {description && <p className="mt-4 text-gray-600">{description}</p>}
  
          {/* Key Differentiators */}
          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8">
            {differentiators.map((diff, index) => (
              <div key={index} className="p-6 bg-white rounded-lg shadow">
                {diff.icon && <span className="text-2xl">{diff.icon}</span>}
                <h3 className="mt-4 text-xl font-semibold">{diff.title}</h3>
                <p className="mt-2 text-gray-600">{diff.description}</p>
              </div>
            ))}
          </div>
  
          {/* Expertise & Benefits */}
          <div className="mt-16 grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-2xl font-semibold">Our Expertise</h3>
              <p className="mt-4 text-gray-600">{expertise.description}</p>
              <ul className="mt-6 space-y-4">
                {expertise.highlights.map((highlight, index) => (
                  <li key={index} className="flex items-center">
                    <span className="text-primary">✓</span>
                    <span className="ml-2">{highlight}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="text-2xl font-semibold">Key Benefits</h3>
              <ul className="mt-6 space-y-4">
                {benefits.map((benefit, index) => (
                  <li key={index} className="flex items-center">
                    <span className="text-primary">✓</span>
                    <span className="ml-2">{benefit}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
  
          {/* Success Metrics */}
          <div className="mt-16">
            <h3 className="text-2xl font-semibold">Success Metrics</h3>
            <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-8">
              {metrics.map((metric, index) => (
                <div key={index} className="text-center">
                  <div className="text-3xl font-bold text-primary">{metric.value}</div>
                  <div className="mt-2 font-medium">{metric.label}</div>
                  {metric.description && (
                    <div className="mt-1 text-sm text-gray-600">{metric.description}</div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    )
  }