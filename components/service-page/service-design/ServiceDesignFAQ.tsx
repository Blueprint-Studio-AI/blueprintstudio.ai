// components/service-page/service-design/ServiceDesignFAQ.tsx
import { motion } from 'framer-motion';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    question: "What is service design?",
    answer: "Service design is a human-centered approach to improving the quality of interactions between service providers and their users. It involves designing the entire service experience across all touchpoints, both visible to customers and behind-the-scenes, to create seamless, efficient, and satisfying experiences that meet user needs while achieving business goals."
  },
  {
    question: "How much does a service design project cost?",
    answer: "Our service design projects typically range from $5,000 to $100,000+ depending on scope, complexity, and organizational scale. Small-scale service improvements might start at $5,000, while comprehensive service transformations for large organizations can exceed $100,000. We provide detailed quotes after understanding your specific needs and goals."
  },
  {
    question: "How long does a service design project take?",
    answer: "Service design projects typically take 2-6 months from kickoff to implementation planning. Smaller, focused projects may be completed in 4-8 weeks, while complex organizational transformations can take 6-12 months. We'll provide a detailed timeline based on your project scope and requirements."
  },
  {
    question: "What deliverables can I expect from a service design project?",
    answer: "Typical deliverables include research insights, customer journey maps, service blueprints, personas, experience prototypes, implementation roadmaps, and measurement frameworks. We tailor deliverables to your specific needs and ensure they're actionable for your organization."
  },
  {
    question: "How is service design different from UX design?",
    answer: "While UX design typically focuses on digital interfaces and products, service design takes a holistic view of the entire service ecosystem, including physical spaces, people, processes, and digital touchpoints. Service design considers both the customer-facing experience and the behind-the-scenes operations needed to deliver the service effectively."
  },
  {
    question: "How do you measure the success of service design?",
    answer: "We establish clear metrics at the beginning of each project aligned with your business goals. Common measurements include customer satisfaction scores, Net Promoter Score (NPS), efficiency metrics (time/cost savings), employee satisfaction, conversion rates, and financial impact. We help implement measurement frameworks to track ongoing performance."
  },
  {
    question: "Do you work with internal teams during service design projects?",
    answer: "Yes, we believe collaboration with your internal teams is essential for successful service design. We typically work closely with stakeholders across departments, conduct co-creation workshops, and transfer knowledge throughout the process to ensure organizational buy-in and capability building."
  },
  {
    question: "How do you ensure service design changes are successfully implemented?",
    answer: "We focus on implementation planning from the beginning, creating realistic roadmaps, providing change management support, developing training materials, and offering ongoing guidance during rollout. We can also establish governance structures and measurement frameworks to ensure sustained success."
  }
];

export function ServiceDesignFAQ() {
  return (
    <section className="py-24">
      <div className="container px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">
              Common Questions About Service Design
            </h2>
            <p className="text-muted-foreground">
              Everything you need to know about working with our service design team
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
                Have more questions? We&apos;re here to help.
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