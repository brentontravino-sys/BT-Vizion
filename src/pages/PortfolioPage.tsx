import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  ArrowLeft,
  ArrowUpRight,
  Search,
  SlidersHorizontal,
  X,
  ExternalLink,
  CheckCircle2,
  Calendar,
  Building,
  Tag,
  Sparkles,
  Layers,
  ArrowRight,
  ShieldCheck,
  Zap,
} from 'lucide-react';
import { PROJECTS, AGENCY_INFO } from '../data/content';
import { Project } from '../types';
import BrowserMockup from '../components/BrowserMockup';
import ProjectModal from '../components/ProjectModal';

interface PortfolioPageProps {
  onNavigateHome: () => void;
  onOpenContact: () => void;
  onInquireProject: (projectName: string) => void;
  initialCategory?: string;
}

const CATEGORIES = [
  'All Work',
  'Enterprise Systems',
  'AI & Automation',
  'Web Applications',
  'E-Commerce',
  'Cloud & Infrastructure',
] as const;

export default function PortfolioPage({
  onNavigateHome,
  onOpenContact,
  onInquireProject,
  initialCategory,
}: PortfolioPageProps) {
  const [activeCategory, setActiveCategory] = useState<string>(
    initialCategory && CATEGORIES.includes(initialCategory as any) ? initialCategory : 'All Work'
  );
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [onlyFeatured, setOnlyFeatured] = useState<boolean>(false);

  // Filter projects by category, search query, and featured toggle
  const filteredProjects = useMemo(() => {
    return PROJECTS.filter((project) => {
      // Category filter
      if (activeCategory !== 'All Work' && project.category !== activeCategory) {
        return false;
      }
      // Featured toggle
      if (onlyFeatured && !project.featured) {
        return false;
      }
      // Search query filter (matches title, client, summary, tags, solution, results)
      if (searchQuery.trim() !== '') {
        const q = searchQuery.toLowerCase();
        const matchesTitle = project.title.toLowerCase().includes(q);
        const matchesClient = project.client.toLowerCase().includes(q);
        const matchesSummary = project.summary.toLowerCase().includes(q);
        const matchesTags = project.tags.some((t) => t.toLowerCase().includes(q));
        const matchesCategory = project.category.toLowerCase().includes(q);
        const matchesSolution = project.solution.toLowerCase().includes(q);

        if (!matchesTitle && !matchesClient && !matchesSummary && !matchesTags && !matchesCategory && !matchesSolution) {
          return false;
        }
      }
      return true;
    });
  }, [activeCategory, searchQuery, onlyFeatured]);

  const handleInquireFromModal = (projectName: string) => {
    setSelectedProject(null);
    onInquireProject(projectName);
  };

  return (
    <div className="pt-24 pb-32 text-[#f4f4f5] relative z-10">
      {/* Top Breadcrumb & Navigation */}
      <div className="max-w-7xl mx-auto px-6 md:px-8 mb-8">
        <div className="flex items-center justify-between py-3 border-b border-white/10 text-xs font-mono">
          <button
            onClick={onNavigateHome}
            className="flex items-center gap-2 text-neutral-400 hover:text-blue-300 transition-colors cursor-pointer group"
          >
            <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
            <span>RETURN TO MAIN OVERVIEW</span>
          </button>
          <div className="flex items-center gap-2 text-neutral-400">
            <span className="hover:text-white cursor-pointer" onClick={onNavigateHome}>
              BT VIZION
            </span>
            <span className="text-blue-500">/</span>
            <span className="text-blue-300 font-semibold uppercase">PORTFOLIO DIRECTORY</span>
            <span className="text-neutral-500 hidden sm:inline">({PROJECTS.length} CASE STUDIES)</span>
          </div>
        </div>
      </div>

      {/* Hero Section with High-Contrast Atmosphere */}
      <div className="max-w-7xl mx-auto px-6 md:px-8 mb-16">
        <div className="relative rounded-xl border border-blue-500/25 bg-[#0a0d14]/90 overflow-hidden shadow-2xl p-8 sm:p-12 md:p-16">
          {/* Ambient Video Background */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-20">
            <video
              autoPlay
              loop
              muted
              playsInline
              className="w-full h-full object-cover"
            >
              <source
                src="https://cdn.pixabay.com/video/2019/04/16/22896-331571212_large.mp4"
                type="video/mp4"
              />
            </video>
            <div className="absolute inset-0 bg-gradient-to-r from-[#080808] via-[#080808]/85 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#080808] via-transparent to-transparent" />
          </div>

          <div className="relative z-10 max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-950/40 border border-blue-500/30 text-blue-300 text-xs font-mono mb-4">
              <Sparkles className="w-3.5 h-3.5 text-blue-400" />
              <span>PRODUCTION WORK &amp; SYSTEM ARCHITECTURE</span>
            </div>

            <h1 className="text-4xl sm:text-5xl md:text-6xl font-black uppercase tracking-tight text-white leading-tight">
              PROVEN OUTCOMES. <span className="text-blue-400">ENGINEERED</span> TO SCALE.
            </h1>

            <p className="mt-6 text-base sm:text-lg text-neutral-300 leading-relaxed font-normal">
              Explore our complete catalogue of enterprise applications, autonomous AI agent pipelines, headless commerce stores, and cloud infrastructures deployed with zero downtime.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-4">
              <button
                onClick={onOpenContact}
                className="px-6 py-3 bg-blue-500 hover:bg-blue-400 text-black font-bold uppercase tracking-wider text-xs transition-all duration-300 shadow-[0_0_20px_rgba(59,130,246,0.3)] flex items-center gap-2 cursor-pointer"
              >
                <span>Commission New Project</span>
                <ArrowUpRight className="w-4 h-4" />
              </button>
              <a
                href="#case-studies-grid"
                className="px-6 py-3 border border-blue-500/30 hover:border-blue-400 text-blue-200 text-xs font-mono uppercase tracking-wider hover:bg-blue-950/20 transition-all duration-200"
              >
                Inspect All {PROJECTS.length} Case Studies ↓
              </a>
            </div>
          </div>

          {/* Key Metrics Banner */}
          <div className="mt-12 pt-8 border-t border-blue-500/20 grid grid-cols-2 sm:grid-cols-4 gap-6 relative z-10">
            <div>
              <div className="text-2xl sm:text-3xl font-bold text-blue-400 font-mono">{PROJECTS.length}+</div>
              <div className="text-xs text-neutral-400 uppercase tracking-wider font-mono mt-1">
                Completed Case Studies
              </div>
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-bold text-white font-mono">R48M+</div>
              <div className="text-xs text-neutral-400 uppercase tracking-wider font-mono mt-1">
                Client Pipeline Created
              </div>
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-bold text-blue-400 font-mono">99.98%</div>
              <div className="text-xs text-neutral-400 uppercase tracking-wider font-mono mt-1">
                Telemetry Reliability
              </div>
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-bold text-white font-mono">&lt; 0.8s</div>
              <div className="text-xs text-neutral-400 uppercase tracking-wider font-mono mt-1">
                Average Load Latency
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Filter and Search Controls Bar */}
      <div id="case-studies-grid" className="max-w-7xl mx-auto px-6 md:px-8 mb-10">
        <div className="p-6 rounded-xl border border-blue-500/20 bg-[#0c0f17]/90 backdrop-blur-md flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-6 shadow-xl">
          {/* Category Filter Chips */}
          <div className="flex flex-wrap items-center gap-2">
            {CATEGORIES.map((category) => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`px-3.5 py-2 text-xs font-mono uppercase tracking-wider transition-all duration-200 cursor-pointer rounded ${
                  activeCategory === category
                    ? 'bg-blue-500 text-white font-bold shadow-[0_0_15px_rgba(59,130,246,0.35)]'
                    : 'border border-blue-500/20 bg-black/60 text-neutral-400 hover:text-blue-200 hover:border-blue-400/40'
                }`}
              >
                {category}
              </button>
            ))}
          </div>

          {/* Search Query & Featured Toggle */}
          <div className="flex flex-wrap items-center gap-3">
            {/* Search Input */}
            <div className="relative flex-1 sm:w-72">
              <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search tech, client, keyword..."
                className="w-full pl-9 pr-8 py-2 bg-black/80 border border-blue-500/25 rounded text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400 font-mono"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-white"
                  title="Clear search"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Featured Only Toggle Button */}
            <button
              onClick={() => setOnlyFeatured(!onlyFeatured)}
              className={`px-3 py-2 text-xs font-mono uppercase tracking-wider rounded border transition-colors cursor-pointer flex items-center gap-1.5 ${
                onlyFeatured
                  ? 'bg-blue-950/80 border-blue-400 text-blue-200 font-bold'
                  : 'bg-black/40 border-white/10 text-neutral-400 hover:text-white'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-blue-400" />
              <span>Featured Only</span>
            </button>
          </div>
        </div>

        {/* Results Counter Bar */}
        <div className="mt-4 flex items-center justify-between text-xs font-mono text-neutral-400 px-1">
          <div>
            Showing <span className="text-blue-400 font-bold">{filteredProjects.length}</span> of {PROJECTS.length} verified projects
            {activeCategory !== 'All Work' && (
              <span className="text-neutral-500"> in <span className="text-neutral-300">{activeCategory}</span></span>
            )}
            {searchQuery && (
              <span className="text-neutral-500"> matching &ldquo;<span className="text-blue-300">{searchQuery}</span>&rdquo;</span>
            )}
          </div>
          {(searchQuery || activeCategory !== 'All Work' || onlyFeatured) && (
            <button
              onClick={() => {
                setSearchQuery('');
                setActiveCategory('All Work');
                setOnlyFeatured(false);
              }}
              className="text-blue-400 hover:text-blue-300 underline cursor-pointer"
            >
              Reset Filters
            </button>
          )}
        </div>
      </div>

      {/* Projects Grid */}
      <div className="max-w-7xl mx-auto px-6 md:px-8 mb-24">
        {filteredProjects.length === 0 ? (
          <div className="p-16 text-center border border-white/10 rounded-xl bg-[#0a0d14]/80">
            <SlidersHorizontal className="w-10 h-10 text-neutral-500 mx-auto mb-4" />
            <h3 className="text-lg font-bold text-white uppercase font-mono">No matching case studies found</h3>
            <p className="text-xs text-neutral-400 mt-2 max-w-md mx-auto">
              We couldn&apos;t find any projects matching your current search parameters. Try adjusting your query or resetting the category filter.
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setActiveCategory('All Work');
                setOnlyFeatured(false);
              }}
              className="mt-6 px-4 py-2 bg-blue-500 text-black text-xs font-mono font-bold uppercase rounded hover:bg-blue-400 cursor-pointer"
            >
              Reset All Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProjects.map((project) => (
              <div
                key={project.id}
                className="group border border-blue-500/20 bg-[#0c0f17]/90 hover:border-blue-400/50 hover:shadow-[0_0_30px_rgba(59,130,246,0.14)] transition-all duration-300 flex flex-col h-full rounded-xl overflow-hidden backdrop-blur-sm"
              >
                {/* Browser Mockup Top Banner */}
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
                    {/* Metadata Header */}
                    <div className="flex items-center justify-between text-[11px] font-mono text-neutral-400 mb-2">
                      <span className="flex items-center gap-1.5 text-neutral-300">
                        <Building className="w-3.5 h-3.5 text-blue-400" />
                        {project.client}
                      </span>
                      <span className="text-blue-400 font-semibold">{project.year}</span>
                    </div>

                    {/* Project Title */}
                    <h3
                      onClick={() => setSelectedProject(project)}
                      className="text-lg sm:text-xl font-bold text-white tracking-tight uppercase group-hover:text-blue-200 transition-colors cursor-pointer"
                    >
                      {project.title}
                    </h3>

                    {/* Project Summary */}
                    <p className="mt-3 text-xs text-neutral-300 line-clamp-3 leading-relaxed">
                      {project.summary}
                    </p>

                    {/* Key Results Checklist */}
                    <div className="mt-4 pt-3 border-t border-white/10 space-y-1.5">
                      {project.results.slice(0, 2).map((res, idx) => (
                        <div key={idx} className="flex items-start gap-2 text-[11px] text-neutral-300">
                          <CheckCircle2 className="w-3.5 h-3.5 text-blue-400 shrink-0 mt-0.5" />
                          <span className="line-clamp-1">{res}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Footer Tags & Case Study CTA */}
                  <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between gap-3">
                    <div className="flex flex-wrap gap-1.5">
                      {project.tags.slice(0, 2).map((t, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-0.5 text-[10px] font-mono border border-blue-500/20 bg-blue-950/20 text-blue-300/80 rounded"
                        >
                          {t}
                        </span>
                      ))}
                    </div>

                    <button
                      onClick={() => setSelectedProject(project)}
                      className="text-xs font-mono uppercase text-blue-400 flex items-center gap-1 group-hover:text-blue-300 group-hover:underline cursor-pointer shrink-0"
                    >
                      <span>Full Case Study</span>
                      <ArrowRight className="w-3 h-3 transition-transform duration-200 group-hover:translate-x-1" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Enterprise Industry Sector Matrix */}
      <div className="max-w-7xl mx-auto px-6 md:px-8 mb-24">
        <div className="p-8 md:p-12 rounded-xl border border-blue-500/20 bg-[#0a0d14]/90 shadow-2xl">
          <div className="text-xs font-mono uppercase tracking-widest text-blue-400 mb-3">
            [ SECTOR EXPERTISE ]
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold uppercase text-white tracking-tight mb-4">
            ACROSS HIGH-STAKES INDUSTRIES
          </h2>
          <p className="text-xs sm:text-sm text-neutral-300 max-w-2xl mb-8">
            From cold-chain agriculture and cross-border haulage to clinical health decision support and institutional private wealth management, our systems are engineered for zero failure.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="p-5 rounded-lg border border-white/10 bg-black/50">
              <div className="text-xs font-mono text-blue-400 uppercase font-bold mb-2">
                Logistics &amp; Fleet Telematics
              </div>
              <div className="text-xs text-neutral-300">
                Cartrack API ingestion, GPS geofencing, driver safety scoring, and SARS customs export packages.
              </div>
            </div>
            <div className="p-5 rounded-lg border border-white/10 bg-black/50">
              <div className="text-xs font-mono text-blue-400 uppercase font-bold mb-2">
                FinTech &amp; Private Wealth
              </div>
              <div className="text-xs text-neutral-300">
                Multi-currency NAV tracking, SARS IT3(b) tax statements, bank-grade encryption, and biometric logins.
              </div>
            </div>
            <div className="p-5 rounded-lg border border-white/10 bg-black/50">
              <div className="text-xs font-mono text-blue-400 uppercase font-bold mb-2">
                Clinical Health &amp; AgTech
              </div>
              <div className="text-xs text-neutral-300">
                FHIR / HL7 anomaly detection, real-time refrigeration sensors, and export phytosanitary compliance.
              </div>
            </div>
            <div className="p-5 rounded-lg border border-white/10 bg-black/50">
              <div className="text-xs font-mono text-blue-400 uppercase font-bold mb-2">
                Headless E-Commerce &amp; AI
              </div>
              <div className="text-xs text-neutral-300">
                Sub-0.8s storefronts, PayFast / Ozow instant EFT, automated WhatsApp bots, and 24/7 autonomous agents.
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Call to Action Banner */}
      <div className="max-w-7xl mx-auto px-6 md:px-8">
        <div className="relative rounded-xl border border-blue-500/30 bg-gradient-to-r from-blue-950/40 via-[#0a0d14] to-blue-950/40 p-8 sm:p-12 text-center overflow-hidden">
          <div className="relative z-10 max-w-2xl mx-auto">
            <h3 className="text-2xl sm:text-3xl md:text-4xl font-extrabold uppercase text-white tracking-tight">
              HAVE A MISSION-CRITICAL PLATFORM IN MIND?
            </h3>
            <p className="mt-4 text-xs sm:text-sm text-neutral-300 leading-relaxed">
              Whether you need to replace sluggish spreadsheets with an integrated Business OS, build an autonomous AI agent swarm, or deploy a headless digital store, we deliver with mathematical precision.
            </p>
            <div className="mt-8 flex flex-wrap justify-center items-center gap-4">
              <button
                onClick={onOpenContact}
                className="px-8 py-3.5 bg-blue-500 hover:bg-blue-400 text-black font-bold uppercase tracking-wider text-xs transition-all duration-300 shadow-[0_0_25px_rgba(59,130,246,0.35)] flex items-center gap-2 cursor-pointer"
              >
                <span>Schedule Technical Briefing</span>
                <ArrowUpRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Interactive Case Study Modal */}
      <ProjectModal
        project={selectedProject}
        onClose={() => setSelectedProject(null)}
        onInquire={handleInquireFromModal}
      />
    </div>
  );
}
