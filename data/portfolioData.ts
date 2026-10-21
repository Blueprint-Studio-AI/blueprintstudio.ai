export interface MediaAsset {
  type: 'image' | 'video';
  src: string;
  poster?: string;
  /** Seconds into the reel the poster was taken; the /work pages start playback there, so poster and reel line up. */
  posterTime?: number;
  /** A strong stretch of the reel, [start, end] in seconds. The home page's small cards loop just this. */
  clip?: [number, number];
  alt: string;
  /** Size as displayed. The /work pages size each frame from it, so nothing jumps when it loads. */
  width?: number;
  height?: number;
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

// What we made for the client. Each value has a /work/<deliverable> page once
// at least two projects carry it (lib/work).
export type Deliverable = 'websites' | 'apps' | 'branding' | 'launch-videos';

// The client's field, as the project's own copy and media describe it.
export type Industry = 'crypto' | 'ai' | 'gaming';

export const deliverableLabels: Record<Deliverable, string> = {
  websites: 'Websites',
  apps: 'Apps',
  branding: 'Branding',
  'launch-videos': 'Launch videos',
};

export const industryLabels: Record<Industry, string> = {
  crypto: 'Crypto',
  ai: 'AI',
  gaming: 'Gaming',
};

export interface PortfolioProject {
  id: string;
  title: string;
  description: string;
  category: string;
  link?: string;
  featuredMedia: ResponsiveMedia;
  showcaseMedia: ShowcaseMedia[];
  deliverables: Deliverable[];
  industries: Industry[];
  /** The client's live site, where we know the address. */
  liveUrl?: string;
  /** Slug of the project's /brands/<slug> page, if it has one. */
  brandPage?: string;
  /** Media to lead with on one deliverable's wall instead of featuredMedia (e.g. the site, not the brand reel). */
  deliverableMedia?: Partial<Record<Deliverable, ResponsiveMedia>>;
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
        // Analytics, then the app on a laptop and a phone; the rest is pale on white.
        clip: [8.4, 12.3],
        alt: 'LivingIP Project Reel',
        width: 1920,
        height: 1080
      },
      mobile: {
        type: 'video',
        src: '/media/projects/living-ip/living-ip-vertical-compressed.mp4',
        poster: '/media/projects/living-ip/living-ip-mobile-poster.jpg',
        alt: 'LivingIP Project Reel',
        width: 720,
        height: 1080
      }
    },
    deliverables: ['apps'],
    industries: ['crypto', 'ai'],
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
    id: 'huch',
    title: 'Huch — Rebrand, Redesign & Platform Build',
    description: 'Full rebrand, product redesign, and end-to-end platform build.',
    category: 'Platform Design, Development, Branding, Research',
    link: '/portfolio/huch',
    featuredMedia: {
      desktop: {
        type: 'video',
        src: '/media/projects/huch/huch-brand-overview-horizontal-compressed.mp4',
        poster: '/media/projects/huch/huch-desktop-poster.jpg',
        posterTime: 1.6,
        alt: 'Huch Platform Redesign & Rebrand Reel',
        width: 1920,
        height: 1080
      },
      mobile: {
        type: 'video',
        src: '/media/projects/huch/huch-brand-overview-vertical-compressed.mp4',
        poster: '/media/projects/huch/huch-mobile-poster.jpg',
        posterTime: 1.6,
        alt: 'Huch Platform Redesign & Rebrand Reel',
        width: 720,
        height: 1080
      }
    },
    // The platform is a web app, so it sits under Apps; /launch's website
    // picker also shows it as a site. Not tagged crypto: nothing in its copy says so.
    deliverables: ['apps', 'branding'],
    industries: ['gaming'],
    showcaseMedia: [
      {
        id: 'huch-asset-1',
        type: 'image',
        src: '/media/projects/huch/huch-asset-1.png',
        alt: 'Huch platform redesign',
        caption: 'Platform redesign'
      },
      {
        id: 'huch-asset-2',
        type: 'image',
        src: '/media/projects/huch/huch-asset-2.png',
        alt: 'Huch rebrand',
        caption: 'Brand identity'
      },
      {
        id: 'huch-asset-3',
        type: 'image',
        src: '/media/projects/huch/huch-asset-3.png',
        alt: 'Huch social media',
        caption: 'Social media kit'
      }
    ],
    metadata: {
      client: 'Huch',
      year: '2025',
      services: ['Platform Design', 'Development', 'Branding', 'Social Media', 'Customer Research']
    }
  },
  {
    id: 'uni',
    title: 'UNI — Brand Identity',
    description: 'Brand identity for a Bitcoin-denominated stablecoin. Logo system, brand narrative, type & palette, and visual language.',
    category: 'Branding',
    link: '/portfolio/uni',
    featuredMedia: {
      desktop: {
        type: 'image',
        src: '/media/projects/uni/uni-brand-overview-horizontal.png',
        alt: 'UNI Brand Identity Overview',
        width: 5760,
        height: 3240
      },
      mobile: {
        type: 'image',
        src: '/media/projects/uni/uni-brand-overview-vertical.png',
        alt: 'UNI Brand Identity Overview',
        width: 1080,
        height: 1620
      }
    },
    // data/brandPortfolio.ts calls UNI a street-food brand; this entry (and the
    // "Refined Stability" line in its artwork) says stablecoin.
    deliverables: ['branding'],
    industries: ['crypto'],
    showcaseMedia: [
      {
        id: 'uni-asset-1',
        type: 'image',
        src: '/media/projects/uni/uni-brand-asset-1.png',
        alt: 'UNI brand asset',
        caption: 'Logo system'
      },
      {
        id: 'uni-asset-2',
        type: 'image',
        src: '/media/projects/uni/uni-brand-asset-2.png',
        alt: 'UNI brand asset',
        caption: 'Type & palette'
      },
      {
        id: 'uni-asset-3',
        type: 'image',
        src: '/media/projects/uni/uni-brand-asset-3.png',
        alt: 'UNI brand asset',
        caption: 'Visual language'
      }
    ],
    metadata: {
      client: 'UNI',
      year: '2025',
      services: ['Brand Identity', 'Logo Design', 'Visual Language']
    }
  },
  {
    id: 'bump',
    title: 'Bump — Brand & Product Design',
    description: 'Brand identity, product design, UX, and customer research for a memecoin platform.',
    category: 'Branding, Product Design, UX, Research',
    link: '/portfolio/bump',
    featuredMedia: {
      desktop: {
        type: 'video',
        src: '/media/projects/bump/bump-brand-overview-horizontal-compressed.mp4',
        poster: '/media/projects/bump/bump-desktop-poster.jpg',
        alt: 'Bump Brand & Product Design Reel',
        width: 1920,
        height: 1080
      },
      mobile: {
        type: 'video',
        src: '/media/projects/bump/bump-brand-overview-vertical-compressed.mp4',
        poster: '/media/projects/bump/bump-mobile-poster.jpg',
        alt: 'Bump Brand & Product Design Reel',
        width: 720,
        height: 1080
      }
    },
    deliverables: ['branding', 'apps'],
    industries: ['crypto'],
    showcaseMedia: [
      {
        id: 'bump-asset-1',
        type: 'image',
        src: '/media/projects/bump/bump-asset-1.png',
        alt: 'Bump brand asset',
        caption: 'Brand identity'
      },
      {
        id: 'bump-asset-2',
        type: 'image',
        src: '/media/projects/bump/bump-asset-2.png',
        alt: 'Bump product design',
        caption: 'Product design'
      },
      {
        id: 'bump-asset-3',
        type: 'image',
        src: '/media/projects/bump/bump-asset-3.png',
        alt: 'Bump platform UX',
        caption: 'Platform UX'
      }
    ],
    metadata: {
      client: 'Bump',
      year: '2025',
      services: ['Brand Identity', 'Brand Strategy', 'Product Design', 'UX', 'Customer Research']
    }
  },
  {
    id: 'arch-network',
    title: 'Arch Network — BTC All-In Summit',
    description: 'Event branding, motion media and marketing for the BTC All-In Summit.',
    category: 'Motion Media, Graphic Design, IRL Event',
    link: '/portfolio/arch-network',
    featuredMedia: {
      desktop: {
        type: 'video',
        src: '/media/projects/arch-vegas/arch-vegas-horizontal-compressed.mp4',
        poster: '/media/projects/arch-vegas/arch-vegas-desktop-poster.jpg',
        alt: 'Arch Network BTC All-In Summit Project Reel',
        width: 1920,
        height: 1080
      },
      mobile: {
        type: 'video',
        src: '/media/projects/arch-vegas/arch-vegas-vertical-compressed.mp4',
        poster: '/media/projects/arch-vegas/arch-vegas-mobile-poster.jpg',
        alt: 'Arch Network BTC All-In Summit Project Reel',
        width: 720,
        height: 1080
      }
    },
    // Event branding and motion for a summit, not a product launch, so it's
    // left off Launch videos.
    deliverables: ['branding'],
    industries: ['crypto'],
    brandPage: 'arch',
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
      year: '2025',
      services: ['Motion Design', 'Event Graphics', 'Brand Design']
    }
  },
  {
    id: 'perena',
    title: 'Perena — Landing Page',
    description: 'Landing page design, development, and motion media for the launch of USD*.',
    category: 'Design, Development, Motion Media',
    link: '/portfolio/perena',
    featuredMedia: {
      desktop: {
        type: 'video',
        src: '/media/projects/perena/perena-horizontal-compressed.mp4',
        poster: '/media/projects/perena/perena-desktop-poster.jpg',
        posterTime: 1,
        // The laptop and the deposit flow; from about 3.7s it fades to cream on cream.
        clip: [0.75, 3.4],
        alt: 'Perena USD* Landing Page Project Reel',
        width: 1920,
        height: 1080
      },
      mobile: {
        // Stored 1920x1080 with tall pixels: it plays 2:3.
        type: 'video',
        src: '/media/projects/perena/perena-vertical-compressed.mp4',
        poster: '/media/projects/perena/perena-mobile-poster.jpg',
        posterTime: 1,
        alt: 'Perena USD* Landing Page Project Reel',
        width: 720,
        height: 1080
      }
    },
    deliverables: ['websites', 'launch-videos'],
    industries: ['crypto'],
    showcaseMedia: [
      {
        id: 'perena-asset-1',
        type: 'image',
        src: '/media/projects/perena/perena-brand-asset-1.png',
        alt: 'Landing hero image',
        caption: 'Landing hero dark'
      },
      {
        id: 'perena-asset-2',
        type: 'image',
        src: '/media/projects/perena/perena-brand-asset-2.png',
        alt: 'APY breakdown section',
        caption: 'APY breakdown'
      },
      {
        id: 'perena-asset-3',
        type: 'image',
        src: '/media/projects/perena/perena-brand-asset-3.png',
        alt: 'Mobile versions',
        caption: 'Mobile versions'
      }
    ],
    metadata: {
      client: 'Perena',
      year: '2026',
      services: ['Landing Page Design', 'Web Development', 'Motion Media']
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
        // The triangle pattern into its homepage, as in the hero.
        clip: [3.8, 7.8],
        alt: 'Autara on Arch Network Project Reel',
        width: 1620,
        height: 1080
      },
      mobile: {
        type: 'video',
        src: '/media/projects/autara/autara-vertical-compressed.mp4',
        poster: '/media/projects/autara/autara-mobile-poster.jpg',
        alt: 'Autara on Arch Network Project Reel',
        width: 720,
        height: 1080
      }
    },
    // DeFi on Arch Network per /brand and the site in its media;
    // data/brandPortfolio.ts calls it AI infrastructure.
    deliverables: ['branding', 'websites'],
    industries: ['crypto'],
    deliverableMedia: {
      websites: {
        desktop: {
          type: 'image',
          src: '/media/projects/autara/recent-work-card.webp',
          alt: 'Autara landing page on a laptop',
          width: 2232,
          height: 1712
        },
        mobile: {
          type: 'image',
          src: '/media/recent-work/autara-mobile.webp',
          alt: 'Autara landing page on a laptop',
          width: 1980,
          height: 1596
        }
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
      year: '2025',
      services: ['Brand Identity', 'Logo System', 'Framer Landing Page', 'Social Kit', 'Brand Deck']
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
        alt: 'TokenWorks Design & Build Reel',
        width: 1920,
        height: 1080
      },
      mobile: {
        type: 'video',
        src: '/media/projects/tokenworks-videos/tokenworks-videos-horizontal-compressed.mp4', // Using same video for now
        poster: '/media/projects/tokenworks-videos/tokenworks-mobile-poster.jpg',
        alt: 'TokenWorks Design & Build Reel',
        width: 1920,
        height: 1080
      }
    },
    // The reel is product videos (on /launch-videos as AV3 and IDVisor). The
    // e-commerce and app work in the description has no media here yet, and
    // nothing places the client in one of the industries above.
    deliverables: ['launch-videos'],
    industries: [],
    deliverableMedia: {
      // The desktop poster above is a store page, and the reel opens on black,
      // so the wall uses a frame from 6s in and starts the reel there.
      'launch-videos': {
        desktop: {
          type: 'video',
          src: '/media/projects/tokenworks-videos/tokenworks-videos-horizontal-compressed.mp4',
          poster: '/media/projects/tokenworks-videos/tokenworks-poster.jpg',
          posterTime: 6,
          // Past the black opening, as in the hero.
          clip: [4.6, 16.4],
          alt: 'TokenWorks product videos reel',
          width: 1920,
          height: 1080
        },
        mobile: {
          type: 'video',
          src: '/media/projects/tokenworks-videos/tokenworks-videos-horizontal-compressed.mp4',
          poster: '/media/projects/tokenworks-videos/tokenworks-poster.jpg',
          posterTime: 6,
          alt: 'TokenWorks product videos reel',
          width: 1920,
          height: 1080
        }
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
      year: '2023-2026',
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
        alt: 'Breeze on Arch Network Reel',
        width: 1920,
        height: 1080
      },
      mobile: {
        type: 'image',
        src: '/media/projects/breeze/hero-breeze-mobile.jpg',
        alt: 'Breeze on Arch Network Reel',
        width: 720,
        height: 1080
      }
    },
    deliverables: ['branding', 'websites'],
    industries: ['crypto'],
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
      year: '2025',
      services: ['Brand Identity', 'Framer Site', 'Social Media Kit']
    }
  }
];

// Projects added for the /work pages, after the home page's original portfolio
// above. Both already appear on /brand as recent work and have their own
// /brands pages; copy and media are reused from there.
export const workOnlyProjects: PortfolioProject[] = [
  {
    id: 'honeyb',
    title: 'HoneyB — Brand, Website & Deck',
    description: 'From blank slate to market-ready in one package. We built HoneyB’s entire brand presence as a single cohesive system.',
    category: 'Brand, Website, Deck',
    featuredMedia: {
      desktop: {
        type: 'image',
        src: '/launch-assets/web-design_assets/desktop-honeyb.png',
        alt: 'HoneyB website on a laptop',
        width: 1440,
        height: 926
      },
      mobile: {
        type: 'image',
        src: '/launch-assets/web-design_assets/desktop-honeyb.png',
        alt: 'HoneyB website on a laptop',
        width: 1440,
        height: 926
      }
    },
    showcaseMedia: [],
    deliverables: ['websites', 'branding'],
    industries: ['crypto'],
    liveUrl: 'https://www.honeybtc.com',
    brandPage: 'honeyb',
    deliverableMedia: {
      branding: {
        desktop: {
          type: 'image',
          src: '/media/hero/honeyb_brands-we-built.png',
          alt: 'HoneyB brand identity',
          width: 1080,
          height: 984
        },
        mobile: {
          type: 'image',
          src: '/media/hero/honeyb_brands-we-built.png',
          alt: 'HoneyB brand identity',
          width: 1080,
          height: 984
        }
      }
    },
    metadata: {
      client: 'HoneyB',
      year: '2026',
      services: ['Brand Identity', 'Website', 'Pitch Deck']
    }
  },
  {
    id: 'jinba',
    title: 'Jinba — Brand Identity & Website',
    description: 'Brand identity for an enterprise automation platform serving regulated industries. Logo system, brand narrative, a refreshed website and a design system.',
    category: 'Brand, Website, Design System',
    featuredMedia: {
      desktop: {
        type: 'image',
        src: '/media/recent-work/jinba-desktop.webp',
        alt: 'Jinba website in a browser window',
        width: 2232,
        height: 1712
      },
      mobile: {
        type: 'image',
        src: '/media/recent-work/jinba-mobile.webp',
        alt: 'Jinba website in a browser window',
        width: 1980,
        height: 1596
      }
    },
    showcaseMedia: [],
    deliverables: ['websites', 'branding'],
    industries: ['ai'],
    // The address in the browser bar of the site screenshot.
    liveUrl: 'https://jinba.io',
    brandPage: 'jinba',
    deliverableMedia: {
      branding: {
        desktop: {
          type: 'image',
          src: '/brands/jinba/og-image.png',
          alt: 'Jinba brand identity',
          width: 1200,
          height: 630
        },
        mobile: {
          type: 'image',
          src: '/brands/jinba/og-image.png',
          alt: 'Jinba brand identity',
          width: 1200,
          height: 630
        }
      }
    },
    metadata: {
      client: 'Jinba',
      year: '2026',
      services: ['Brand Identity', 'Website', 'Design System']
    }
  }
];

export const allWorkProjects: PortfolioProject[] = [...portfolioProjects, ...workOnlyProjects];

// The home page's Featured Work (components/Home/PortfolioBento.tsx): the
// projects each filter shows, in order, at most six. "All work" leads with
// recent, live clients across all four kinds of work. Each filter opens on the
// clients the hero names for it. Huch is no longer trading, so it's left out
// of "All work" and comes last where it shows.
export const featuredWork: Record<'all' | Deliverable, string[]> = {
  all: ['perena', 'arch-network', 'tokenworks', 'jinba', 'livingip', 'honeyb'],
  apps: ['livingip', 'bump', 'huch'],
  websites: ['perena', 'autara', 'breeze', 'jinba', 'honeyb'],
  branding: ['autara', 'arch-network', 'honeyb', 'jinba', 'bump', 'uni'],
  'launch-videos': ['tokenworks', 'perena'],
};