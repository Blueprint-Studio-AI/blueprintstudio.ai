// app/page.tsx
"use client";
import { motion } from "framer-motion";
import { useState } from "react";
import Image from 'next/image';
import { Footer } from "@/service-pages/components/sections/Footer";
import { PhoneCall, Calculator, CheckCircle, ChevronDown, ChevronUp, ArrowUpRight } from "lucide-react";
import { AutoplayVideo } from "@/components/AutoplayVideo";
import { PricingCalculator } from "@/components/PricingCalculator";

//edit to add fade at end and start of loop
const workItems = [
  {
    type: 'video',
    src: '/videos/work/idVisorProductPage-Desktop1.mp4',
  },
  {
    type: 'image',
    src: '/images/work/ProjectMetaVison-Desktop1.png',
    alt: 'Project Metavision',
  },
  {
    type: 'video',
    src: '/videos/work/ManchesterEngeryCommitee-Desktop1.mp4',
    link: 'https://www.google.com'
  },
  {
    type: 'video',  
    src: '/videos/work/SDNYTB-Desktop1.mp4',
  },
  {
    type: 'image',
    src: '/images/work/LivingPersona-Desktop1.png',
    alt: 'Living Persona Web App',
  },
];


export default function Home() {

  return (
    <div className="min-h-screen bg-[#fafaf9]">
      {/* Hero Section */}
      <section className="py-20 pb-12 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <span className="inline-flex items-center bg-white rounded-full px-4 py-2 text-sm shadow">
              <span className="w-2 h-2 bg-green-400 rounded-full mr-2"></span>
                Start Today
              </span>
          </div>
          <h1 className="text-5xl md:text-7xl font-bold mb-8">
            Design & Build with Blueprint Studio
          </h1>
          <button 
            onClick={() => {
              document.getElementById('pricing')?.scrollIntoView({ 
                behavior: 'smooth',
                block: 'start'
              });
            }}
            className="bg-black text-white px-8 py-4 rounded-full text-lg hover:bg-gray-800 transition-colors"
          >
            See Pricing
          </button>
        </div>
      </section>

      {/* Work Grid */}
      <section className="py-20 pt-12 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 gap-8">
            {workItems.map((item, index) => (
              <a 
                key={index}
                href={item.link}
                target="_blank"
                rel="noopener noreferrer" 
                className="rounded-3xl border overflow-hidden transition-all duration-200 bg-white shadow"
              >
                {item.type === 'image' ? (
                  <Image
                    src={item.src}
                    alt={item.alt || 'Blueprint Studio Image'}
                    width={800}
                    height={600}
                    className="w-full h-auto"
                  />
                ) : (
                  <AutoplayVideo
                    src={item.src}
                    className="w-full h-auto"
                  />
                )}
              </a>
            ))}
          </div>
        </div>
      </section>

       {/* Pricing */}
      <PricingCalculator/>

      <Footer/>
    </div>
  );
}