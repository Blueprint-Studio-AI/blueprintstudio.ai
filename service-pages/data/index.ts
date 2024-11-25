import { 
    // Core Service Icons
    Rocket, LineChart, Sparkles, Users, FlaskConical,
    
    // Create & Launch Icons
    Box, Globe, Zap, Code2, Wand2, Server,
    
    // Grow & Scale Icons
    TrendingUp, Palette, Megaphone, FileText, BarChart2, Share2,
    Image, Video, Bot,
    
    // Elevate & Perfect Icons
    Crown, Layout, Layers, HeartHandshake, UserCheck, Gauge,
    Accessibility, PieChart,
    
    // Enable & Advance Icons
    UserPlus, PencilRuler, Target, GraduationCap, Workflow,
    Wrench, FileCode, Settings,
    
    // Innovate & Lead Icons
    Brain, MessageSquare, Factory, Laptop, TestTube,
    Database, Compass, Leaf
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
            slug: 'digital-products',
            name: 'Digital Products',
            description: 'Custom digital solutions for modern businesses',
            icon: Box,
            features: []
          },
          {
            slug: 'websites',
            name: 'Websites',
            description: 'Professional web presence solutions',
            icon: Globe,
            features: []
          },
          {
            slug: 'mvp-development',
            name: 'MVP Development',
            description: 'Rapid solution deployment',
            icon: Zap,
            features: []
          },
          {
            slug: 'development-solutions',
            name: 'Development Solutions',
            description: 'Full-stack development expertise',
            icon: Code2,
            features: []
          },
          {
            slug: 'no-code-solutions',
            name: 'No-Code Solutions',
            description: 'Rapid development without coding',
            icon: Wand2,
            features: []
          },
          {
            slug: 'technical-infrastructure',
            name: 'Technical Infrastructure',
            description: 'Robust technical foundation',
            icon: Server,
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
            slug: 'brand-strategy-design',
            name: 'Brand Strategy & Design',
            description: 'Comprehensive brand development and design',
            icon: Palette,
            features: []
          },
          {
            slug: 'digital-marketing',
            name: 'Digital Marketing',
            description: 'Strategic digital marketing solutions',
            icon: Megaphone,
            features: []
          },
          {
            slug: 'content-marketing',
            name: 'Content Marketing',
            description: 'Engaging content strategy and creation',
            icon: FileText,
            features: []
          },
          {
            slug: 'seo-analytics',
            name: 'SEO & Analytics',
            description: 'Data-driven search optimization',
            icon: BarChart2,
            features: []
          },
          {
            slug: 'social-media',
            name: 'Social Media',
            description: 'Strategic social media management',
            icon: Share2,
            features: []
          },
          {
            slug: 'visual-content',
            name: 'Visual Content',
            description: 'Professional photography and design',
            icon: Image,
            features: []
          },
          {
            slug: 'video-production',
            name: 'Video Production',
            description: 'High-quality video content creation',
            icon: Video,
            features: []
          },
          {
            slug: 'marketing-automation',
            name: 'Marketing Automation',
            description: 'Automated marketing solutions',
            icon: Bot,
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
            slug: 'user-experience',
            name: 'User Experience (UX)',
            description: 'Human-centered design solutions',
            icon: Users,
            features: []
          },
          {
            slug: 'user-interface',
            name: 'User Interface (UI)',
            description: 'Intuitive interface design',
            icon: Layout,
            features: []
          },
          {
            slug: 'service-design',
            name: 'Service Design',
            description: 'End-to-end service optimization',
            icon: Layers,
            features: []
          },
          {
            slug: 'customer-experience',
            name: 'Customer Experience (CX)',
            description: 'Customer journey optimization',
            icon: HeartHandshake,
            features: []
          },
          {
            slug: 'employee-experience',
            name: 'Employee Experience (EX)',
            description: 'Internal systems and workflows',
            icon: UserCheck,
            features: []
          },
          {
            slug: 'performance-optimization',
            name: 'Performance Optimization',
            description: 'Technical performance enhancement',
            icon: Gauge,
            features: []
          },
          {
            slug: 'accessibility',
            name: 'Accessibility',
            description: 'Inclusive design implementation',
            icon: Accessibility,
            features: []
          },
          {
            slug: 'analytics-insights',
            name: 'Analytics & Insights',
            description: 'Data-driven improvement strategies',
            icon: PieChart,
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
            slug: 'team-augmentation',
            name: 'Team Augmentation',
            description: 'Skilled technical team extension',
            icon: UserPlus,
            features: []
          },
          {
            slug: 'design-teams',
            name: 'Design Teams',
            description: 'Expert design team support',
            icon: PencilRuler,
            features: []
          },
          {
            slug: 'marketing-teams',
            name: 'Marketing Teams',
            description: 'Marketing team enhancement',
            icon: Target,
            features: []
          },
          {
            slug: 'workshops-training',
            name: 'Workshops & Training',
            description: 'Professional skill development',
            icon: GraduationCap,
            features: []
          },
          {
            slug: 'process-automation',
            name: 'Process Automation',
            description: 'Workflow optimization solutions',
            icon: Workflow,
            features: []
          },
          {
            slug: 'technical-consulting',
            name: 'Technical Consulting',
            description: 'Expert technical guidance',
            icon: Wrench,
            features: []
          },
          {
            slug: 'documentation-knowledge',
            name: 'Documentation & Knowledge',
            description: 'Comprehensive knowledge management',
            icon: FileCode,
            features: []
          },
          {
            slug: 'tools-infrastructure',
            name: 'Tools & Infrastructure',
            description: 'Technical tooling solutions',
            icon: Settings,
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
            slug: 'ai-integration',
            name: 'AI Integration',
            description: 'Advanced AI solutions',
            icon: Brain,
            features: []
          },
          {
            slug: 'prompt-engineering',
            name: 'Prompt Engineering',
            description: 'AI implementation and optimization',
            icon: MessageSquare,
            features: []
          },
          {
            slug: 'digital-transformation',
            name: 'Digital Transformation',
            description: 'Business evolution strategies',
            icon: Factory,
            features: []
          },
          {
            slug: 'emerging-technology',
            name: 'Emerging Technology',
            description: 'Future-ready solutions',
            icon: Laptop,
            features: []
          },
          {
            slug: 'innovation-labs',
            name: 'Innovation Labs',
            description: 'R&D and prototyping',
            icon: TestTube,
            features: []
          },
          {
            slug: 'data-analytics',
            name: 'Data Analytics',
            description: 'Advanced data solutions',
            icon: Database,
            features: []
          },
          {
            slug: 'future-strategy',
            name: 'Future Strategy',
            description: 'Forward-thinking planning',
            icon: Compass,
            features: []
          },
          {
            slug: 'sustainability-tech',
            name: 'Sustainability Tech',
            description: 'Sustainable technology solutions',
            icon: Leaf,
            features: []
          }
        ]
      }
    ]
  };