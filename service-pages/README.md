# Blueprint Studio Services Documentation

## Current State

### Directory Structure
```
blueprintstudio.ai/
├── app/
│   └── services/
│       ├── page.tsx                    # Main services page
│       └── [service]/
│           ├── page.tsx                # Individual service page
│           ├── solutions/
│           │   └── [solution]/
│           │       └── page.tsx        # Solution page
│           └── industries/
│               └── [industry]/
│                   ├── page.tsx        # Industry page
│                   └── [city]/
│                       └── page.tsx    # City page
├── data/
│   └── services/
│       └── web-development/           # Example service
│           ├── meta.json              # Basic service info
│           ├── solutions.json         # Service solutions
│           └── industries.json        # Industry-specific info
└── service-pages/
    ├── components/
    │   ├── sections/                  # Page sections
    │   ├── templates/                 # Page templates
    │   └── ui/                        # Reusable UI components
    ├── data/
    │   └── index.ts                  # Services overview data
    ├── lib/
    │   └── data.ts                   # Data fetching utilities
    └── types/
        └── service-pages.ts          # TypeScript interfaces
```

### Current Data Flow
1. Services Overview Page (`/services`)
   - Uses data from `service-pages/data/index.ts`
   - Displays all core services and their service lines
   - Currently hardcoded data

2. Individual Service Pages (`/services/[service]`)
   - Reads from `/data/services/[service]/`
   - Uses JSON files for content
   - Falls back to mock data if files don't exist

### Page Types
1. Services Overview
   - Grid of core services
   - Each service shows its solutions
   - CTA sections

2. Service Page (rough - just data connection)
   - Service description
   - Solutions grid
   - Industries served
   - CTA section

3. Solution Page (not implemented)
4. Industry Page (not implemented)
5. City Page (not implemented)

## Future State

### Planned Improvements

#### 1. Data Management
```typescript
// Single source of truth in /data/services/
/data
  /services
    /web-development
      meta.ts          // Basic info + SEO
      solutions.ts     // Solutions with features
      industries.ts    // Industries with cities
      case-studies.ts  // Success stories
      testimonials.ts  // Client feedback
    /mobile-development
      // Similar structure
```

#### 2. Build Process
- Add build step to generate `service-pages/data/index.ts`
- Consolidate data from individual service directories
- Generate TypeScript types from data structure
- Create sitemaps automatically

#### 3. Additional Features
- Case studies section per service
- Testimonials integration
- Related services recommendations
- Industry-specific case studies
- City-specific content
- Service comparison tool
- ROI calculators

#### 4. SEO Enhancements
- Automated meta tag generation
- Structured data (JSON-LD)
- Dynamic sitemaps
- Canonical URL management
- Breadcrumb navigation

### Planned Page Types

1. Service Overview (`/services`)
```typescript
interface ServicesPage {
  hero: {
    title: string
    description: string
    cta: CTAButton
  }
  coreServices: CoreService[]
  featuredCaseStudies: CaseStudy[]
  testimonials: Testimonial[]
}
```

2. Service Page (`/services/[service]`)
```typescript
interface ServicePage {
  meta: ServiceMeta
  hero: HeroSection
  solutions: Solution[]
  industries: Industry[]
  caseStudies: CaseStudy[]
  testimonials: Testimonial[]
  relatedServices: RelatedService[]
}
```

3. Solution Page (`/services/[service]/solutions/[solution]`)
```typescript
interface SolutionPage {
  meta: SolutionMeta
  features: Feature[]
  benefits: Benefit[]
  process: ProcessStep[]
  technologies: Technology[]
  caseStudies: CaseStudy[]
  pricing: PricingTier[]
}
```

4. Industry Page (`/services/[service]/[industry]`)
```typescript
interface IndustryPage {
  meta: IndustryMeta
  challenges: Challenge[]
  solutions: Solution[]
  caseStudies: CaseStudy[]
  cities: City[]
  compliance: ComplianceInfo[]
}
```

### Development Roadmap

1. Phase 1 (Current)
   - ✓ Basic service pages
   - ✓ JSON data structure
   - ✓ Component templates

2. Phase 2 (Next Steps)
   - [ ] Service pages
   - [ ] Solution pages
   - [ ] Industry pages
   - [ ] Case studies integration
   - [ ] Build process for data consolidation

3. Phase 3
   - [ ] City pages
   - [ ] ROI calculators
   - [ ] Service comparisons
   - [ ] Advanced analytics
   - [ ] AI Features?

4. Phase 4
   - [ ] CMS integration
   - [ ] Dynamic content generation
   - [ ] A/B testing framework
   - [ ] Personalization
   - [ ] AI page creation / edit pipeline

### Notes for Developers
1. All components use the `"use client"` directive when needed
2. Framer Motion is used for animations
3. Tailwind CSS for styling
4. Next.js 14 app router
5. TypeScript for type safety

### Best Practices
1. Always update types when modifying data structure
2. Use loading and error states for all dynamic content
3. Keep SEO metadata current
4. Test mobile responsiveness
5. Maintain consistent spacing and typography

Would you like me to expand on any of these sections or add additional documentation?
Add to Conversation