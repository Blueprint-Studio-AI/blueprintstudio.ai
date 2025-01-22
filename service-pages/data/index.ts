//service-pages/data/index.ts
import { 
    // Core Service Icons
    Rocket, LineChart, Sparkles, Users, FlaskConical,
    
    // Create & Launch Icons
    Box, Globe, Zap, Code2, Wand2, Server, Smartphone,
    
    // Grow & Scale Icons
    TrendingUp, Palette, Megaphone, FileText, BarChart2, Share2,
    Image, Video, Bot,
    
    // Elevate & Perfect Icons
    Crown, Layout, Layers, HeartHandshake, CheckCircle, Gauge,
    Accessibility, PieChart,
    
    // Enable & Advance Icons
    UserPlus, ClipboardList, Target, GraduationCap, Workflow,
    Wrench, FileCode, Settings,
    
    // Innovate & Lead Icons
    Brain, Network, Factory, Laptop, TestTube,
    Database, Compass, Glasses,
    
  } from 'lucide-react';
  import type { ServicePageData } from '../types/service';
  
  export const services: ServicePageData = {
    coreServices: [
      {
        slug: 'create-launch',
        name: 'Create & Launch',
        description: 'Transform your vision into reality with custom digital solutions',
        icon: Rocket,
        serviceLines: [
          {
            slug: 'custom-software-development',
            name: 'Custom Software Development',
            description: 'Enterprise-grade custom software solutions',
            icon: Code2,
            features: []
          },
          {
            slug: 'web-application-development',
            name: 'Web Application Development',
            description: 'Scalable web applications and platforms',
            icon: Globe,
            features: []
          },
          {
            slug: 'mobile-app-development',
            name: 'Mobile App Development',
            description: 'Native and cross-platform mobile solutions',
            icon: Smartphone,  // Need to import this icon
            features: []
          },
          {
            slug: 'cloud-architecture',
            name: 'Cloud Architecture & Infrastructure',
            description: 'Scalable cloud-native solutions',
            icon: Server,
            features: []
          },
          {
            slug: 'api-development',
            name: 'API Development & Integration',
            description: 'Custom API solutions and integrations',
            icon: Workflow,
            features: []
          },
          {
            slug: 'devops-solutions',
            name: 'DevOps & CI/CD Solutions',
            description: 'Automated deployment and infrastructure',
            icon: Settings,
            features: []
          },
          {
            slug: 'enterprise-platforms',
            name: 'Enterprise Platform Development',
            description: 'Custom enterprise software platforms',
            icon: Box,
            features: []
          },
          {
            slug: 'saas-development',
            name: 'SaaS Product Development',
            description: 'Cloud-based software solutions',
            icon: Zap,
            features: []
          }
        ]
      },
      {
        slug: 'grow-scale',
        name: 'Grow & Scale',
        description: 'Expand your market presence and accelerate growth',
        icon: TrendingUp,
        serviceLines: [
          {
            slug: 'digital-marketing-strategy',
            name: 'Digital Marketing Strategy',
            description: 'Comprehensive digital marketing solutions',
            icon: Megaphone,
            features: []
          },
          {
            slug: 'search-engine-optimization',
            name: 'Search Engine Optimization (SEO)',
            description: 'Data-driven search optimization services',
            icon: BarChart2,
            features: []
          },
          {
            slug: 'paid-media-marketing',
            name: 'Paid Media Marketing (PPC)',
            description: 'Strategic paid advertising campaigns',
            icon: Target,
            features: []
          },
          {
            slug: 'content-marketing',
            name: 'Content Marketing Services',
            description: 'Strategic content creation and distribution',
            icon: FileText,
            features: []
          },
          {
            slug: 'brand-design-strategy',
            name: 'Brand Design & Strategy',
            description: 'Comprehensive brand identity and strategy',
            icon: Palette,
            features: []
          },
          {
            slug: 'content-strategy',
            name: 'Content Strategy & Planning',
            description: 'Strategic content planning and direction',
            icon: FileText,
            features: []
          },
          {
            slug: 'content-production',
            name: 'Content Production Services',
            description: 'Professional content creation and production',
            icon: Video,  // or could use Image
            features: []
          },
          {
            slug: 'social-media-marketing',
            name: 'Social Media Marketing',
            description: 'Comprehensive social media management',
            icon: Share2,
            features: []
          },
          {
            slug: 'email-marketing',
            name: 'Email Marketing Automation',
            description: 'Automated email marketing solutions',
            icon: Bot,
            features: []
          },
          {
            slug: 'conversion-optimization',
            name: 'Conversion Rate Optimization',
            description: 'Data-driven conversion improvement',
            icon: LineChart,
            features: []
          },
          {
            slug: 'marketing-analytics',
            name: 'Analytics & Performance Marketing',
            description: 'Marketing performance measurement and optimization',
            icon: PieChart,
            features: []
          }
        ]
      },
      {
        slug: 'elevate-perfect',
        name: 'Elevate & Perfect',
        description: 'Create exceptional experiences that delight and retain customers',
        icon: Crown,
        serviceLines: [
          {
            slug: 'ux-ui-design',
            name: 'UX/UI Design Services',
            description: 'User-centered design solutions',
            icon: Layout,
            features: []
          },
          {
            slug: 'product-design-systems',
            name: 'Product Design Systems',
            description: 'Scalable design system development',
            icon: Palette,
            features: []
          },
          {
            slug: 'web-design-services',
            name: 'Web Design Services',
            description: 'Professional website design solutions',
            icon: Globe,
            features: []
          },
          {
            slug: 'service-design',
            name: 'Service Design & Optimization',
            description: 'End-to-end service experience design',
            icon: Layers,
            features: []
          },
          {
            slug: 'digital-product-strategy',
            name: 'Digital Product Strategy',
            description: 'Strategic product planning and development',
            icon: Compass,
            features: []
          },
          {
            slug: 'quality-assurance',
            name: 'Quality Assurance Testing',
            description: 'Comprehensive quality testing services',
            icon: CheckCircle, // Need to import
            features: []
          },
          {
            slug: 'customer-experience',
            name: 'Customer Experience (CX) Design',
            description: 'End-to-end customer journey optimization',
            icon: HeartHandshake,
            features: []
          },
          {
            slug: 'accessibility-services',
            name: 'Accessibility Implementation',
            description: 'WCAG compliance and accessibility solutions',
            icon: Accessibility,
            features: []
          }
        ]
      },
      {
        slug: 'enable-advance',
        name: 'Enable & Advance',
        description: 'Empower your teams with the tools and knowledge to excel',
        icon: Sparkles,
        serviceLines: [
          {
            slug: 'staff-augmentation',
            name: 'Staff Augmentation Services',
            description: 'Skilled technical team extension',
            icon: UserPlus,
            features: []
          },
          {
            slug: 'devops-consulting',
            name: 'DevOps Consulting Services',
            description: 'DevOps transformation and optimization',
            icon: Settings,
            features: []
          },
          {
            slug: 'process-automation',
            name: 'Business Process Automation',
            description: 'Workflow and process optimization',
            icon: Workflow,
            features: []
          },
          {
            slug: 'technical-project-management',
            name: 'Technical Project Management',
            description: 'Expert project leadership and delivery',
            icon: ClipboardList, // Need to import
            features: []
          },
          {
            slug: 'technology-implementation',
            name: 'Technology Implementation',
            description: 'Enterprise technology deployment',
            icon: Wrench,
            features: []
          },
          {
            slug: 'software-training',
            name: 'Custom Software Training',
            description: 'Tailored technical training programs',
            icon: GraduationCap,
            features: []
          },
          {
            slug: 'it-strategy',
            name: 'IT Strategy Consulting',
            description: 'Strategic technology planning',
            icon: FileCode,
            features: []
          },
          {
            slug: 'enterprise-solutions',
            name: 'Enterprise Technology Solutions',
            description: 'Complete enterprise system solutions',
            icon: Database,
            features: []
          }
        ]
      },
      {
        slug: 'innovate-lead',
        name: 'Innovate & Lead',
        description: 'Pioneer the future with cutting-edge technology and innovation',
        icon: FlaskConical,
        serviceLines: [
          {
            slug: 'ai-automation',
            name: 'AI & Automation Solutions',
            description: 'Advanced artificial intelligence integration',
            icon: Brain,
            features: []
          },
          {
            slug: 'machine-learning',
            name: 'Machine Learning Services',
            description: 'Custom machine learning solutions',
            icon: Network, // Need to import
            features: []
          },
          {
            slug: 'ai-process-automation',
            name: 'AI Process Automation',
            description: 'Intelligent process automation solutions',
            icon: Bot,
            features: []
          },
          {
            slug: 'data-analytics',
            name: 'Data Analytics & Business Intelligence',
            description: 'Advanced data analysis and insights',
            icon: BarChart2,
            features: []
          },
          {
            slug: 'web3-development',
            name: 'Web3 Development Services',
            description: 'Blockchain and Web3 solutions',
            icon: Database,
            features: []
          },
          {
            slug: 'extended-reality',
            name: 'Extended Reality Development',
            description: 'AR/VR/MR development solutions',
            icon: Glasses, // Need to import
            features: []
          },
          {
            slug: 'digital-transformation',
            name: 'Digital Transformation Services',
            description: 'Complete business transformation solutions',
            icon: Factory,
            features: []
          },
          {
            slug: 'emerging-tech-consulting',
            name: 'Emerging Technology Consulting',
            description: 'Future-focused technology guidance',
            icon: Compass,
            features: []
          }
        ]
      }
    ]
  };