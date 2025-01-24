// components/PricingCalculator.tsx
"use client";
import { useState } from 'react';
import { motion } from 'framer-motion';
import { PhoneCall, Calculator, CheckCircle, ChevronDown, ChevronUp, ArrowUpRight } from 'lucide-react';
import Image from 'next/image';

const services = [
  {
    id: 'design',
    name: 'Design',
    description: 'UI/UX, Brand, Product Design',
    basePrice: 5000
  },
  {
    id: 'development',
    name: 'Development',
    description: 'Web, Mobile, Custom Solutions',
    basePrice: 8000
  },
  {
    id: 'marketing',
    name: 'Marketing',
    description: 'SEO, Content, Digital Strategy',
    basePrice: 4000
  },
  {
    id: 'strategy',
    name: 'Strategy',
    description: 'Product, Business, Innovation',
    basePrice: 6000
  }
];

const subscriptionFeatures = [
  {
    title: "Dedicated team",
    description: "Specialists from each service available daily"
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
    title: "Twice-Weekly Delivery",
    description: "Regular alignment and planning sessions"
  }
];

const projectFeatures = [
  {
    title: "Custom scope & timeline",
    description: "Tailored to your specific needs"
  },
  {
    title: "Fixed pricing",
    description: "No surprises or hidden fees"
  },
  {
    title: "One-time delivery",
    description: "Clear milestones and deliverables"
  },
  {
    title: "30 days of support",
    description: "Post-launch maintenance included"
  }
];

const previewImages = {
  calendar: "data:image/svg+xml,%3Csvg width='200' height='150' viewBox='0 0 200 150' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Crect width='200' height='150' fill='%23F3F4F6'/%3E%3Crect x='20' y='20' width='160' height='110' rx='4' fill='white'/%3E%3Crect x='30' y='40' width='140' height='20' rx='2' fill='%23E5E7EB'/%3E%3Crect x='30' y='70' width='140' height='20' rx='2' fill='%23E5E7EB'/%3E%3Crect x='30' y='100' width='140' height='20' rx='2' fill='%23E5E7EB'/%3E%3C/svg%3E",
  chat: "data:image/svg+xml,%3Csvg width='200' height='150' viewBox='0 0 200 150' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Crect width='200' height='150' fill='%23F3F4F6'/%3E%3Crect x='20' y='20' width='160' height='110' rx='4' fill='white'/%3E%3Crect x='30' y='90' width='140' height='30' rx='15' fill='%23E5E7EB'/%3E%3Crect x='30' y='40' width='100' height='20' rx='10' fill='%23E5E7EB'/%3E%3C/svg%3E"
};

export function PricingCalculator() {
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [showDetails, setShowDetails] = useState(false);
  const [showCalendarPreview, setShowCalendarPreview] = useState(false);
  const [showChatPreview, setShowChatPreview] = useState(false);

  const calculatePrice = () => {
    return selectedServices.reduce((total, serviceId) => {
      const service = services.find(s => s.id === serviceId);
      return total + (service?.basePrice || 0);
    }, 0);
  };

  return (
    <section id="pricing" className="py-32 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-20">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Choose your services
          </h2>
          <p className="text-gray-600">
            Select the services you need. Get instant pricing or schedule a custom quote.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-12">
          {services.map(service => (
            <div
              key={service.id}
              onClick={() => {
                setSelectedServices(prev => 
                  prev.includes(service.id) 
                    ? prev.filter(id => id !== service.id)
                    : [...prev, service.id]
                );
              }}
              className={`
                bg-white p-8 rounded-3xl cursor-pointer
                transition-all duration-200
                hover:shadow-lg hover:-translate-y-1
                ${selectedServices.includes(service.id) 
                  ? 'border border-black shadow-md' 
                  : 'border border-gray-200 hover:border-gray-300'}
              `}
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">{service.name}</h3>
                <div className={`
                  w-6 h-6 rounded-full flex items-center justify-center
                  transition-colors
                  ${selectedServices.includes(service.id)
                    ? 'border-black bg-black'
                    : 'border-gray-300'}
                `}>
                  {selectedServices.includes(service.id) && (
                    <svg 
                      viewBox="0 0 24 24" 
                      className="w-4 h-4 text-white"
                    >
                      <path 
                        fill="currentColor" 
                        d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"
                      />
                    </svg>
                  )}
                </div>
              </div>
              <p className="text-gray-600 mb-4">{service.description}</p>
              <p className="text-gray-500">From ${service.basePrice.toLocaleString()}</p>
            </div>
          ))}
        </div>

          {/* Black pricing box */}
          <div className="relative"> {/* Added wrapper div */}
            <div className="bg-black text-white p-8 rounded-2xl relative mb-16">
              <div className="flex justify-between items-center mb-8">
                <div>
                  <h3 className="text-2xl font-semibold mb-2">Design & Build Subscription</h3>
                  <p className="text-gray-400">
                    {selectedServices.length === 0 
                      ? 'Select services to see monthly pricing' 
                      : `${selectedServices.length} services included`}
                  </p>
                </div>
                <div className="text-3xl font-bold">
                  {selectedServices.length > 0 && `$${calculatePrice().toLocaleString()}/mo`}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <button 
                  className="w-full border-2 border-white rounded-full py-4 font-medium flex items-center justify-center relative group transition-all duration-300"
                  onMouseEnter={() => setShowCalendarPreview(true)}
                  onMouseLeave={() => setShowCalendarPreview(false)}
                >
                  <PhoneCall className="w-5 h-5 mr-2" />
                  Book a Call
                </button>

                <button 
                  className="w-full bg-white text-black rounded-full py-4 font-medium flex items-center justify-center relative group transition-all duration-300"
                  onMouseEnter={() => setShowChatPreview(true)}
                  onMouseLeave={() => setShowChatPreview(false)}
                >
                  <Calculator className="w-5 h-5 mr-2" />
                  Get Project Quote
                </button>
              </div>

              {/* Details Toggle Button */}
              <button 
                onClick={() => setShowDetails(!showDetails)}
                className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 bg-white text-black px-6 py-2 rounded-full text-sm font-medium shadow-lg flex items-center gap-2 hover:bg-gray-100 transition-colors"
              >
                {showDetails ? (
                  <>Hide Details <ChevronUp className="w-4 h-4" /></>
                ) : (
                  <>View Details <ChevronDown className="w-4 h-4" /></>
                )}
              </button>
            </div>

            {/* Calendar Preview - Fine-tuned positioning */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ 
                opacity: showCalendarPreview ? 1 : 0,
                y: showCalendarPreview ? 0 : 10
              }}
              className="absolute top-[calc(100%-80px)] left-[15%] -translate-x-1/2 bg-white text-black p-6 rounded-xl shadow-xl w-48 pointer-events-none z-10"
            >
              <div className="relative">
                <div className="absolute top-0.5 right-0.5 w-6 h-6 bg-black rounded-full flex items-center justify-center -mt-3 -mr-3 z-20">
                  <ArrowUpRight className="w-4 h-4 text-white" />
                </div>
                  <Image 
                    src={previewImages.calendar}
                    alt="Calendar Interface"
                    width={140}
                    height={105}
                    className="rounded-lg mb-2"
                  />
                <p className="text-xs text-gray-600 text-center mt-4">Select a time</p>
              </div>
            </motion.div>

              {/* Chat Preview - Fine-tuned positioning */}
              <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ 
                opacity: showChatPreview ? 1 : 0,
                y: showChatPreview ? 0 : 10
              }}
              className="absolute top-[calc(100%-80px)] right-[15%] translate-x-1/2 bg-white p-6 rounded-xl shadow-xl w-48 pointer-events-none z-10"
            >
              <div className="relative">
                <div className="absolute top-0.5 right-0.5 w-6 h-6 bg-black rounded-full flex items-center justify-center -mt-3 -mr-3 z-20">
                  <ArrowUpRight className="w-4 h-4 text-white" />
                </div>
                  <Image 
                    src={previewImages.chat}
                    alt="Chat Interface"
                    width={140}
                    height={105}
                    className="rounded-lg mb-2"
                  />
                <p className="text-xs text-gray-600 text-center mt-4">Chat right now</p>
              </div>
            </motion.div>

            {/* Animated Details Panel */}
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ 
                height: showDetails ? 'auto' : 0,
                opacity: showDetails ? 1 : 0
              }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden bg-white rounded-xl shadow-lg"
            >
              <div className="grid grid-cols-2 gap-8 p-8">
                <div>
                  <h4 className="font-medium mb-6 text-lg">Subscription Includes</h4>
                  <ul className="space-y-6">
                    {subscriptionFeatures.map((feature, i) => (
                      <motion.li 
                        key={i}
                        initial={{ x: -20, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ delay: i * 0.1 }}
                        className="flex items-start gap-3"
                      >
                        <CheckCircle className="w-5 h-5 text-green-500 shrink-0 mt-1" />
                        <div>
                          <p className="font-medium text-gray-900">{feature.title}</p>
                          <p className="text-gray-500 text-sm mt-1">{feature.description}</p>
                        </div>
                      </motion.li>
                    ))}
                  </ul>
                </div>
                
                <div>
                  <h4 className="font-medium mb-6 text-lg">Project-Based Includes</h4>
                  <ul className="space-y-6">
                    {projectFeatures.map((feature, i) => (
                      <motion.li 
                        key={i}
                        initial={{ x: -20, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ delay: i * 0.1 }}
                        className="flex items-start gap-3"
                      >
                        <CheckCircle className="w-5 h-5 text-green-500 shrink-0 mt-1" />
                        <div>
                          <p className="font-medium text-gray-900">{feature.title}</p>
                          <p className="text-gray-500 text-sm mt-1">{feature.description}</p>
                        </div>
                      </motion.li>
                    ))}
                  </ul>
                </div>
              </div>
            </motion.div>
          </div>
          </div>

      </section>
  );
}