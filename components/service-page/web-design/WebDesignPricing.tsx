// should become props on PricingSection.tsx instead of being it's own component

// components/PricingSection.tsx
"use client";
import { useState } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, ArrowUpRight } from 'lucide-react';

// For SVGs, we'll use regular img tags instead of Next.js Image component
const previewImages = {
  calendar: "data:image/svg+xml,%3Csvg width='200' height='150' viewBox='0 0 200 150' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Crect width='200' height='150' fill='%23F3F4F6'/%3E%3Crect x='20' y='20' width='160' height='110' rx='4' fill='white'/%3E%3Crect x='30' y='40' width='140' height='20' rx='2' fill='%23E5E7EB'/%3E%3Crect x='30' y='70' width='140' height='20' rx='2' fill='%23E5E7EB'/%3E%3Crect x='30' y='100' width='140' height='20' rx='2' fill='%23E5E7EB'/%3E%3C/svg%3E",
  chat: "data:image/svg+xml,%3Csvg width='200' height='150' viewBox='0 0 200 150' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Crect width='200' height='150' fill='%23F3F4F6'/%3E%3Crect x='20' y='20' width='160' height='110' rx='4' fill='white'/%3E%3Crect x='30' y='90' width='140' height='30' rx='15' fill='%23E5E7EB'/%3E%3Crect x='30' y='40' width='100' height='20' rx='10' fill='%23E5E7EB'/%3E%3C/svg%3E"
};

const subscriptionFeatures = [
  {
    title: "Dedicated team",
    description: "Full-time designers and developers"
  },
  {
    title: "Unlimited requests",
    description: "Submit as many projects as you need"
  },
  {
    title: "Priority support",
    description: "24/7 access to your project manager"
  },
  {
    title: "Rapid delivery",
    description: "Regular updates and deployments"
  }
];

const webDesignProjectFeatures = [
    {
      title: "Custom web design",
      description: "Tailored to your brand & goals"
    },
    {
      title: "Mobile-first design",
      description: "Responsive across all devices"
    },
    {
      title: "SEO optimization",
      description: "Built for search engines"
    },
    {
      title: "CMS integration",
      description: "Easy content management"
    }
  ];

const pricingFaqs = [
    {
      question: "How flexible is the subscription?",
      answer: "Our company subscriptions are highly flexible. You can pause or cancel at any time, and adjust your team size and resource allocation monthly based on your needs."
    },
    {
      question: "What determines the subscription cost?",
      answer: "Pricing varies based on the services and resources needed. Development-intensive projects with multiple developers typically represent the higher end of our range, while marketing-focused engagements often start at lower price points. We'll help determine the right resource mix for your company."
    },
    {
      question: "Can we scale our subscription up or down?",
      answer: "Yes, your company can adjust bandwidth monthly. Need more developers for a big launch? Want to scale back after a major milestone? You have full control over your resource allocation and can modify it based on project demands."
    },
    {
      question: "How does the trial period work?",
      answer: "New companies can start with a 1-week trial period to experience our full service offering. During this time, you'll work with our team just as you would in a regular subscription, allowing you to evaluate if we're the right fit for your needs."
    },
    {
      question: "What happens if we need to pause our subscription?",
      answer: "We understand business needs fluctuate. You can pause your company's subscription at any time and resume when ready, maintaining all your project information and team relationships."
    },
    {
      question: "How do you handle project handoffs and documentation?",
      answer: "Our team provides comprehensive documentation and ensures smooth knowledge transfer for all company projects. Whether you're scaling up or transitioning between phases, we maintain detailed records and clear communication."
    },
    {
      question: "What's the difference between subscription and custom projects?",
      answer: "Subscriptions offer ongoing access to our team with predictable monthly pricing, ideal for companies looking for a consistent partner. Custom projects are better for one-off initiatives with defined scopes and timelines."
    }
  ];
  

  export function WebDesignPricing() {
    const [showCalendarPreview, setShowCalendarPreview] = useState(false);
    const [showChatPreview, setShowChatPreview] = useState(false);
  
    return (
      <section id="pricing" className="py-32 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Web Design Pricing
            </h2>
            <p className="text-gray-600">
              Choose the engagement model that works best for your website project
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
                 1-Week Free Trial
                </span>
              </div>

              <h3 className="text-2xl font-semibold mb-2">Design & Build Subscription</h3>
              <div className="text-3xl font-bold mb-4">
                $5k - $20k<span className="text-lg font-normal">/month</span>
              </div>
              <p className="text-gray-400 mb-6">All-inclusive service with dedicated team</p>
              
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
              >
                <span>Book a Call</span>
                <ArrowUpRight className="w-5 h-5 ml-2 opacity-0 group-hover:opacity-100 transition-opacity" />
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
                  <img 
                    src={previewImages.calendar}
                    alt="Calendar Interface"
                    className="w-full h-auto rounded-lg mb-2"
                  />
                  <p className="text-xs text-gray-600 text-center mt-4">Select a time</p>
                </div>
              </motion.div>
            </div>
          </motion.div>

          {/* Modified Project Card for Web Design */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="relative group"
          >
            <div className="border border-gray-200 p-8 rounded-2xl bg-white">
              <h3 className="text-2xl font-semibold mb-2">Web Design Project</h3>
              <div className="text-3xl font-bold mb-4">Starting at $899</div>
              <p className="text-gray-600 mb-6">Professional website design & development</p>

              <ul className="space-y-4 mb-8">
                {webDesignProjectFeatures.map((feature, i) => (
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
                onClick={() => window.open('https://cal.com/blueprint/web-design', '_blank')}
                onMouseEnter={() => setShowChatPreview(true)}
                onMouseLeave={() => setShowChatPreview(false)}
              >
                <span>Get Web Design Quote</span>
                <ArrowUpRight className="w-5 h-5 ml-2 opacity-0 group-hover:opacity-100 transition-opacity" />
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
                  <img 
                    src={previewImages.chat}
                    alt="Chat Interface"
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