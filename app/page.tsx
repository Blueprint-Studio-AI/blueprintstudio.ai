// app/page.tsx
"use client";
import { LazyMotion, motion, domAnimation } from "framer-motion";
import Image from 'next/image';
import { Footer } from "@/components/Footer";
import { PhoneCall, Calculator, CheckCircle, ChevronDown, ChevronUp, ArrowUpRight } from "lucide-react";
import { AutoplayVideo } from "@/components/AutoplayVideo";
import { PricingSection } from "@/components/PricingSection";
import { Services } from "@/components/services-index/Services";
import { ShimmerButton } from "@/components/ui/shimmer-button";

//edit to add fade at end and start of loop
const workItems = [
  {
    type: 'video',
    src: '/videos/work/idscanner-spotlight-compressed.mp4',
  },
  {
    type: 'video',  
    src: '/videos/work/next-gen-conference-compressed.mp4',
  },
  {
    type: 'video',
    src: '/videos/work/mvt-energy-committee-compressed.mp4',
    link: 'https://www.google.com'
  },
  {
    type: 'image',
    src: '/images/work/ProjectMetaVison-Desktop1.png',
    alt: 'Project Metavision',
  },
  {
    type: 'image',
    src: '/images/work/LivingPersona-Desktop1.png',
    alt: 'Living Persona Web App',
  },
  {
    type: 'video',
    src: '/videos/work/workshopai-compressed.mp4',
  },
];


export default function Home() {

  return (
    <div className="min-h-screen bg-[#fafaf9]">
      {/* Hero Section with updated buttons */}
      <section className="py-20 pb-12 px-4 bg-[#fafaf9]">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <span className="inline-flex items-center bg-white rounded-full px-4 py-2 text-sm shadow">
              <span className="relative flex h-2 w-2 mr-2">
                <span className="animate-pulse-rhythmic absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-400"></span>
              </span>
              Start Today
            </span>
          </div>
          <h1 className="mb-8">
            <span className="block text-5xl md:text-7xl font-serif italic font-medium mb-2">Design & Build</span>
            <span className="block text-4xl md:text-6xl font-sans font-bold tracking-tight">with Blueprint Studio</span>
          </h1>
          <div className="flex flex-col sm:flex-row gap-4">
            <ShimmerButton
              onClick={() => {
                document.getElementById('pricing')?.scrollIntoView({ 
                  behavior: 'smooth',
                  block: 'start'
                });
              }}
              className="text-lg"
            >
              See Pricing <Calculator className="ml-2 h-5 w-5" />
            </ShimmerButton>
            
            <button 
              onClick={() => {
                // Scroll to the center of the first work item
                const firstWorkItem = document.querySelector('.grid-cols-1 > a:first-child');
                if (firstWorkItem) {
                  const rect = firstWorkItem.getBoundingClientRect();
                  const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
                  const targetY = scrollTop + rect.top + (rect.height / 2) - (window.innerHeight / 2);
                  
                  window.scrollTo({
                    top: targetY,
                    behavior: 'smooth'
                  });
                }
              }}
              className="inline-flex items-center justify-center px-8 py-4 rounded-full text-lg font-medium 
              border-2 border-black bg-white text-black
              hover:bg-black hover:text-white active:scale-[0.98] transition-all duration-200
              shadow-md hover:shadow-lg active:shadow-sm"
            >
              View Our Work
            </button>
          </div>
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
                className="rounded-3xl border overflow-hidden transition-all duration-200 bg-gray-100/80 backdrop-blur-sm shadow"
              >
                <div className="relative w-full" style={{ paddingBottom: '66.67%' }}>
                  <div className="absolute inset-0">
                    {item.type === 'image' ? (
                      <Image
                        src={item.src}
                        alt={item.alt || 'Blueprint Studio Image'}
                        fill
                        className="object-cover transition-opacity duration-500"
                        placeholder="blur"
                        blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/4gHYSUNDX1BST0ZJTEUAAQEAAAHIAAAAAAQwAABtbnRyUkdCIFhZWiAH4AABAAEAAAAAAABhY3NwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQAA9tYAAQAAAADTLQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAlkZXNjAAAA8AAAACRyWFlaAAABFAAAABRnWFlaAAABKAAAABRiWFlaAAABPAAAABR3dHB0AAABUAAAABRyVFJDAAABZAAAAChnVFJDAAABZAAAAChiVFJDAAABZAAAAChjcHJ0AAABjAAAADxtbHVjAAAAAAAAAAEAAAAMZW5VUwAAAAgAAAAcAHMAUgBHAEJYWVogAAAAAAAAb6IAADj1AAADkFhZWiAAAAAAAABimQAAt4UAABjaWFlaIAAAAAAAACSgAAAPhAAAts9YWVogAAAAAAAA9tYAAQAAAADTLXBhcmEAAAAAAAQAAAACZmYAAPKnAAANWQAAE9AAAApbAAAAAAAAAABtbHVjAAAAAAAAAAEAAAAMZW5VUwAAACAAAAAcAEcAbwBvAGcAbABlACAASQBuAGMALgAgADIAMAAxADb/2wBDABQODxIPDRQSEBIXFRQdHx4dHRsdHR4dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR3/2wBDAR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR3/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAb/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k="
                      />
                    ) : (
                      <AutoplayVideo
                        src={item.src}
                        className="w-full h-full object-cover"
                      />
                    )}
                  </div>
                </div>
              </a>
            ))}
            </div>
          </div>
        </section>


      {/* Services */}
      <section className="relative services-theme">
        <div className="relative">
          <div className="max-w-4xl mx-auto overflow-visible">
            <Services 
              useSimpleTitle={true}
              customTitle="Our Services"
              customDescription="Transforming complex challenges into elegant, user-centric solutions for forward-thinking brands."
            />
          </div>
        </div>
      </section>

       {/* Pricing */}
      <PricingSection/>

      <Footer/>
    </div>
  );
}