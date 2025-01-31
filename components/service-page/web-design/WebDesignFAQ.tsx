// components/service-page/web-design/WebDesignFAQ.tsx
import { motion } from 'framer-motion';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    question: "How much does professional web design cost?",
    answer: "Our web design projects can range from $899 to $60,000+ depending on complexity and requirements. A simple single page site starts at $899, while custom web applications or seo optomized e-commerce solutions may range are more expensive. We provide detailed quotes after understanding your specific needs and goals."
  },
  {
    question: "How long does it take to design and launch a website?",
    answer: "Simple single page sites can be completed in a day. Complex projects with hundreds of pages can take over 8 months. Most business websites take 4-8 weeks from kickoff to launch. We'll provide a detailed timeline based on your project scope and requirements."
  },
  {
    question: "Do you provide ongoing website maintenance?",
    answer: "Yes, we offer flexible maintenance plans to keep your website secure, updated, and performing optimally. This includes regular updates, security monitoring, performance optimization, content updates, and technical support. Maintence plans are not required and we can tailor a maintenance plan to your specific needs if desired."
  },
  {
    question: "Will my website be mobile-friendly and responsive?",
    answer: "Absolutely. Every website we design is fully responsive and optimized for all devices - mobile phones, tablets, laptops, and desktops. We follow mobile-first design principles to ensure an exceptional user experience across all screen sizes."
  },
  {
    question: "Do you help with website content and SEO?",
    answer: "Yes, we provide comprehensive content strategy and SEO services as part of our web design process. This includes keyword research, content planning, copywriting, meta tag optimization, and technical SEO implementation to help your website rank well in search results."
  },
  {
    question: "What is your web design process like?",
    answer: "Our process begins with in-depth discovery to understand your goals and requirements. We then move through strategic planning, user experience design, visual design, development, and testing phases. We maintain clear communication throughout, with regular updates and opportunities for feedback."
  },
  {
    question: "Can you redesign my existing website?",
    answer: "Yes, we specialize in website redesigns. We'll analyze your current site's performance, identify improvement opportunities, and create a modern, effective design while preserving your existing SEO value and implementing new optimizations."
  },
  {
    question: "What platforms and technologies do you use?",
    answer: "We choose the best technology for each project's needs. We work with modern platforms like Next.js, React, and TypeScript for custom development; Framer, WordPress, and Webflow for content-managed sites; and Shopify for e-commerce. All our solutions prioritize performance, security, and scalability."
  }
];

export function WebDesignFAQ() {
  return (
    <section className="py-24">
      <div className="container px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">
              Common Questions About Web Design
            </h2>
            <p className="text-muted-foreground">
              Everything you need to know about working with our design team
            </p>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="space-y-4"
          >
            <Accordion type="single" collapsible className="w-full">
              {faqs.map((faq, index) => (
                <AccordionItem key={index} value={`item-${index}`}>
                  <AccordionTrigger className="text-left">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </motion.div>

          {/* Call to Action */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="mt-16 text-center"
          >
            <p className="text-muted-foreground mb-4">
              Have more questions? We're here to help.
            </p>
            <button
              onClick={() => window.open('https://cal.com/blueprint-studio/intro-call', '_blank')}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full 
                bg-primary text-white hover:bg-primary/90 transition-colors"
            >
              Schedule a Free Consultation
            </button>
          </motion.div>
        </div>
      </div>
    </section>
  );
}