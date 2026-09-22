import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Globe, Bot, TrendingUp, Server, Sparkles, ChevronDown, Check, ArrowUpRight } from 'lucide-react';
import { SERVICES } from '../data/content';
import { Service } from '../types';
import { useLanguage } from '../context/LanguageContext';
import {
  ScrollReveal,
  ScrollStagger,
  ScrollStaggerItem,
  ScrollWordColorReveal,
  SpotlightCard,
  ScrollHeaderGradientFill,
} from './ScrollReveal';

interface ServicesProps {
  onSelectService: (serviceName: string) => void;
  onNavigateToServicesPage?: () => void;
}

const ICON_MAP: Record<string, typeof Globe> = {
  Globe,
  Bot,
  TrendingUp,
  Server,
  Sparkles,
};

export default function Services({ onSelectService, onNavigateToServicesPage }: ServicesProps) {
  const { language, t } = useLanguage();
  const [expandedId, setExpandedId] = useState<string>(SERVICES[0].id);

  const toggleService = (id: string) => {
    setExpandedId((prev) => (prev === id ? '' : id));
  };

  return (
    <section id="services" className="py-24 md:py-32 bg-transparent border-t border-white/10 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 md:px-8 relative z-10">
        {/* Section Header */}
        <ScrollReveal variant="fade-up" className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-14 border-b border-white/10">
          <div>
            <div className="text-xs uppercase tracking-widest text-blue-400 font-mono mb-3">
              {t.services.tag}
            </div>
            <ScrollHeaderGradientFill
              as="h2"
              text={t.services.title}
              className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight uppercase max-w-2xl leading-tight"
            />
          </div>
          <div className="max-w-md">
            <ScrollWordColorReveal
              text={t.services.subtitle}
              className="text-neutral-400 text-sm md:text-base leading-relaxed font-normal"
            />
          </div>
        </ScrollReveal>

        {/* Services List / Accordion Stack */}
        <ScrollStagger staggerDelay={0.08} className="divide-y divide-white/10">
          {SERVICES.map((service, index) => {
            const IconComponent = ICON_MAP[service.iconName] || Globe;
            const isExpanded = expandedId === service.id;

            return (
              <ScrollStaggerItem
                key={service.id}
                className={`py-8 md:py-10 transition-colors duration-300 ${
                  isExpanded ? 'bg-blue-950/[0.08]' : 'hover:bg-white/[0.01]'
                }`}
              >
                {/* Clickable Row Header */}
                <div
                  onClick={() => toggleService(service.id)}
                  className="flex flex-col md:flex-row md:items-center justify-between gap-6 cursor-pointer select-none group"
                >
                  <div className="flex items-start md:items-center gap-6">
                    <span className="font-mono text-sm text-blue-400 font-semibold w-8">
                      {`0${index + 1}`}
                    </span>
                    <div className="w-10 h-10 border border-blue-500/30 flex items-center justify-center bg-blue-950/40 shrink-0 transition-colors duration-300 group-hover:border-blue-400">
                      <IconComponent className="w-5 h-5 text-blue-400" />
                    </div>
                    <div>
                      <div className="text-[11px] font-mono uppercase text-blue-400/90 tracking-wider">
                        {service.category}
                      </div>
                      <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-white tracking-tight group-hover:text-blue-100 transition-colors duration-200 mt-0.5">
                        {service.title}
                      </h3>
                    </div>
                  </div>

                  <div className="flex items-center justify-between md:justify-end gap-6 pl-14 md:pl-0">
                    <span className="hidden lg:block text-xs font-mono text-blue-300/90">
                      {service.metrics}
                    </span>
                    <div className="w-9 h-9 border border-blue-500/30 flex items-center justify-center transition-all duration-300 group-hover:border-blue-400 group-hover:bg-blue-500 group-hover:text-white text-neutral-400">
                      <ChevronDown
                        className={`w-4 h-4 transition-transform duration-300 ${
                          isExpanded ? 'rotate-180 text-blue-400' : ''
                        }`}
                      />
                    </div>
                  </div>
                </div>

                {/* Expanded Detailed Content */}
                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.35, ease: 'easeInOut' }}
                      className="overflow-hidden"
                    >
                      <div className="pt-8 pl-0 md:pl-14 grid grid-cols-1 lg:grid-cols-12 gap-8">
                        {/* Description & Impact */}
                        <div className="lg:col-span-6 space-y-4">
                          <p className="text-base text-neutral-300 leading-relaxed font-normal">
                            {service.fullDesc}
                          </p>

                          <div className="p-4 border border-blue-500/25 bg-blue-950/30 backdrop-blur-sm">
                            <div className="text-[11px] font-mono text-blue-400 uppercase">
                              Guaranteed Metric Target
                            </div>
                            <div className="text-base font-semibold text-blue-200 mt-1 font-mono">
                              {service.metrics}
                            </div>
                          </div>

                          <div className="pt-2">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                onSelectService(service.title);
                              }}
                              className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-black bg-white px-5 py-2.5 hover:bg-neutral-200 transition-colors cursor-pointer shadow-[0_0_20px_rgba(59,130,246,0.2)]"
                            >
                              <span>Request Inquiry for {service.title}</span>
                              <ArrowUpRight className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>

                        {/* Deliverables & Tech Stack */}
                        <div className="lg:col-span-6 space-y-6">
                          <div>
                            <div className="text-xs uppercase tracking-wider text-neutral-400 font-mono mb-3">
                              Included Deliverables
                            </div>
                            <div className="space-y-2">
                              {service.deliverables.map((item, idx) => (
                                <div key={idx} className="flex items-start gap-2.5 text-xs text-neutral-200">
                                  <Check className="w-3.5 h-3.5 text-blue-400 shrink-0 mt-0.5" />
                                  <span>{item}</span>
                                </div>
                              ))}
                            </div>
                          </div>

                          <div>
                            <div className="text-xs uppercase tracking-wider text-neutral-400 font-mono mb-2">
                              Technology Stack
                            </div>
                            <div className="flex flex-wrap gap-1.5">
                              {service.techStack.map((tech, idx) => (
                                <span
                                  key={idx}
                                  className="px-2.5 py-1 text-[11px] font-mono border border-blue-500/20 bg-blue-950/20 text-blue-300"
                                >
                                  {tech}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </ScrollStaggerItem>
            );
          })}
        </ScrollStagger>

        {/* Dedicated Services Page Link Callout */}
        {onNavigateToServicesPage && (
          <div className="mt-12 p-6 rounded-lg border border-blue-500/25 bg-blue-950/20 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <div className="text-xs font-mono uppercase text-blue-400 font-bold">
                [ {language === 'en' ? 'DEEP-DIVE SPECIFICATIONS & SLA MATRIX' : 'ESPECIFICACIONES DETALLADAS Y MATRIZ DE SLA'} ]
              </div>
              <div className="text-sm font-semibold text-white mt-1">
                {language === 'en'
                  ? 'Explore in-depth deliverables, interactive live previews, and agency comparison matrix.'
                  : 'Explora entregables detallados, vistas previas interactivas y matriz comparativa.'}
              </div>
            </div>
            <button
              onClick={onNavigateToServicesPage}
              className="shrink-0 px-5 py-2.5 bg-blue-500 hover:bg-blue-400 text-black font-bold uppercase tracking-wider text-xs rounded transition-colors flex items-center gap-2 cursor-pointer shadow-[0_0_15px_rgba(59,130,246,0.3)]"
            >
              <span>{language === 'en' ? 'Explore Dedicated Services Page' : 'Explorar Página Dedicada de Servicios'}</span>
              <ArrowUpRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
