import { LucideIcon } from 'lucide-react';

export interface ServiceFeature {
  icon: LucideIcon;
  title: string;
  description: string;
}

export interface CaseStudyMetric {
  label: string;
  value: string;
}

export interface CaseStudy {
  title: string;
  description: string;
  image: string;
  metrics: CaseStudyMetric[];
}

export interface ServiceLine {
  slug: string;
  name: string;
  description: string;
  icon: LucideIcon;
  features: ServiceFeature[];
}

export interface CoreService {
  slug: string;
  name: string;
  description: string;
  icon: LucideIcon;
  serviceLines: ServiceLine[];
}

export interface ServicePageData {
  coreServices: CoreService[];
}