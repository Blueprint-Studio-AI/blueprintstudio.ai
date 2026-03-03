// components/service-page/service-design/ServiceDesignPricing.tsx
import { useState } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, ArrowUpRight } from 'lucide-react';
import Image from 'next/image';

// For SVGs, we'll use regular img tags instead of Next.js Image component
const previewImages = {
  calendar: "data:image/svg+xml,%3Csvg width='200' height='150' viewBox='0 0 200 150' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Crect width='200' height='150' fill='%23F3F4F6'/%3E%3Crect x='20' y='20' width='160' height='110' rx='4' fill='white'/%3E%3Crect x='30' y='40' width='140' height='20' rx='2' fill='%23E5E7EB'/%3E%3Crect x='30' y='70' width='140' height='20' rx='2' fill='%23E5E7EB'/%3E%3Crect x='30' y='100' width='140' height='20' rx='2' fill='%23E5E7EB'/%3E%3C/svg%3E",
  chat: "data:image/svg+xml,%3Csvg width='200' height='150' viewBox='0 0 200 150' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Crect width='200' height='150' fill='%23F3F4F6'/%3E%3Crect x='20' y='20' width='160' height='110' rx='4' fill='white'/%3E%3Crect x='30' y='90' width='140' height='30' rx='15' fill='%23E5E7EB'/%3E%3Crect x='30' y='40' width='100' height='20' rx='10' fill='%23E5E7EB'/%3E%3C/svg%3E"
};

const subscriptionFeatures = [
  {
    title: "Dedicated service design team",
    description: "Expert designers and researchers"
  },
  {
    title: "Ongoing service evolution",
    description: "Continuous improvement approach"
  },
  {
    title: "Priority support",
    description: "24/7 access to your project manager"
  },
  {
    title: "Implementation guidance",
    description: "Support throughout rollout"
  }
];

const projectFeatures = [
    {
      title: "Comprehensive research",
      description: "Deep user & context understanding"
    },
    {
      title: "Service blueprinting",
      description: "End-to-end service mapping"
    },
    {
      title: "Experience design",
      description: "Touchpoint & journey design"
    },
    {
      title: "Implementation roadmap",
      description: "Clear path to execution"
    }
  ];

const pricingFaqs = [
    {
      question: "What factors influence service design project costs?",
      answer: "Service design project costs are influenced by scope (single service vs. organization-wide), complexity (number of touchpoints and stakeholders), research requirements, implementation support needs, and timeline constraints. We provide transparent pricing based on these factors."
    },
    {
      question: "Do you offer phased service design approaches?",
      answer: "Yes, we often structure service design projects in phases to manage costs and demonstrate value early. Typical phases include initial research and discovery, concept development, detailed design, and implementation support. Each phase can be contracted separately."
    },
    {
      question: "How do you ensure ROI from service design investments?",
      answer: "We establish clear metrics aligned with your business goals at the project outset. These might include customer satisfaction improvements, operational efficiency gains, increased conversion rates, or reduced support costs. We track these metrics throughout implementation to demonstrate ROI."
    },
    {
      question: "Can we start with a smaller service design pilot?",
      answer: "Absolutely. Many organizations begin with a focused service design pilot to demonstrate value before expanding to larger initiatives. We can help you identify high-impact opportunities for an initial project that balances feasibility with potential ROI."
    },
    {
      question: "What's included in your service design subscription model?",
      answer: "Our subscription model provides ongoing access to our service design team with predictable monthly pricing. It includes continuous research, design iterations, implementation support, and measurement. This model works well for organizations committed to ongoing service evolution."
    },
    {
      question: "How do you handle knowledge transfer to our team?",
      answer: "Knowledge transfer is built into our process. We conduct collaborative workshops, provide comprehensive documentation, offer training sessions, and can embed with your team during implementation. Our goal is to build your internal service design capabilities throughout the engagement."
    },
    {
      question: "Do you offer service design training for our staff?",
      answer: "Yes, we offer customized service design training programs to build your team's capabilities. These can range from introductory workshops to comprehensive skill development programs, and can be added to any project or purchased separately."
    }
  ];
  

export function ServiceDesignPricing() {
    const [showCalendarPreview, setShowCalendarPreview] = useState(false);
    const [showChatPreview, setShowChatPreview] = useState(false);
  
    return (
      <section id="pricing" className="py-32 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Service Design Pricing
            </h2>
            <p className="text-gray-600">
              Choose the engagement model that works best for your service transformation
            </p>
          </div>  

        <div className="grid md:grid-cols-2 gap-8">
          {/* Subscription Card */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="relative group"
          >
            <div className="bg-black text-white p-8 rounded-2xl">
              <div className="absolute -top-3 -right-3">
                <span className="inline-flex items-center bg-blue-500 text-white text-sm px-3 py-1 rounded-full">
                 Free Initial Assessment
                </span>
              </div>

              <h3 className="text-2xl font-semibold mb-2">Service Design Partnership</h3>
              <div className="text-3xl font-bold mb-4">
                $8k - $25k<span className="text-lg font-normal">/month</span>
              </div>
              <p className="text-gray-400 mb-6">Ongoing service evolution & support</p>
              
              <ul className="space-y-4 mb-8">
                {subscriptionFeatures.map((feature, i) => (
                  <motion.li 
                    key={i}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                    className="flex items-start gap-3"
                  >
                    <CheckCircle className="w-5 h-5 text-green-500 shrink-0 mt-1" />
                    <div>
                      <p className="font-medium">{feature.title}</p>
                      <p className="text-gray-400 text-sm">{feature.description}</p>
                    </div>
                  </motion.li>
                ))}
              </ul>

              <button 
                className="w-full bg-white text-black rounded-full py-4 font-medium flex items-center justify-center group-hover:bg-gray-100 transition-colors"
                onMouseEnter={() => setShowCalendarPreview(true)}
                onMouseLeave={() => setShowCalendarPreview(false)}
                onClick={() => window.open('https://cal.com/blueprint-studio/intro-call', '_blank')}
              >
                <span>Book a Call</span>
                <ArrowUpRight className="w-5 h-5 ml-2 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </button>

              {/* Calendar Preview */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ 
                  opacity: showCalendarPreview ? 1 : 0,
                  y: showCalendarPreview ? 0 : 10
                }}
                className="absolute top-[calc(100%-12px)] left-[26%] -translate-x-1/2 bg-white text-black p-6 rounded-xl shadow-xl w-48 pointer-events-none z-10"
              >
                <div className="relative">
                  <div className="absolute top-0.5 right-0.5 w-6 h-6 bg-black rounded-full flex items-center justify-center -mt-3 -mr-3 z-20">
                    <ArrowUpRight className="w-4 h-4 text-white" />
                  </div>
                  <Image 
                    src={previewImages.calendar}
                    alt="Calendar Interface"
                    width={200}
                    height={150}
                    className="w-full h-auto rounded-lg mb-2"
                  />
                  <p className="text-xs text-gray-600 text-center mt-4">Select a time</p>
                </div>
              </motion.div>
            </div>
          </motion.div>

          {/* Project Card */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="relative group"
          >
            <div className="border border-gray-200 p-8 rounded-2xl bg-white">
              <h3 className="text-2xl font-semibold mb-2">Service Design Project</h3>
              <div className="text-3xl font-bold mb-4">Starting at $12,000</div>
              <p className="text-gray-600 mb-6">Focused service transformation projects</p>

              <ul className="space-y-4 mb-8">
                {projectFeatures.map((feature, i) => (
                  <motion.li 
                    key={i}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                    className="flex items-start gap-3"
                  >
                    <CheckCircle className="w-5 h-5 text-green-500 shrink-0 mt-1" />
                    <div>
                      <p className="font-medium text-gray-900">{feature.title}</p>
                      <p className="text-gray-600 text-sm">{feature.description}</p>
                    </div>
                  </motion.li>
                ))}
              </ul>

              <button 
                className="w-full border-2 border-black rounded-full py-4 font-medium flex items-center justify-center hover:bg-black hover:text-white transition-colors"
                onClick={() => window.open('https://cal.com/blueprint-studio/intro-call', '_blank')}
                onMouseEnter={() => setShowChatPreview(true)}
                onMouseLeave={() => setShowChatPreview(false)}
              >
                <span>Get Service Design Quote</span>
                <ArrowUpRight className="w-5 h-5 ml-2 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </button>


              {/* Chat Preview */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ 
                  opacity: showChatPreview ? 1 : 0,
                  y: showChatPreview ? 0 : 10
                }}
                className="absolute top-[calc(100%-12px)] right-[28%] translate-x-1/2 bg-white p-6 rounded-xl shadow-xl w-48 pointer-events-none z-10"
              >
                <div className="relative">
                  <div className="absolute top-0.5 right-0.5 w-6 h-6 bg-black rounded-full flex items-center justify-center -mt-3 -mr-3 z-20">
                    <ArrowUpRight className="w-4 h-4 text-white" />
                  </div>
                  <Image 
                    src={previewImages.chat}
                    alt="Chat Interface"
                    width={200}
                    height={150}
                    className="w-full h-auto rounded-lg mb-2"
                  />
                  <p className="text-xs text-gray-600 text-center mt-4">Chat right now</p>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>

        {/* FAQ */}
        <div className="mt-20">
        <h3 className="text-2xl font-semibold text-center mb-12">Frequently Asked Questions</h3>
        <div className="max-w-2xl mx-auto space-y-8">
            {pricingFaqs.map((faq, i) => (
            <motion.div 
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
            >
                <h4 className="font-medium mb-2">{faq.question}</h4>
                <p className="text-gray-600">{faq.answer}</p>
            </motion.div>
            ))}
        </div>
        
        <div className="text-center mt-12">
        <p className="text-gray-600">
            Still have questions? Email us at{' '}
            <a href="mailto:blueprint.dao@gmail.com" className="text-black underline hover:no-underline">
            blueprint.dao@gmail.com
            </a>
        </p>
        </div>
        </div>
      </div>
    </section>
  );
}