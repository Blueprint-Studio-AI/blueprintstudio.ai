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
      title: 'LivingIP — On-Chain AI Agents',
      description: 'UI/UX and product design for on-chain AI agents. Clarified vision. Simplified flows.',
      type: 'featured' as const,
      media: {
        type: 'video' as const,
        src: '/media/projects/living-ip/living-ip-horizontal-compressed.mp4',
        alt: 'LivingIP Project Reel'
      },
      link: '/portfolio/livingip',
      metadata: {
        category: 'Product Design',
        readTime: '5 min read'
      }
    },
    sidebar: [
      {
        id: 'project-1-1',
        title: 'LivingIP — On-Chain AI Agents',
        description: 'x',
        type: 'standard' as const,
        media: {
          type: 'image' as const,
          src: '/media/projects/living-ip/square-votes.png',
          alt: 'x'
        },
        link: '/portfolio/x',
        metadata: {
          category: 'x'
        }
      },
      {
        id: 'project-1-2',
        title: 'LivingIP — On-Chain AI Agents',
        description: 'x',
        type: 'standard' as const,
        media: {
          type: 'image' as const,
          src: '/media/projects/living-ip/square-analytics.png',
          alt: 'x'
        },
        link: '/portfolio/x',
        metadata: {
          category: 'x'
        }
      },
      {
        id: 'project-1-3',
        title: 'LivingIP — On-Chain AI Agents',
        description: 'x',
        type: 'standard' as const,
        media: {
          type: 'image' as const,
          src: '/media/projects/living-ip/square-badges.png',
          alt: 'x'
        },
        link: '/portfolio/x',
        metadata: {
          category: 'x'
        }
      }
    ]
  },
  {
    featured: {
      id: 'featured-2',
      title: 'Arch Network — BTC All-In Summit',
      description: 'Las Vegas event motion media and graphic design for the BTC All-In Summit; ongoing design & build partner.',
      type: 'featured' as const,
      media: {
        type: 'video' as const,
        src: '/media/projects/arch-vegas/arch-vegas-horizontal-compressed.mp4',
        alt: 'Arch Network BTC All-In Summit Project Reel'
      },
      link: '/portfolio/ai-analytics',
      metadata: {
        category: 'Motion Media, Graphic Design, IRL Event',
        readTime: '7 min read'
      }
    },
    sidebar: [
      {
        id: 'project-2-1',
        title: 'Arch Network — BTC All-In Summit',
        description: 'x',
        type: 'standard' as const,
        media: {
          type: 'video' as const,
          src: '/media/projects/arch-vegas/square-screens.mov',
          alt: 'x'
        },
        link: '/portfolio/x',
        metadata: {
          category: 'x'
        }
      },
      {
        id: 'project-2-3',
        title: 'Arch Network — BTC All-In Summit',
        description: 'x',
        type: 'standard' as const,
        media: {
          type: 'image' as const,
          src: '/media/projects/arch-vegas/square-docs-graphic.png',
          alt: 'x'
        },
        link: '/portfolio/x',
        metadata: {
          category: 'x'
        }
      },
      {
        id: 'project-2-2',
        title: 'Arch Network — BTC All-In Summit',
        description: 'x',
        type: 'standard' as const,
        media: {
          type: 'image' as const,
          src: '/media/projects/arch-vegas/square-logos.png',
          alt: 'x'
        },
        link: '/portfolio/x',
        metadata: {
          category: 'x'
        }
      }
    ]
  },
  {
    featured: {
      id: 'featured-3',
      title: 'Autara — Brand Identity & Web Design',
      description: 'Brand identity and Framer landing page for Autara: logo system, type & palette, social kit, brand deck.',
      type: 'featured' as const,
      media: {
        type: 'video' as const,
        src: '/media/projects/autara/autara-quick-edit-compressed.mp4',
        alt: 'Autara on Arch Network Project Reel'
      },
      link: '/portfolio/autara',
      metadata: {
        category: 'Logo, Brand, Framer Landing Page, Social Assets',
        readTime: '6 min read'
      }
    },
    sidebar: [
      {
        id: 'project-3-1',
        title: 'Autara — Brand Identity & Web Design',
        description: 'x',
        type: 'standard' as const,
        media: {
          type: 'image' as const,
          src: '/media/projects/autara/square-logo.png',
          alt: 'x'
        },
        link: '/portfolio/x',
        metadata: {
          category: 'x'
        }
      },
      {
        id: 'project-3-2',
        title: 'Autara — Brand Identity & Web Design',
        description: 'x',
        type: 'standard' as const,
        media: {
          type: 'image' as const,
          src: '/media/projects/autara/square-pie-chart.png',
          alt: 'x'
        },
        link: '/portfolio/x',
        metadata: {
          category: 'x'
        }
      },
      {
        id: 'project-3-3',
        title: 'Autara — Brand Identity & Web Design',
        description: 'x',
        type: 'standard' as const,
        media: {
          type: 'image' as const,
          src: '/media/projects/autara/square-table.png',
          alt: 'x'
        },
        link: '/portfolio/x',
        metadata: {
          category: 'x'
        }
      }
    ]
  },
  {
    featured: {
      id: 'featured-4',
      title: 'TokenWorks — Marketing Videos',
      description: 'Ongoing multi-disiplinary end-to-end design, engineering, and growth: headless ecommerce, apps, media, brand, and strategy.',
      type: 'featured' as const,
      media: {
        type: 'video' as const,
        src: '/media/projects/tokenworks-videos/tokenworks-videos-horizontal-compressed.mp4',
        alt: 'TokenWorks Design & Build Reel'
      },
      link: '/portfolio/x',
      metadata: {
        category: 'Design & Build',
        readTime: '8 min read'
      }
    },
    sidebar: [
      {
        id: 'project-4-1',
        title: 'TokenWorks — Design & Build',
        description: 'x',
        type: 'standard' as const,
        media: {
          type: 'image' as const,
          src: '/media/projects/tokenworks-videos/square-idvs+.png',
          alt: 'x'
        },
        link: '/portfolio/x',
        metadata: {
          category: 'x'
        }
      },
      {
        id: 'project-4-2',
        title: 'TokenWorks — Design & Build',
        description: 'x',
        type: 'standard' as const,
        media: {
          type: 'image' as const,
          src: '/media/projects/tokenworks-videos/square-youtube.png',
          alt: 'x'
        },
        link: '/portfolio/x',
        metadata: {
          category: 'x'
        }
      },
      {
        id: 'project-4-3',
        title: 'TokenWorks — Design & Build',
        description: 'x',
        type: 'standard' as const,
        media: {
          type: 'image' as const,
          src: '/media/projects/tokenworks-videos/square-av3.png',
          alt: 'x'
        },
        link: '/portfolio/x',
        metadata: {
          category: 'x'
        }
      }
    ]
  },
  {
    featured: {
      id: 'featured-5',
      title: 'Breeze — Brand Identity & Site',
      description: 'Brand identity and Framer site: logo system, type & palette, social kit, brand deck.',
      type: 'featured' as const,
      media: {
        type: 'image' as const,
        src: '/media/projects/breeze/hero-breeze.png',
        alt: 'Breeze on Arch Network Reel'
      },
      link: '/portfolio/iot-center',
      metadata: {
        category: 'Logo, Brand, Framer Landing Page, Social Assets',
        readTime: '4 min read'
      }
    },
    sidebar: [
      {
        id: 'project-5-1',
        title: 'x',
        description: 'x',
        type: 'standard' as const,
        media: {
          type: 'video' as const,
          src: '/media/projects/breeze/square-b.mp4',
          alt: 'x'
        },
        link: '/portfolio/x',
        metadata: {
          category: 'x'
        }
      },
      {
        id: 'project-5-2',
        title: 'x',
        description: 'x',
        type: 'standard' as const,
        media: {
          type: 'image' as const,
          src: '/media/projects/breeze/square-phone.png',
          alt: 'x'
        },
        link: '/portfolio/x',
        metadata: {
          category: 'x'
        }
      },
      {
        id: 'project-5-3',
        title: 'x',
        description: 'x',
        type: 'standard' as const,
        media: {
          type: 'image' as const,
          src: '/media/projects/breeze/square-hill.png',
          alt: 'x'
        },
        link: '/portfolio/x',
        metadata: {
          category: 'x'
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

  // const scaleClass = featured ? 'group-hover:scale-[1.0125]' : 'group-hover:scale-[1.025]';
  const scaleClass = ''; // Hover effect disabled

  return (
    <div className="relative cursor-default">
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
                    className={`absolute right-2 top-2 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-black/40 text-white backdrop-blur-lg transition duration-200 hover:bg-black/60 cursor-pointer ${
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
          <div className="text-black relative w-full pt-8">
            <div className="text-xl md:text-2xl lg:text-3xl font-semibold mb-2 cursor-default">
              {item.title}
            </div>
            <p className="text-neutral-600 text-base cursor-default">
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

      <SectionHeader leftText="PORTFOLIO" rightText="design / dev" />

      <OuterContainer className="flex-1">
        <InnerContainer className="pt-8 sm:pt-12 lg:pt-16 px-2.5 sm:px-6 relative">
          {/* Inner dashed vertical lines on desktop - matching Achievements section */}
          <div className="absolute left-0 top-0 bottom-0 line-dash-y hidden custom:block" />
          <div className="absolute right-0 top-0 bottom-0 line-dash-y hidden custom:block" />
          
          <h2
            className="font-medium text-black text-center mb:0 cursor-default"
            style={{
              fontSize: 'clamp(32px, 6vw, 48px)',
              lineHeight: 'clamp(97%, 1vw, 100%)',
              letterSpacing: '-1.5px'
            }}
          >
            Featured Work
          </h2>
        </InnerContainer>

        {/* Render all 5 sections sequentially */}
        <div className="w-full max-w-[1000px]">
          {portfolioSections.map((section, sectionIndex) => (
            <div key={section.featured.id} className="w-full">
              {sectionIndex > 0 && (
                <div className="w-full line-dash-x" />
              )}
              
              <InnerContainer className="py-10 sm:py-16 lg:py-20 px-2.5 sm:px-6 relative">
                {/* Inner dashed vertical lines for each section */}
                <div className="absolute left-0 top-0 bottom-0 line-dash-y hidden custom:block" />
                <div className="absolute right-0 top-0 bottom-0 line-dash-y hidden custom:block" />
                
                {/* Wrap entire section in clickable link - DISABLED */}
                {/* <a href={section.featured.link} className="block cursor-pointer group/section transition-all duration-300 hover:opacity-90"> */}
                <div className="block">
                  <div className="lg:grid lg:grid-cols-4 lg:gap-6">
                    {/* Featured item - sticky positioned on desktop */}
                    <div className="lg:col-span-3 mb-0">
                      <div className="lg:sticky lg:top-24">
                        {/* Mobile version - 9:16 aspect ratio */}
                        <div className="block lg:hidden ">
                          <MediaCard item={section.featured} aspectRatio="2/3" featured />
                          
                          {/* Mobile: Show sidebar images in a grid below */}
                          <div className="grid grid-cols-3 gap-2 mt-8">
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
                        {/* Small spacer to delay sticky end timing - adjust for first and last sections */}
                        <div style={{ height: (sectionIndex === 0 || sectionIndex === portfolioSections.length - 1) ? '76px' : '100px' }} />
                      </div>
                    </div>
                  </div>
                {/* </a> */}
                </div>
              </InnerContainer>
            </div>
          ))}
        </div>
      </OuterContainer>
      <div className="w-full line-dash-x" />
    </Section>
  );
}