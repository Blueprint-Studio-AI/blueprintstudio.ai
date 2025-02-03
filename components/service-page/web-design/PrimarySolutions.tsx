import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { Building2, Rocket, ShoppingCart, Code, Search } from 'lucide-react';

const solutions = [
  {
    name: "Small Business",
    price: "Starting from $2,999",
    image: "/images/solutions/small-business.webp",
    className: "col-span-1 row-span-2 md:col-span-2",
    icon: Building2
  },
  {
    name: "Startup Sites",
    price: "Starting from $3,999",
    image: "/images/solutions/startup.webp",
    className: "col-span-1 row-span-1",
    icon: Rocket
  },
  {
    name: "E-commerce",
    price: "Starting from $4,999",
    image: "/images/solutions/ecommerce.webp",
    className: "col-span-1 row-span-1",
    icon: ShoppingCart
  },
  {
    name: "MVP Prototype",
    price: "Starting from $10k",
    image: "/images/solutions/mvp.webp",
    className: "col-span-1 row-span-1 md:col-span-2",
    icon: Code
  },
  {
    name: "Find Your Solution",
    price: "",
    image: "/images/solutions/mvp.webp",
    className: "col-span-1 row-span-1 md:col-span-1",
    link: "#solution-finder",
    icon: Search
  }
];

export function PrimarySolutions() {
  const SolutionContent = ({ solution, index }: { solution: typeof solutions[0], index: number }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1 }}
      className="p-6 h-full flex flex-col justify-between"
    >
      <div>
        <h3 className="text-xl font-medium mb-2">{solution.name}</h3>
        <p className="text-gray-600 text-sm">{solution.price}</p>
      </div>

      <div className="mt-4 flex justify-between items-end">
        <div className="relative w-24 h-24">
          <solution.icon className="w-6 h-6 text-gray-600 absolute bottom-0 left-0" />
        </div>
        {solution.link && (
          <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-gray-600 transition-colors" />
        )}
      </div>
    </motion.div>
  );

  return (
    <section id="solutions" className="py-24">
      <div className="container px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold mb-12">Popular Company Solutions</h2>
          
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {solutions.map((solution, index) => (
              solution.link ? (
                <motion.div
                  key={solution.name}
                  whileHover={{ scale: 1.02 }}
                  className={`relative overflow-hidden rounded-3xl bg-gray-50 ${solution.className}`}
                >
                  <Link
                    href={solution.link}
                    className="group block h-full hover:bg-gray-100 transition-all duration-300"
                  >
                    <SolutionContent solution={solution} index={index} />
                  </Link>
                </motion.div>
              ) : (
                <div
                  key={solution.name}
                  className={`relative overflow-hidden rounded-3xl bg-gray-50 ${solution.className}`}
                >
                  <SolutionContent solution={solution} index={index} />
                </div>
              )
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}