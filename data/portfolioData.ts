export interface MediaAsset {
  type: 'image' | 'video';
  src: string;
  poster?: string;
  alt: string;
}

export interface ResponsiveMedia {
  desktop: MediaAsset;
  mobile: MediaAsset;
}

export interface ShowcaseMedia {
  id: string;
  type: 'image' | 'video';
  src: string;
  poster?: string;
  alt: string;
  caption?: string;
}

export interface PortfolioProject {
  id: string;
  title: string;
  description: string;
  category: string;
  link?: string;
  featuredMedia: ResponsiveMedia;
  showcaseMedia: ShowcaseMedia[];
  metadata?: {
    client?: string;
    year?: string;
    services?: string[];
    testimonial?: string;
  };
}

export const portfolioProjects: PortfolioProject[] = [
  {
    id: 'livingip',
    title: 'LivingIP — On-Chain AI Agents',
    description: 'UI/UX and product design for on-chain AI agents. Clarified vision. Simplified flows.',
    category: 'Product Design',
    link: '/portfolio/livingip',
    featuredMedia: {
      desktop: {
        type: 'video',
        src: '/media/projects/living-ip/living-ip-horizontal-compressed.mp4',
        poster: '/media/projects/living-ip/living-ip-desktop-poster.jpg',
        alt: 'LivingIP Project Reel'
      },
      mobile: {
        type: 'video',
        src: '/media/projects/living-ip/living-ip-vertical-compressed.mp4',
        poster: '/media/projects/living-ip/living-ip-mobile-poster.jpg',
        alt: 'LivingIP Project Reel'
      }
    },
    showcaseMedia: [
      {
        id: 'livingip-votes',
        type: 'image',
        src: '/media/projects/living-ip/square-votes.png',
        alt: 'LivingIP voting interface',
        caption: 'Governance voting UI'
      },
      {
        id: 'livingip-analytics',
        type: 'image',
        src: '/media/projects/living-ip/square-analytics.png',
        alt: 'LivingIP analytics dashboard',
        caption: 'Real-time analytics'
      },
      {
        id: 'livingip-badges',
        type: 'image',
        src: '/media/projects/living-ip/square-badges.png',
        alt: 'LivingIP achievement badges',
        caption: 'Gamification elements'
      }
    ],
    metadata: {
      client: 'LivingIP',
      year: '2024',
      services: ['UI/UX Design', 'Product Strategy', 'Prototyping']
    }
  },
  {
    id: 'arch-network',
    title: 'Arch Network — BTC All-In Summit',
    description: 'Las Vegas event motion media and graphic design for the BTC All-In Summit; ongoing design & build partner.',
    category: 'Motion Media, Graphic Design, IRL Event',
    link: '/portfolio/arch-network',
    featuredMedia: {
      desktop: {
        type: 'video',
        src: '/media/projects/arch-vegas/arch-vegas-horizontal-compressed.mp4',
        poster: '/media/projects/arch-vegas/arch-vegas-desktop-poster.jpg',
        alt: 'Arch Network BTC All-In Summit Project Reel'
      },
      mobile: {
        type: 'video',
        src: '/media/projects/arch-vegas/arch-vegas-vertical-compressed.mp4',
        poster: '/media/projects/arch-vegas/arch-vegas-mobile-poster.jpg',
        alt: 'Arch Network BTC All-In Summit Project Reel'
      }
    },
    showcaseMedia: [
      {
        id: 'arch-screens',
        type: 'video',
        src: '/media/projects/arch-vegas/square-screens.mov',
        poster: '/media/projects/arch-vegas/square-screens-poster.jpg',
        alt: 'Event screen displays',
        caption: 'Live event visuals'
      },
      {
        id: 'arch-docs',
        type: 'image',
        src: '/media/projects/arch-vegas/square-docs-graphic.png',
        alt: 'Documentation graphics',
        caption: 'Technical diagrams'
      },
      {
        id: 'arch-logos',
        type: 'image',
        src: '/media/projects/arch-vegas/square-logos.png',
        alt: 'Logo variations',
        caption: 'Brand system'
      }
    ],
    metadata: {
      client: 'Arch Network',
      year: '2024',
      services: ['Motion Design', 'Event Graphics', 'Brand Design']
    }
  },
  {
    id: 'autara',
    title: 'Autara — Brand Identity & Web Design',
    description: 'Brand identity and Framer landing page for Autara: logo system, type & palette, social kit, brand deck.',
    category: 'Logo, Brand, Framer Landing Page, Social Assets',
    link: '/portfolio/autara',
    featuredMedia: {
      desktop: {
        type: 'video',
        src: '/media/projects/autara/autara-horizontal-compressed.mp4',
        poster: '/media/projects/autara/autara-desktop-poster.jpg',
        alt: 'Autara on Arch Network Project Reel'
      },
      mobile: {
        type: 'video',
        src: '/media/projects/autara/autara-vertical-compressed.mp4',
        poster: '/media/projects/autara/autara-mobile-poster.jpg',
        alt: 'Autara on Arch Network Project Reel'
      }
    },
    showcaseMedia: [
      {
        id: 'autara-logo',
        type: 'image',
        src: '/media/projects/autara/square-logo.png',
        alt: 'Autara logo design',
        caption: 'Logo system'
      },
      {
        id: 'autara-chart',
        type: 'image',
        src: '/media/projects/autara/square-pie-chart.png',
        alt: 'Data visualization design',
        caption: 'Analytics UI'
      },
      {
        id: 'autara-table',
        type: 'image',
        src: '/media/projects/autara/square-table.png',
        alt: 'Dashboard table design',
        caption: 'Data tables'
      }
    ],
    metadata: {
      client: 'Autara',
      year: '2024',
      services: ['Brand Identity', 'Web Design', 'Framer Development']
    }
  },
  {
    id: 'tokenworks',
    title: 'TokenWorks — Marketing Videos',
    description: 'Ongoing multi-disciplinary end-to-end design, engineering, and growth: headless ecommerce, apps, media, brand, and strategy.',
    category: 'Design & Build',
    link: '/portfolio/tokenworks',
    featuredMedia: {
      desktop: {
        type: 'video',
        src: '/media/projects/tokenworks-videos/tokenworks-videos-horizontal-compressed.mp4',
        poster: '/images/work/idscanner.png',
        alt: 'TokenWorks Design & Build Reel'
      },
      mobile: {
        type: 'video',
        src: '/media/projects/tokenworks-videos/tokenworks-videos-horizontal-compressed.mp4', // Using same video for now
        poster: '/media/projects/tokenworks-videos/tokenworks-mobile-poster.jpg',
        alt: 'TokenWorks Design & Build Reel'
      }
    },
    showcaseMedia: [
      {
        id: 'tokenworks-idvs',
        type: 'image',
        src: '/media/projects/tokenworks-videos/square-idvs+.png',
        alt: 'IDVS+ platform interface',
        caption: 'Platform UI'
      },
      {
        id: 'tokenworks-youtube',
        type: 'image',
        src: '/media/projects/tokenworks-videos/square-youtube.png',
        alt: 'YouTube content strategy',
        caption: 'Video content'
      },
      {
        id: 'tokenworks-av3',
        type: 'image',
        src: '/media/projects/tokenworks-videos/square-av3.png',
        alt: 'AV3 product showcase',
        caption: 'Product videos'
      }
    ],
    metadata: {
      client: 'TokenWorks',
      year: '2023-2024',
      services: ['Video Production', 'Marketing', 'Full-Stack Development', 'E-commerce']
    }
  },
  {
    id: 'breeze',
    title: 'Breeze — Brand Identity & Site',
    description: 'Brand identity and Framer site: logo system, type & palette, social kit, brand deck.',
    category: 'Logo, Brand, Framer Landing Page, Social Assets',
    link: '/portfolio/breeze',
    featuredMedia: {
      desktop: {
        type: 'image',
        src: '/media/projects/breeze/hero-breeze.jpg',
        alt: 'Breeze on Arch Network Reel'
      },
      mobile: {
        type: 'image',
        src: '/media/projects/breeze/hero-breeze-mobile.jpg',
        alt: 'Breeze on Arch Network Reel'
      }
    },
    showcaseMedia: [
      {
        id: 'breeze-animation',
        type: 'video',
        src: '/media/projects/breeze/square-b.mp4',
        poster: '/media/projects/breeze/square-b-poster.jpg',
        alt: 'Breeze logo animation',
        caption: 'Logo animation'
      },
      {
        id: 'breeze-mobile',
        type: 'image',
        src: '/media/projects/breeze/square-phone.png',
        alt: 'Mobile app design',
        caption: 'Mobile experience'
      },
      {
        id: 'breeze-landscape',
        type: 'image',
        src: '/media/projects/breeze/square-hill.png',
        alt: 'Brand illustration',
        caption: 'Visual identity'
      }
    ],
    metadata: {
      client: 'Breeze',
      year: '2024',
      services: ['Brand Identity', 'Framer Site', 'Social Media Kit']
    }
  }
];