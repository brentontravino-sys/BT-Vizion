import { motion, AnimatePresence } from 'motion/react';
import { X, ArrowUpRight, CheckCircle2, Calendar, Tag, Building, Globe } from 'lucide-react';
import { Project } from '../types';
import BrowserMockup from './BrowserMockup';

interface ProjectModalProps {
  project: Project | null;
  onClose: () => void;
  onInquire: (title: string) => void;
}

export default function ProjectModal({ project, onClose, onInquire }: ProjectModalProps) {
  if (!project) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 md:p-10 overflow-y-auto">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/80 backdrop-blur-md"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 20 }}
          transition={{ duration: 0.25 }}
          className="relative w-full max-w-4xl bg-[#0d0d0e] border border-white/20 p-6 sm:p-8 md:p-10 shadow-2xl z-10 max-h-[90vh] overflow-y-auto"
        >
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-6 right-6 p-2 border border-white/20 hover:border-white hover:bg-white hover:text-black transition-colors text-neutral-400 cursor-pointer"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Header metadata */}
          <div className="flex flex-wrap items-center gap-4 text-xs font-mono text-neutral-400 pb-4 border-b border-white/10 pr-12">
            <span className="flex items-center gap-1.5 text-white">
              <Tag className="w-3.5 h-3.5" />
              {project.category}
            </span>
            <span>•</span>
            <span className="flex items-center gap-1.5">
              <Building className="w-3.5 h-3.5" />
              {project.client}
            </span>
            <span>•</span>
            <span className="flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5" />
              {project.year}
            </span>
          </div>

          {/* Title & summary */}
          <div className="mt-6">
            <h3 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white tracking-tight uppercase">
              {project.title}
            </h3>
            <p className="mt-3 text-base text-neutral-300 leading-relaxed">
              {project.summary}
            </p>
          </div>

          {/* Hero Media Preview with Minimal Browser Mockup */}
          <div className="mt-6 overflow-hidden rounded-lg border border-blue-500/30">
            <BrowserMockup
              title={project.title}
              domain={project.domain || 'app.btvizion.co.za'}
              views={
                project.views && project.views.length > 0
                  ? project.views
                  : [
                      {
                        id: project.id,
                        name: 'Architecture View',
                        image: project.image,
                        badge: 'Verified Deployed Architecture',
                      },
                    ]
              }
              aspectRatio="aspect-[16/10]"
              interactive={true}
              seamless={true}
            />
          </div>

          {/* Challenge & Solution */}
          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-8 pt-6 border-t border-white/10">
            <div>
              <h4 className="text-xs uppercase font-mono tracking-wider text-neutral-400 mb-2">
                The Operational Challenge
              </h4>
              <p className="text-sm text-neutral-300 leading-relaxed font-normal">
                {project.challenge}
              </p>
            </div>
            <div>
              <h4 className="text-xs uppercase font-mono tracking-wider text-neutral-400 mb-2">
                Our Engineering Solution
              </h4>
              <p className="text-sm text-neutral-300 leading-relaxed font-normal">
                {project.solution}
              </p>
            </div>
          </div>

          {/* Quantified Results */}
          <div className="mt-8 p-6 bg-black border border-white/10">
            <h4 className="text-xs uppercase font-mono tracking-wider text-white mb-3">
              Measurable Business Outcomes
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {project.results.map((res, i) => (
                <div key={i} className="flex items-start gap-2 text-xs text-neutral-200">
                  <CheckCircle2 className="w-4 h-4 text-white shrink-0 mt-0.5" />
                  <span className="font-medium">{res}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Tech stack tags */}
          <div className="mt-6 flex flex-wrap gap-2">
            {project.tags.map((tag, i) => (
              <span
                key={i}
                className="px-3 py-1 text-xs font-mono border border-white/10 bg-neutral-900 text-neutral-300"
              >
                {tag}
              </span>
            ))}
          </div>

          {/* Modal Footer actions */}
          <div className="mt-8 pt-6 border-t border-white/10 flex flex-wrap items-center justify-between gap-4">
            <button
              onClick={onClose}
              className="text-xs uppercase font-mono text-neutral-400 hover:text-white transition-colors cursor-pointer"
            >
              ← Back to Selected Works
            </button>

            <button
              onClick={() => {
                onClose();
                onInquire(project.title);
              }}
              className="inline-flex items-center gap-2 px-6 py-3 bg-white text-black text-xs font-bold uppercase tracking-wider hover:bg-neutral-200 transition-colors cursor-pointer"
            >
              <span>Build A Similar Solution</span>
              <ArrowUpRight className="w-4 h-4" />
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
