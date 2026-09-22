import { useState } from 'react';
import { motion } from 'motion/react';
import { ArrowUpRight, ArrowRight } from 'lucide-react';
import { PROJECTS } from '../data/content';
import { Project } from '../types';
import ProjectModal from './ProjectModal';
import BrowserMockup from './BrowserMockup';
import {
  ScrollReveal,
  ScrollStagger,
  ScrollStaggerItem,
  ScrollWordColorReveal,
  SpotlightCard,
  ScrollHeaderGradientFill,
} from './ScrollReveal';

interface PortfolioProps {
  onInquireProject: (projectName: string) => void;
  onNavigateToPortfolioPage?: () => void;
}

const CATEGORIES = [
  'All Work',
  'Web Applications',
  'AI & Automation',
  'E-Commerce',
  'Enterprise Systems',
  'Cloud & Infrastructure',
] as const;

export default function Portfolio({ onInquireProject, onNavigateToPortfolioPage }: PortfolioProps) {
  const [activeCategory, setActiveCategory] = useState<string>('All Work');
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  const filteredProjects = activeCategory === 'All Work'
    ? PROJECTS
    : PROJECTS.filter((p) => p.category === activeCategory);

  return (
    <section id="work" className="py-24 md:py-32 bg-transparent border-t border-white/10 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 md:px-8 relative z-10">
        {/* Header */}
        <ScrollReveal variant="fade-up" className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-14 border-b border-white/10">
          <div>
            <div className="text-xs uppercase tracking-widest text-blue-400 font-mono mb-3">
              [ 03 // PORTFOLIO & CASE STUDIES ]
            </div>
            <ScrollHeaderGradientFill
              as="h2"
              text="PROVEN RESULTS. ENGINEERED TO SCALE."
              className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight uppercase max-w-2xl leading-tight"
            />
          </div>
          <div className="max-w-md">
            <ScrollWordColorReveal
              text="Every digital platform and AI agent we launch is engineered with measurable business impact, extreme reliability, and clean aesthetics."
              className="text-xs sm:text-sm text-neutral-400 leading-relaxed font-normal"
            />
          </div>
        </ScrollReveal>

        {/* Category Filter Chips */}
        <ScrollReveal variant="fade-up" delay={0.1} className="mt-10 flex flex-wrap gap-2 pb-6 border-b border-white/10">
          {CATEGORIES.map((category) => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`px-4 py-2 text-xs font-mono uppercase tracking-wider transition-all duration-200 cursor-pointer ${
                activeCategory === category
                  ? 'bg-blue-500 text-white font-bold shadow-[0_0_15px_rgba(59,130,246,0.35)]'
                  : 'border border-blue-500/20 bg-black text-neutral-400 hover:text-blue-300 hover:border-blue-400/40'
              }`}
            >
              {category}
            </button>
          ))}
        </ScrollReveal>

        {/* Projects Grid */}
        <ScrollStagger staggerDelay={0.08} className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProjects.map((project) => (
            <ScrollStaggerItem key={project.id} className="h-full">
              <SpotlightCard
                spotlightColor="rgba(59, 130, 246, 0.12)"
                className="group border border-blue-500/20 bg-[#0c0c0d]/90 hover:border-blue-400/50 hover:shadow-[0_0_30px_rgba(59,130,246,0.14)] transition-all duration-300 flex flex-col h-full cursor-pointer overflow-hidden backdrop-blur-sm"
              >
                <div
                  onClick={() => setSelectedProject(project)}
                  className="flex flex-col h-full"
                >
                  {/* Card Top Browser Frame with Direct App / Site UI Screenshot */}
                  <div className="border-b border-white/10 bg-[#090d15]">
                    <BrowserMockup
                      title={project.title}
                      domain={project.domain || 'app.btvizion.co.za'}
                      views={
                        project.views && project.views.length > 0
                          ? project.views
                          : [
                              {
                                id: project.id,
                                name: 'Overview',
                                image: project.image,
                                badge: project.category,
                              },
                            ]
                      }
                      aspectRatio="aspect-[16/10]"
                      interactive={true}
                      seamless={true}
                      onExpand={() => setSelectedProject(project)}
                    />
                  </div>

                  {/* Card Body */}
                  <div className="p-6 flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between text-[11px] font-mono text-neutral-400 mb-2">
                        <span>{project.client}</span>
                        <span className="text-blue-400/90 font-semibold">{project.year}</span>
                      </div>

                      <h3 className="text-xl font-bold text-white tracking-tight uppercase group-hover:text-blue-100 transition-colors">
                        {project.title}
                      </h3>

                      <p className="mt-3 text-xs text-neutral-400 line-clamp-2 leading-relaxed">
                        {project.summary}
                      </p>
                    </div>

                    {/* Tags & Action */}
                    <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between">
                      <div className="flex flex-wrap gap-1.5">
                        {project.tags.slice(0, 2).map((t, idx) => (
                          <span
                            key={idx}
                            className="px-2 py-0.5 text-[10px] font-mono border border-blue-500/20 bg-blue-950/20 text-blue-300/80"
                          >
                            {t}
                          </span>
                        ))}
                      </div>

                      <span className="text-xs font-mono uppercase text-blue-400 flex items-center gap-1 group-hover:text-blue-300 group-hover:underline">
                        Case Study <ArrowRight className="w-3 h-3 transition-transform duration-200 group-hover:translate-x-1" />
                      </span>
                    </div>
                  </div>
                </div>
              </SpotlightCard>
            </ScrollStaggerItem>
          ))}
        </ScrollStagger>

        {/* Full Directory Link */}
        {onNavigateToPortfolioPage && (
          <div className="mt-14 text-center">
            <button
              onClick={onNavigateToPortfolioPage}
              className="inline-flex items-center gap-2 px-8 py-3.5 bg-blue-500 hover:bg-blue-400 text-black font-mono text-xs uppercase tracking-wider font-bold rounded shadow-[0_0_20px_rgba(59,130,246,0.3)] cursor-pointer transition-all hover:scale-[1.02]"
            >
              <span>Explore All {PROJECTS.length} Case Studies in Full Directory</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      {/* Selected Project Case Study Modal */}
      <ProjectModal
        project={selectedProject}
        onClose={() => setSelectedProject(null)}
        onInquire={onInquireProject}
      />
    </section>
  );
}
