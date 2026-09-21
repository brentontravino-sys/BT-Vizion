export interface Service {
  id: string;
  title: string;
  category: string;
  shortDesc: string;
  fullDesc: string;
  iconName: string;
  deliverables: string[];
  techStack: string[];
  metrics: string;
}

export interface ProjectView {
  id: string;
  name: string;
  urlPath?: string;
  image: string;
  badge?: string;
  description?: string;
}

export interface Project {
  id: string;
  title: string;
  client: string;
  category: 'Web Applications' | 'AI & Automation' | 'E-Commerce' | 'Enterprise Systems' | 'Cloud & Infrastructure';
  year: string;
  summary: string;
  challenge: string;
  solution: string;
  results: string[];
  tags: string[];
  image: string;
  domain?: string;
  views?: ProjectView[];
  liveUrl?: string;
  featured?: boolean;
}

export interface Testimonial {
  id: string;
  quote: string;
  clientName: string;
  role: string;
  company: string;
  location: string;
  rating: number;
  highlight: string;
}

export interface ProcessStep {
  step: string;
  title: string;
  description: string;
  deliverable: string;
}
