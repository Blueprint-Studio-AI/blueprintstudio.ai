// components/service-page/service-design/ServiceDesignTestimonials.tsx
import { motion } from 'framer-motion';
import { Quote } from 'lucide-react';
import Image from 'next/image';

const testimonials = [
  {
    quote: "Blueprint Studio's service design approach completely transformed our patient experience. Their methodical process uncovered insights we had missed for years.",
    author: "Dr. Sarah Chen",
    title: "Chief Experience Officer, Regional Health Network",
    image: "/images/testimonials/sarah-chen.jpg",
    logo: "/images/testimonials/health-logo.svg"
  },
  {
    quote: "Their service design expertise helped us streamline our customer onboarding process, resulting in dramatically improved conversion rates and customer satisfaction.",
    author: "Michael Rodriguez",
    title: "VP of Customer Experience, Financial Services Inc.",
    image: "/images/testimonials/michael-rodriguez.jpg",
    logo: "/images/testimonials/finance-logo.svg"
  },
  {
    quote: "Blueprint Studio's service design team helped us reimagine our citizen services from the ground up. The results have exceeded all our expectations.",
    author: "Emily Foster",
    title: "Director of Digital Transformation, City Government",
    image: "/images/testimonials/emily-foster.jpg",
    logo: "/images/testimonials/government-logo.svg"
  }
];

export function ServiceDesignTestimonials() {
  return (
    <section className="py-24 relative overflow-hidden">
      <div className="container px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">
              Trusted by Leading Organizations
            </h2>
            <p className="text-muted-foreground">
              See what our clients say about our service design expertise
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-3 md:gap-4 lg:gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={testimonial.author}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ 
                  delay: index * 0.2,
                  duration: 0.5
                }}
                className={`relative p-8 rounded-2xl border bg-background/50 backdrop-blur-sm
                  hover:border-primary/20 transition-all duration-300
                  ${index === 1 ? 'md:translate-y-8' : ''}`}
              >
                <div className="absolute -top-3 -left-3">
                  <div className="p-2 rounded-full bg-primary/5 border border-primary/10">
                    <Quote className="w-4 h-4 text-primary" />
                  </div>
                </div>

                <div className="flex flex-col justify-between h-full">
                  <div className="mb-6">
                    <p className="text-lg leading-relaxed">
                      &quot;{testimonial.quote}&quot;
                    </p>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="relative w-12 h-12 rounded-full overflow-hidden bg-primary/5">
                      {/* Uncomment when you have images */}
                      {/* <Image
                        src={testimonial.image}
                        alt={testimonial.author}
                        fill
                        className="object-cover"
                      /> */}
                    </div>
                    
                    <div>
                      <div className="font-medium">{testimonial.author}</div>
                      <div className="text-sm text-muted-foreground">
                        {testimonial.title}
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="mt-16 text-center"
          >
            <p className="text-sm text-muted-foreground">
              Trusted by organizations worldwide • 50+ successful service transformations • 96% client satisfaction
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}