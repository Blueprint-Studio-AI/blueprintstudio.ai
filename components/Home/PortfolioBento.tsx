"use client";
import { useState, useRef, useEffect } from "react";
import Section from "@/components/ui/Section";
import OuterContainer from "@/components/ui/OuterContainer";
import InnerContainer from "@/components/ui/InnerContainer";
import SectionHeader from "@/components/ui/SectionHeader";
import { Pause, Play } from "lucide-react";

interface PortfolioItem {
  id: string;
  title: string;
  description: string;
  type: 'featured' | 'standard';
  media: {
    type: 'image' | 'video';
    src: string;
    alt?: string;
  };
  link?: string;
  metadata?: {
    category: string;
    readTime?: string;
  };
}

const portfolioSections = [
  {
    featured: {
      id: 'featured-1',
      title: 'Project One',
      description: 'Our flagship design and development platform revolutionizing how teams collaborate.',
      type: 'featured' as const,
      media: {
        type: 'video' as const,
        src: '/videos/portfolio-featured.mp4',
        alt: 'Blueprint Studio Platform Preview'
      },
      link: '/portfolio/blueprint-platform',
      metadata: {
        category: 'Platform',
        readTime: '5 min read'
      }
    },
    sidebar: [
      {
        id: 'project-1-1',
        title: 'E-commerce Revolution',
        description: 'Complete digital transformation for retail excellence.',
        type: 'standard' as const,
        media: {
          type: 'image' as const,
          src: '/images/portfolio-ecommerce.jpg',
          alt: 'E-commerce Project Preview'
        },
        link: '/portfolio/ecommerce-revolution',
        metadata: {
          category: 'E-commerce'
        }
      },
      {
        id: 'project-1-2',
        title: 'Mobile Banking App',
        description: 'Secure and intuitive financial services platform.',
        type: 'standard' as const,
        media: {
          type: 'video' as const,
          src: '/videos/portfolio-banking.mp4',
          alt: 'Mobile Banking App Preview'
        },
        link: '/portfolio/banking-app',
        metadata: {
          category: 'FinTech'
        }
      },
      {
        id: 'project-1-3',
        title: 'Healthcare Dashboard',
        description: 'Advanced analytics for healthcare professionals.',
        type: 'standard' as const,
        media: {
          type: 'image' as const,
          src: '/images/portfolio-healthcare.jpg',
          alt: 'Healthcare Dashboard Preview'
        },
        link: '/portfolio/healthcare-dashboard',
        metadata: {
          category: 'Healthcare'
        }
      }
    ]
  },
  {
    featured: {
      id: 'featured-2',
      title: 'AI-Powered Analytics Suite',
      description: 'Next-generation business intelligence with machine learning insights.',
      type: 'featured' as const,
      media: {
        type: 'video' as const,
        src: '/videos/portfolio-ai.mp4',
        alt: 'AI Analytics Preview'
      },
      link: '/portfolio/ai-analytics',
      metadata: {
        category: 'AI/ML',
        readTime: '7 min read'
      }
    },
    sidebar: [
      {
        id: 'project-2-1',
        title: 'Social Media Dashboard',
        description: 'Real-time social analytics and engagement tracking.',
        type: 'standard' as const,
        media: {
          type: 'image' as const,
          src: '/images/portfolio-social.jpg',
          alt: 'Social Dashboard Preview'
        },
        link: '/portfolio/social-dashboard',
        metadata: {
          category: 'Social'
        }
      },
      {
        id: 'project-2-2',
        title: 'Supply Chain Manager',
        description: 'End-to-end logistics and inventory optimization.',
        type: 'standard' as const,
        media: {
          type: 'video' as const,
          src: '/videos/portfolio-supply.mp4',
          alt: 'Supply Chain Preview'
        },
        link: '/portfolio/supply-chain',
        metadata: {
          category: 'Logistics'
        }
      },
      {
        id: 'project-2-3',
        title: 'Education Platform',
        description: 'Interactive learning management system.',
        type: 'standard' as const,
        media: {
          type: 'image' as const,
          src: '/images/portfolio-education.jpg',
          alt: 'Education Platform Preview'
        },
        link: '/portfolio/education',
        metadata: {
          category: 'EdTech'
        }
      }
    ]
  },
  {
    featured: {
      id: 'featured-3',
      title: 'Cloud Infrastructure Portal',
      description: 'Enterprise-grade cloud management and deployment solutions.',
      type: 'featured' as const,
      media: {
        type: 'image' as const,
        src: '/images/portfolio-cloud.jpg',
        alt: 'Cloud Portal Preview'
      },
      link: '/portfolio/cloud-portal',
      metadata: {
        category: 'Infrastructure',
        readTime: '6 min read'
      }
    },
    sidebar: [
      {
        id: 'project-3-1',
        title: 'CRM System',
        description: 'Customer relationship management reimagined.',
        type: 'standard' as const,
        media: {
          type: 'video' as const,
          src: '/videos/portfolio-crm.mp4',
          alt: 'CRM System Preview'
        },
        link: '/portfolio/crm',
        metadata: {
          category: 'Business'
        }
      },
      {
        id: 'project-3-2',
        title: 'Real Estate Portal',
        description: 'Property management and listing platform.',
        type: 'standard' as const,
        media: {
          type: 'image' as const,
          src: '/images/portfolio-realestate.jpg',
          alt: 'Real Estate Preview'
        },
        link: '/portfolio/real-estate',
        metadata: {
          category: 'PropTech'
        }
      },
      {
        id: 'project-3-3',
        title: 'Gaming Dashboard',
        description: 'Esports analytics and tournament management.',
        type: 'standard' as const,
        media: {
          type: 'video' as const,
          src: '/videos/portfolio-gaming.mp4',
          alt: 'Gaming Dashboard Preview'
        },
        link: '/portfolio/gaming',
        metadata: {
          category: 'Gaming'
        }
      }
    ]
  },
  {
    featured: {
      id: 'featured-4',
      title: 'Blockchain Exchange',
      description: 'Secure cryptocurrency trading platform with advanced features.',
      type: 'featured' as const,
      media: {
        type: 'video' as const,
        src: '/videos/portfolio-blockchain.mp4',
        alt: 'Blockchain Exchange Preview'
      },
      link: '/portfolio/blockchain',
      metadata: {
        category: 'Crypto',
        readTime: '8 min read'
      }
    },
    sidebar: [
      {
        id: 'project-4-1',
        title: 'Food Delivery App',
        description: 'On-demand food ordering and tracking.',
        type: 'standard' as const,
        media: {
          type: 'image' as const,
          src: '/images/portfolio-food.jpg',
          alt: 'Food Delivery Preview'
        },
        link: '/portfolio/food-delivery',
        metadata: {
          category: 'Food & Beverage'
        }
      },
      {
        id: 'project-4-2',
        title: 'Travel Booking Platform',
        description: 'Comprehensive travel planning and booking.',
        type: 'standard' as const,
        media: {
          type: 'video' as const,
          src: '/videos/portfolio-travel.mp4',
          alt: 'Travel Platform Preview'
        },
        link: '/portfolio/travel',
        metadata: {
          category: 'Travel'
        }
      },
      {
        id: 'project-4-3',
        title: 'HR Management System',
        description: 'Employee management and payroll solution.',
        type: 'standard' as const,
        media: {
          type: 'image' as const,
          src: '/images/portfolio-hr.jpg',
          alt: 'HR System Preview'
        },
        link: '/portfolio/hr-system',
        metadata: {
          category: 'HR Tech'
        }
      }
    ]
  },
  {
    featured: {
      id: 'featured-5',
      title: 'IoT Control Center',
      description: 'Smart device management and automation platform.',
      type: 'featured' as const,
      media: {
        type: 'image' as const,
        src: '/images/portfolio-iot.jpg',
        alt: 'IoT Control Center Preview'
      },
      link: '/portfolio/iot-center',
      metadata: {
        category: 'IoT',
        readTime: '4 min read'
      }
    },
    sidebar: [
      {
        id: 'project-5-1',
        title: 'Music Streaming Service',
        description: 'High-quality audio streaming platform.',
        type: 'standard' as const,
        media: {
          type: 'video' as const,
          src: '/videos/portfolio-music.mp4',
          alt: 'Music Streaming Preview'
        },
        link: '/portfolio/music-streaming',
        metadata: {
          category: 'Entertainment'
        }
      },
      {
        id: 'project-5-2',
        title: 'Fitness Tracker App',
        description: 'Health monitoring and workout planning.',
        type: 'standard' as const,
        media: {
          type: 'image' as const,
          src: '/images/portfolio-fitness.jpg',
          alt: 'Fitness Tracker Preview'
        },
        link: '/portfolio/fitness',
        metadata: {
          category: 'Health & Fitness'
        }
      },
      {
        id: 'project-5-3',
        title: 'News Aggregator',
        description: 'Personalized news and content curation.',
        type: 'standard' as const,
        media: {
          type: 'video' as const,
          src: '/videos/portfolio-news.mp4',
          alt: 'News Aggregator Preview'
        },
        link: '/portfolio/news',
        metadata: {
          category: 'Media'
        }
      }
    ]
  }
];

interface MediaCardProps {
  item: PortfolioItem;
  aspectRatio: string;
  featured?: boolean;
  imageOnly?: boolean;
}

function MediaCard({ item, aspectRatio, featured = false, imageOnly = false }: MediaCardProps) {
  const [isPlaying, setIsPlaying] = useState(true);
  const [showControls, setShowControls] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const togglePlayPause = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const scaleClass = featured ? 'group-hover:scale-[1.0125]' : 'group-hover:scale-[1.025]';

  return (
    <div className="relative">
      <div className="group relative">
        <div 
          className="bg-neutral-200 absolute left-0 top-0 w-full rounded-md"
          style={{ aspectRatio }}
        />
        <div className="relative mx-auto overflow-hidden transition-opacity duration-300 ease-out rounded-md">
          <div className="relative w-full" style={{ aspectRatio }}>
            {item.media.type === 'video' ? (
              <div 
                className="absolute left-0 top-0 h-full w-full object-cover overflow-hidden"
                style={{ aspectRatio }}
              >
                <video
                  ref={videoRef}
                  autoPlay
                  loop
                  playsInline
                  muted
                  className={`pointer-events-none h-full w-full object-cover transition-transform duration-300 ${scaleClass}`}
                  onMouseEnter={() => setShowControls(true)}
                  onMouseLeave={() => setShowControls(false)}
                >
                  <source src={item.media.src} type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
                {featured && (
                  <button
                    type="button"
                    onClick={togglePlayPause}
                    className={`absolute right-2 top-2 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-black/40 text-white backdrop-blur-lg transition duration-200 hover:bg-black/60 ${
                      showControls ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
                    }`}
                    aria-label={isPlaying ? "Pause video" : "Play video"}
                  >
                    {isPlaying ? (
                      <Pause className="h-3 w-3" />
                    ) : (
                      <Play className="h-3 w-3" />
                    )}
                  </button>
                )}
              </div>
            ) : (
              <div className="h-full w-full">
                <div className="group relative h-full w-full overflow-hidden rounded-none bg-transparent transition-colors duration-300" style={{ aspectRatio }}>
                  <img
                    alt={item.media.alt}
                    loading="lazy"
                    decoding="async"
                    className={`object-cover object-center transition-transform duration-300 ${scaleClass}`}
                    style={{
                      position: 'absolute',
                      height: '100%',
                      width: '100%',
                      left: 0,
                      top: 0,
                      right: 0,
                      bottom: 0,
                      color: 'transparent'
                    }}
                    src={item.media.src}
                  />
                </div>
              </div>
            )}
          </div>
        </div>
        {/* Only show text for featured items, not for image-only sidebar items */}
        {featured && !imageOnly && (
          <div className="text-black relative w-full pt-4">
            <div className="text-2xl md:text-3xl lg:text-4xl font-semibold mb-2">
              {item.title}
            </div>
            <p className="text-neutral-600 text-base">
              {item.description}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default function PortfolioBento() {
  return (
    <Section className="flex flex-col relative z-20 bg-neutral-100">
      {/* Background lines matching existing portfolio */}
      <div className="absolute inset-0 flex justify-center pointer-events-none px-2.5 sm:px-[60px]">
        <div className="w-full flex-1 flex justify-center relative">
          <div className="absolute left-0 top-0 bottom-0 line-dash-y custom:hidden" />
          <div className="absolute left-0 top-0 bottom-0 w-px bg-neutral-300 hidden custom:block" />
          <div className="absolute right-0 top-0 bottom-0 line-dash-y custom:hidden" />
          <div className="absolute right-0 top-0 bottom-0 w-px bg-neutral-300 hidden custom:block" />
        </div>
      </div>

      <SectionHeader leftText="PORTFOLIO BENTO" rightText="/ hybrid layout" />

      <OuterContainer className="flex-1">
        <InnerContainer className="pt-8 sm:pt-12 lg:pt-16 px-2.5 sm:px-6 relative">
          {/* Inner dashed vertical lines on desktop - matching Achievements section */}
          <div className="absolute left-0 top-0 bottom-0 line-dash-y hidden custom:block" />
          <div className="absolute right-0 top-0 bottom-0 line-dash-y hidden custom:block" />
          
          <h1 
            className="font-medium text-black text-center mb:0"
            style={{
              fontSize: 'clamp(36px, 6vw, 56px)',
              lineHeight: 'clamp(97%, 1vw, 100%)',
              letterSpacing: '-1.5px'
            }}
          >
            Featured Work
          </h1>
        </InnerContainer>

        {/* Render all 5 sections sequentially */}
        <div className="w-full max-w-[1000px]">
          {portfolioSections.map((section, sectionIndex) => (
            <div key={section.featured.id} className="w-full">
              {sectionIndex > 0 && (
                <div className="w-full line-dash-x" />
              )}
              
              <InnerContainer className="py-12 sm:py-16 lg:py-20 px-2.5 sm:px-6 relative">
                {/* Inner dashed vertical lines for each section */}
                <div className="absolute left-0 top-0 bottom-0 line-dash-y hidden custom:block" />
                <div className="absolute right-0 top-0 bottom-0 line-dash-y hidden custom:block" />
                
                {/* Wrap entire section in clickable link */}
                <a href={section.featured.link} className="block cursor-pointer group/section transition-all duration-300 hover:opacity-90">
                  <div className="lg:grid lg:grid-cols-4 lg:gap-6">
                    {/* Featured item - sticky positioned on desktop */}
                    <div className="lg:col-span-3 mb-6 lg:mb-0">
                      <div className="lg:sticky lg:top-24">
                        {/* Mobile version - 4:5 aspect ratio */}
                        <div className="block lg:hidden px-4">
                          <MediaCard item={section.featured} aspectRatio="4/5" featured />
                          
                          {/* Mobile: Show sidebar images in a grid below */}
                          <div className="grid grid-cols-3 gap-2 mt-4">
                            {section.sidebar.map((item) => (
                              <div key={item.id} className="relative">
                                <MediaCard item={item} aspectRatio="1/1" imageOnly />
                              </div>
                            ))}
                          </div>
                        </div>
                        
                        {/* Desktop version - 16:9 aspect ratio */}
                        <div className="hidden lg:block lg:px-0">
                          <MediaCard item={section.featured} aspectRatio="16/9" featured />
                        </div>
                      </div>
                    </div>

                    {/* Sidebar items - image only, desktop only */}
                    <div className="hidden lg:block lg:col-span-1 lg:px-0">
                      <div className="space-y-6">
                        {section.sidebar.map((item) => (
                          <div key={item.id} className="relative">
                            <MediaCard item={item} aspectRatio="1/1" imageOnly />
                          </div>
                        ))}
                        {/* Small spacer to delay sticky end timing */}
                        <div className="h-16" />
                      </div>
                    </div>
                  </div>
                </a>
              </InnerContainer>
            </div>
          ))}
        </div>
      </OuterContainer>
      <div className="w-full line-dash-x" />
    </Section>
  );
}